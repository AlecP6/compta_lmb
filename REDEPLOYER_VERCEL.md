# 🔄 Redéployer sur Vercel après les changements

## ✅ Vérifier que les changements sont sur GitHub

Les changements ont été poussés sur GitHub. Vérifiez :
1. **Allez sur** : https://github.com/AlecP6/compta_lmb
2. **Vérifiez** que le fichier `backend/api/index.ts` existe
3. **Vérifiez** que `backend/vercel.json` est à jour

## 🚀 Redéployer sur Vercel

### Méthode 1 : Via l'interface Vercel (Recommandé)

1. **Allez sur** : https://vercel.com
2. **Sélectionnez votre projet backend**
3. **Allez dans "Deployments"**
4. **Cliquez sur les "..."** (trois points) à droite du dernier déploiement
5. **Sélectionnez "Redeploy"**
6. **IMPORTANT** : Décochez **"Use existing Build Cache"** pour forcer un build complet
7. **Cliquez sur "Redeploy"**

### Méthode 2 : Forcer un nouveau déploiement via Git

Si Vercel ne détecte pas automatiquement les changements :

1. **Créez un commit vide** pour déclencher un nouveau déploiement :
   ```powershell
   cd "C:\Users\pxksa\Documents\Compta LMB"
   git commit --allow-empty -m "Trigger Vercel redeploy"
   git push
   ```

2. **Vercel détectera automatiquement** le nouveau commit et redéploiera

### Méthode 3 : Vérifier la configuration Vercel

1. **Allez dans** : Vercel > Votre projet > **"Settings"**
2. **Vérifiez "General"** :
   - **Root Directory** : `backend` ⚠️ (TRÈS IMPORTANT)
   - **Build Command** : `npm install && npm run build`
   - **Output Directory** : `dist` (ou laissez vide)
   - **Install Command** : `npm install`
3. **Vérifiez "Environment Variables"** :
   - `DATABASE_URL` existe
   - `JWT_SECRET` existe
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

## 🔍 Vérifier les logs après redéploiement

1. **Allez dans "Deployments"**
2. **Cliquez sur le dernier déploiement**
3. **Regardez les logs** :
   - ✅ "Build successful"
   - ✅ "Deployment ready"
   - ❌ Si erreur, copiez le message d'erreur

## 🐛 Si le redéploiement échoue

### Erreur : "Cannot find module"
- **Cause** : Le fichier `backend/api/index.ts` n'est pas trouvé
- **Solution** : Vérifiez que le fichier est bien sur GitHub

### Erreur : "Build failed"
- **Cause** : Erreur de compilation TypeScript
- **Solution** : Regardez les logs pour voir l'erreur exacte

### Erreur : "Function not found"
- **Cause** : Configuration `vercel.json` incorrecte
- **Solution** : Vérifiez que `vercel.json` pointe vers `api/index.ts`

## ✅ Test après redéploiement

Une fois redéployé, testez :
```
https://votre-backend.vercel.app/api/health
```

Vous devriez voir : `{"status":"OK","message":"API de comptabilité fonctionnelle"}`

## 📝 Checklist

- [ ] Changements poussés sur GitHub
- [ ] Fichier `backend/api/index.ts` existe sur GitHub
- [ ] `backend/vercel.json` est à jour
- [ ] Redéploiement déclenché sur Vercel
- [ ] Build réussi (vérifier les logs)
- [ ] Test de `/api/health` fonctionne

