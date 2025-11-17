/**
 * Script pour mettre à jour les catégories des transactions existantes
 * 
 * Ce script remplace "GTA RP" par "argent sale" dans toutes les transactions existantes
 * 
 * Usage:
 *   node scripts/update-categories.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCategories() {
  try {
    console.log('\n🔄 Mise à jour des catégories des transactions\n');
    console.log('═══════════════════════════════════════\n');

    // Compter les transactions avec "GTA RP"
    const countGtaRp = await prisma.transaction.count({
      where: {
        category: 'GTA RP',
      },
    });

    console.log(`📊 Transactions trouvées avec la catégorie "GTA RP": ${countGtaRp}\n`);

    if (countGtaRp === 0) {
      console.log('✅ Aucune transaction à mettre à jour.\n');
      return;
    }

    // Mettre à jour les transactions
    const result = await prisma.transaction.updateMany({
      where: {
        category: 'GTA RP',
      },
      data: {
        category: 'argent sale',
      },
    });

    console.log(`✅ ${result.count} transaction(s) mise(s) à jour avec succès !\n`);
    console.log('   Catégorie "GTA RP" → "argent sale"\n');

    // Vérifier les autres catégories existantes
    const allCategories = await prisma.transaction.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    const categories = allCategories
      .map(t => t.category)
      .filter(c => c !== null)
      .sort();

    if (categories.length > 0) {
      console.log('📋 Catégories actuellement utilisées dans la base de données:');
      categories.forEach(cat => {
        console.log(`   - ${cat}`);
      });
      console.log('');
    }

    console.log('═══════════════════════════════════════\n');
    console.log('✨ Mise à jour terminée avec succès !\n');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des catégories:', error.message);
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Assurez-vous que la base de données est accessible.');
      console.error('   Vérifiez votre DATABASE_URL dans le fichier .env\n');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

