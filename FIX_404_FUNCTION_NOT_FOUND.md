# 🔧 Correction : Erreur 404 Function Invocation Not Found

## ❌ Problème

Vercel retourne une erreur 404 "Function Invocation Not Found" pour `/api/index` :
- **Requête** : `POST /api/register`
- **Route tentée** : `/api/index`
- **Erreur** : `Function Invocation: Not Found 404`
- **Logs** : "No logs found for this request"

## 🔍 Cause

Vercel ne détecte pas automatiquement `api/index.ts` comme fonction serverless, même si le fichier existe et est correctement exporté.

## ✅ Solution Appliquée

**IMPORTANT** : La configuration `functions` avec `runtime` a causé une erreur. Vercel détecte automatiquement les fonctions dans `api/`.

Configuration finale dans `vercel.json` :

```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.ts"
    }
  ]
}
```

**Pourquoi** :
- ✅ Vercel détecte automatiquement les fichiers dans `api/` comme fonctions serverless
- ✅ Vercel utilise automatiquement le runtime Node.js 20.x (spécifié dans `package.json` via `engines`)
- ✅ Vercel compile automatiquement le TypeScript
- ✅ Les rewrites routeront toutes les requêtes vers cette fonction
- ✅ Pas besoin de configuration `functions` explicite

## 📝 Vérifications Nécessaires

### 1. Structure du Projet

Assurez-vous que la structure est correcte :
```
backend/
├── api/
│   └── index.ts          ✅ Fonction serverless
├── src/
│   ├── routes/           ✅ Nécessaire (importé par api/index.ts)
│   ├── scripts/          ✅ Nécessaire (importé par api/index.ts)
│   └── middleware/       ✅ Nécessaire (importé par les routes)
├── prisma/
│   └── schema.prisma     ✅ Nécessaire pour Prisma
├── package.json
└── vercel.json           ✅ Configuration Vercel
```

### 2. Configuration Vercel (Interface)

Dans Vercel Dashboard > Settings > General :

- **Root Directory** : `backend` ⚠️ (TRÈS IMPORTANT)
- **Build Command** : `npm install && npm run build` (ou laisser vide pour utiliser vercel.json)
- **Output Directory** : (laisser vide - pas nécessaire pour serverless functions)
- **Framework Preset** : `Other` (ou laisser vide)

### 3. Export dans `api/index.ts`

Le fichier doit exporter l'application Express par défaut :

```typescript
export default app;
```

✅ C'est correct dans votre code.

### 4. Fichiers Nécessaires

Vérifiez que `.vercelignore` n'ignore pas les fichiers nécessaires :

```
dist/
*.db
*.log
src/server.ts
```

✅ Les fichiers `src/routes/`, `src/scripts/`, `src/middleware/` ne sont PAS ignorés.

## 🚀 Résultat Attendu

Après le redéploiement :
- ✅ Vercel détecte `api/index.ts` comme fonction serverless
- ✅ Plus d'erreur 404 "Function Invocation Not Found"
- ✅ Les requêtes `/api/register`, `/api/login`, etc. fonctionnent
- ✅ Les logs apparaissent dans Vercel

## 🔧 Test Après Redéploiement

```powershell
# Test de santé
Invoke-RestMethod -Uri "https://compta-lmb.vercel.app/api/health" -Method Get

# Test d'inscription
$body = @{
    username = "testuser"
    password = "testpass123"
    name = "Test User"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://compta-lmb.vercel.app/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

## 📝 Notes

- Le runtime `@vercel/node` est automatiquement fourni par Vercel, pas besoin de l'ajouter aux dépendances
- La configuration `functions` est nécessaire pour que Vercel détecte explicitement la fonction
- Les rewrites permettent de router toutes les requêtes vers la fonction unique

