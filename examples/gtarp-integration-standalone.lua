-- ============================================
-- Version standalone simplifiée
-- À copier directement dans votre script de coffre
-- ============================================

-- Configuration - MODIFIEZ CES VALEURS
local WEBHOOK_URL = "https://votre-domaine.com/api/gtarp/webhook"
local API_KEY = "votre-cle-secrete"  -- Laissez vide "" si pas de clé API

-- Fonction pour envoyer une transaction
local function SendComptaTransaction(gameId, action, amount, description)
    local payload = {
        gameId = tostring(gameId),
        action = action,  -- "deposit" ou "withdraw"
        amount = tonumber(amount),
        description = description or nil,
        category = "GTA RP"
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
            print("[COMPTA] Erreur " .. statusCode .. ": " .. (response or ""))
        end
    end, 'POST', json.encode(payload), headers)
end

-- ============================================
-- INTÉGRATION DANS VOTRE SCRIPT DE COFFRE
-- ============================================

-- Exemple: Lors d'un dépôt
-- Remplacez "coffre:depot" par votre event
RegisterServerEvent('coffre:depot')
AddEventHandler('coffre:depot', function(amount)
    local source = source
    -- Récupérer l'ID du joueur (adaptez selon votre framework)
    local gameId = GetPlayerIdentifier(source)  -- ou xPlayer.identifier pour ESX
    -- gameId = gameId:gsub("license:", "")  -- Si besoin de nettoyer le format
    
    -- Votre logique de dépôt...
    
    -- Envoyer à la comptabilité
    SendComptaTransaction(gameId, "deposit", amount, "Dépôt depuis coffre")
end)

-- Exemple: Lors d'un retrait
RegisterServerEvent('coffre:retrait')
AddEventHandler('coffre:retrait', function(amount)
    local source = source
    local gameId = GetPlayerIdentifier(source)
    
    -- Votre logique de retrait...
    
    -- Envoyer à la comptabilité
    SendComptaTransaction(gameId, "withdraw", amount, "Retrait depuis coffre")
end)

