-- ============================================
-- Script d'intégration GTA RP pour la comptabilité
-- Compatible avec ESX, QBCore et autres frameworks
-- ============================================

-- Configuration
local Config = {
    WebhookURL = "https://votre-domaine.com/api/gtarp/webhook",  -- Remplacez par votre URL
    APIKey = "votre-cle-secrete",  -- Optionnel : seulement si vous avez configuré GTARP_WEBHOOK_KEY
    EnableLogs = true,  -- Activer les logs de débogage
}

-- ============================================
-- Fonction utilitaire pour envoyer au webhook
-- ============================================
function SendTransactionToWebhook(gameId, action, amount, description, category)
    if not gameId or not action or not amount then
        if Config.EnableLogs then
            print("^1[COMPTA] Erreur: Paramètres manquants pour le webhook^0")
        end
        return false
    end

    local payload = {
        gameId = tostring(gameId),
        action = action,  -- "deposit" ou "withdraw"
        amount = tonumber(amount),
        description = description or nil,
        category = category or "GTA RP"
    }

    local headers = {
        ['Content-Type'] = 'application/json'
    }

    -- Ajouter la clé API si configurée
    if Config.APIKey and Config.APIKey ~= "" then
        headers['X-API-Key'] = Config.APIKey
    end

    PerformHttpRequest(Config.WebhookURL, function(statusCode, response, responseHeaders)
        if statusCode == 201 then
            if Config.EnableLogs then
                print("^2[COMPTA] Transaction enregistrée avec succès^0")
                print("^2[COMPTA] Type: " .. action .. " | Montant: " .. amount .. "^0")
            end
        elseif statusCode == 404 then
            if Config.EnableLogs then
                print("^3[COMPTA] Avertissement: Aucun utilisateur trouvé avec l'ID de jeu: " .. gameId .. "^0")
                print("^3[COMPTA] L'utilisateur doit s'inscrire sur le site avec cet ID^0")
            end
        elseif statusCode == 401 or statusCode == 403 then
            if Config.EnableLogs then
                print("^1[COMPTA] Erreur d'authentification: Vérifiez votre clé API^0")
            end
        else
            if Config.EnableLogs then
                print("^1[COMPTA] Erreur lors de l'enregistrement (Code: " .. statusCode .. ")^0")
                print("^1[COMPTA] Réponse: " .. (response or "Aucune réponse") .. "^0")
            end
        end
    end, 'POST', json.encode(payload), headers)

    return true
end

-- ============================================
-- EXEMPLE POUR ESX
-- ============================================
if GetResourceState('es_extended') == 'started' then
    -- Dépôt dans un coffre
    RegisterServerEvent('coffre:depot')
    AddEventHandler('coffre:depot', function(amount, coffreName)
        local source = source
        local xPlayer = ESX.GetPlayerFromId(source)
        
        if not xPlayer then
            return
        end

        local gameId = xPlayer.identifier  -- ou xPlayer.getIdentifier() selon votre version ESX
        local playerName = xPlayer.getName()
        
        -- Votre logique de dépôt ici...
        -- xPlayer.removeMoney(amount)
        -- etc.

        -- Envoyer au webhook
        local description = coffreName and ("Dépôt dans " .. coffreName) or "Dépôt depuis coffre"
        SendTransactionToWebhook(gameId, "deposit", amount, description, "GTA RP - Coffre")
    end)

    -- Retrait depuis un coffre
    RegisterServerEvent('coffre:retrait')
    AddEventHandler('coffre:retrait', function(amount, coffreName)
        local source = source
        local xPlayer = ESX.GetPlayerFromId(source)
        
        if not xPlayer then
            return
        end

        local gameId = xPlayer.identifier
        local playerName = xPlayer.getName()
        
        -- Votre logique de retrait ici...
        -- xPlayer.addMoney(amount)
        -- etc.

        -- Envoyer au webhook
        local description = coffreName and ("Retrait depuis " .. coffreName) or "Retrait depuis coffre"
        SendTransactionToWebhook(gameId, "withdraw", amount, description, "GTA RP - Coffre")
    end)
end

-- ============================================
-- EXEMPLE POUR QBCORE
-- ============================================
if GetResourceState('qb-core') == 'started' then
    local QBCore = exports['qb-core']:GetCoreObject()

    -- Dépôt dans un coffre
    RegisterNetEvent('coffre:depot', function(amount, coffreName)
        local source = source
        local Player = QBCore.Functions.GetPlayer(source)
        
        if not Player then
            return
        end

        local gameId = Player.PlayerData.citizenid  -- ou Player.PlayerData.license selon votre config
        local playerName = Player.PlayerData.name
        
        -- Votre logique de dépôt ici...
        -- Player.Functions.RemoveMoney('cash', amount)
        -- etc.

        -- Envoyer au webhook
        local description = coffreName and ("Dépôt dans " .. coffreName) or "Dépôt depuis coffre"
        SendTransactionToWebhook(gameId, "deposit", amount, description, "GTA RP - Coffre")
    end)

    -- Retrait depuis un coffre
    RegisterNetEvent('coffre:retrait', function(amount, coffreName)
        local source = source
        local Player = QBCore.Functions.GetPlayer(source)
        
        if not Player then
            return
        end

        local gameId = Player.PlayerData.citizenid
        local playerName = Player.PlayerData.name
        
        -- Votre logique de retrait ici...
        -- Player.Functions.AddMoney('cash', amount)
        -- etc.

        -- Envoyer au webhook
        local description = coffreName and ("Retrait depuis " .. coffreName) or "Retrait depuis coffre"
        SendTransactionToWebhook(gameId, "withdraw", amount, description, "GTA RP - Coffre")
    end)
end

-- ============================================
-- EXEMPLE GÉNÉRIQUE (sans framework)
-- ============================================
-- Utilisez cette version si vous n'utilisez pas ESX ou QBCore

-- Fonction pour obtenir l'identifiant du joueur
function GetPlayerIdentifier(source)
    local identifiers = GetPlayerIdentifiers(source)
    for _, identifier in ipairs(identifiers) do
        if string.find(identifier, "license:") then
            return identifier:gsub("license:", "")
        elseif string.find(identifier, "steam:") then
            return identifier:gsub("steam:", "")
        end
    end
    return nil
end

-- Dépôt dans un coffre (exemple générique)
RegisterServerEvent('coffre:depot')
AddEventHandler('coffre:depot', function(amount, coffreName)
    local source = source
    local gameId = GetPlayerIdentifier(source)
    
    if not gameId then
        print("^1[COMPTA] Impossible de récupérer l'identifiant du joueur^0")
        return
    end

    -- Votre logique de dépôt ici...

    -- Envoyer au webhook
    local description = coffreName and ("Dépôt dans " .. coffreName) or "Dépôt depuis coffre"
    SendTransactionToWebhook(gameId, "deposit", amount, description, "GTA RP - Coffre")
end)

-- Retrait depuis un coffre (exemple générique)
RegisterServerEvent('coffre:retrait')
AddEventHandler('coffre:retrait', function(amount, coffreName)
    local source = source
    local gameId = GetPlayerIdentifier(source)
    
    if not gameId then
        print("^1[COMPTA] Impossible de récupérer l'identifiant du joueur^0")
        return
    end

    -- Votre logique de retrait ici...

    -- Envoyer au webhook
    local description = coffreName and ("Retrait depuis " .. coffreName) or "Retrait depuis coffre"
    SendTransactionToWebhook(gameId, "withdraw", amount, description, "GTA RP - Coffre")
end)

-- ============================================
-- COMMANDE ADMIN POUR TESTER LE WEBHOOK
-- ============================================
RegisterCommand('testcompta', function(source, args, rawCommand)
    local gameId = GetPlayerIdentifier(source)
    if not gameId then
        TriggerClientEvent('chat:addMessage', source, {
            color = {255, 0, 0},
            multiline = true,
            args = {"[COMPTA]", "Impossible de récupérer votre ID de jeu"}
        })
        return
    end

    local amount = tonumber(args[1]) or 1000
    local action = args[2] or "deposit"  -- "deposit" ou "withdraw"

    if action ~= "deposit" and action ~= "withdraw" then
        TriggerClientEvent('chat:addMessage', source, {
            color = {255, 255, 0},
            multiline = true,
            args = {"[COMPTA]", "Usage: /testcompta [montant] [deposit/withdraw]"}
        })
        return
    end

    SendTransactionToWebhook(gameId, action, amount, "Test depuis le jeu", "Test")
    
    TriggerClientEvent('chat:addMessage', source, {
        color = {0, 255, 0},
        multiline = true,
        args = {"[COMPTA]", "Transaction de test envoyée: " .. action .. " de " .. amount .. "$"}
    })
end, false)

print("^2[COMPTA] Script d'intégration GTA RP chargé^0")
print("^2[COMPTA] Webhook URL: " .. Config.WebhookURL .. "^0")

