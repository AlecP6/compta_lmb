# Guide de déploiement Git et Netlify

## 📦 Préparer le dépôt Git

Le dépôt Git a été initialisé et le premier commit a été créé.

## 🚀 Pousser sur GitHub

### 1. Créer un nouveau repository sur GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton "+" en haut à droite
3. Sélectionnez "New repository"
4. Nommez votre repository (ex: `compta-lmb`)
5. **Ne cochez PAS** "Initialize with README" (le projet existe déjà)
6. Cliquez sur "Create repository"

### 2. Connecter votre dépôt local à GitHub

GitHub vous donnera des commandes. Utilisez celles-ci (remplacez `VOTRE_USERNAME` et `VOTRE_REPO`) :

```powershell
cd "C:\Users\pxksa\Documents\Compta LMB"
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

### 3. Alternative : Via SSH (si vous avez configuré une clé SSH)

```powershell
git remote add origin git@github.com:VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

## 🔄 Commandes Git utiles

### Voir l'état du dépôt
```powershell
git status
```

### Ajouter des fichiers modifiés
```powershell
git add .
```

### Créer un commit
```powershell
git commit -m "Description de vos modifications"
```

### Pousser vers GitHub
```powershell
git push
```

### Récupérer les dernières modifications
```powershell
git pull
```

## 🌐 Déployer sur Netlify depuis GitHub

Une fois votre code sur GitHub :

1. **Allez sur Netlify** : https://app.netlify.com
2. **Cliquez sur "Add new site"** > **"Import an existing project"**
3. **Choisissez GitHub** et autorisez Netlify
4. **Sélectionnez votre repository** `compta-lmb`
5. **Configurez le build** :
   - **Build command** : `cd frontend && npm install && npm run build`
   - **Publish directory** : `frontend/dist`
6. **Ajoutez la variable d'environnement** :
   - `VITE_API_URL` = `https://votre-backend-url.com/api`
7. **Cliquez sur "Deploy site"**

Netlify redéploiera automatiquement à chaque push sur la branche principale !

## 📝 Notes importantes

- **Ne commitez JAMAIS** les fichiers `.env` (ils sont dans `.gitignore`)
- **Ne commitez JAMAIS** les `node_modules` (ils sont dans `.gitignore`)
- Le fichier `.gitignore` est déjà configuré pour exclure les fichiers sensibles

## 🐛 Dépannage

### Erreur "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
```

### Erreur d'authentification
- Utilisez un Personal Access Token au lieu de votre mot de passe
- Créez-en un sur : https://github.com/settings/tokens

### Voir les remotes configurés
```powershell
git remote -v
```

