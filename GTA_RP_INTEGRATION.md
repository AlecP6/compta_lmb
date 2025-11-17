# Intégration GTA RP - Documentation

Ce document explique comment automatiser votre comptabilité avec les logs de GTA RP.

## Vue d'ensemble

Le système permet d'automatiser la création de transactions lorsqu'un joueur dépose ou retire de l'argent d'un coffre dans GTA RP. Chaque utilisateur doit être enregistré avec son ID de jeu pour que l'automatisation fonctionne.

## Configuration

### 1. Enregistrement des utilisateurs avec ID de jeu

Lors de l'inscription sur le site, les utilisateurs peuvent maintenant fournir leur **ID de jeu GTA RP**. Cet ID est optionnel mais nécessaire pour l'automatisation.

- **Champ**: `gameId` (optionnel)
- **Format**: Chaîne de caractères unique
- **Validation**: L'ID doit être unique (un seul compte par ID de jeu)

### 2. Endpoint Webhook

L'endpoint webhook est disponible à l'adresse suivante :

```
POST /api/gtarp/webhook
```

#### Format de la requête

```json
{
  "gameId": "12345",
  "action": "deposit",  // ou "withdraw"
  "amount": 1000.50,
  "description": "Dépôt depuis coffre principal",  // optionnel
    "category": "argent sale"  // optionnel, par défaut "argent sale"
}
```

#### Paramètres

- **gameId** (requis) : L'ID de jeu du joueur
- **action** (requis) : `"deposit"` pour un dépôt (INCOME) ou `"withdraw"` pour un retrait (EXPENSE)
- **amount** (requis) : Le montant de la transaction (nombre positif)
- **description** (optionnel) : Description personnalisée. Si non fournie, une description par défaut sera utilisée
- **category** (optionnel) : Catégorie de la transaction. Par défaut : "argent sale"

#### Réponses

**Succès (201)** :
```json
{
  "success": true,
  "transaction": {
    "id": "...",
    "type": "INCOME",
    "amount": 1000.50,
    "description": "Dépôt depuis coffre GTA RP",
    "category": "argent sale",
    "source": "GTA_RP",
    "userId": "...",
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Transaction créée avec succès"
}
```

**Erreur - Utilisateur non trouvé (404)** :
```json
{
  "error": "Aucun utilisateur trouvé avec cet ID de jeu",
  "gameId": "12345"
}
```

**Erreur - Validation (400)** :
```json
{
  "errors": [
    {
      "msg": "L'action doit être \"deposit\" ou \"withdraw\"",
      "param": "action"
    }
  ]
}
```

### 3. Exemple d'intégration avec les logs GTA RP

Des exemples complets sont disponibles dans le dossier `examples/` :

- **`gtarp-integration.lua`** : Version complète avec support ESX, QBCore et générique
- **`gtarp-integration-standalone.lua`** : Version simplifiée à intégrer directement

**Exemple basique** :

```lua
-- Configuration
local WEBHOOK_URL = "https://votre-domaine.com/api/gtarp/webhook"
local API_KEY = "votre-cle-secrete"  -- Optionnel

-- Fonction pour envoyer une transaction
local function SendComptaTransaction(gameId, action, amount, description)
    local payload = {
        gameId = tostring(gameId),
        action = action,  -- "deposit" ou "withdraw"
        amount = tonumber(amount),
        description = description or nil,
        category = "argent sale"
    }

    local headers = {
        ['Content-Type'] = 'application/json'
    }
    
    if API_KEY and API_KEY ~= "" then
        headers['X-API-Key'] = API_KEY
    end

    PerformHttpRequest(WEBHOOK_URL, function(statusCode, response)
        if statusCode == 201 then
            print("[COMPTA] Transaction enregistrée: " .. action .. " de " .. amount .. "$")
        elseif statusCode == 404 then
            print("[COMPTA] Utilisateur non trouvé avec l'ID: " .. gameId)
        else
            print("[COMPTA] Erreur " .. statusCode)
        end
    end, 'POST', json.encode(payload), headers)
end

-- Exemple d'utilisation
RegisterServerEvent('coffre:depot')
AddEventHandler('coffre:depot', function(amount)
    local source = source
    local gameId = GetPlayerIdentifier(source)  -- Adaptez selon votre framework
    
    -- Votre logique de dépôt...
    
    -- Envoyer à la comptabilité
    SendComptaTransaction(gameId, "deposit", amount, "Dépôt depuis coffre")
end)
```

Consultez les fichiers dans `examples/` pour des exemples plus détaillés selon votre framework (ESX, QBCore, etc.).

### 4. Sécurisation du webhook

Le webhook est maintenant sécurisé avec une clé API optionnelle. Pour l'activer :

1. **Ajouter la clé API dans votre fichier `.env`** :
   ```env
   GTARP_WEBHOOK_KEY="votre-cle-secrete-tres-longue-et-aleatoire"
   ```

2. **Utiliser la clé dans votre script GTA RP** :
   ```lua
   local headers = {
       ['Content-Type'] = 'application/json',
       ['X-API-Key'] = 'votre-cle-secrete-tres-longue-et-aleatoire'
   }
   ```

**Note** : Si `GTARP_WEBHOOK_KEY` n'est pas définie, le webhook reste accessible sans authentification (mode développement). En production, **toujours** définir une clé API sécurisée.

**Autres recommandations de sécurité** :
- Utiliser HTTPS uniquement en production
- Limiter les IPs autorisées si possible
- Générer une clé API longue et aléatoire (minimum 32 caractères)

### 5. Consultation des transactions par gameId

Vous pouvez également consulter les transactions d'un utilisateur via son gameId :

```
GET /api/gtarp/user/:gameId/transactions?limit=50
```

**Exemple de réponse** :
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "gameId": "12345"
  },
  "transactions": [...],
  "total": 10
}
```

## Migration de la base de données

Après avoir modifié le schéma Prisma, vous devez créer et appliquer une migration :

```bash
cd backend
npx prisma migrate dev --name add_gameid_and_source
```

Ou en production :
```bash
npx prisma migrate deploy
```

## Notifications Discord

Le système peut envoyer automatiquement des notifications Discord lorsqu'une transaction GTA RP est créée.

### Configuration

Ajoutez dans `backend/.env` :

```env
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### Format des notifications

Les notifications Discord incluent :
- **Titre** : Type de transaction (Dépôt/Retrait) avec emoji
- **Joueur** : Nom et ID de jeu
- **Montant** : Formaté avec séparateurs
- **Description** : Description de la transaction
- **Catégorie** : Catégorie de la transaction
- **Timestamp** : Date et heure de la transaction

Les notifications utilisent des couleurs différentes :
- 🟢 **Vert** pour les dépôts (INCOME)
- 🔴 **Rouge** pour les retraits (EXPENSE)

**Note** : Si le webhook Discord n'est pas configuré ou échoue, la transaction sera quand même créée. Les erreurs Discord sont loggées mais n'interrompent pas le processus.

## Notes importantes

- Les transactions créées via le webhook ont le champ `source` défini à `"GTA_RP"`
- Les transactions manuelles ont le champ `source` défini à `"MANUAL"` (ou `null`)
- Le champ `gameId` est unique : un seul compte peut être associé à un ID de jeu
- Si un utilisateur n'a pas de `gameId` enregistré, les webhooks pour cet ID échoueront avec une erreur 404
- Les notifications Discord sont envoyées de manière asynchrone et n'affectent pas la création de la transaction

