import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Obtenir toutes les transactions (partagées entre tous les utilisateurs)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, startDate, endDate, limit = '100' } = req.query;

    const where: any = {};

    if (type && (type === 'INCOME' || type === 'EXPENSE')) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
    });

    // Calculer le solde total
    const allTransactions = await prisma.transaction.findMany();
    const balance = allTransactions.reduce((acc, transaction) => {
      return transaction.type === 'INCOME'
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);

    res.json({
      transactions,
      balance,
      total: transactions.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une nouvelle transaction
router.post(
  '/',
  authenticateToken,
  [
    body('type')
      .isIn(['INCOME', 'EXPENSE'])
      .withMessage('Le type doit être INCOME ou EXPENSE'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Le montant doit être un nombre positif'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('La description est requise'),
    body('category').optional().trim(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, amount, description, category } = req.body;

      if (!req.userId) {
        return res.status(401).json({ error: 'Non authentifié' });
      }

      const transaction = await prisma.transaction.create({
        data: {
          type,
          amount: parseFloat(amount),
          description,
          category: category || null,
          userId: req.userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// Obtenir une transaction spécifique
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Erreur lors de la récupération de la transaction:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour une transaction
router.put(
  '/:id',
  authenticateToken,
  [
    body('type')
      .optional()
      .isIn(['INCOME', 'EXPENSE'])
      .withMessage('Le type doit être INCOME ou EXPENSE'),
    body('amount')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Le montant doit être un nombre positif'),
    body('description').optional().trim().notEmpty(),
    body('category').optional().trim(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { type, amount, description, category } = req.body;

      // Vérifier que la transaction existe
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        return res.status(404).json({ error: 'Transaction non trouvée' });
      }

      // Vérifier que l'utilisateur est le propriétaire ou permettre la modification pour tous
      // (dans ce cas, on permet à tous les utilisateurs authentifiés de modifier)
      const updateData: any = {};
      if (type) updateData.type = type;
      if (amount) updateData.amount = parseFloat(amount);
      if (description) updateData.description = description;
      if (category !== undefined) updateData.category = category || null;

      const transaction = await prisma.transaction.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json(transaction);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// Supprimer une transaction
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({ message: 'Transaction supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les statistiques
router.get('/stats/summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const allTransactions = await prisma.transaction.findMany();

    const totalIncome = allTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = allTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Statistiques par catégorie
    const categoryStats: Record<string, { income: number; expense: number }> = {};
    allTransactions.forEach((t) => {
      const cat = t.category || 'Sans catégorie';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { income: 0, expense: 0 };
      }
      if (t.type === 'INCOME') {
        categoryStats[cat].income += t.amount;
      } else {
        categoryStats[cat].expense += t.amount;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      balance,
      totalTransactions: allTransactions.length,
      categoryStats,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

