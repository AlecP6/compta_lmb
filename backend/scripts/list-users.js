/**
 * Script pour lister les utilisateurs et leurs gameIds
 * 
 * Usage:
 *   node scripts/list-users.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('\n📋 Liste des utilisateurs\n');
    console.log('═══════════════════════════════════════\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        gameId: true,
        isAdmin: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données.\n');
      console.log('💡 Créez un utilisateur via l\'interface web ou l\'API d\'inscription.\n');
      return;
    }

    console.log(`✅ ${users.length} utilisateur(s) trouvé(s):\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'Sans nom'}`);
      console.log(`   👤 Username: ${user.username || 'N/A'}`);
      console.log(`   📧 Email: ${user.email || 'N/A'}`);
      console.log(`   🎮 GameId: ${user.gameId || '❌ Non défini'}`);
      console.log(`   👑 Admin: ${user.isAdmin ? 'Oui' : 'Non'}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════\n');
    console.log('💡 Pour tester le webhook Discord, utilisez un gameId existant ou un username.\n');
    console.log('   Exemple: node scripts/test-discord-webhook.js --gameId=12345\n');
    console.log('   Ou: node scripts/test-discord-webhook.js --username=Switch\n');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error.message);
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Assurez-vous que la base de données est accessible.');
      console.error('   Vérifiez votre DATABASE_URL dans le fichier .env\n');
    }
  } finally {
    await prisma.$disconnect();
  }
}

listUsers().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

