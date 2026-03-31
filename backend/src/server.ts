import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import adminRoutes from './routes/admin.js';
import gtarpRoutes from './routes/gtarp.js';
import discordRoutes from './routes/discord.js';
import { initAdmin } from './scripts/initAdmin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.VERCEL_PORT || 3001;

// Configuration CORS pour permettre les requêtes depuis Netlify
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Autoriser les requêtes sans origine (Postman, etc.) et depuis localhost
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else if (origin.includes('netlify.app') || origin.includes('netlify.com')) {
      // Autoriser toutes les URLs Netlify
      callback(null, true);
    } else {
      // Vous pouvez ajouter d'autres domaines autorisés ici
      callback(null, true); // Pour le moment, on autorise tout (à restreindre en production)
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gtarp', gtarpRoutes);
app.use('/api/discord', discordRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API de comptabilité fonctionnelle' });
});

// Initialiser le compte admin au démarrage
const startServer = async () => {
  try {
    // Note: Ne pas appeler db push ici - cela doit être fait manuellement
    // en développement via: npm run prisma:db:push
    // ou via migrations en production: npm run prisma:migrate:deploy
    
    await initAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error);
    process.exit(1);
  }
};

startServer();

