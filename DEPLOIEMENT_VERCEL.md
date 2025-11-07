# Solution Simple : Déployer sur Vercel (Frontend + Backend)

Vercel est la solution la plus simple pour déployer votre application complète. Il gère automatiquement le frontend ET le backend.

## 🚀 Déploiement complet sur Vercel

### 1. Créer un compte Vercel

1. **Allez sur** : https://vercel.com
2. **Cliquez sur "Sign Up"**
3. **Connectez-vous avec GitHub** (recommandé)
4. Autorisez Vercel à accéder à vos repositories

### 2. Créer une base de données (PlanetScale - Gratuit)

PlanetScale est gratuit et très simple :

1. **Allez sur** : https://planetscale.com
2. **Créez un compte** (gratuit avec GitHub)
3. **Créez une base de données** :
   - Cliquez sur "Create database"
   - Name : `compta_lmb`
   - Region : Choisissez le plus proche
   - Plan : **"Hobby"** (gratuit)
4. **Créez un branche** :
   - Cliquez sur "Create branch"
   - Name : `main`
5. **Obtenez l'URL de connexion** :
   - Cliquez sur "Connect"
   - Sélectionnez "Prisma"
   - **Copiez l'URL** (elle ressemble à : `mysql://...@...planetscale.com/...`)

### 3. Modifier le schéma Prisma pour MySQL

PlanetScale utilise MySQL. Modifions le schéma :

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### 4. Déployer sur Vercel

1. **Dans Vercel**, cliquez sur **"Add New..."** > **"Project"**
2. **Importez votre repository** : `AlecP6/compta_lmb`
3. **Configurez le projet** :
   - **Framework Preset** : Vite (détecté automatiquement)
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`
4. **Ajoutez les variables d'environnement** :
   - Cliquez sur "Environment Variables"
   - Ajoutez :
     ```
     VITE_API_URL = /api
     ```
   - Pour le backend (nous allons le configurer séparément)
5. **Cliquez sur "Deploy"**

### 5. Configurer le backend comme API Routes Vercel

Vercel peut gérer le backend via des Serverless Functions. Créons la structure :

1. **Créez un dossier** `api` à la racine du projet
2. **Vercel détectera automatiquement** les fichiers dans `/api` comme des fonctions serverless

Mais pour simplifier, déployons le backend séparément :

### Option A : Backend séparé sur Vercel (Recommandé)

1. **Créez un NOUVEAU projet Vercel** :
   - "Add New..." > "Project"
   - Même repository : `AlecP6/compta_lmb`
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

2. **Variables d'environnement** :
   ```
   DATABASE_URL = (l'URL PlanetScale que vous avez copiée)
   JWT_SECRET = votre-clé-secrète-aléatoire
   NODE_ENV = production
   PORT = 3000
   ```

3. **Déployez**

4. **Notez l'URL** : Vercel vous donnera une URL comme `https://compta-lmb-backend.vercel.app`

5. **Mettez à jour le frontend** :
   - Dans le projet frontend Vercel, modifiez `VITE_API_URL` :
     ```
     VITE_API_URL = https://compta-lmb-backend.vercel.app/api
     ```
   - Redéployez

## 🔄 Solution Alternative : Tout sur Vercel avec API Routes

Si vous voulez tout sur un seul projet Vercel, nous pouvons convertir le backend en API Routes Vercel. Mais c'est plus complexe.

## ✅ Solution la PLUS SIMPLE : Backend sur Render + Frontend sur Netlify

Si Vercel ne fonctionne pas, revenons à Render mais avec des instructions plus claires :

### Backend sur Render (Étape par étape)

1. **Allez sur Render** : https://render.com
2. **Créez un compte** (gratuit)
3. **"New +"** > **"PostgreSQL"** :
   - Name : `compta-db`
   - Plan : **Free**
   - Créez
4. **"New +"** > **"Web Service"** :
   - Connectez GitHub : `AlecP6/compta_lmb`
   - Name : `compta-backend`
   - Root Directory : `backend`
   - Build : `npm install && npm run build`
   - Start : `npm start`
   - Variables :
     - `DATABASE_URL` = (Internal Database URL de votre PostgreSQL)
     - `JWT_SECRET` = (générez avec PowerShell : `-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})`)
     - `PORT` = `3000`
     - `NODE_ENV` = `production`
5. **Déployez** et attendez
6. **Notez l'URL** : `https://compta-backend.onrender.com`

### Frontend sur Netlify (Déjà fait)

1. **Netlify** > Votre site > **Environment Variables**
2. **Modifiez** `VITE_API_URL` : `https://compta-backend.onrender.com/api`
3. **Redéployez**

## 🐛 Si ça ne marche toujours pas

Dites-moi exactement :
1. **Quelle étape** vous bloquez ?
2. **Quelle erreur** vous voyez ?
3. **Sur quelle plateforme** (Render, Vercel, Netlify) ?

Je créerai une solution sur mesure pour vous !

