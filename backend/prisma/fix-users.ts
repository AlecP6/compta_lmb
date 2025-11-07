import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Mise à jour des utilisateurs existants...');

  // Récupérer tous les utilisateurs sans username
  const users = await prisma.user.findMany({
    where: {
      username: null as any,
    },
  });

  for (const user of users) {
    // Générer un username basé sur l'email ou créer un nom unique
    let username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`;
    
    // S'assurer que le username est unique
    let counter = 1;
    let finalUsername = username;
    while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
      finalUsername = `${username}_${counter}`;
      counter++;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { username: finalUsername },
    });

    console.log(`✅ Utilisateur ${user.name} mis à jour avec username: ${finalUsername}`);
  }

  // Créer ou mettre à jour le compte admin
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'Switch' },
  });

  if (existingAdmin) {
    const hashedPassword = await bcrypt.hash('Switch57220', 10);
    await prisma.user.update({
      where: { username: 'Switch' },
      data: { password: hashedPassword, name: 'Switch' },
    });
    console.log('✅ Compte admin mis à jour');
  } else {
    const hashedPassword = await bcrypt.hash('Switch57220', 10);
    await prisma.user.create({
      data: {
        username: 'Switch',
        password: hashedPassword,
        name: 'Switch',
      },
    });
    console.log('✅ Compte admin créé');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

