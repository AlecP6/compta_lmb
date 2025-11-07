# 🔧 Configurer DATABASE_URL sur Vercel

## ✅ URL de votre base de données Neon

Votre URL de connexion est :
```
postgresql://neondb_owner:npg_p1kCytel3wrR@ep-morning-shadow-ahf453zo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🚀 Configuration sur Vercel

### 1. Ajouter la variable d'environnement

1. **Allez sur Vercel** : https://vercel.com
2. **Sélectionnez votre projet backend**
3. **Allez dans** : Settings > Environment Variables
4. **Cherchez ou créez** `DATABASE_URL`
5. **Collez l'URL complète** :
   ```
   postgresql://neondb_owner:npg_p1kCytel3wrR@ep-morning-shadow-ahf453zo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
6. **Sélectionnez les environnements** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
7. **Cliquez sur "Save"**

### 2. Vérifier les autres variables

Assurez-vous d'avoir aussi :
- `JWT_SECRET` = (votre clé secrète)
- `NODE_ENV` = `production`
- `PORT` = `3000` (optionnel)

### 3. Redéployer

1. **Allez dans "Deployments"**
2. **Cliquez sur "Redeploy"** sur le dernier déploiement
3. **Décochez "Use existing Build Cache"**
4. **Cliquez sur "Redeploy"**

## ✅ Test de connexion

Après le redéploiement, testez :
```
https://votre-backend.vercel.app/api/health
```

Vous devriez voir : `{"status":"OK","message":"API de comptabilité fonctionnelle"}`

## 🔍 Vérifier les logs

Dans Vercel > Deployments > Dernier déploiement > Function Logs, vous devriez voir :
- ✅ "🔄 Exécution des migrations Prisma..."
- ✅ "✅ Migrations terminées"
- ✅ "✅ Initialisation terminée"

Si vous voyez une erreur de connexion, vérifiez que l'URL est bien copiée complètement.

## ⚠️ Important

- **Ne partagez JAMAIS** cette URL publiquement (elle contient votre mot de passe)
- **Utilisez-la uniquement** dans les variables d'environnement Vercel
- **L'URL est sensible** aux espaces et caractères spéciaux

