# Guide de mise à jour des catégories

Ce guide explique comment mettre à jour les catégories des transactions existantes de "GTA RP" vers "argent sale".

## Méthode 1: Script Node.js (recommandé si la base de données est configurée)

### Prérequis

Assurez-vous que votre fichier `backend/.env` contient une `DATABASE_URL` valide :

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Exécution

```powershell
cd backend
node scripts/update-categories.js
```

## Méthode 2: Script SQL direct

Si vous préférez exécuter le SQL directement sur votre base de données :

### Pour PostgreSQL (Neon, Supabase, etc.)

1. Connectez-vous à votre base de données via l'interface web ou un client SQL
2. Exécutez le contenu du fichier `backend/scripts/update-categories.sql`

Ou via la ligne de commande :

```bash
psql $DATABASE_URL -f backend/scripts/update-categories.sql
```

### Pour SQLite (si vous utilisez SQLite)

```sql
-- Compter les transactions à mettre à jour
SELECT COUNT(*) as transactions_a_mettre_a_jour
FROM Transaction
WHERE category = 'GTA RP';

-- Mettre à jour les transactions
UPDATE Transaction
SET category = 'argent sale'
WHERE category = 'GTA RP';

-- Vérifier le résultat
SELECT category, COUNT(*) as nombre
FROM Transaction
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;
```

## Méthode 3: Via Prisma Studio (interface graphique)

1. Ouvrez Prisma Studio :
   ```bash
   cd backend
   npx prisma studio
   ```

2. Allez dans la table `Transaction`
3. Filtrez par `category = "GTA RP"`
4. Modifiez manuellement chaque transaction ou utilisez l'export/import

## Vérification

Après la mise à jour, vérifiez que les changements ont été appliqués :

```sql
SELECT category, COUNT(*) as nombre
FROM "Transaction"
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;
```

Vous devriez voir :
- `argent sale` : nombre de transactions mises à jour
- Plus de `GTA RP` dans la liste

## Notes importantes

- ⚠️ **Sauvegarde** : Faites une sauvegarde de votre base de données avant d'exécuter le script
- ✅ **Idempotent** : Le script peut être exécuté plusieurs fois sans problème
- 🔄 **Nouvelles transactions** : Les nouvelles transactions GTA RP utiliseront automatiquement "argent sale" grâce aux modifications du code

