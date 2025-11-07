# 🔑 Vérification du JWT_SECRET

## ❓ Le JWT_SECRET peut-il causer une erreur 404 ?

**Non**, le JWT_SECRET ne cause **PAS** une erreur 404.

### Différence entre les erreurs :

- **404 NOT_FOUND** = La route n'est pas trouvée (problème de configuration Vercel/routing)
- **500 Internal Server Error** = Erreur serveur (peut être causé par JWT_SECRET manquant)
- **401 Unauthorized** = Problème d'authentification (token invalide)

## ✅ Vérifier le JWT_SECRET dans Vercel

### 1. Vérifier que JWT_SECRET existe

1. **Allez sur** : Vercel > Votre projet > **Settings** > **Environment Variables**
2. **Cherchez** `JWT_SECRET` dans la liste
3. **Vérifiez** qu'il est défini pour **Production**, **Preview**, et **Development**

### 2. Vérifier la valeur de JWT_SECRET

Le JWT_SECRET doit être :
- ✅ **Au moins 32 caractères** (recommandé)
- ✅ **Une chaîne aléatoire** (lettres, chiffres, caractères spéciaux)
- ✅ **Unique** (ne pas utiliser la même clé partout)

### 3. Générer un nouveau JWT_SECRET si nécessaire

Si vous n'avez pas de JWT_SECRET ou s'il est trop court, générez-en un :

**Dans PowerShell** :
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**Ou en ligne** : https://randomkeygen.com/

## 🔍 Comment JWT_SECRET est utilisé

Le JWT_SECRET est utilisé pour :
1. **Signer les tokens JWT** lors de l'inscription/connexion
2. **Vérifier les tokens JWT** lors des requêtes authentifiées

### Si JWT_SECRET est manquant :

Vous verrez ces erreurs (PAS une 404) :
- ❌ `"Configuration serveur invalide"` lors de l'inscription/connexion
- ❌ `500 Internal Server Error` dans les logs
- ❌ `"JWT_SECRET is not defined"` dans les logs

## ✅ Vérification Complète

### Checklist JWT_SECRET :

- [ ] JWT_SECRET existe dans Vercel > Settings > Environment Variables
- [ ] JWT_SECRET est défini pour Production, Preview, et Development
- [ ] JWT_SECRET fait au moins 32 caractères
- [ ] JWT_SECRET est une chaîne aléatoire (pas "secret" ou "test")

### Si JWT_SECRET manque ou est incorrect :

1. **Générez un nouveau JWT_SECRET** (voir ci-dessus)
2. **Allez dans** Vercel > Settings > Environment Variables
3. **Ajoutez ou modifiez** `JWT_SECRET` avec la nouvelle valeur
4. **Sélectionnez** Production, Preview, et Development
5. **Cliquez sur "Save"**
6. **Redéployez** le projet

## 🐛 Erreurs liées à JWT_SECRET

### Erreur : "Configuration serveur invalide"

**Cause** : JWT_SECRET est manquant ou non défini

**Solution** :
1. Vérifiez que JWT_SECRET existe dans Vercel
2. Vérifiez qu'il est défini pour tous les environnements
3. Redéployez

### Erreur : "Token invalide" ou "Unauthorized"

**Cause** : JWT_SECRET a changé ou est différent entre les environnements

**Solution** :
1. Vérifiez que JWT_SECRET est le même partout
2. Si vous avez changé JWT_SECRET, tous les utilisateurs doivent se reconnecter

## 📝 Pour l'erreur 404

L'erreur 404 **DEPLOYMENT_NOT_FOUND** vient de :
- ❌ URL incorrecte
- ❌ Root Directory mal configuré dans Vercel
- ❌ Routes mal configurées dans `vercel.json`
- ❌ Déploiement non terminé

**PAS** de JWT_SECRET.

## ✅ Action Immédiate

Pour vérifier si le problème vient de JWT_SECRET :

1. **Testez** `/api/health` (cette route ne nécessite PAS de JWT)
   - Si ça fonctionne → Le problème n'est PAS JWT_SECRET
   - Si ça ne fonctionne pas → Le problème est le routing (404)

2. **Testez** `/api/auth/register` (nécessite JWT_SECRET)
   - Si vous obtenez "Configuration serveur invalide" → JWT_SECRET manque
   - Si vous obtenez 404 → Le problème est le routing

## 🔧 Solution Rapide

Si vous voulez être sûr que JWT_SECRET est correct :

1. **Générez un nouveau JWT_SECRET** :
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
   ```

2. **Ajoutez-le dans Vercel** :
   - Settings > Environment Variables
   - Ajoutez `JWT_SECRET` = (votre nouvelle clé)
   - Sélectionnez Production, Preview, Development
   - Save

3. **Redéployez** :
   - Deployments > Redeploy (sans cache)

4. **Testez** :
   - `/api/health` → Devrait fonctionner
   - `/api/auth/register` → Devrait fonctionner (si routing OK)

