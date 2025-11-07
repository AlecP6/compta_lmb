import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { fixExistingUsers } from './fixExistingUsers.js';

const prisma = new PrismaClient();

export async function initAdmin() {
  try {
    // D'abord, corriger les utilisateurs existants sans username
    await fixExistingUsers();

    // Créer une nouvelle instance pour éviter les problèmes de connexion
    const prismaAdmin = new PrismaClient();
    
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
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

