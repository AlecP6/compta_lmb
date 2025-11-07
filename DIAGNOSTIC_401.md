# 🔍 Diagnostic de l'Erreur 401

## ❓ Pourquoi une erreur 401 ?

Une erreur **401 (Non autorisé)** sur **toutes** les routes, y compris `/api/health` qui ne nécessite pas d'authentification, indique un problème de **configuration** plutôt qu'un problème d'authentification.

## 🔍 Étapes du Diagnostic

### Étape 1 : Accéder aux Logs Vercel

1. **Allez sur** : https://vercel.com
2. **Connectez-vous** à votre compte
3. **Sélectionnez votre projet** : `compta-psbedbhfp-alecp6s-projects` (ou le nom de votre projet)
4. **Dans le menu de gauche**, cliquez sur **"Functions"**
5. **Cliquez sur** : `api/index.ts`
6. **Allez dans l'onglet** : **"Logs"**

### Étape 2 : Déclencher une Requête pour Voir les Logs

Pour voir les logs en temps réel, faites une requête :

**Dans PowerShell** :
```powershell
Invoke-WebRequest -Uri "https://compta-psbedbhfp-alecp6s-projects.vercel.app/api/health" -Method Get
```

**Puis regardez immédiatement** les logs dans Vercel (ils apparaissent en temps réel).

### Étape 3 : Analyser les Logs

#### ✅ Si tout fonctionne, vous devriez voir :

```
🔄 Synchronisation du schéma Prisma avec la base de données...
✅ Schéma synchronisé
✅ Compte admin créé avec succès !
✅ Initialisation terminée
```

#### ❌ Si il y a un problème, vous verrez :

**Erreurs Prisma** :
```
❌ Erreur lors de l'initialisation: PrismaClientInitializationError
Invalid `prisma.user.findUnique()` invocation
```

**Erreurs de connexion base de données** :
```
❌ Erreur: Can't reach database server
P1001: Can't reach database server
```

**Erreurs de variables d'environnement** :
```
❌ Error: Environment variable not found: DATABASE_URL
```

**Erreurs de routing** :
```
❌ 404: Route not found
❌ Cannot GET /api/health
```

### Étape 4 : Vérifier la Configuration

#### A. Vérifier Root Directory

1. **Allez dans** : Settings > General
2. **Vérifiez** : Root Directory = `backend`
3. **Si ce n'est pas le cas**, changez-le et redéployez

#### B. Vérifier les Variables d'Environnement

1. **Allez dans** : Settings > Environment Variables
2. **Vérifiez** que toutes ces variables existent :
   - ✅ `DATABASE_URL`
   - ✅ `JWT_SECRET`
   - ✅ `NODE_ENV` = `production`
3. **Vérifiez** qu'elles sont définies pour **Production**, **Preview**, et **Development**

#### C. Vérifier la Structure des Fichiers

Vérifiez que ces fichiers existent dans votre repository GitHub :

- ✅ `backend/api/index.ts`
- ✅ `backend/vercel.json`
- ✅ `backend/package.json`
- ✅ `backend/prisma/schema.prisma`

### Étape 5 : Tester Différentes Routes

Testez ces routes pour voir lesquelles fonctionnent :

```powershell
# Test 1 : Health (devrait fonctionner)
Invoke-WebRequest -Uri "https://compta-psbedbhfp-alecp6s-projects.vercel.app/api/health" -Method Get

# Test 2 : Root (devrait rediriger)
Invoke-WebRequest -Uri "https://compta-psbedbhfp-alecp6s-projects.vercel.app/" -Method Get

# Test 3 : Auth register (devrait fonctionner)
$body = @{ username = "test"; password = "test123"; name = "Test" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://compta-psbedbhfp-alecp6s-projects.vercel.app/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

## 🎯 Causes Possibles de l'Erreur 401

### 1. Problème avec l'Export Express

**Symptôme** : Erreur 401 sur toutes les routes

**Cause** : L'app Express n'est pas correctement exportée pour Vercel

**Solution** : Vérifier que `backend/api/index.ts` exporte correctement l'app

### 2. Problème avec les Routes

**Symptôme** : Erreur 401 ou 404 sur certaines routes

**Cause** : Les routes ne sont pas correctement configurées dans `vercel.json`

**Solution** : Vérifier la configuration `vercel.json`

### 3. Problème avec les Variables d'Environnement

**Symptôme** : Erreur 401 ou 500, logs montrent des erreurs de variables

**Cause** : Variables d'environnement manquantes ou incorrectes

**Solution** : Vérifier et corriger les variables dans Vercel

### 4. Problème avec la Base de Données

**Symptôme** : Erreur 401 ou 500, logs montrent des erreurs Prisma

**Cause** : Connexion à la base de données échoue

**Solution** : Vérifier `DATABASE_URL` et la connexion Neon

## 📝 Informations à Me Donner

Pour que je puisse vous aider, donnez-moi :

1. **Les logs complets** de Vercel (Functions > Logs)
   - Copiez-collez tout ce que vous voyez
   - Y compris les erreurs

2. **Le résultat des tests** :
   - `/api/health` : quel code de statut ?
   - `/api/auth/register` : quel code de statut ?
   - Y a-t-il un message d'erreur ?

3. **La configuration Vercel** :
   - Root Directory : `backend` ?
   - Variables d'environnement : toutes présentes ?

4. **Les erreurs dans la console** :
   - Y a-t-il des erreurs lors du build ?
   - Y a-t-il des erreurs lors du déploiement ?

## 🔧 Actions Immédiates

1. **Allez dans Vercel** > Functions > `api/index.ts` > Logs
2. **Faites une requête** à `/api/health`
3. **Copiez les logs** qui apparaissent
4. **Donnez-moi** ces informations

Je pourrai alors identifier précisément le problème et vous donner la solution exacte !

