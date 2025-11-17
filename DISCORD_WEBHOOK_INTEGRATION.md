# Intégration Webhook Discord - Création automatique de transactions

Ce document explique comment configurer et utiliser le webhook Discord pour créer automatiquement des transactions (entrées et sorties d'argent) dans votre système de comptabilité.

> **Note** : Ce système reçoit des données **depuis** Discord (ou un service externe) vers votre API. Ce n'est pas pour envoyer des notifications Discord, mais pour créer des transactions automatiquement à partir de messages Discord.

## Vue d'ensemble

Le système permet de recevoir des messages depuis Discord et de créer automatiquement des transactions. Cela peut être utilisé avec :
- Un bot Discord qui envoie des messages formatés
- Des services externes qui envoient des données vers votre API
- Des webhooks Discord configurés pour envoyer des données vers votre serveur

## Configuration

### 1. Endpoint Webhook

L'endpoint webhook Discord est disponible à l'adresse suivante :

```
POST /api/discord/webhook
```

### 2. Sécurisation (optionnelle)

Pour sécuriser le webhook, ajoutez une clé API dans votre fichier `.env` :

```env
DISCORD_WEBHOOK_KEY="votre-cle-secrete-tres-longue-et-aleatoire"
```

Si `DISCORD_WEBHOOK_KEY` n'est pas définie, le webhook reste accessible sans authentification (mode développement). En production, **toujours** définir une clé API sécurisée.

Pour utiliser le webhook avec authentification, incluez la clé dans le header :

```bash
X-API-Key: votre-cle-secrete-tres-longue-et-aleatoire
```

ou

```bash
Authorization: Bearer votre-cle-secrete-tres-longue-et-aleatoire
```

## Formats de données supportés

Le système supporte plusieurs formats de données pour une flexibilité maximale.

### Format 1: JSON direct (recommandé)

Format simple et direct depuis un bot Discord ou un service externe :

```json
{
  "gameId": "12345",
  "username": "John Doe",
  "action": "deposit",
  "amount": 1000.50,
  "description": "Dépôt depuis Discord",
  "category": "Discord"
}
```

**Paramètres** :
- `gameId` (optionnel) : L'ID de jeu de l'utilisateur
- `username` (optionnel) : Le nom d'utilisateur ou le nom de l'utilisateur
- `action` (requis) : `"deposit"` ou `"withdraw"` (ou `"income"`/`"expense"`)
- `amount` (requis) : Le montant de la transaction (nombre positif)
- `description` (optionnel) : Description de la transaction
- `category` (optionnel) : Catégorie de la transaction (par défaut : "Discord")

**Note** : Au moins un des champs `gameId` ou `username` doit être fourni pour identifier l'utilisateur.

### Format 2: Embed Discord

Le système peut parser automatiquement les embeds Discord pour extraire les informations :

```json
{
  "embeds": [
    {
      "title": "💰 Transaction - Dépôt",
      "description": "Nouvelle transaction",
      "color": 65280,
      "fields": [
        {
          "name": "👤 Joueur",
          "value": "John Doe (ID: 12345)",
          "inline": true
        },
        {
          "name": "💵 Montant",
          "value": "$1,000.50",
          "inline": true
        },
        {
          "name": "📝 Description",
          "value": "Dépôt depuis Discord",
          "inline": false
        }
      ],
      "footer": {
        "text": "Catégorie: Discord"
      }
    }
  ]
}
```

Le parser extrait automatiquement :
- Le **gameId** depuis le champ "Joueur" (format: "Nom (ID: 12345)" ou "Nom - 12345")
- Le **montant** depuis le champ "Montant" (supprime les symboles $, espaces, etc.)
- La **description** depuis le champ "Description"
- L'**action** depuis le titre (dépôt/deposit/income = INCOME, retrait/withdraw/expense = EXPENSE) ou la couleur (vert = INCOME, rouge = EXPENSE)

### Format 3: Message texte simple

Le système peut aussi parser des messages texte simples :

```
Dépôt de 1000.50$ pour joueur ID:12345
```

ou

```
Retrait 500$ - ID:12345
```

Le parser recherche :
- Les mots-clés : "dépôt", "deposit", "income", "entrée" pour les entrées
- Les mots-clés : "retrait", "withdraw", "expense", "sortie" pour les sorties
- Le montant (nombre avec ou sans décimales)
- L'ID de jeu (format: "ID: 12345" ou "ID:12345")

## Exemples d'utilisation

### Exemple 1: Bot Discord avec format JSON

```javascript
// Exemple avec un bot Discord (Node.js)
const axios = require('axios');

async function createTransaction(gameId, action, amount, description) {
  try {
    const response = await axios.post('https://votre-domaine.com/api/discord/webhook', {
      gameId: gameId,
      action: action, // "deposit" ou "withdraw"
      amount: amount,
      description: description || 'Transaction depuis Discord',
      category: 'Discord'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'votre-cle-secrete' // Si configurée
      }
    });
    
    console.log('Transaction créée:', response.data);
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
  }
}

// Utilisation
createTransaction('12345', 'deposit', 1000.50, 'Dépôt depuis bot Discord');
```

### Exemple 2: Service externe avec cURL

```bash
curl -X POST "https://votre-domaine.com/api/discord/webhook" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre-cle-secrete" \
  -d '{
    "gameId": "12345",
    "action": "deposit",
    "amount": 1000.50,
    "description": "Dépôt automatique",
    "category": "Discord"
  }'
```

### Exemple 3: Python

```python
import requests

def create_transaction(game_id, action, amount, description=None):
    url = "https://votre-domaine.com/api/discord/webhook"
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": "votre-cle-secrete"  # Si configurée
    }
    data = {
        "gameId": game_id,
        "action": action,  # "deposit" ou "withdraw"
        "amount": amount,
        "description": description or "Transaction depuis Discord",
        "category": "Discord"
    }
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Utilisation
result = create_transaction("12345", "deposit", 1000.50, "Dépôt depuis Python")
print(result)
```

## Réponses de l'API

### Succès (201)

```json
{
  "success": true,
  "transaction": {
    "id": "...",
    "type": "INCOME",
    "amount": 1000.50,
    "description": "Dépôt depuis Discord",
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

### Erreur - Utilisateur non trouvé (404)

```json
{
  "error": "Utilisateur non trouvé",
  "message": "Aucun utilisateur trouvé avec l'ID de jeu: 12345",
  "gameId": "12345",
  "username": null
}
```

### Erreur - Format non reconnu (400)

```json
{
  "error": "Format de message Discord non reconnu",
  "message": "Impossible d'extraire les informations de transaction depuis le message"
}
```

### Erreur - Validation (400)

```json
{
  "error": "Montant invalide",
  "message": "Le montant doit être un nombre positif"
}
```

### Erreur - Clé API invalide (401/403)

```json
{
  "error": "Clé API invalide",
  "message": "La clé API fournie est incorrecte"
}
```

## Identification des utilisateurs

Le système peut identifier un utilisateur de deux façons :

1. **Par gameId** : Si l'utilisateur a enregistré son ID de jeu lors de l'inscription
2. **Par username** : Recherche par nom d'utilisateur ou nom (insensible à la casse)

**Important** : Au moins un des deux (`gameId` ou `username`) doit être fourni dans la requête.

## Types de transactions

- **INCOME (Entrée)** : Créée lorsque `action` est `"deposit"` ou `"income"`
- **EXPENSE (Sortie)** : Créée lorsque `action` est `"withdraw"` ou `"expense"`

Si l'action n'est pas spécifiée, le système considère par défaut une entrée (INCOME).

## Notes importantes

- Les transactions créées via le webhook Discord ont le champ `source` défini à `"DISCORD"`
- Les transactions manuelles ont le champ `source` défini à `"MANUAL"` (ou `null`)
- Les transactions GTA RP ont le champ `source` défini à `"GTA_RP"`
- Si un utilisateur n'est pas trouvé, la requête échoue avec une erreur 404
- Les erreurs sont loggées dans la console du serveur pour le débogage
- Le webhook est compatible avec les webhooks Discord standards (embeds, contenu texte, etc.)

## Sécurité

⚠️ **Important** : En production, **toujours** configurer une clé API sécurisée.

- Utilisez une clé API longue et aléatoire (minimum 32 caractères)
- Ne partagez jamais la clé API publiquement
- Utilisez HTTPS uniquement en production
- Limitez les IPs autorisées si possible
- Surveillez les logs pour détecter les tentatives d'accès non autorisées

## Dépannage

### L'utilisateur n'est pas trouvé

1. Vérifiez que l'utilisateur existe dans la base de données
2. Vérifiez que le `gameId` ou `username` correspond exactement
3. Pour le `username`, la recherche est insensible à la casse mais doit correspondre exactement

### Le format n'est pas reconnu

1. Vérifiez que les données sont au format JSON valide
2. Assurez-vous que le montant est un nombre positif
3. Vérifiez que au moins `gameId` ou `username` est fourni
4. Consultez les logs du serveur pour plus de détails

### La clé API est rejetée

1. Vérifiez que `DISCORD_WEBHOOK_KEY` est bien définie dans `.env`
2. Vérifiez que la clé est correctement envoyée dans le header
3. Redémarrez le serveur après avoir modifié `.env`

