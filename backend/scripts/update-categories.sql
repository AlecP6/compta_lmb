-- Script SQL pour mettre à jour les catégories des transactions existantes
-- Remplace "GTA RP" par "argent sale" dans toutes les transactions

-- Compter les transactions à mettre à jour
SELECT COUNT(*) as transactions_a_mettre_a_jour
FROM "Transaction"
WHERE category = 'GTA RP';

-- Mettre à jour les transactions
UPDATE "Transaction"
SET category = 'argent sale'
WHERE category = 'GTA RP';

-- Vérifier le résultat
SELECT category, COUNT(*) as nombre
FROM "Transaction"
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;

