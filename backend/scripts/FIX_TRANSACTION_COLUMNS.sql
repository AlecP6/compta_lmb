-- Script pour ajouter les colonnes manquantes à la table Transaction
-- Exécutez ce script dans votre base de données Neon

-- 1. Vérifier les colonnes existantes AVANT
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Transaction'
ORDER BY ordinal_position;

-- 2. Ajouter la colonne 'source' si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Transaction' 
        AND column_name = 'source'
    ) THEN
        ALTER TABLE "Transaction" ADD COLUMN source TEXT;
        RAISE NOTICE '✅ Colonne source ajoutée';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne source existe déjà';
    END IF;
END $$;

-- 3. Ajouter la colonne 'category' si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Transaction' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE "Transaction" ADD COLUMN category TEXT;
        RAISE NOTICE '✅ Colonne category ajoutée';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne category existe déjà';
    END IF;
END $$;

-- 4. Ajouter la colonne 'updatedAt' si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Transaction' 
        AND column_name = 'updatedAt'
    ) THEN
        ALTER TABLE "Transaction" ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
        RAISE NOTICE '✅ Colonne updatedAt ajoutée';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne updatedAt existe déjà';
    END IF;
END $$;

-- 5. Vérifier les colonnes existantes APRÈS
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Transaction'
ORDER BY ordinal_position;

