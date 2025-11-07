# 🐛 Déboguer l'erreur d'inscription

## 🔍 Vérifications à faire

### 1. Vérifier l'URL de l'API

**Dans la console du navigateur (F12)** :
1. Allez sur la page d'inscription
2. Ouvrez l'onglet **"Network"** (Réseau)
3. Essayez de vous inscrire
4. **Regardez la requête** qui est envoyée :
   - **URL** : Est-ce que c'est la bonne URL ?
   - **Status** : Quel code de statut (200, 400, 500, etc.) ?
   - **Response** : Cliquez sur la requête et regardez la réponse

### 2. Vérifier les variables d'environnement

**Sur Netlify** :
1. Allez dans **"Site settings"** > **"Environment variables"**
2. **Vérifiez** que `VITE_API_URL` existe et est correcte
3. **Format attendu** : `https://votre-backend.vercel.app/api` (sans `/auth` à la fin)

### 3. Vérifier que le backend fonctionne

**Testez l'URL du backend directement** :
1. Ouvrez votre navigateur
2. Allez sur : `https://votre-backend.vercel.app/api/health`
3. **Vous devriez voir** : `{"status":"OK","message":"API de comptabilité fonctionnelle"}`
4. Si vous voyez une erreur, le backend ne fonctionne pas

### 4. Vérifier les logs Vercel

**Sur Vercel** :
1. Allez dans votre projet backend
2. Cliquez sur **"Deployments"**
3. Cliquez sur le dernier déploiement
4. Regardez les **"Function Logs"**
5. **Cherchez** les erreurs liées à :
   - Base de données
   - Migrations Prisma
   - Variables d'environnement

### 5. Vérifier la base de données

**Sur Neon** :
1. Allez sur https://console.neon.tech
2. Vérifiez que votre projet est actif
3. Vérifiez que l'URL de connexion est correcte

## 🔧 Erreurs courantes et solutions

### Erreur : "Network Error" ou "Failed to fetch"
**Cause** : Le frontend ne peut pas contacter le backend
**Solution** :
- Vérifiez que `VITE_API_URL` est correcte sur Netlify
- Vérifiez que le backend est bien déployé sur Vercel
- Vérifiez que l'URL du backend est accessible

### Erreur : "Configuration serveur invalide"
**Cause** : `JWT_SECRET` n'est pas défini sur Vercel
**Solution** :
- Allez sur Vercel > Votre projet > Settings > Environment Variables
- Vérifiez que `JWT_SECRET` existe
- Si elle n'existe pas, ajoutez-la et redéployez

### Erreur : "Cannot connect to database"
**Cause** : `DATABASE_URL` est incorrecte ou la base de données n'est pas accessible
**Solution** :
- Vérifiez que `DATABASE_URL` est correcte sur Vercel
- Vérifiez que la base de données Neon est active
- Vérifiez que l'URL Neon est complète (avec le mot de passe)

### Erreur : "Prisma Client not generated"
**Cause** : Prisma n'a pas été généré
**Solution** :
- Vérifiez que `postinstall` est dans `package.json` (c'est déjà fait)
- Vérifiez les logs Vercel pour voir si Prisma génère correctement

### Erreur de validation (400)
**Cause** : Les données ne respectent pas les règles
**Solution** :
- Vérifiez que l'identifiant fait au moins 3 caractères
- Vérifiez que l'identifiant ne contient que des lettres, chiffres et underscores
- Vérifiez que le mot de passe fait au moins 6 caractères
- Vérifiez que le nom n'est pas vide

## 📝 Informations à me donner

Pour que je puisse vous aider, donnez-moi :

1. **Le message d'erreur exact** (copiez-collez)
2. **Le code de statut HTTP** (visible dans la console réseau)
3. **La réponse du serveur** (visible dans la console réseau)
4. **Les logs Vercel** (si vous y avez accès)
5. **L'URL de votre backend Vercel**

Avec ces informations, je pourrai identifier précisément le problème !

