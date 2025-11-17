import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateWebhook } from '../middleware/webhookAuth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Interface pour les données de transaction depuis Discord
 */
interface DiscordTransactionData {
  gameId?: string;
  username?: string;
  action?: 'deposit' | 'withdraw' | 'income' | 'expense';
  amount: number;
  description?: string;
  category?: string;
}

/**
 * Parse un message Discord (embed ou contenu) pour extraire les informations de transaction
 */
function parseDiscordMessage(body: any): DiscordTransactionData | null {
  // Format 1: Données JSON directes (depuis un bot Discord)
  if (body.gameId || body.username) {
    return {
      gameId: body.gameId,
      username: body.username,
      action: body.action || body.type,
      amount: parseFloat(body.amount),
      description: body.description,
      category: body.category || 'Discord',
    };
  }

  // Format 2: Message Discord avec embeds
  if (body.embeds && Array.isArray(body.embeds) && body.embeds.length > 0) {
    const embed = body.embeds[0];
    const fields = embed.fields || [];
    
    // Extraire les informations depuis les champs de l'embed
    let gameId: string | undefined;
    let username: string | undefined;
    let amount: number | undefined;
    let description: string | undefined;
    let action: 'deposit' | 'withdraw' | 'income' | 'expense' | undefined;

    // Parser les champs de l'embed
    fields.forEach((field: any) => {
      const name = field.name?.toLowerCase() || '';
      const value = field.value || '';

      // Identifier le joueur
      if (name.includes('joueur') || name.includes('player') || name.includes('user')) {
        // Format: "Nom (ID: 12345)" ou "Nom - 12345"
        const match = value.match(/(?:\(ID:\s*)?(\d+)\)?/);
        if (match) {
          gameId = match[1];
        }
        // Extraire le nom d'utilisateur
        const nameMatch = value.match(/^([^(]+)/);
        if (nameMatch) {
          username = nameMatch[1].trim();
        }
      }

      // Identifier le montant
      if (name.includes('montant') || name.includes('amount') || name.includes('somme')) {
        // Extraire le nombre (supprimer $, espaces, etc.)
        const amountMatch = value.replace(/[^0-9.,]/g, '').replace(',', '.');
        if (amountMatch) {
          amount = parseFloat(amountMatch);
        }
      }

      // Identifier la description
      if (name.includes('description') || name.includes('desc')) {
        description = value;
      }
    });

    // Déterminer l'action depuis le titre ou la couleur de l'embed
    const title = embed.title?.toLowerCase() || '';
    const color = embed.color;
    
    if (title.includes('dépôt') || title.includes('deposit') || title.includes('income') || 
        title.includes('entrée') || color === 0x00ff00 || color === 65280) {
      action = 'deposit';
    } else if (title.includes('retrait') || title.includes('withdraw') || title.includes('expense') || 
               title.includes('sortie') || color === 0xff0000 || color === 16711680) {
      action = 'withdraw';
    }

    if (amount && (gameId || username)) {
      return {
        gameId,
        username,
        action,
        amount,
        description: description || embed.description || 'Transaction depuis Discord',
        category: embed.footer?.text?.replace('Catégorie: ', '') || 'Discord',
      };
    }
  }

  // Format 3: Contenu texte simple
  if (body.content) {
    // Parser un message texte simple
    // Exemples: "Dépôt de 1000$ pour joueur ID:12345" ou "Retrait 500$ - ID:12345"
    const content = body.content;
    const depositMatch = content.match(/(?:dépôt|deposit|income|entrée).*?(\d+(?:[.,]\d+)?)/i);
    const withdrawMatch = content.match(/(?:retrait|withdraw|expense|sortie).*?(\d+(?:[.,]\d+)?)/i);
    const gameIdMatch = content.match(/ID[:\s]*(\d+)/i);
    const usernameMatch = content.match(/(?:joueur|player|user)[:\s]*([^\d]+)/i);

    const amount = depositMatch ? parseFloat(depositMatch[1].replace(',', '.')) : 
                   withdrawMatch ? parseFloat(withdrawMatch[1].replace(',', '.')) : undefined;
    const gameId = gameIdMatch ? gameIdMatch[1] : undefined;
    const username = usernameMatch ? usernameMatch[1].trim() : undefined;
    const action = depositMatch ? 'deposit' : withdrawMatch ? 'withdraw' : undefined;

    if (amount && (gameId || username)) {
      return {
        gameId,
        username,
        action,
        amount,
        description: content,
        category: 'Discord',
      };
    }
  }

  return null;
}

/**
 * Route webhook pour recevoir les messages Discord et créer des transactions automatiquement
 */
router.post(
  '/webhook',
  authenticateWebhook,
  [
    body('amount').optional().isFloat({ min: 0.01 }),
    body('gameId').optional().trim(),
    body('username').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      // Parser le message Discord
      const transactionData = parseDiscordMessage(req.body);

      if (!transactionData) {
        return res.status(400).json({
          error: 'Format de message Discord non reconnu',
          message: 'Impossible d\'extraire les informations de transaction depuis le message',
        });
      }

      const { gameId, username, action, amount, description, category } = transactionData;

      // Validation
      if (!amount || amount <= 0) {
        return res.status(400).json({
          error: 'Montant invalide',
          message: 'Le montant doit être un nombre positif',
        });
      }

      // Trouver l'utilisateur par gameId ou username
      let user = null;
      if (gameId) {
        user = await prisma.user.findUnique({
          where: { gameId },
        });
      }

      // Si pas trouvé par gameId, essayer par username
      if (!user && username) {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: { equals: username, mode: 'insensitive' } },
              { name: { equals: username, mode: 'insensitive' } },
            ],
          },
        });
      }

      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé',
          message: gameId 
            ? `Aucun utilisateur trouvé avec l'ID de jeu: ${gameId}`
            : `Aucun utilisateur trouvé avec le nom: ${username}`,
          gameId,
          username,
        });
      }

      // Déterminer le type de transaction
      let transactionType: 'INCOME' | 'EXPENSE';
      if (action === 'deposit' || action === 'income') {
        transactionType = 'INCOME';
      } else if (action === 'withdraw' || action === 'expense') {
        transactionType = 'EXPENSE';
      } else {
        // Par défaut, on considère comme un dépôt si le montant est positif
        transactionType = 'INCOME';
      }

      // Créer la description par défaut si non fournie
      const transactionDescription = description || 
        (transactionType === 'INCOME' 
          ? `Entrée d'argent depuis Discord` 
          : `Sortie d'argent depuis Discord`);

      // Créer la transaction automatiquement
      const transaction = await prisma.transaction.create({
        data: {
          type: transactionType,
          amount: parseFloat(amount.toString()),
          description: transactionDescription,
          category: category || 'Discord',
          source: 'DISCORD',
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              gameId: true,
            },
          },
        },
      });

      console.log(`✅ Transaction Discord créée: ${transactionType} de ${amount} pour ${user.name}${gameId ? ` (${gameId})` : ''}`);

      res.status(201).json({
        success: true,
        transaction,
        message: 'Transaction créée avec succès depuis Discord',
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de la transaction Discord:', error);
      
      // Gérer les erreurs spécifiques
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Erreur de contrainte unique' });
      }
      
      res.status(500).json({
        error: 'Erreur serveur lors de la création de la transaction',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

export default router;

