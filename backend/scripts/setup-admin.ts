// Script pour créer le compte admin après migration
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔧 Création du compte admin...');

    // Vérifier si l'utilisateur admin existe déjà
    let admin = await prisma.user.findUnique({
      where: { username: 'Switch' },
    });

    if (admin) {
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash('Switch57220', 10);
      admin = await prisma.user.update({
        where: { username: 'Switch' },
        data: { password: hashedPassword, name: 'Switch' },
      });
      console.log('✅ Compte admin mis à jour');
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash('Switch57220', 10);
      // Utiliser une valeur par défaut pour email si nécessaire
      admin = await prisma.user.create({
        data: {
          username: 'Switch',
          password: hashedPassword,
          name: 'Switch',
          email: 'switch@admin.local', // Valeur par défaut (non utilisée pour la connexion)
        },
      });
      console.log('✅ Compte admin créé avec succès !');
    }

    console.log(`   Identifiant: ${admin.username}`);
    console.log(`   Nom: ${admin.name}`);
    console.log(`   Mot de passe: Switch57220`);
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    if (error.message?.includes('username')) {
      console.error('   → Le champ username n\'existe pas encore. Exécutez d\'abord: npm run prisma:generate');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();

