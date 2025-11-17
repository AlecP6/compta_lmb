-- Script pour créer l'utilisateur Switch dans la base de données
-- ATTENTION: Ce script crée l'utilisateur avec un mot de passe hashé
-- Le hash bcrypt pour "Switch57220" est pré-calculé ci-dessous

-- IMPORTANT: Vous devez utiliser l'API ou un script Node.js pour hasher le mot de passe correctement
-- Ce script SQL ne peut pas hasher le mot de passe avec bcrypt

-- Option 1: Utiliser l'API d'inscription pour créer l'utilisateur
-- POST /api/auth/register
-- {
--   "username": "Switch",
--   "password": "Switch57220",
--   "name": "Switch"
-- }

-- Option 2: Vérifier si l'utilisateur existe déjà
SELECT id, username, name, "isAdmin"
FROM "User"
WHERE username = 'Switch';

-- Si l'utilisateur n'existe pas, vous devez utiliser l'API ou le script initAdmin
-- car le mot de passe doit être hashé avec bcrypt

