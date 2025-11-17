# Guide de test du webhook Discord

Ce guide explique comment tester l'endpoint `/api/discord/webhook` pour créer des transactions automatiquement.

## Prérequis

1. **Serveur backend démarré** : Assurez-vous que votre serveur backend est en cours d'exécution
   ```bash
   cd backend
   npm start
   ```

2. **Utilisateur existant** : Un utilisateur doit exister dans votre base de données avec :
   - Un `gameId` (ex: "12345")
   - OU un `username` (ex: "johndoe")

## Méthode 1: Script Node.js (recommandé)

### Utilisation basique

```bash
cd backend
node scripts/test-discord-webhook.js
```

### Avec paramètres personnalisés

```bash
# Test avec un gameId spécifique
node scripts/test-discord-webhook.js --gameId=12345 --action=deposit --amount=1000.50

# Test avec un username
node scripts/test-discord-webhook.js --username=johndoe --action=withdraw --amount=500

# Test avec une URL personnalisée (production)
node scripts/test-discord-webhook.js --url=https://votre-domaine.com --gameId=12345

# Test avec une clé API
node scripts/test-discord-webhook.js --apiKey=ma-cle-secrete --gameId=12345
```

### Variables d'environnement

Vous pouvez aussi utiliser des variables d'environnement :

```bash
export API_URL="http://localhost:3001"
export DISCORD_WEBHOOK_KEY="votre-cle-secrete"
node scripts/test-discord-webhook.js --gameId=12345
```

## Méthode 2: Script Shell (Linux/Mac)

### Utilisation basique

```bash
cd backend
chmod +x scripts/test-discord-webhook.sh
./scripts/test-discord-webhook.sh
```

### Avec paramètres

```bash
# Syntaxe: ./test-discord-webhook.sh [gameId] [action] [amount] [description]
./scripts/test-discord-webhook.sh 12345 deposit 1000.50 "Dépôt de test"
./scripts/test-discord-webhook.sh johndoe withdraw 500 "Retrait de test"
```

### Variables d'environnement

```bash
export API_URL="http://localhost:3001"
export DISCORD_WEBHOOK_KEY="votre-cle-secrete"
./scripts/test-discord-webhook.sh 12345 deposit 1000.50
```

## Méthode 3: cURL (ligne de commande)

### Test basique

```bash
curl -X POST "http://localhost:3001/api/discord/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "12345",
    "action": "deposit",
    "amount": 1000.50,
    "description": "Test de transaction",
    "category": "Discord"
  }'
```

### Avec clé API

```bash
curl -X POST "http://localhost:3001/api/discord/webhook" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre-cle-secrete" \
  -d '{
    "gameId": "12345",
    "action": "deposit",
    "amount": 1000.50,
    "description": "Test de transaction",
    "category": "Discord"
  }'
```

## Méthode 4: Postman ou client HTTP

1. **Méthode** : `POST`
2. **URL** : `http://localhost:3001/api/discord/webhook`
3. **Headers** :
   - `Content-Type: application/json`
   - `X-API-Key: votre-cle-secrete` (optionnel)
4. **Body** (JSON) :
```json
{
  "gameId": "12345",
  "action": "deposit",
  "amount": 1000.50,
  "description": "Test de transaction depuis Postman",
  "category": "Discord"
}
```

## Réponses attendues

### ✅ Succès (201)

```json
{
  "success": true,
  "transaction": {
    "id": "...",
    "type": "INCOME",
    "amount": 1000.50,
    "description": "Test de transaction",
    "category": "Discord",
    "source": "DISCORD",
    "userId": "...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "username": "johndoe",
      "gameId": "12345"
    },
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Transaction créée avec succès depuis Discord"
}
```

### ❌ Erreur - Utilisateur non trouvé (404)

```json
{
  "error": "Utilisateur non trouvé",
  "message": "Aucun utilisateur trouvé avec l'ID de jeu: 12345",
  "gameId": "12345",
  "username": null
}
```

### ❌ Erreur - Format invalide (400)

```json
{
  "error": "Format de message Discord non reconnu",
  "message": "Impossible d'extraire les informations de transaction depuis le message"
}
```

## Dépannage

### Erreur: ECONNREFUSED

**Problème** : Le serveur backend n'est pas démarré ou n'écoute pas sur le bon port.

**Solution** :
1. Vérifiez que le serveur est démarré : `cd backend && npm start`
2. Vérifiez le port dans `backend/.env` (par défaut: 3001)
3. Vérifiez l'URL dans le script (par défaut: `http://localhost:3001`)

### Erreur: Utilisateur non trouvé

**Problème** : L'utilisateur avec le `gameId` ou `username` fourni n'existe pas.

**Solution** :
1. Vérifiez que l'utilisateur existe dans la base de données
2. Vérifiez que le `gameId` ou `username` correspond exactement
3. Créez l'utilisateur si nécessaire via l'interface web ou l'API

### Erreur: Clé API invalide

**Problème** : La clé API fournie ne correspond pas à celle configurée.

**Solution** :
1. Vérifiez `DISCORD_WEBHOOK_KEY` ou `GTARP_WEBHOOK_KEY` dans `backend/.env`
2. Vérifiez que la clé est correctement envoyée dans le header
3. Redémarrez le serveur après avoir modifié `.env`

### Erreur: Format non reconnu

**Problème** : Les données envoyées ne sont pas dans un format reconnu.

**Solution** :
1. Vérifiez que le JSON est valide
2. Assurez-vous que `amount` est un nombre positif
3. Assurez-vous qu'au moins `gameId` ou `username` est fourni
4. Consultez la documentation pour les formats supportés

## Exemples de tests

### Test 1: Dépôt simple

```bash
node scripts/test-discord-webhook.js --gameId=12345 --action=deposit --amount=1000
```

### Test 2: Retrait

```bash
node scripts/test-discord-webhook.js --gameId=12345 --action=withdraw --amount=500
```

### Test 3: Avec username

```bash
node scripts/test-discord-webhook.js --username=johndoe --action=deposit --amount=2000
```

### Test 4: En production

```bash
node scripts/test-discord-webhook.js \
  --url=https://votre-domaine.com \
  --apiKey=votre-cle-secrete \
  --gameId=12345 \
  --action=deposit \
  --amount=1000.50
```

## Vérification dans la base de données

Après un test réussi, vous pouvez vérifier que la transaction a été créée :

```bash
# Via Prisma Studio (interface graphique)
cd backend
npx prisma studio

# Ou via une requête SQL directe (si vous utilisez SQLite)
sqlite3 prisma/dev.db "SELECT * FROM Transaction ORDER BY createdAt DESC LIMIT 1;"
```

La transaction devrait avoir :
- `type`: "INCOME" ou "EXPENSE"
- `source`: "DISCORD"
- `category`: "Discord" (ou celle que vous avez fournie)
- `amount`: Le montant que vous avez spécifié

