# 🚀 Déploiement Complet sur Vercel (Backend + Frontend)

Guide étape par étape pour déployer votre application sur Vercel.

## 📋 Prérequis

- ✅ Compte GitHub (déjà fait - votre code est sur `AlecP6/compta_lmb`)
- ⬜ Compte Vercel (gratuit)
- ⬜ Base de données Neon (en cours de création)

## 🗄️ ÉTAPE 1 : Finaliser la base de données Neon

### Option A : Via le terminal (si vous avez créé le projet)

1. **Dans votre terminal**, après avoir créé le projet, exécutez :
   ```powershell
   npx neonctl@latest connection-string
   ```
2. **COPIEZ l'URL** qui s'affiche (ressemble à : `postgresql://...`)

### Option B : Via l'interface web (Plus simple)

1. **Allez sur** : https://console.neon.tech
2. **Cliquez sur votre projet** (ou créez-en un si nécessaire)
3. **L'URL de connexion** est affichée directement dans le dashboard
4. **COPIEZ cette URL**

## 🚀 ÉTAPE 2 : Déployer le backend sur Vercel

1. **Allez sur** : https://vercel.com
2. **Créez un compte** (gratuit, avec GitHub)
3. **Autorisez** Vercel à accéder à vos repositories GitHub
4. **Cliquez sur "Add New..."** > **"Project"**
5. **Importez votre repository** : `AlecP6/compta_lmb`
6. **Configurez le projet** :
   
   **IMPORTANT** : Avant de cliquer sur "Deploy", cliquez sur **"Configure Project"** ou **"Edit"** :
   
   - **Framework Preset** : `Other` (ou laissez Vercel détecter)
   - **Root Directory** : **`backend`** ⚠️ (TRÈS IMPORTANT)
   - **Build Command** : `npm install && npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`
   
7. **Variables d'environnement** :
   - Cliquez sur **"Environment Variables"**
   - Ajoutez ces 4 variables :
     
     **Variable 1** :
     - Key : `DATABASE_URL`
     - Value : (Collez l'URL Neon que vous avez copiée)
     - Environments : ✅ Production, ✅ Preview, ✅ Development
     
     **Variable 2** :
     - Key : `JWT_SECRET`
     - Value : (Générez avec PowerShell - voir ci-dessous)
     - Environments : ✅ Production, ✅ Preview, ✅ Development
     
     **Variable 3** :
     - Key : `NODE_ENV`
     - Value : `production`
     - Environments : ✅ Production
     
     **Variable 4** :
     - Key : `PORT`
     - Value : `3000`
     - Environments : ✅ Production, ✅ Preview, ✅ Development

8. **Cliquez sur "Deploy"**
9. **ATTENDEZ** le déploiement (5-10 minutes)
10. **Une fois déployé**, Vercel vous donnera une URL comme : `https://compta-lmb-backend.vercel.app`
11. **NOTEZ CETTE URL** - vous en aurez besoin pour Netlify

## 🔑 Générer JWT_SECRET

Ouvrez PowerShell et exécutez :

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

Copiez le résultat et utilisez-le comme valeur de `JWT_SECRET`.

## 🌐 ÉTAPE 3 : Mettre à jour Netlify

1. **Allez sur** : https://app.netlify.com
2. **Cliquez sur votre site**
3. **Menu de gauche** : **"Site settings"**
4. **Menu de gauche** : **"Environment variables"**
5. **Cherchez ou créez** `VITE_API_URL`
6. **Modifiez la valeur** avec l'URL Vercel :
   ```
   https://compta-lmb-backend.vercel.app/api
   ```
   (Remplacez par votre URL Vercel réelle)
7. **Cliquez sur "Save"**
8. **Redéployez** :
   - Menu de gauche : **"Deploys"**
   - Cliquez sur **"Trigger deploy"** (en haut à droite)
   - Sélectionnez **"Clear cache and deploy site"**

## ✅ ÉTAPE 4 : Vérifier que tout fonctionne

1. **Ouvrez votre site Netlify** (l'URL que Netlify vous a donnée)
2. **Ouvrez la console du navigateur** (F12)
3. **Testez** :
   - Créez un compte
   - Connectez-vous
   - Ajoutez une transaction
4. **Vérifiez** qu'il n'y a pas d'erreurs dans la console

## 🎯 Option Bonus : Déployer aussi le frontend sur Vercel

Si vous voulez tout sur Vercel (au lieu de Netlify) :

1. **Dans Vercel**, créez un **NOUVEAU projet**
2. **Importez** le même repository : `AlecP6/compta_lmb`
3. **Configurez** :
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. **Variables d'environnement** :
   - `VITE_API_URL` = `https://compta-lmb-backend.vercel.app/api`
5. **Déployez**

## 🐛 Dépannage

### Le backend ne démarre pas sur Vercel
- **Vérifiez les logs** : Dans Vercel, allez dans votre projet > "Deployments" > Cliquez sur un déploiement > "View Function Logs"
- **Vérifiez** que `Root Directory` est bien `backend`
- **Vérifiez** que toutes les variables d'environnement sont correctes

### Erreur de base de données
- **Vérifiez** que `DATABASE_URL` est correcte (URL Neon complète)
- **Vérifiez** que la base de données Neon est active

### Le frontend ne peut pas contacter le backend
- **Vérifiez** que `VITE_API_URL` sur Netlify est correcte
- **Vérifiez** que vous avez redéployé Netlify après avoir modifié la variable
- **Vérifiez** que l'URL Vercel est accessible (testez dans le navigateur)

## 📝 Checklist finale

- [ ] Base de données Neon créée
- [ ] URL Neon copiée
- [ ] Backend déployé sur Vercel
- [ ] Variables d'environnement Vercel configurées
- [ ] URL Vercel notée
- [ ] Variable `VITE_API_URL` mise à jour sur Netlify
- [ ] Site Netlify redéployé
- [ ] Site testé et fonctionnel

## 🎉 C'est tout !

Votre application est maintenant en ligne :
- **Frontend** : Sur Netlify (ou Vercel si vous avez choisi cette option)
- **Backend** : Sur Vercel
- **Base de données** : Sur Neon

Tout est gratuit et se mettra à jour automatiquement à chaque push sur GitHub !

