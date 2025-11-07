// Point d'entrée pour Vercel Serverless Functions
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth.js';
import transactionRoutes from '../src/routes/transactions.js';
import { initAdmin } from '../src/scripts/initAdmin.js';

dotenv.config();

const app = express();

// Configuration CORS pour permettre les requêtes depuis Netlify
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else if (origin.includes('netlify.app') || origin.includes('netlify.com') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API de comptabilité fonctionnelle' });
});

// Initialiser le compte admin au démarrage (une seule fois)
let adminInitialized = false;
const initializeAdmin = async () => {
  if (!adminInitialized) {
    try {
      await initAdmin();
      adminInitialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation admin:', error);
    }
  }
};

// Initialiser au démarrage
initializeAdmin();

// Export pour Vercel
export default app;

