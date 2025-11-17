# Guide de démarrage rapide - Test du webhook Discord

## Étape 1: Vérifier la configuration

Assurez-vous d'avoir un fichier `.env` dans le dossier `backend/` avec au minimum :

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="votre-secret-jwt"
PORT=3001
```

## Étape 2: Démarrer le serveur backend

Dans un terminal PowerShell :

```powershell
cd "C:\Users\pxksa\Documents\Compta LMB\backend"
node --loader ts-node/esm src/server.ts
```

Ou si vous avez un script npm :

```powershell
npm start
```

## Étape 3: Lister les utilisateurs (dans un autre terminal)

```powershell
cd "C:\Users\pxksa\Documents\Compta LMB\backend"
node scripts/list-users.js
```

## Étape 4: Tester le webhook

```powershell
node scripts/test-discord-webhook.js --gameId=VOTRE_GAME_ID --action=deposit --amount=100
```

Ou avec un username :

```powershell
node scripts/test-discord-webhook.js --username=VOTRE_USERNAME --action=deposit --amount=100
```

