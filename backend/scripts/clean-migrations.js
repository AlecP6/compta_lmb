// Script pour nettoyer les anciennes migrations SQLite
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');

try {
  if (fs.existsSync(migrationsDir)) {
    const entries = fs.readdirSync(migrationsDir);
    entries.forEach(entry => {
      const entryPath = path.join(migrationsDir, entry);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        const migrationFile = path.join(entryPath, 'migration.sql');
        if (fs.existsSync(migrationFile)) {
          fs.unlinkSync(migrationFile);
          console.log(`✅ Supprimé: ${migrationFile}`);
        }
      }
    });
  }
} catch (error) {
  // Ignorer les erreurs
}

