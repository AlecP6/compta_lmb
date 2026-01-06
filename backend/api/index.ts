// Backend simple - Tout en un seul fichier
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// Initialiser Prisma avec gestion d'erreur
let prisma: PrismaClient;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('❌ Erreur initialisation Prisma:', error);
  // Créer un client Prisma même en cas d'erreur pour éviter le crash
  prisma = new PrismaClient();
}

// Initialiser le compte admin au démarrage (de manière asynchrone)
(async () => {
  try {
    console.log('🔧 Vérification du compte admin...');
    
    // Vérifier si l'utilisateur admin existe déjà
    let admin = await prisma.user.findUnique({
      where: { username: 'Switch' },
    });

    if (admin) {
      // Mettre à jour le mot de passe au cas où
      const hashedPassword = await bcrypt.hash('Switch57220', 10);
      admin = await prisma.user.update({
        where: { username: 'Switch' },
        data: { password: hashedPassword, name: 'Switch' },
      });
      console.log('✅ Compte admin mis à jour');
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash('Switch57220', 10);
      admin = await prisma.user.create({
        data: {
          username: 'Switch',
          password: hashedPassword,
          name: 'Switch',
        },
      });
      console.log('✅ Compte admin créé avec succès !');
    }

    console.log(`   Identifiant: ${admin.username}`);
    console.log(`   Nom: ${admin.name}`);
    console.log(`   Mot de passe: Switch57220`);
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error.message || error);
    if (error.message?.includes('P1001') || error.message?.includes('Can\'t reach database')) {
      console.error('⚠️ Impossible de se connecter à la base de données. Vérifiez DATABASE_URL.');
    }
    // Ne pas bloquer le serveur si l'init admin échoue
  }
})();

// Middleware
app.use(cors());
app.use(express.json());

// Route de santé
app.get('/api/health', async (req, res) => {
  try {
    // Tester la connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', message: 'API fonctionnelle', database: 'connected' });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'API fonctionnelle mais base de données non accessible',
      error: error.message 
    });
  }
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
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { username },
      });
    } catch (dbError: any) {
      console.error('❌ Erreur base de données lors de la vérification utilisateur:', dbError.message);
      return res.status(500).json({ 
        error: 'Erreur base de données', 
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined 
      });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Cet identifiant est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    let user;
    try {
      user = await prisma.user.create({
        data: { username, password: hashedPassword, name },
      });
    } catch (dbError: any) {
      console.error('❌ Erreur base de données lors de la création utilisateur:', dbError.message);
      return res.status(500).json({ 
        error: 'Erreur base de données', 
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined 
      });
    }

    // Générer un token
    const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        isAdmin: (user as any).isAdmin || false 
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur inscription:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Connexion - Support des deux formats
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }

    console.log('🔐 Tentative de connexion pour:', username);

    // Trouver l'utilisateur
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { username },
      });
    } catch (dbError: any) {
      console.error('❌ Erreur base de données lors de la recherche utilisateur:', dbError.message);
      console.error('Stack:', dbError.stack);
      return res.status(500).json({ 
        error: 'Erreur base de données', 
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined 
      });
    }

    if (!user) {
      console.log('❌ Utilisateur non trouvé:', username);
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    console.log('✅ Utilisateur trouvé:', user.id);

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log('❌ Mot de passe incorrect pour:', username);
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Générer un token
    const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    console.log('✅ Connexion réussie pour:', username);

    res.json({
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        isAdmin: (user as any).isAdmin || false 
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur connexion:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
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
    // Récupérer l'utilisateur sans select pour éviter les erreurs si colonnes manquantes
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        isAdmin: (user as any).isAdmin || false
      }
    });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route alternative pour /api/me
app.get('/api/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    // Récupérer l'utilisateur sans select pour éviter les erreurs si colonnes manquantes
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        isAdmin: (user as any).isAdmin || false
      }
    });
  } catch (error: any) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Middleware admin
const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(user as any).isAdmin) {
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

    // Récupérer les transactions sans include pour éviter les erreurs si relations manquantes
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Récupérer les utilisateurs séparément pour éviter les erreurs de relation
    const userIds = [...new Set(transactions.map(t => t.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    const userMap = new Map(users.map(u => [u.id, { id: u.id, name: u.name }]));

    // Ajouter les informations utilisateur aux transactions
    const transactionsWithUser = transactions.map(t => ({
      ...t,
      user: userMap.get(t.userId) || { id: t.userId, name: 'Utilisateur inconnu' }
    }));

    // Calculer le solde
    const allTransactions = await prisma.transaction.findMany();
    const balance = allTransactions.reduce((acc, t) => {
      return t.type === 'INCOME' ? acc + t.amount : acc - t.amount;
    }, 0);

    console.log(`✅ ${transactions.length} transactions trouvées, solde: ${balance}`);
    res.json({ transactions: transactionsWithUser, balance });
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

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('❌ Utilisateur non trouvé:', userId);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    console.log('✅ Utilisateur trouvé:', user.username);

    let transaction;
    try {
      transaction = await prisma.transaction.create({
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
    } catch (dbError: any) {
      console.error('❌ Erreur base de données lors de la création:', dbError.message);
      console.error('Code erreur Prisma:', dbError.code);
      console.error('Stack:', dbError.stack);
      
      // Messages d'erreur plus explicites
      if (dbError.code === 'P2003') {
        return res.status(500).json({ 
          error: 'Erreur de référence: utilisateur invalide',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        });
      }
      if (dbError.code === 'P2022') {
        return res.status(500).json({ 
          error: 'Erreur de schéma: colonne manquante dans la base de données',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        });
      }
      
      return res.status(500).json({ 
        error: 'Erreur lors de la création de la transaction',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    console.log('✅ Transaction créée:', transaction.id);
    res.status(201).json({ transaction });
  } catch (error: any) {
    console.error('❌ Erreur création transaction:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
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
    try {
      await (prisma as any).deletionLog.create({
      data: {
        transactionId: transaction.id,
        deletedBy: userId,
        transactionType: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
      },
      });
    } catch (logError) {
      // Ignorer les erreurs de log si la table n'existe pas
      console.warn('Impossible de logger la suppression:', logError);
    }

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

    // Calculer les totaux globaux
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
    const logs = await (prisma as any).deletionLog.findMany({
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
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, name },
    });

    const jwtSecret = process.env.JWT_SECRET || 'secret-par-defaut';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        isAdmin: (user as any).isAdmin || false 
      },
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
