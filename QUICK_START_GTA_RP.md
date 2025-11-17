# Guide de démarrage rapide - Intégration GTA RP

## 🚀 Étapes rapides

### 1. Migration de la base de données

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name add_gameid_and_source
# ou si SQLite: npx prisma db push
```

### 2. Configuration

Ajoutez dans `backend/.env` :

```env
# Clé API pour sécuriser le webhook (optionnel mais recommandé)
GTARP_WEBHOOK_KEY="votre-cle-secrete-tres-longue-et-aleatoire"

# Webhook Discord pour les notifications (optionnel)
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

**Générer une clé sécurisée** :
```bash
# Sur Linux/Mac
openssl rand -hex 32

# Sur Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Redémarrer le serveur backend

```bash
cd backend
npm run build
npm start
```

### 4. Configurer votre script GTA RP

1. **Copiez le fichier** `examples/gtarp-integration-standalone.lua` dans votre ressource
2. **Modifiez la configuration** :
   ```lua
   local WEBHOOK_URL = "https://votre-domaine.com/api/gtarp/webhook"
   local API_KEY = "votre-cle-secrete"  -- La même que dans .env
   ```
3. **Intégrez dans votre script de coffre** :
   - Appelez `SendComptaTransaction()` lors des dépôts/retraits
   - Utilisez l'ID de jeu du joueur (license, steam, citizenid, etc.)

### 5. Enregistrer les utilisateurs avec leur ID de jeu

Les utilisateurs doivent s'inscrire sur le site avec leur **ID de jeu GTA RP**. Cet ID doit correspondre à celui utilisé dans votre script Lua.

**Exemples d'IDs de jeu** :
- ESX : `xPlayer.identifier` (ex: `steam:11000010abc1234`)
- QBCore : `Player.PlayerData.citizenid` (ex: `ABC12345`)
- Générique : `GetPlayerIdentifier(source)` (ex: `license:abc123def456`)

## 📝 Exemple d'intégration rapide

Dans votre script de coffre, ajoutez simplement :

```lua
-- Au début du fichier
local function SendComptaTransaction(gameId, action, amount, description)
    PerformHttpRequest("https://votre-domaine.com/api/gtarp/webhook", 
        function(statusCode, response) 
            print("[COMPTA] Status: " .. statusCode) 
        end, 
        'POST', 
        json.encode({
            gameId = tostring(gameId),
            action = action,
            amount = tonumber(amount),
            description = description,
            category = "GTA RP"
        }), 
        {['Content-Type'] = 'application/json', ['X-API-Key'] = 'votre-cle'}
    )
end

-- Lors d'un dépôt
RegisterServerEvent('coffre:depot')
AddEventHandler('coffre:depot', function(amount)
    local source = source
    local gameId = GetPlayerIdentifier(source)  -- Adaptez selon votre framework
    
    -- Votre logique...
    
    SendComptaTransaction(gameId, "deposit", amount, "Dépôt depuis coffre")
end)
```

## ✅ Vérification

1. **Testez le webhook** :
   ```bash
   curl -X POST https://votre-domaine.com/api/gtarp/webhook \
     -H "Content-Type: application/json" \
     -H "X-API-Key: votre-cle" \
     -d '{
       "gameId": "test123",
       "action": "deposit",
       "amount": 1000,
       "description": "Test"
     }'
   ```

2. **Vérifiez les logs** du serveur backend pour voir les transactions créées

3. **Consultez le dashboard** pour voir les transactions automatiques

## 🔒 Sécurité

- ✅ **Toujours utiliser HTTPS** en production
- ✅ **Définir une clé API** longue et aléatoire
- ✅ **Ne pas exposer** la clé API dans le code client
- ✅ **Valider** les montants côté serveur GTA RP avant d'envoyer

## 📚 Documentation complète

- `GTA_RP_INTEGRATION.md` : Documentation détaillée
- `examples/gtarp-integration.lua` : Exemples complets pour ESX/QBCore
- `examples/gtarp-integration-standalone.lua` : Version simplifiée

## 🆘 Dépannage

**Erreur 404 "Aucun utilisateur trouvé"** :
- L'utilisateur doit s'inscrire sur le site avec son ID de jeu
- Vérifiez que l'ID utilisé dans le script correspond à celui enregistré

**Erreur 401/403 "Clé API invalide"** :
- Vérifiez que `GTARP_WEBHOOK_KEY` est défini dans `.env`
- Vérifiez que la clé dans le script Lua correspond

**Erreurs TypeScript** :
- Exécutez `npx prisma generate` dans le dossier `backend`

