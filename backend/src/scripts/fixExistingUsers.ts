import { PrismaClient } from '@prisma/client';

export async function fixExistingUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Correction des utilisateurs existants...');

    // Récupérer tous les utilisateurs (même ceux sans username)
    // Note: Pour PostgreSQL, on ne peut pas chercher null directement, donc on récupère tous et on filtre
    const allUsers = await prisma.user.findMany();
    const users = allUsers.filter(u => !u.username || u.username === '');

    for (const user of users) {
      // Générer un username basé sur l'email ou créer un nom unique
      let username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`;
      
      // Nettoyer le username (enlever caractères spéciaux)
      username = username.replace(/[^a-zA-Z0-9_]/g, '_');
      
      // S'assurer que le username est unique
      let counter = 1;
      let finalUsername = username;
      let exists = await prisma.user.findUnique({ where: { username: finalUsername } }).catch(() => null);
      
      while (exists) {
        finalUsername = `${username}_${counter}`;
        exists = await prisma.user.findUnique({ where: { username: finalUsername } }).catch(() => null);
        counter++;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { username: finalUsername },
      });

      console.log(`✅ Utilisateur ${user.name} mis à jour avec username: ${finalUsername}`);
    }

    if (users.length === 0) {
      console.log('✅ Aucun utilisateur à corriger');
    } else {
      console.log(`✅ ${users.length} utilisateur(s) corrigé(s)`);
    }
  } catch (error: any) {
    // Ignorer les erreurs si la colonne username n'existe pas encore
    if (!error.message?.includes('no such column')) {
      console.error('❌ Erreur lors de la correction:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

