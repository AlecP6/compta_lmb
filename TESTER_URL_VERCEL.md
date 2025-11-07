# 🧪 Tester votre URL Vercel

## 📍 URL de votre Backend

```
https://compta-iu0r0teus-alecp6s-projects.vercel.app
```

## ✅ Tests à Effectuer

### 1. Test de l'endpoint de santé

**URL complète** :
```
https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/health
```

**Résultat attendu** :
```json
{
  "status": "OK",
  "message": "API de comptabilité fonctionnelle"
}
```

### 2. Test de l'inscription

**URL complète** :
```
https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/auth/register
```

**Méthode** : POST

**Body** (JSON) :
```json
{
  "username": "testuser",
  "password": "test123",
  "name": "Test User"
}
```

**Résultat attendu** :
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "username": "testuser",
    "name": "Test User"
  }
}
```

### 3. Test de la connexion

**URL complète** :
```
https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/auth/login
```

**Méthode** : POST

**Body** (JSON) :
```json
{
  "username": "Switch",
  "password": "Switch57220"
}
```

**Résultat attendu** :
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "username": "Switch",
    "name": "Switch"
  }
}
```

## 🔍 Comment Tester

### Option 1 : Navigateur (pour /api/health uniquement)

1. **Ouvrez votre navigateur**
2. **Allez sur** : `https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/health`
3. **Vous devriez voir** : `{"status":"OK","message":"API de comptabilité fonctionnelle"}`

### Option 2 : PowerShell (pour tous les tests)

```powershell
# Test 1 : Endpoint de santé
Invoke-RestMethod -Uri "https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/health" -Method Get

# Test 2 : Inscription
$body = @{
    username = "testuser"
    password = "test123"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/auth/register" -Method Post -Body $body -ContentType "application/json"

# Test 3 : Connexion
$body = @{
    username = "Switch"
    password = "Switch57220"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

### Option 3 : curl (si installé)

```bash
# Test 1 : Endpoint de santé
curl https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/health

# Test 2 : Inscription
curl -X POST https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","name":"Test User"}'

# Test 3 : Connexion
curl -X POST https://compta-iu0r0teus-alecp6s-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Switch","password":"Switch57220"}'
```

## 🐛 Erreurs Possibles

### Erreur 404 : NOT_FOUND

**Cause** : Le routing Vercel n'est pas correct

**Solutions** :
1. Vérifiez que **Root Directory** est `backend` dans Vercel
2. Vérifiez que `vercel.json` existe dans `backend/`
3. Redéployez sans cache

### Erreur 500 : Internal Server Error

**Cause** : Problème serveur (JWT_SECRET, DATABASE_URL, etc.)

**Solutions** :
1. Vérifiez les **logs** dans Vercel > Functions > Logs
2. Vérifiez les **variables d'environnement** dans Vercel
3. Vérifiez que `DATABASE_URL` et `JWT_SECRET` sont définis

### Erreur CORS

**Cause** : Le frontend ne peut pas accéder au backend

**Solutions** :
1. Vérifiez que l'URL du frontend est autorisée dans `backend/api/index.ts`
2. Vérifiez que CORS est configuré correctement

## 📝 Résultats Attendus

### ✅ Si tout fonctionne :

1. `/api/health` → `{"status":"OK","message":"API de comptabilité fonctionnelle"}`
2. `/api/auth/register` → Token + User object
3. `/api/auth/login` → Token + User object

### ❌ Si ça ne fonctionne pas :

Copiez l'erreur exacte et dites-moi :
1. **Quelle URL** vous avez testée
2. **Quel message d'erreur** vous obtenez
3. **Les logs** de Vercel (Functions > Logs)

## 🔧 Configuration Frontend (Netlify)

Une fois que le backend fonctionne, mettez à jour `VITE_API_URL` sur Netlify :

```
VITE_API_URL=https://compta-iu0r0teus-alecp6s-projects.vercel.app/api
```

Puis redéployez le frontend.

