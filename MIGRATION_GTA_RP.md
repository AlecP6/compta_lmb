# Instructions de migration pour l'intégration GTA RP

## Étapes à suivre

### 1. Générer le client Prisma

Après avoir modifié le schéma Prisma, vous devez régénérer le client :

```bash
cd backend
npx prisma generate
```

### 2. Appliquer les changements à la base de données

#### Si vous utilisez PostgreSQL (production) :

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name add_gameid_and_source

# Ou en production
npx prisma migrate deploy
```

#### Si vous utilisez SQLite (développement) :

```bash
npx prisma db push
```

### 3. Vérifier les changements

Les modifications apportées au schéma incluent :

- **User.gameId** : Nouveau champ optionnel et unique pour stocker l'ID de jeu GTA RP
- **Transaction.source** : Nouveau champ optionnel pour indiquer l'origine de la transaction (`"MANUAL"` ou `"GTA_RP"`)

### 4. Redémarrer le serveur

Après la migration, redémarrez votre serveur backend :

```bash
npm run build  # ou votre commande de build
npm start      # ou votre commande de démarrage
```

## Notes importantes

- ⚠️ **Sauvegardez votre base de données** avant d'appliquer la migration
- Les utilisateurs existants n'auront pas de `gameId` (null par défaut)
- Les transactions existantes n'auront pas de `source` (null par défaut)
- Les nouvelles transactions manuelles auront `source = "MANUAL"`
- Les transactions créées via le webhook auront `source = "GTA_RP"`

## Résolution des erreurs TypeScript

Si vous voyez des erreurs TypeScript concernant les nouveaux champs (`gameId`, `source`), c'est normal. Elles disparaîtront après avoir exécuté `npx prisma generate`.

