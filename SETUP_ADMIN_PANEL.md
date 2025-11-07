# Configuration du Panel Admin

## Étapes pour activer le panel admin

### 1. Mettre à jour la base de données

Vous devez d'abord mettre à jour votre base de données pour ajouter :
- Le champ `isAdmin` dans la table `User`
- La table `DeletionLog` pour les logs de suppressions

#### Option A : Via Prisma (recommandé)

```bash
cd backend
npx prisma db push
npx prisma generate
```

**Important** : Après avoir exécuté `prisma generate`, les erreurs TypeScript dans `backend/api/index.ts` disparaîtront automatiquement car le client Prisma sera régénéré avec les nouveaux champs.

#### Option B : Via SQL direct (si Prisma ne fonctionne pas)

Exécutez ces commandes SQL dans votre éditeur SQL Neon.tech :

```sql
-- Ajouter la colonne isAdmin à la table User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

-- Créer la table DeletionLog
CREATE TABLE IF NOT EXISTS "DeletionLog" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "deletedBy" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletionLog_pkey" PRIMARY KEY ("id")
);

-- Ajouter la clé étrangère
ALTER TABLE "DeletionLog" ADD CONSTRAINT "DeletionLog_deletedBy_fkey" 
    FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE CASCADE;
```

### 2. Définir votre utilisateur comme admin

Exécutez cette commande SQL pour définir votre utilisateur comme admin (remplacez `VOTRE_USERNAME` par votre identifiant) :

```sql
UPDATE "User" 
SET "isAdmin" = true 
WHERE "username" = 'VOTRE_USERNAME';
```

### 3. Redéployer le backend

Après avoir mis à jour la base de données, redéployez le backend sur Vercel :

```bash
cd backend
git add .
git commit -m "feat: Ajout du panel admin"
git push
```

### 4. Accéder au panel admin

Une fois votre utilisateur défini comme admin :
1. Connectez-vous à l'application
2. Un bouton "Panel Admin" apparaîtra dans le header du Dashboard
3. Cliquez dessus pour accéder au panel admin

## Fonctionnalités du panel admin

### 1. Logs de Suppressions
- Affiche toutes les transactions supprimées
- Montre qui a supprimé chaque transaction
- Affiche la date, le type, le montant et la description

### 2. Statistiques Hebdomadaires
- Tableau par semaine du total des entrées (INCOME) par utilisateur
- Permet de suivre les ajouts d'argent de chaque utilisateur par semaine

## Sécurité

- Seuls les utilisateurs avec `isAdmin = true` peuvent accéder au panel
- Les routes admin sont protégées par le middleware `requireAdmin`
- Les logs de suppressions sont automatiquement créés lors de chaque suppression de transaction

