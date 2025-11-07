# 🔧 Correction : Erreur "tsc: command not found"

## ❌ Problème

Vercel essaie d'exécuter `npm run build` qui utilise `tsc`, mais TypeScript n'est pas disponible dans l'environnement de build.

**Erreur** :
```
sh: line 1: tsc: command not found
Error: Command "npm install && npm run build" exited with 127
```

## 🔍 Cause

Pour les serverless functions Vercel, on n'a **pas besoin** de compiler TypeScript manuellement car Vercel le fait automatiquement. Le script `build` dans `package.json` utilisait `tsc`, ce qui n'est pas nécessaire.

## ✅ Solution Appliquée

### 1. Simplification du script `build`

**Avant** :
```json
{
  "scripts": {
    "build": "tsc && prisma generate"
  }
}
```

**Après** :
```json
{
  "scripts": {
    "build": "prisma generate"
  }
}
```

**Pourquoi** :
- ✅ Vercel compile automatiquement TypeScript pour les serverless functions
- ✅ Pas besoin de `tsc` dans le build
- ✅ `prisma generate` est déjà exécuté via `postinstall`
- ✅ Le script `build` est simplifié

### 2. Configuration `vercel.json`

J'ai ajouté `"buildCommand": "npm install"` pour s'assurer que Vercel installe seulement les dépendances :

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "rewrites": [...]
}
```

**Pourquoi** :
- ✅ Installe les dépendances
- ✅ `postinstall` génère automatiquement Prisma Client
- ✅ Vercel compile automatiquement TypeScript
- ✅ Pas besoin de `tsc`

## 🚀 Comment ça Fonctionne Maintenant

1. **Vercel exécute** : `npm install`
2. **`postinstall`** génère Prisma Client automatiquement
3. **Vercel détecte** `api/index.ts` comme fonction serverless
4. **Vercel compile** automatiquement TypeScript
5. **Rewrites** routent toutes les requêtes vers `/api/index.ts`

## 📝 Note

Pour les serverless functions Vercel :
- **TypeScript** : Compilé automatiquement par Vercel (pas besoin de `tsc`)
- **Prisma Client** : Généré via `postinstall` après `npm install`
- **Build Command** : Juste `npm install` (ou peut être vide)
- **Pas besoin de `tsc`** : Vercel gère la compilation TypeScript

## ✅ Résultat Attendu

Après le redéploiement :
- ✅ Build réussi (pas d'erreur "tsc: command not found")
- ✅ Prisma Client généré via `postinstall`
- ✅ TypeScript compilé automatiquement par Vercel
- ✅ Déploiement réussi
- ✅ API fonctionnelle

## 🔍 Vérification

Après le redéploiement, vérifiez :
- ✅ Build réussi
- ✅ Déploiement réussi
- ✅ Test `/api/health` fonctionne

Le problème devrait être résolu maintenant ! 🚀

