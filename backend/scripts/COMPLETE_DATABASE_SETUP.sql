-- ============================================
-- Script SQL complet pour la base de données
-- Comptabilité LMB
-- ============================================

-- ============================================
-- 1. TABLE USER
-- ============================================

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "gameId" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_username_key" UNIQUE ("username"),
    CONSTRAINT "User_gameId_key" UNIQUE ("gameId")
);

-- Si la table existe déjà, ajouter les colonnes manquantes
DO $$ 
BEGIN
    -- Ajouter gameId si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'gameId'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "gameId" TEXT;
        ALTER TABLE "User" ADD CONSTRAINT "User_gameId_key" UNIQUE ("gameId");
    END IF;

    -- Ajouter isAdmin si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'isAdmin'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Ajouter la contrainte d'unicité sur username si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'User' AND constraint_name = 'User_username_key'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_username_key" UNIQUE ("username");
    END IF;
END $$;

-- ============================================
-- 2. TABLE TRANSACTION
-- ============================================

CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") 
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Si la table existe déjà, ajouter les colonnes manquantes
DO $$ 
BEGIN
    -- Ajouter category si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Transaction' AND column_name = 'category'
    ) THEN
        ALTER TABLE "Transaction" ADD COLUMN "category" TEXT;
    END IF;

    -- Ajouter source si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Transaction' AND column_name = 'source'
    ) THEN
        ALTER TABLE "Transaction" ADD COLUMN "source" TEXT;
    END IF;
END $$;

-- ============================================
-- 3. TABLE DELETIONLOG
-- ============================================

CREATE TABLE IF NOT EXISTS "DeletionLog" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "deletedBy" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletionLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DeletionLog_deletedBy_fkey" FOREIGN KEY ("deletedBy") 
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- 4. MISE À JOUR DES CATÉGORIES EXISTANTES
-- ============================================

-- Vérifier combien de transactions ont la catégorie "GTA RP" (avant la mise à jour)
SELECT COUNT(*) as nombre_transactions_gta_rp
FROM "Transaction"
WHERE category = 'GTA RP';

-- Mettre à jour toutes les transactions avec la catégorie "GTA RP" vers "argent sale"
UPDATE "Transaction"
SET category = 'argent sale'
WHERE category = 'GTA RP';

-- Vérifier le résultat (toutes les catégories utilisées)
SELECT category, COUNT(*) as nombre
FROM "Transaction"
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

