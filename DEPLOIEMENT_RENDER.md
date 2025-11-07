# Guide : Déployer le backend sur Render (Alternative à Railway)

Render est une alternative gratuite et simple à Railway pour déployer le backend.

## 🚀 Étapes de déploiement sur Render

### 1. Créer un compte Render

1. **Allez sur** : https://render.com
2. **Cliquez sur "Get Started for Free"**
3. **Créez un compte** avec votre email ou GitHub (recommandé)

### 2. Créer une base de données PostgreSQL

1. **Dans le dashboard Render**, cliquez sur **"New +"**
2. **Sélectionnez "PostgreSQL"**
3. **Configurez** :
   - **Name** : `compta-lmb-db` (ou un nom de votre choix)
   - **Database** : `compta_lmb` (ou un nom de votre choix)
   - **User** : `compta_user` (ou un nom de votre choix)
   - **Region** : Choisissez le plus proche (ex: Frankfurt, Ireland)
   - **PostgreSQL Version** : Laissez la dernière version
   - **Plan** : Sélectionnez **"Free"** (gratuit)
4. **Cliquez sur "Create Database"**
5. **Notez les informations** :
   - **Internal Database URL** : Vous en aurez besoin
   - **External Database URL** : Pour la connexion depuis l'extérieur

### 3. Créer le service Web (Backend)

1. **Dans le dashboard**, cliquez sur **"New +"**
2. **Sélectionnez "Web Service"**
3. **Connectez votre repository GitHub** :
   - Si c'est la première fois, autorisez Render à accéder à GitHub
   - Sélectionnez le repository : `AlecP6/compta_lmb`
4. **Configurez le service** :
   - **Name** : `compta-lmb-backend` (ou un nom de votre choix)
   - **Region** : Même région que la base de données
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : Sélectionnez **"Free"** (gratuit)
5. **Ajoutez les variables d'environnement** :
   - Cliquez sur **"Advanced"** pour voir plus d'options
   - Dans **"Environment Variables"**, ajoutez :
     ```
     DATABASE_URL = (copiez l'Internal Database URL de votre base de données)
     JWT_SECRET = votre-clé-secrète-aléatoire-ici
     PORT = 3000
     ```
   - Pour `JWT_SECRET`, générez une clé aléatoire :
     - Sur Windows PowerShell : 
       ```powershell
       -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
       ```
     - Ou utilisez un générateur en ligne : https://randomkeygen.com/
6. **Cliquez sur "Create Web Service"**

### 4. Attendre le déploiement

- Render va automatiquement :
  1. Cloner votre repository
  2. Installer les dépendances
  3. Builder le projet
  4. Démarrer le service

- **Cela peut prendre 5-10 minutes** la première fois

### 5. Exécuter les migrations Prisma

Une fois le service déployé :

1. **Allez dans votre service** (dans le dashboard Render)
2. **Cliquez sur "Shell"** (ou "Open Shell")
3. **Exécutez ces commandes** :
   ```bash
   npm run prisma:generate
   npm run prisma:migrate deploy
   npm run setup:admin
   ```

**OU** via les logs (méthode alternative) :

1. **Allez dans "Logs"**
2. **Attendez** que le service démarre
3. Les migrations peuvent être exécutées automatiquement si vous ajoutez un script dans `package.json`

### 6. Notez l'URL de votre backend

- Render vous donnera une URL comme : `https://compta-lmb-backend.onrender.com`
- **Notez cette URL**, vous en aurez besoin pour Netlify

### 7. Mettre à jour Netlify

1. **Allez sur Netlify** : https://app.netlify.com
2. **Sélectionnez votre site**
3. **Site settings** > **Environment variables**
4. **Modifiez** `VITE_API_URL` avec :
   ```
   https://compta-lmb-backend.onrender.com/api
   ```
   (Remplacez par votre URL réelle)
5. **Redéployez** :
   - "Deploys" > "Trigger deploy" > "Clear cache and deploy site"

## 🔧 Ajouter un script de migration automatique

Pour que les migrations s'exécutent automatiquement au démarrage, modifiez `backend/package.json` :

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "postinstall": "prisma generate",
    "prisma:migrate:deploy": "prisma migrate deploy"
  }
}
```

Et modifiez `backend/src/server.ts` pour exécuter les migrations au démarrage.

## ⚠️ Notes importantes

- **Plan gratuit** : Le service peut "s'endormir" après 15 minutes d'inactivité
  - Le premier appel après l'inactivité peut prendre 30-60 secondes
  - Pour éviter ça, utilisez un service de "ping" gratuit (ex: UptimeRobot)

- **Base de données** : Le plan gratuit a des limitations mais suffit pour commencer

- **Variables d'environnement** : Utilisez l'**Internal Database URL** pour `DATABASE_URL` (plus sécurisé)

## 🐛 Dépannage

### Le service ne démarre pas
- Vérifiez les logs dans Render
- Vérifiez que toutes les variables d'environnement sont correctes
- Vérifiez que `Root Directory` est bien `backend`

### Erreurs de base de données
- Vérifiez que `DATABASE_URL` utilise l'Internal URL
- Vérifiez que la base de données est bien créée et active

### Les migrations ne fonctionnent pas
- Exécutez-les manuellement via le Shell
- Vérifiez que Prisma est bien installé

## ✅ Checklist

- [ ] Compte Render créé
- [ ] Base de données PostgreSQL créée
- [ ] Service Web créé et configuré
- [ ] Variables d'environnement ajoutées
- [ ] Service déployé avec succès
- [ ] Migrations exécutées
- [ ] URL du backend notée
- [ ] Variable `VITE_API_URL` mise à jour sur Netlify
- [ ] Site Netlify redéployé

## 🎉 Une fois terminé

Votre backend sera accessible sur `https://votre-service.onrender.com` et votre frontend Netlify pourra communiquer avec lui !

