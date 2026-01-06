/**
 * Script pour supprimer TOUTES les transactions de la base de données
 * ATTENTION : Cette action est irréversible !
 * 
 * Usage:
 *   node scripts/delete-all-transactions.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllTransactions() {
  try {
    console.log('\n⚠️  SUPPRESSION DE TOUTES LES TRANSACTIONS\n');
    console.log('═══════════════════════════════════════\n');

    // Compter les transactions avant suppression
    const count = await prisma.transaction.count();
    console.log(`📊 Nombre de transactions à supprimer: ${count}\n`);

    if (count === 0) {
      console.log('✅ Aucune transaction à supprimer.\n');
      return;
    }

    // Supprimer toutes les transactions
    const result = await prisma.transaction.deleteMany({});
    
    console.log(`✅ ${result.count} transaction(s) supprimée(s) avec succès !\n`);
    
    // Vérifier qu'il ne reste plus rien
    const remaining = await prisma.transaction.count();
    console.log(`📊 Transactions restantes: ${remaining}\n`);

    if (remaining === 0) {
      console.log('✅ Base de données nettoyée avec succès !\n');
    } else {
      console.log('⚠️  Attention: Il reste encore des transactions.\n');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllTransactions()
  .catch((error) => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });

