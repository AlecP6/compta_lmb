# Guide de déploiement sur Netlify

## 📋 Prérequis

1. Un compte Netlify (gratuit) : https://www.netlify.com
2. Le backend déployé sur un autre service (Railway, Render, Heroku, etc.)
3. Git installé sur votre machine

## 🚀 Étapes de déploiement

### 1. Déployer le backend

Le backend doit être déployé séparément. Options recommandées :

#### Option A : Railway (Recommandé)
1. Allez sur https://railway.app
2. Créez un nouveau projet
3. Connectez votre repository Git
4. Sélectionnez le dossier `backend`
5. Ajoutez les variables d'environnement :
   - `DATABASE_URL` (Railway fournit une base de données PostgreSQL)
   - `JWT_SECRET` (générez une clé secrète)
   - `PORT` (généralement 3000)
6. Railway déploiera automatiquement

#### Option B : Render
1. Allez sur https://render.com
2. Créez un nouveau "Web Service"
3. Connectez votre repository
4. Configurez :
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`

### 2. Déployer le frontend sur Netlify

#### Méthode 1 : Via l'interface Netlify (Recommandé pour débuter)

1. **Préparer le build localement** (optionnel) :
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Aller sur Netlify** :
   - Connectez-vous sur https://app.netlify.com
   - Cliquez sur "Add new site" > "Import an existing project"

3. **Connecter Git** :
   - Choisissez votre provider (GitHub, GitLab, Bitbucket)
   - Autorisez Netlify à accéder à votre repository
   - Sélectionnez le repository "Compta LMB"

4. **Configurer le build** :
   - **Base directory** : (laissez vide)
   - **Build command** : `cd frontend && npm install && npm run build`
   - **Publish directory** : `frontend/dist`

5. **Ajouter les variables d'environnement** :
   - Allez dans "Site settings" > "Environment variables"
   - Ajoutez :
     ```
     VITE_API_URL = https://votre-backend-url.com/api
     ```
   - Remplacez `https://votre-backend-url.com` par l'URL réelle de votre backend

6. **Déployer** :
   - Cliquez sur "Deploy site"
   - Netlify va construire et déployer votre site

#### Méthode 2 : Via Netlify CLI

1. **Installer Netlify CLI** :
   ```bash
   npm install -g netlify-cli
   ```

2. **Se connecter** :
   ```bash
   netlify login
   ```

3. **Initialiser le site** :
   ```bash
   cd "C:\Users\pxksa\Documents\Compta LMB"
   netlify init
   ```

4. **Configurer** :
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`

5. **Déployer** :
   ```bash
   netlify deploy --prod
   ```

### 3. Configurer CORS sur le backend

Assurez-vous que votre backend autorise les requêtes depuis votre domaine Netlify :

```typescript
// Dans backend/src/server.ts
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://votre-site.netlify.app', // Ajoutez votre URL Netlify
  ],
  credentials: true,
};
```

### 4. Vérifier le déploiement

1. Une fois déployé, Netlify vous donnera une URL (ex: `https://votre-site.netlify.app`)
2. Testez l'application :
   - Créez un compte
   - Connectez-vous
   - Ajoutez des transactions

## 🔧 Configuration avancée

### Variables d'environnement Netlify

Dans les paramètres du site Netlify, ajoutez :

```
VITE_API_URL = https://votre-backend.railway.app/api
```

### Domaine personnalisé

1. Allez dans "Domain settings"
2. Cliquez sur "Add custom domain"
3. Suivez les instructions pour configurer votre domaine

### Redéploiement automatique

Netlify redéploie automatiquement à chaque push sur votre branche principale.

## 🐛 Dépannage

### Le site ne charge pas
- Vérifiez que `VITE_API_URL` est correctement configuré
- Vérifiez les logs de build dans Netlify

### Erreurs CORS
- Vérifiez que l'URL Netlify est dans la liste des origines autorisées du backend

### Le backend ne répond pas
- Vérifiez que le backend est bien déployé et accessible
- Vérifiez les variables d'environnement du backend

## 📝 Notes importantes

- Le fichier `netlify.toml` est déjà configuré à la racine du projet
- Les routes React sont automatiquement redirigées vers `index.html`
- Les requêtes API utilisent la variable d'environnement `VITE_API_URL`

