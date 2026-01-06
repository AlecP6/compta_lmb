-- Script pour vérifier et créer/corriger la table Transaction
-- Exécutez ce script dans votre base de données Neon

-- 1. Vérifier si la table Transaction existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'Transaction';

-- 2. Vérifier toutes les colonnes de la table Transaction
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Transaction'
ORDER BY ordinal_position;

-- 3. Si la table n'existe pas ou si des colonnes manquent, exécutez ceci :
-- (Note: Adaptez selon votre schéma Prisma actuel)

-- Créer la table Transaction si elle n'existe pas
CREATE TABLE IF NOT EXISTS "Transaction" (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  source TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "userId" TEXT NOT NULL,
  CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Créer un index sur userId pour améliorer les performances
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");

-- Créer un index sur createdAt pour améliorer les performances des requêtes de tri
CREATE INDEX IF NOT EXISTS "Transaction_createdAt_idx" ON "Transaction"("createdAt" DESC);

