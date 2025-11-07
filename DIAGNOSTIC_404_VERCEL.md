# 🔍 Diagnostic : Erreurs 404 sur Vercel

## ❌ Problème

Les requêtes vers `/api/register` et `/api/login` retournent 404 "Function Invocation Not Found".

## 🔍 Causes Possibles

### 1. Root Directory Non Configuré sur Vercel ⚠️ (LE PLUS PROBABLE)

Si le Root Directory n'est pas configuré, Vercel cherche `api/index.ts` à la racine du repo, pas dans `backend/`.

**Solution** :
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet backend
3. **Settings** > **General**
4. **Root Directory** : Mettre `backend`
5. **Sauvegarder**
6. **Redéployer**

### 2. Le Fichier n'est Pas au Bon Endroit

Vérifier que la structure est :
```
backend/
├── api/
│   └── index.ts    ← Doit être ici
├── package.json
└── vercel.json
```

### 3. Build Échoue Silencieusement

Vérifier les logs de build sur Vercel pour voir s'il y a des erreurs.

## ✅ Vérifications à Faire

### 1. Vérifier la Configuration Vercel

Dans Vercel Dashboard > Settings > General :

- ✅ **Root Directory** : `backend` (TRÈS IMPORTANT)
- ✅ **Build Command** : (peut être vide, utilise postinstall)
- ✅ **Output Directory** : (vide)
- ✅ **Framework Preset** : `Other` ou vide

### 2. Vérifier que le Fichier Existe

```bash
# Sur votre machine
ls backend/api/index.ts
```

Doit retourner le fichier.

### 3. Vérifier les Logs de Build

Sur Vercel, aller dans **Deployments** > Cliquer sur le dernier déploiement > **Build Logs**

Chercher :
- ✅ "Installing dependencies"
- ✅ "Running postinstall"
- ✅ "Generating Prisma Client"
- ❌ Erreurs de build

### 4. Tester la Route de Santé

Après le déploiement, tester :

```powershell
Invoke-RestMethod -Uri "https://compta-lmb.vercel.app/api/health" -Method Get
```

Si ça fonctionne, la fonction serverless est détectée.

## 🔧 Solution Immédiate

### Option 1 : Vérifier Root Directory (RECOMMANDÉ)

1. Vercel Dashboard > Projet > Settings > General
2. Vérifier que **Root Directory** = `backend`
3. Si vide ou incorrect, mettre `backend`
4. Sauvegarder et redéployer

### Option 2 : Vérifier les Variables d'Environnement

Vercel Dashboard > Settings > Environment Variables :

- ✅ `DATABASE_URL` doit être défini
- ✅ `JWT_SECRET` doit être défini (optionnel mais recommandé)

### Option 3 : Forcer un Redéploiement

1. Vercel Dashboard > Deployments
2. Cliquer sur les 3 points du dernier déploiement
3. **Redeploy**
4. Attendre la fin du build

## 📝 Routes Disponibles

Maintenant le backend supporte les deux formats :

- ✅ `POST /api/auth/register` (format standard)
- ✅ `POST /api/register` (format alternatif)
- ✅ `POST /api/auth/login` (format standard)
- ✅ `POST /api/login` (format alternatif)
- ✅ `GET /api/health` (test de santé)
- ✅ `GET /` (debug)

## 🚀 Après Correction

Une fois le Root Directory configuré :

1. Vercel va redéployer automatiquement
2. Les routes devraient fonctionner
3. Tester avec :

```powershell
# Test santé
Invoke-RestMethod -Uri "https://compta-lmb.vercel.app/api/health" -Method Get

# Test inscription
$body = @{ username = "test"; password = "test123"; name = "Test" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://compta-lmb.vercel.app/api/register" -Method Post -Body $body -ContentType "application/json"
```

## ⚠️ Si Ça Ne Fonctionne Toujours Pas

1. Vérifier les logs de runtime (pas juste les logs de build)
2. Vérifier que `DATABASE_URL` est correct
3. Vérifier que Prisma Client est généré (dans les logs de build)
4. Contacter le support Vercel avec les logs complets

