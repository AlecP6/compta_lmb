import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { fixExistingUsers } from './fixExistingUsers.js';

const prisma = new PrismaClient();

export async function initAdmin() {
  const prismaAdmin = new PrismaClient();
  
  try {
    // D'abord, corriger les utilisateurs existants sans username
    try {
      await fixExistingUsers();
    } catch (error: any) {
      // Ignorer si la fonction n'existe pas ou si la colonne n'existe pas encore
      if (!error.message?.includes('no such column') && !error.message?.includes('Cannot find')) {
        console.warn('⚠️ Erreur lors de la correction des utilisateurs:', error.message);
      }
    }

    console.log('🔧 Vérification du compte admin...');

    // Vérifier si l'utilisateur admin existe déjà
    let admin = await prismaAdmin.user.findUnique({
      where: { username: 'Switch' },
    });

    if (admin) {
      // Mettre à jour le mot de passe au cas où
      const hashedPassword = await bcrypt.hash('Switch57220', 10);
      admin = await prismaAdmin.user.update({
        where: { username: 'Switch' },
        data: { password: hashedPassword, name: 'Switch' },
      });
      console.log('✅ Compte admin mis à jour');
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash('Switch57220', 10);
      admin = await prismaAdmin.user.create({
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
    
    await prismaAdmin.$disconnect();
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error.message || error);
    // Ne pas throw pour ne pas bloquer le serveur
    if (error.message?.includes('P1001') || error.message?.includes('Can\'t reach database')) {
      console.error('⚠️ Impossible de se connecter à la base de données. Vérifiez DATABASE_URL.');
    }
  } finally {
    try {
      await prismaAdmin.$disconnect();
      await prisma.$disconnect();
    } catch (e) {
      // Ignorer les erreurs de déconnexion
    }
  }
}

