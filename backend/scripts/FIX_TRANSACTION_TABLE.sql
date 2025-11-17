-- Script pour corriger la table Transaction et ajouter les colonnes manquantes
-- Exécutez ce script dans votre base de données Neon

-- 1. Vérifier les colonnes existantes
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
        RAISE NOTICE 'Colonne source ajoutée à la table Transaction';
    ELSE
        RAISE NOTICE 'Colonne source existe déjà';
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
        RAISE NOTICE 'Colonne category ajoutée à la table Transaction';
    ELSE
        RAISE NOTICE 'Colonne category existe déjà';
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
        RAISE NOTICE 'Colonne updatedAt ajoutée à la table Transaction';
    ELSE
        RAISE NOTICE 'Colonne updatedAt existe déjà';
    END IF;
END $$;

-- 5. Vérifier que toutes les colonnes existent maintenant
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Transaction'
ORDER BY ordinal_position;

