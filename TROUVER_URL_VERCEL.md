# 🔍 Trouver l'URL de votre Backend Vercel

## ⚠️ Erreur 404 : DEPLOYMENT_NOT_FOUND

Cette erreur signifie que :
1. L'URL que vous utilisez est incorrecte
2. Le déploiement n'est pas terminé
3. La configuration Vercel n'est pas correcte

## ✅ Solution : Trouver la bonne URL

### 1. Trouver l'URL dans Vercel

1. **Allez sur** : https://vercel.com
2. **Sélectionnez votre projet backend**
3. **Allez dans "Deployments"**
4. **Cliquez sur le dernier déploiement** (celui avec ✅ "Ready")
5. **Regardez l'URL** en haut de la page :
   - Elle ressemble à : `https://votre-projet-xxxxx.vercel.app`
   - **COPIEZ cette URL**

### 2. Tester l'endpoint de santé

Une fois que vous avez l'URL, testez :

```
https://votre-projet-xxxxx.vercel.app/api/health
```

Vous devriez voir :
```json
{
  "status": "OK",
  "message": "API de comptabilité fonctionnelle"
}
```

### 3. Si vous obtenez toujours 404

Vérifiez la configuration Vercel :

1. **Allez dans** : Vercel > Votre projet > **"Settings"** > **"General"**
2. **Vérifiez** :
   - ✅ **Root Directory** : `backend` ⚠️ (TRÈS IMPORTANT)
   - ✅ **Build Command** : `npm install && npm run vercel-build`
   - ✅ **Output Directory** : (laissez vide)
   - ✅ **Install Command** : `npm install`

3. **Si Root Directory n'est pas `backend`** :
   - Cliquez sur "Edit"
   - Changez **Root Directory** en `backend`
   - Cliquez sur "Save"
   - Redéployez

### 4. Vérifier les routes dans vercel.json

Le fichier `backend/vercel.json` doit contenir :

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
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

## 🔄 Redéployer si nécessaire

Si la configuration n'est pas correcte :

1. **Corrigez** la configuration dans Vercel
2. **Allez dans "Deployments"**
3. **Cliquez sur "Redeploy"**
4. **Décochez "Use existing Build Cache"**
5. **Cliquez sur "Redeploy"**

## 📝 URLs à tester

Une fois que vous avez la bonne URL, testez :

- ✅ `/api/health` → Devrait retourner `{"status": "OK", ...}`
- ✅ `/api/auth/register` → Devrait accepter POST avec username
- ✅ `/api/auth/login` → Devrait accepter POST avec username/password

## 🐛 Si ça ne fonctionne toujours pas

Donnez-moi :
1. **L'URL exacte** que vous utilisez
2. **Le message d'erreur complet**
3. **Une capture d'écran** de la page "Settings" > "General" dans Vercel

Je pourrai identifier précisément le problème !

