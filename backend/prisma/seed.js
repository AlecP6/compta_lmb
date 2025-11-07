import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Démarrage du seed...');
    // Vérifier si l'utilisateur admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
        where: { username: 'Switch' },
    });
    if (existingAdmin) {
        console.log('✅ Compte admin existe déjà');
        // Mettre à jour le mot de passe au cas où
        const hashedPassword = await bcrypt.hash('Switch57220', 10);
        await prisma.user.update({
            where: { username: 'Switch' },
            data: { password: hashedPassword, name: 'Switch' },
        });
        console.log('✅ Compte admin mis à jour');
        return;
    }
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('Switch57220', 10);
    // Créer le compte admin
    const admin = await prisma.user.create({
        data: {
            username: 'Switch',
            password: hashedPassword,
            name: 'Switch',
        },
    });
    console.log('✅ Compte admin créé avec succès !');
    console.log(`   Identifiant: ${admin.username}`);
    console.log(`   Nom: ${admin.name}`);
}
main()
    .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map