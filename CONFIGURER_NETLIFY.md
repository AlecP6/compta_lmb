# Guide : Configurer les variables d'environnement sur Netlify

## 📍 Où ajouter VITE_API_URL dans Netlify

### Méthode 1 : Pendant le déploiement initial

1. **Après avoir sélectionné votre repository** sur Netlify
2. **Avant de cliquer sur "Deploy site"**, vous verrez une section **"Advanced"** ou **"Show advanced"**
3. Cliquez sur **"New variable"** ou **"Add variable"**
4. Ajoutez :
   - **Key** : `VITE_API_URL`
   - **Value** : `https://votre-backend-url.com/api`
5. Cliquez sur **"Deploy site"**

### Méthode 2 : Après le déploiement (Recommandé)

Si vous avez déjà déployé le site :

1. **Allez sur votre dashboard Netlify** : https://app.netlify.com
2. **Cliquez sur votre site** (celui que vous venez de déployer)
3. Dans le menu de gauche, cliquez sur **"Site settings"** (ou "Paramètres du site")
4. Dans le menu de gauche, cliquez sur **"Environment variables"** (ou "Variables d'environnement")
5. Cliquez sur **"Add a variable"** ou **"Add variable"**
6. Remplissez :
   - **Key** : `VITE_API_URL`
   - **Value** : `https://votre-backend-url.com/api`
7. Cliquez sur **"Save"**
8. **Important** : Vous devez **redéployer** le site pour que la variable soit prise en compte :
   - Allez dans **"Deploys"** (ou "Déploiements")
   - Cliquez sur **"Trigger deploy"** > **"Clear cache and deploy site"**

## 🔍 Capture d'écran des étapes

### Étape 1 : Accéder aux paramètres
```
Dashboard Netlify → Votre site → Site settings → Environment variables
```

### Étape 2 : Ajouter la variable
```
+ Add a variable
Key: VITE_API_URL
Value: https://votre-backend-url.com/api
[Save]
```

### Étape 3 : Redéployer
```
Deploys → Trigger deploy → Clear cache and deploy site
```

## ⚠️ Important

- **Remplacez** `https://votre-backend-url.com/api` par l'URL réelle de votre backend
- Si votre backend est sur Railway, l'URL ressemble à : `https://votre-app.railway.app/api`
- Si votre backend est sur Render, l'URL ressemble à : `https://votre-app.onrender.com/api`
- N'oubliez pas le `/api` à la fin !

## 🎯 Exemple concret

Si votre backend est déployé sur Railway avec l'URL `https://compta-lmb-backend.railway.app`, alors :

**Key** : `VITE_API_URL`  
**Value** : `https://compta-lmb-backend.railway.app/api`

## ✅ Vérifier que ça fonctionne

Après avoir ajouté la variable et redéployé :
1. Ouvrez votre site Netlify
2. Ouvrez la console du navigateur (F12)
3. Essayez de vous connecter
4. Vérifiez dans l'onglet "Network" que les requêtes vont bien vers votre backend

## 🐛 Si ça ne fonctionne pas

1. Vérifiez que la variable est bien nommée `VITE_API_URL` (avec `VITE_` au début, c'est obligatoire pour Vite)
2. Vérifiez que vous avez bien redéployé après avoir ajouté la variable
3. Vérifiez que l'URL du backend est correcte et accessible
4. Vérifiez que le backend autorise les requêtes depuis votre domaine Netlify (CORS)

