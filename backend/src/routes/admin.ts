import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

const requireAdmin = async (req: AuthRequest, res: any, next: any) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user?.isAdmin) {
    return res.status(403).json({ error: 'Accès refusé - droits administrateur requis' });
  }
  next();
};

// Logs de suppressions
router.get('/deletion-logs', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const logs = await prisma.deletionLog.findMany({
      include: {
        deletedByUser: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: { deletedAt: 'desc' },
      take: 100,
    });

    res.json({ logs });
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Statistiques hebdomadaires par utilisateur
router.get('/weekly-stats', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { type: 'INCOME' },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const weekMap: Record<string, Record<string, number>> = {};

    transactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      const weekKey = monday.toISOString();

      if (!weekMap[weekKey]) weekMap[weekKey] = {};
      const userName = t.user.name;
      weekMap[weekKey][userName] = (weekMap[weekKey][userName] || 0) + t.amount;
    });

    const stats = Object.entries(weekMap)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([week, users]) => ({
        week,
        users: Object.entries(users).map(([userName, total]) => ({ userName, total })),
      }));

    res.json({ stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer TOUTES les transactions (admin uniquement)
router.delete('/transactions/all', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const deleted = await prisma.transaction.deleteMany({});
    res.json({ message: 'Toutes les transactions ont été supprimées', deletedCount: deleted.count });
  } catch (error) {
    console.error('Erreur lors de la suppression globale:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
