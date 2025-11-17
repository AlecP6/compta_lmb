import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateWebhook } from '../middleware/webhookAuth.js';
import { notifyDiscordTransaction } from '../utils/discordWebhook.js';

const router = express.Router();
const prisma = new PrismaClient();

// Route webhook pour recevoir les logs GTA RP
// Sécurisée avec une clé API si GTARP_WEBHOOK_KEY est configurée
router.post(
  '/webhook',
  authenticateWebhook,
  [
    body('gameId').trim().notEmpty().withMessage('L\'ID de jeu est requis'),
    body('action').isIn(['deposit', 'withdraw']).withMessage('L\'action doit être "deposit" ou "withdraw"'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Le montant doit être un nombre positif'),
    body('description').optional().trim(),
    body('category').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { gameId, action, amount, description, category } = req.body;

      // Trouver l'utilisateur par son ID de jeu
      const user = await prisma.user.findUnique({
        where: { gameId },
      });

      if (!user) {
        return res.status(404).json({ 
          error: 'Aucun utilisateur trouvé avec cet ID de jeu',
          gameId 
        });
      }

      // Déterminer le type de transaction
      const transactionType = action === 'deposit' ? 'INCOME' : 'EXPENSE';
      
      // Créer la description par défaut si non fournie
      const transactionDescription = description || 
        (action === 'deposit' 
          ? `Dépôt depuis coffre GTA RP` 
          : `Retrait vers coffre GTA RP`);

      // Créer la transaction automatiquement
      const transaction = await prisma.transaction.create({
        data: {
          type: transactionType,
          amount: parseFloat(amount),
          description: transactionDescription,
          category: category || 'argent sale',
          source: 'GTA_RP',
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              gameId: true,
            },
          },
        },
      });

      console.log(`✅ Transaction GTA RP créée: ${transactionType} de ${amount} pour ${user.name} (${gameId})`);

      // Envoyer une notification Discord si configurée
      const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (discordWebhookUrl) {
        notifyDiscordTransaction(
          discordWebhookUrl,
          transactionType,
          parseFloat(amount),
          user.name,
          gameId,
          transactionDescription,
          category || 'argent sale'
        ).catch((error) => {
          console.error('Erreur lors de l\'envoi de la notification Discord:', error);
          // On ne bloque pas la réponse même si Discord échoue
        });
      }

      res.status(201).json({
        success: true,
        transaction,
        message: 'Transaction créée avec succès',
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de la transaction GTA RP:', error);
      
      // Gérer les erreurs spécifiques
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Erreur de contrainte unique' });
      }
      
      res.status(500).json({ 
        error: 'Erreur serveur lors de la création de la transaction',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Route pour obtenir les transactions d'un utilisateur par son gameId
router.get('/user/:gameId/transactions', async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { limit = '50' } = req.query;

    // Trouver l'utilisateur par son ID de jeu
    const user = await prisma.user.findUnique({
      where: { gameId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet ID de jeu' });
    }

    // Récupérer les transactions de l'utilisateur
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        gameId: user.gameId,
      },
      transactions,
      total: transactions.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

