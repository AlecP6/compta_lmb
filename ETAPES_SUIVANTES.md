# Étapes suivantes après la configuration Netlify

## ✅ Ce que vous avez fait
- [x] Code poussé sur GitHub
- [x] Site déployé sur Netlify
- [x] Variable d'environnement `VITE_API_URL` ajoutée

## 🎯 Prochaines étapes

### 1. Déployer le backend (OBLIGATOIRE)

Le frontend a besoin du backend pour fonctionner. Vous devez déployer le backend sur un service comme Railway ou Render.

#### Option A : Railway (Recommandé - Plus simple)

1. **Allez sur Railway** : https://railway.app
2. **Créez un compte** (gratuit avec GitHub)
3. **Cliquez sur "New Project"**
4. **Sélectionnez "Deploy from GitHub repo"**
5. **Choisissez votre repository** : `AlecP6/compta_lmb`
6. **Configurez le service** :
   - **Root Directory** : `backend`
   - Railway détectera automatiquement que c'est un projet Node.js
7. **Ajoutez une base de données PostgreSQL** :
   - Cliquez sur "+ New" dans votre projet
   - Sélectionnez "Database" > "PostgreSQL"
   - Railway créera automatiquement une base de données
8. **Ajoutez les variables d'environnement** :
   - Cliquez sur votre service backend
   - Allez dans "Variables"
   - Ajoutez :
     ```
     DATABASE_URL = (Railway l'ajoute automatiquement depuis la base de données)
     JWT_SECRET = votre-clé-secrète-aléatoire-ici
     PORT = 3000
     ```
   - Pour `JWT_SECRET`, générez une clé aléatoire (ex: `openssl rand -base64 32`)
9. **Modifiez le schéma Prisma pour PostgreSQL** :
   - Dans `backend/prisma/schema.prisma`, changez :
     ```prisma
     datasource db {
       provider = "postgresql"  // Au lieu de "sqlite"
       url      = env("DATABASE_URL")
     }
     ```
10. **Déployez** : Railway déploiera automatiquement
11. **Notez l'URL** : Railway vous donnera une URL comme `https://votre-app.railway.app`

#### Option B : Render

1. Allez sur https://render.com
2. Créez un compte
3. "New" > "Web Service"
4. Connectez votre repository GitHub
5. Configurez :
   - **Name** : `compta-lmb-backend`
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
6. Ajoutez les variables d'environnement
7. Créez une base de données PostgreSQL séparée

### 2. Mettre à jour la variable d'environnement Netlify

Une fois le backend déployé :

1. **Allez sur Netlify** : https://app.netlify.com
2. **Sélectionnez votre site**
3. **Site settings** > **Environment variables**
4. **Modifiez** `VITE_API_URL` avec l'URL réelle de votre backend :
   - Si Railway : `https://votre-app.railway.app/api`
   - Si Render : `https://votre-app.onrender.com/api`
5. **Redéployez** :
   - Allez dans "Deploys"
   - Cliquez sur "Trigger deploy" > "Clear cache and deploy site"

### 3. Modifier le schéma Prisma pour PostgreSQL

Si vous utilisez Railway ou Render (PostgreSQL), vous devez modifier le schéma :

1. **Ouvrez** `backend/prisma/schema.prisma`
2. **Changez** :
   ```prisma
   datasource db {
     provider = "postgresql"  // Au lieu de "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. **Poussez les changements** :
   ```powershell
   cd "C:\Users\pxksa\Documents\Compta LMB"
   git add backend/prisma/schema.prisma
   git commit -m "Switch to PostgreSQL for production"
   git push
   ```

### 4. Initialiser la base de données sur le backend

Une fois le backend déployé, vous devez exécuter les migrations :

1. **Sur Railway** : Allez dans votre service backend > "Deploy Logs"
2. **Sur Render** : Allez dans "Shell" ou utilisez "Run Command"
3. **Exécutez** :
   ```bash
   npm run prisma:generate
   npm run prisma:migrate deploy
   npm run setup:admin
   ```

### 5. Tester votre site

1. **Ouvrez votre site Netlify** (URL fournie par Netlify)
2. **Testez** :
   - Créez un compte
   - Connectez-vous
   - Ajoutez une transaction
   - Vérifiez que tout fonctionne

### 6. Vérifier les logs en cas de problème

**Netlify** :
- Allez dans "Deploys" > Cliquez sur un déploiement > "View build log"

**Railway/Render** :
- Allez dans "Logs" pour voir les erreurs du backend

## 🔧 Commandes utiles

### Mettre à jour le code sur GitHub
```powershell
cd "C:\Users\pxksa\Documents\Compta LMB"
git add .
git commit -m "Description des changements"
git push
```

### Voir les logs du backend (Railway)
- Allez dans votre service > "Deploy Logs"

## ⚠️ Problèmes courants

### Le site ne charge pas
- Vérifiez que `VITE_API_URL` est correctement configuré
- Vérifiez les logs de build Netlify

### Erreurs CORS
- Vérifiez que l'URL Netlify est dans la configuration CORS du backend
- Le code est déjà configuré pour autoriser les domaines Netlify

### Le backend ne répond pas
- Vérifiez que le backend est bien déployé
- Vérifiez les variables d'environnement du backend
- Vérifiez les logs du backend

## 📝 Checklist finale

- [ ] Backend déployé sur Railway/Render
- [ ] Base de données PostgreSQL créée
- [ ] Schéma Prisma modifié pour PostgreSQL
- [ ] Migrations exécutées
- [ ] Variable `VITE_API_URL` mise à jour sur Netlify
- [ ] Site redéployé sur Netlify
- [ ] Site testé et fonctionnel

## 🎉 Une fois tout configuré

Votre site sera accessible sur l'URL Netlify (ex: `https://votre-site.netlify.app`) et se mettra à jour automatiquement à chaque push sur GitHub !

