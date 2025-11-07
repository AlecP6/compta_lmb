// Script pour nettoyer les anciennes migrations SQLite
const fs = require('fs');
const path = require('path');

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

