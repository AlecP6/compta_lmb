-- Script pour vérifier et créer l'utilisateur Switch si nécessaire
-- Exécutez ce script dans votre base de données Neon

-- 1. Vérifier si l'utilisateur Switch existe
SELECT id, username, name, "isAdmin", "createdAt"
FROM "User"
WHERE username = 'Switch';

-- 2. Si l'utilisateur n'existe pas, créez-le avec ce script :
-- (Note: Le mot de passe doit être hashé avec bcrypt, donc utilisez plutôt l'API ou le script initAdmin)

-- 3. Vérifier toutes les colonnes de la table User
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

-- 4. Vérifier toutes les colonnes de la table Transaction
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Transaction'
ORDER BY ordinal_position;

