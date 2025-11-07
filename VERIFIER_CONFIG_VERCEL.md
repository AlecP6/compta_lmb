# ✅ Vérification Complète de la Configuration Vercel

## 📋 Checklist de Vérification

### 1. ✅ Configuration du Projet (Settings > General)

Allez sur **Vercel** > Votre projet > **Settings** > **General** :

- [ ] **Root Directory** : `backend` ⚠️ (TRÈS IMPORTANT)
- [ ] **Framework Preset** : `Other` (ou laissez vide)
- [ ] **Build Command** : `npm install && npm run vercel-build` (ou laissez vide si `vercel.json` existe)
- [ ] **Output Directory** : (laissez vide)
- [ ] **Install Command** : `npm install` (ou laissez vide)
- [ ] **Node.js Version** : `20.x` (recommandé)

### 2. ✅ Variables d'Environnement (Settings > Environment Variables)

Allez sur **Settings** > **Environment Variables** :

Vérifiez que vous avez **TOUTES** ces variables :

- [ ] `DATABASE_URL` = `postgresql://neondb_owner:npg_p1kCytel3wrR@ep-morning-shadow-ahf453zo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- [ ] `JWT_SECRET` = (votre clé secrète, au moins 32 caractères)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000` (optionnel pour Vercel)

**Important** : Vérifiez que les variables sont définies pour **Production**, **Preview**, et **Development**.

### 3. ✅ Fichiers de Configuration

Vérifiez que ces fichiers existent dans `backend/` :

- [ ] `backend/vercel.json` ✅ (existe)
- [ ] `backend/api/index.ts` ✅ (existe)
- [ ] `backend/package.json` ✅ (existe)
- [ ] `backend/prisma/schema.prisma` ✅ (existe)

### 4. ✅ Contenu de `backend/vercel.json`

Le fichier doit contenir :

```json
{
  "version": 2,
  "buildCommand": "npm install && npm run vercel-build",
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

### 5. ✅ Contenu de `backend/package.json`

Vérifiez que le script `vercel-build` existe :

```json
{
  "scripts": {
    "vercel-build": "node scripts/clean-migrations.js && prisma generate"
  }
}
```

### 6. ✅ Structure des Fichiers

Vérifiez que la structure est correcte :

```
backend/
├── api/
│   └── index.ts          ✅ Point d'entrée Vercel
├── src/
│   ├── routes/
│   │   ├── auth.ts       ✅ Routes d'authentification
│   │   └── transactions.ts ✅ Routes de transactions
│   ├── scripts/
│   │   └── initAdmin.ts  ✅ Script d'initialisation admin
│   └── middleware/
│       └── auth.ts       ✅ Middleware d'authentification
├── prisma/
│   ├── schema.prisma     ✅ Schéma Prisma
│   └── migrations/
│       └── migration_lock.toml ✅ Lock file PostgreSQL
├── scripts/
│   └── clean-migrations.js ✅ Script de nettoyage
├── vercel.json           ✅ Configuration Vercel
└── package.json          ✅ Configuration npm
```

### 7. ✅ Test des Endpoints

Une fois déployé, testez ces URLs (remplacez `votre-projet` par votre URL Vercel) :

- [ ] `https://votre-projet.vercel.app/api/health`
  - Devrait retourner : `{"status": "OK", "message": "API de comptabilité fonctionnelle"}`

- [ ] `https://votre-projet.vercel.app/api/auth/login`
  - Devrait accepter POST avec `username` et `password`

- [ ] `https://votre-projet.vercel.app/api/transactions`
  - Devrait nécessiter un token JWT (401 si non authentifié)

### 8. ✅ Logs de Déploiement

Allez dans **Deployments** > Cliquez sur le dernier déploiement > **Logs** :

Vérifiez que vous voyez :
- [ ] ✅ "Prisma schema loaded from prisma/schema.prisma"
- [ ] ✅ "Generated Prisma Client"
- [ ] ✅ "Build successful"
- [ ] ✅ "Deployment ready"

### 9. ✅ Logs Runtime (Functions)

Allez dans **Functions** > `api/index.ts` > **Logs** :

Après la première requête, vous devriez voir :
- [ ] ✅ "🔄 Synchronisation du schéma Prisma avec la base de données..."
- [ ] ✅ "✅ Schéma synchronisé"
- [ ] ✅ "✅ Compte admin créé avec succès !"
- [ ] ✅ "✅ Initialisation terminée"

## 🔧 Corrections à Apporter

### Si Root Directory n'est pas `backend` :

1. Allez dans **Settings** > **General**
2. Cliquez sur **"Edit"**
3. Changez **Root Directory** en `backend`
4. Cliquez sur **"Save"**
5. Redéployez

### Si les variables d'environnement manquent :

1. Allez dans **Settings** > **Environment Variables**
2. Cliquez sur **"Add New"**
3. Ajoutez chaque variable manquante
4. Sélectionnez **Production**, **Preview**, et **Development**
5. Cliquez sur **"Save"**
6. Redéployez

### Si le build échoue :

1. Allez dans **Deployments**
2. Cliquez sur le déploiement qui a échoué
3. Regardez les **Logs**
4. Copiez l'erreur exacte
5. Vérifiez que tous les fichiers existent sur GitHub

## 📝 Commandes de Vérification Locale

Pour vérifier localement que tout est correct :

```powershell
cd "C:\Users\pxksa\Documents\Compta LMB\backend"

# Vérifier que vercel.json existe
Test-Path vercel.json

# Vérifier que api/index.ts existe
Test-Path api/index.ts

# Vérifier que package.json contient vercel-build
Select-String -Path package.json -Pattern "vercel-build"

# Vérifier que prisma/schema.prisma existe
Test-Path prisma/schema.prisma
```

## 🚀 Après Vérification

Une fois que tout est vérifié :

1. **Redéployez** sur Vercel (sans cache)
2. **Testez** l'endpoint `/api/health`
3. **Vérifiez** les logs runtime
4. **Testez** l'inscription/connexion

## ❓ Besoin d'Aide ?

Si quelque chose ne correspond pas à cette checklist, dites-moi :
1. **Quelle étape** pose problème
2. **Ce que vous voyez** dans Vercel
3. **Les erreurs** dans les logs

Je vous aiderai à corriger !

