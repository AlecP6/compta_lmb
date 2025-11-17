// Backend simple - Tout en un seul fichier
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API fonctionnelle' });
});

// Route catch-all pour debug
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Backend fonctionnel', path: req.path });
});

// ===== AUTHENTIFICATION =====

// Inscription - Support des deux formats
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'L\'identifiant doit contenir au moins 3 caractères' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet identifiant est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, name },
    });

    // Générer un token
    const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      // @ts-ignore - isAdmin sera disponible après prisma generate
      user: { id: user.id, username: user.username, name: user.name, isAdmin: user.isAdmin || false },
    });
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion - Support des deux formats
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }

    // Trouver l'utilisateur
    // @ts-ignore - isAdmin sera disponible après prisma generate
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Générer un token
    const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      // @ts-ignore - isAdmin sera disponible après prisma generate
      user: { id: user.id, username: user.username, name: user.name, isAdmin: user.isAdmin || false },
    });
  } catch (error: any) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Middleware d'authentification
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    (req as any).userId = decoded.userId;
    next();
  });
};

// Obtenir l'utilisateur connecté
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    // @ts-ignore - isAdmin sera disponible après prisma generate
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, name: true, isAdmin: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route alternative pour /api/me
app.get('/api/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    // @ts-ignore - isAdmin sera disponible après prisma generate
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, name: true, isAdmin: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Middleware admin
const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const userId = (req as any).userId;
    // @ts-ignore - isAdmin sera disponible après prisma generate
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    // @ts-ignore - isAdmin sera disponible après prisma generate
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    next();
  } catch (error: any) {
    console.error('Erreur vérification admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ===== TRANSACTIONS =====

// Obtenir toutes les transactions
app.get('/api/transactions', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    console.log('📋 Récupération transactions pour userId:', userId);

    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Calculer le solde
    const allTransactions = await prisma.transaction.findMany();
    const balance = allTransactions.reduce((acc, t) => {
      return t.type === 'INCOME' ? acc + t.amount : acc - t.amount;
    }, 0);

    console.log(`✅ ${transactions.length} transactions trouvées, solde: ${balance}`);
    res.json({ transactions, balance });
  } catch (error: any) {
    console.error('❌ Erreur récupération transactions:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// Créer une transaction
app.post('/api/transactions', authenticate, async (req, res) => {
  try {
    const { type, amount, description, category } = req.body;
    const userId = (req as any).userId;

    console.log('📝 Création transaction:', { type, amount, description, category, userId });

    if (!type || amount === undefined || !description) {
      console.log('❌ Validation échouée:', { type, amount, description });
      return res.status(400).json({ error: 'Type, montant et description requis' });
    }

    if (type !== 'INCOME' && type !== 'EXPENSE') {
      return res.status(400).json({ error: 'Type doit être INCOME ou EXPENSE' });
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Le montant doit être un nombre positif' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        category: category || null,
        source: 'MANUAL',
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    console.log('✅ Transaction créée:', transaction.id);
    res.status(201).json({ transaction });
  } catch (error: any) {
    console.error('❌ Erreur création transaction:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// Mettre à jour une transaction
app.put('/api/transactions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { type, amount, description, category } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(description && { description }),
        ...(category !== undefined && { category: category || null }),
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({ transaction: updated });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer une transaction
app.delete('/api/transactions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Logger la suppression avant de supprimer
    // @ts-ignore - deletionLog sera disponible après prisma generate
    await prisma.deletionLog.create({
      data: {
        transactionId: transaction.id,
        deletedBy: userId,
        transactionType: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
      },
    });

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({ message: 'Transaction supprimée' });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Statistiques
app.get('/api/transactions/stats/summary', authenticate, async (req, res) => {
  try {
    const allTransactions = await prisma.transaction.findMany();

    const income = allTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = allTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;
    const totalTransactions = allTransactions.length;

    res.json({
      income,
      expenses,
      balance,
      totalTransactions,
    });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== ADMIN =====

// Logs de suppressions (admin uniquement)
app.get('/api/admin/deletion-logs', authenticate, requireAdmin, async (req, res) => {
  try {
    // @ts-ignore - deletionLog sera disponible après prisma generate
    const logs = await prisma.deletionLog.findMany({
      include: {
        deletedByUser: {
          select: { id: true, username: true, name: true },
        },
      },
      orderBy: { deletedAt: 'desc' },
      take: 100,
    });

    res.json({ logs });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Statistiques par semaine et par utilisateur (admin uniquement)
app.get('/api/admin/weekly-stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const allTransactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: { id: true, username: true, name: true },
        },
      },
      where: {
        type: 'INCOME', // Seulement les entrées
      },
    });

    // Grouper par semaine et par utilisateur
    const weeklyStats: Record<string, Record<string, number>> = {};

    allTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      // Obtenir le lundi de la semaine (début de semaine)
      const monday = new Date(date);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      
      const weekKey = monday.toISOString().split('T')[0]; // Format YYYY-MM-DD
      const userId = transaction.userId;
      const userName = transaction.user.name || transaction.user.username;

      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = {};
      }

      if (!weeklyStats[weekKey][userName]) {
        weeklyStats[weekKey][userName] = 0;
      }

      weeklyStats[weekKey][userName] += transaction.amount;
    });

    // Convertir en format tableau pour faciliter l'affichage
    const statsArray = Object.entries(weeklyStats).map(([week, users]) => ({
      week,
      users: Object.entries(users).map(([userName, total]) => ({
        userName,
        total,
      })),
    })).sort((a, b) => b.week.localeCompare(a.week)); // Plus récent en premier

    res.json({ stats: statsArray });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes alternatives pour compatibilité (dupliquées)
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'L\'identifiant doit contenir au moins 3 caractères' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet identifiant est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // @ts-ignore - isAdmin sera disponible après prisma generate
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, name },
    });

    const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      // @ts-ignore - isAdmin sera disponible après prisma generate
      user: { id: user.id, username: user.username, name: user.name, isAdmin: user.isAdmin || false },
    });
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }

    // @ts-ignore - isAdmin sera disponible après prisma generate
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      // @ts-ignore - isAdmin sera disponible après prisma generate
      user: { id: user.id, username: user.username, name: user.name, isAdmin: user.isAdmin || false },
    });
  } catch (error: any) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Export pour Vercel
export default app;
