# 🔧 Créer les Tables Manuellement dans Neon

## ❌ Problème

Les tables `User` et `Transaction` n'existent pas dans la base de données PostgreSQL/Neon, ce qui cause des erreurs 500 lors des opérations sur les transactions.

## ✅ Solution : Créer les Tables Manuellement

### Étape 1 : Accéder à Neon Console

1. Allez sur **https://console.neon.tech**
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### Étape 2 : Ouvrir le SQL Editor

1. Dans le menu de gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New Query** ou utilisez l'éditeur existant

### Étape 3 : Exécuter le SQL Suivant

Copiez et collez ce SQL dans l'éditeur, puis cliquez sur **Run** :

```sql
-- Créer la table User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Créer l'index unique sur username
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

-- Créer la table Transaction
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- Créer la clé étrangère
ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_userId_fkey" 
FOREIGN KEY ("userId") 
REFERENCES "User"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Créer un index sur userId pour améliorer les performances
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
```

### Étape 4 : Vérifier que les Tables sont Créées

Exécutez cette requête pour vérifier :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('User', 'Transaction');
```

Vous devriez voir les deux tables listées.

## 🚀 Après Création des Tables

1. **Redéployer sur Vercel** (optionnel, mais recommandé) :
   - Allez sur Vercel Dashboard
   - Sélectionnez votre projet
   - Cliquez sur **Redeploy** sur le dernier déploiement

2. **Tester l'API** :
   ```powershell
   # Test de création de transaction
   $token = "VOTRE_TOKEN_JWT"
   $body = @{
       type = "INCOME"
       amount = 100.50
       description = "Test transaction"
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "https://compta-lmb.vercel.app/api/transactions" `
       -Method Post `
       -Body $body `
       -ContentType "application/json" `
       -Headers @{ Authorization = "Bearer $token" }
   ```

## 📝 Notes

- Les tables seront créées avec `IF NOT EXISTS`, donc vous pouvez exécuter le script plusieurs fois sans problème
- Les données existantes (si vous en avez) seront préservées
- La clé étrangère garantit l'intégrité référentielle entre User et Transaction

## ✅ Vérification

Après avoir créé les tables, les erreurs 500 sur `/api/transactions` devraient disparaître et vous pourrez :
- ✅ Créer des transactions (ajout/retrait d'argent)
- ✅ Lister les transactions
- ✅ Supprimer des transactions
- ✅ Voir les statistiques

