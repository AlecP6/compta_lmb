# Script complet pour tester le webhook Discord
# Démarre le serveur, liste les utilisateurs et teste le webhook

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test du Webhook Discord" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot ".."
Set-Location $backendPath

# Vérifier si Node.js est disponible
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté : $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas trouvé. Installez Node.js d'abord." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "📋 Étape 1/4 : Liste des utilisateurs" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────" -ForegroundColor Gray
node scripts/list-users.js
Write-Host ""

# Demander à l'utilisateur quel gameId/username utiliser
Write-Host "📝 Étape 2/4 : Configuration du test" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────" -ForegroundColor Gray

$gameId = Read-Host "Entrez un gameId (ou laissez vide pour utiliser un username)"
$username = $null
$action = "deposit"
$amount = 100

if ([string]::IsNullOrWhiteSpace($gameId)) {
    $username = Read-Host "Entrez un username"
    if ([string]::IsNullOrWhiteSpace($username)) {
        Write-Host "❌ Vous devez fournir un gameId ou un username" -ForegroundColor Red
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}

$actionInput = Read-Host "Type de transaction (deposit/withdraw) [défaut: deposit]"
if (-not [string]::IsNullOrWhiteSpace($actionInput)) {
    $action = $actionInput
}

$amountInput = Read-Host "Montant [défaut: 100]"
if (-not [string]::IsNullOrWhiteSpace($amountInput)) {
    $amount = [double]$amountInput
}

Write-Host ""
Write-Host "🔍 Étape 3/4 : Vérification du serveur" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────" -ForegroundColor Gray

# Vérifier si le serveur est déjà démarré
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Serveur déjà démarré sur http://localhost:3001" -ForegroundColor Green
        $serverRunning = $true
    }
} catch {
    Write-Host "⚠️  Serveur non démarré, démarrage en cours..." -ForegroundColor Yellow
    
    # Démarrer le serveur en arrière-plan
    Write-Host "   Démarrage du serveur backend..." -ForegroundColor Yellow
    
    # Vérifier si tsx est disponible
    $tsxAvailable = $false
    try {
        $tsxCheck = npx tsx --version 2>&1
        $tsxAvailable = $true
    } catch {
        $tsxAvailable = $false
    }
    
    if ($tsxAvailable) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npx tsx src/server.ts" -WindowStyle Minimized
    } else {
        # Essayer avec node directement (si compilé)
        if (Test-Path "dist/server.js") {
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node dist/server.js" -WindowStyle Minimized
        } else {
            Write-Host "❌ Impossible de démarrer le serveur automatiquement." -ForegroundColor Red
            Write-Host "   Veuillez démarrer le serveur manuellement dans un autre terminal :" -ForegroundColor Yellow
            Write-Host "   cd backend" -ForegroundColor White
            Write-Host "   npx tsx src/server.ts" -ForegroundColor White
            Write-Host ""
            $continue = Read-Host "Appuyez sur Entrée une fois le serveur démarré, ou 'q' pour quitter"
            if ($continue -eq 'q') {
                exit 1
            }
        }
    }
    
    # Attendre que le serveur démarre
    Write-Host "   Attente du démarrage du serveur..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0
    while ($attempt -lt $maxAttempts) {
        Start-Sleep -Seconds 1
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 1 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Serveur démarré avec succès !" -ForegroundColor Green
                $serverRunning = $true
                break
            }
        } catch {
            $attempt++
            Write-Host "   Tentative $attempt/$maxAttempts..." -ForegroundColor Gray
        }
    }
    
    if (-not $serverRunning) {
        Write-Host "❌ Le serveur n'a pas démarré dans les temps." -ForegroundColor Red
        Write-Host "   Veuillez démarrer le serveur manuellement et relancer ce script." -ForegroundColor Yellow
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}

Write-Host ""
Write-Host "🧪 Étape 4/4 : Test du webhook Discord" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────" -ForegroundColor Gray

# Construire la commande de test
$testCommand = "node scripts/test-discord-webhook.js"
if (-not [string]::IsNullOrWhiteSpace($gameId)) {
    $testCommand += " --gameId=$gameId"
} else {
    $testCommand += " --username=$username"
}
$testCommand += " --action=$action"
$testCommand += " --amount=$amount"

Write-Host "Exécution: $testCommand" -ForegroundColor Gray
Write-Host ""

# Exécuter le test
Invoke-Expression $testCommand

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test terminé !" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Appuyez sur Entrée pour quitter"

