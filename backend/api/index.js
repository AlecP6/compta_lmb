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
    origin: function (origin, callback) {
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        }
        else if (origin.includes('netlify.app') || origin.includes('netlify.com') || origin.includes('vercel.app')) {
            callback(null, true);
        }
        else {
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
const initialize = async () => {
    if (initialized)
        return;
    try {
        // Exécuter les migrations Prisma en production
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
            const { execSync } = await import('child_process');
            try {
                console.log('🔄 Exécution des migrations Prisma...');
                execSync('npx prisma migrate deploy', {
                    stdio: 'inherit',
                    cwd: process.cwd()
                });
                console.log('✅ Migrations terminées');
            }
            catch (error) {
                console.warn('⚠️ Erreur lors des migrations (peut être normal si déjà exécutées):', error.message);
            }
        }
        // Initialiser le compte admin
        await initAdmin();
        initialized = true;
        console.log('✅ Initialisation terminée');
    }
    catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        // Ne pas bloquer le démarrage si l'admin existe déjà
        if (!error.message?.includes('Unique constraint')) {
            console.error('Détails:', error);
        }
    }
};
// Initialiser au démarrage (de manière asynchrone pour ne pas bloquer)
initialize().catch(console.error);
// Export pour Vercel
export default app;
//# sourceMappingURL=index.js.map