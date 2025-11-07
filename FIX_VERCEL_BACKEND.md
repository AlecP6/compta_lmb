# 🔧 Corriger le Backend Vercel

## Problème

Vercel utilise des Serverless Functions, donc la configuration actuelle ne fonctionne pas directement.

## Solution : Utiliser l'API Routes de Vercel

J'ai créé un fichier `backend/api/index.ts` qui adapte votre Express app pour Vercel.

## 📋 Étapes pour corriger

### 1. Vérifier que les fichiers sont créés

Le fichier `backend/api/index.ts` doit exister. Si ce n'est pas le cas, Vercel ne pourra pas le trouver.

### 2. Redéployer sur Vercel

1. **Allez sur Vercel** : https://vercel.com
2. **Sélectionnez votre projet backend**
3. **Allez dans "Settings"** > **"General"**
4. **Vérifiez la configuration** :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npm run build`
   - **Output Directory** : (laissez vide ou `dist`)
   - **Install Command** : `npm install`
5. **Allez dans "Deployments"**
6. **Cliquez sur "Redeploy"** sur le dernier déploiement
7. **Sélectionnez "Use existing Build Cache"** (décochez-le pour un build propre)

### 3. Vérifier les variables d'environnement

Dans Vercel > Settings > Environment Variables, vérifiez :
- ✅ `DATABASE_URL` (URL Neon complète)
- ✅ `JWT_SECRET` (clé générée)
- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `3000` (optionnel pour Vercel)

### 4. Vérifier les logs

Après le redéploiement :
1. **Allez dans "Deployments"**
2. **Cliquez sur le dernier déploiement**
3. **Regardez les "Function Logs"**
4. **Cherchez** :
   - ✅ "Serveur démarré" ou "Server started"
   - ❌ Erreurs Prisma
   - ❌ Erreurs de connexion base de données
   - ❌ Erreurs de variables d'environnement

## 🔄 Alternative : Utiliser Railway ou Render

Si Vercel continue de poser problème, utilisez Railway ou Render qui sont plus simples pour les applications Express complètes.

### Railway (Recommandé)

1. **Allez sur** : https://railway.app
2. **"New Project"** > **"Deploy from GitHub repo"**
3. **Sélectionnez** : `AlecP6/compta_lmb`
4. **Configurez** :
   - **Root Directory** : `backend`
5. **Ajoutez une base PostgreSQL** :
   - Cliquez sur "+ New" > "Database" > "PostgreSQL"
6. **Variables d'environnement** :
   - `DATABASE_URL` (ajouté automatiquement)
   - `JWT_SECRET` (générez-en un)
   - `PORT` = `3000`
7. **Déployez**

Railway est plus simple car il gère directement les applications Node.js sans configuration spéciale.

## 🐛 Erreurs courantes Vercel

### "Cannot find module"
- **Cause** : Les dépendances ne sont pas installées
- **Solution** : Vérifiez que `npm install` s'exécute dans le build

### "Prisma Client not generated"
- **Cause** : Prisma n'est pas généré
- **Solution** : Vérifiez que `postinstall` est dans `package.json` (c'est déjà fait)

### "Database connection error"
- **Cause** : `DATABASE_URL` incorrecte
- **Solution** : Vérifiez que l'URL Neon est complète et correcte

## ✅ Test rapide

Une fois redéployé, testez :
```
https://votre-backend.vercel.app/api/health
```

Vous devriez voir : `{"status":"OK","message":"API de comptabilité fonctionnelle"}`

Si ça ne fonctionne toujours pas, dites-moi quelle erreur vous voyez dans les logs Vercel !

