/**
 * Script de migration pour ajouter le support GTA RP
 * 
 * Ce script doit être exécuté après avoir modifié le schéma Prisma
 * pour ajouter les champs gameId (User) et source (Transaction)
 * 
 * Usage:
 *   cd backend
 *   node scripts/migrate-gtarp.js
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendDir = join(__dirname, '..');

console.log('🔄 Génération du client Prisma...');
try {
  execSync('npx prisma generate', { 
    cwd: backendDir, 
    stdio: 'inherit' 
  });
  console.log('✅ Client Prisma généré avec succès');
} catch (error) {
  console.error('❌ Erreur lors de la génération du client Prisma:', error.message);
  process.exit(1);
}

console.log('\n📝 Création de la migration...');
console.log('⚠️  Note: Si vous utilisez PostgreSQL, exécutez:');
console.log('   npx prisma migrate dev --name add_gameid_and_source');
console.log('\n   Ou pour appliquer en production:');
console.log('   npx prisma migrate deploy');
console.log('\n⚠️  Si vous utilisez SQLite (dev.db), exécutez:');
console.log('   npx prisma db push');

