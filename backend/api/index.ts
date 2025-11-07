// Point d'entrée pour Vercel Serverless Functions
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import authRoutes from '../src/routes/auth.js';
import transactionRoutes from '../src/routes/transactions.js';
import { initAdmin } from '../src/scripts/initAdmin.js';

const require = createRequire(import.meta.url);

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

// Initialiser le compte admin et les migrations (une seule fois)
let initialized = false;
let initializing = false;

const initialize = async () => {
  if (initialized || initializing) return;
  initializing = true;
  
  try {
    // Synchroniser le schéma Prisma avec la base de données en production
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      const { execSync } = await import('child_process');
      try {
        console.log('🔄 Synchronisation du schéma Prisma avec la base de données...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Défini' : 'NON DÉFINI');
        
        // Utiliser prisma directement (sans npx) car il est déjà installé
        execSync('node_modules/.bin/prisma db push --accept-data-loss --skip-generate', { 
          stdio: 'inherit',
          cwd: process.cwd(),
          env: { ...process.env },
          timeout: 60000 // 60 secondes de timeout
        });
        console.log('✅ Schéma synchronisé');
      } catch (error: any) {
        console.error('❌ Erreur lors de la synchronisation:', error.message);
        console.error('Stack:', error.stack);
        // Ne pas continuer si la synchronisation échoue
        initializing = false;
        return;
      }
    }
    
    // Attendre un peu pour que la base de données soit prête
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Initialiser le compte admin
    console.log('🔧 Initialisation du compte admin...');
    await initAdmin();
    initialized = true;
    initializing = false;
    console.log('✅ Initialisation terminée');
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    console.error('Stack:', error.stack);
    initializing = false;
    // Ne pas bloquer le démarrage, mais loguer l'erreur
  }
};

// Middleware pour forcer l'initialisation avant de traiter les requêtes
app.use(async (req, res, next) => {
  // Ne pas bloquer /api/health
  if (req.path === '/api/health') {
    return next();
  }
  
  // Attendre que l'initialisation soit terminée
  if (!initialized && !initializing) {
    await initialize();
  } else if (initializing) {
    // Attendre que l'initialisation en cours se termine
    while (initializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  next();
});

// Initialiser au démarrage (de manière asynchrone pour ne pas bloquer)
initialize().catch(console.error);

// Export pour Vercel - Handler pour serverless functions
export default app;

// Alternative: Export explicite pour Vercel
// Vercel détecte automatiquement l'export default comme handler

