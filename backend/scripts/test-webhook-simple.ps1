# Script simple pour tester le webhook Discord
# Utilise directement le script Node.js

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test du Webhook Discord" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot ".."
Set-Location $backendPath

Write-Host "🧪 Test du webhook Discord" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Paramètres par défaut
$gameId = "12345"
$action = "deposit"
$amount = 100

Write-Host "Parametres par defaut:" -ForegroundColor Yellow
Write-Host "  - gameId: $gameId" -ForegroundColor White
Write-Host "  - action: $action" -ForegroundColor White
Write-Host "  - amount: $amount" -ForegroundColor White
Write-Host ""

$custom = Read-Host "Utiliser les parametres par defaut ? (O/n)"
if ($custom -eq "n" -or $custom -eq "N") {
    $gameIdInput = Read-Host "gameId [defaut: $gameId]"
    if (-not [string]::IsNullOrWhiteSpace($gameIdInput)) {
        $gameId = $gameIdInput
    }
    
    $actionInput = Read-Host "action (deposit/withdraw) [defaut: $action]"
    if (-not [string]::IsNullOrWhiteSpace($actionInput)) {
        $action = $actionInput
    }
    
    $amountInput = Read-Host "amount [defaut: $amount]"
    if (-not [string]::IsNullOrWhiteSpace($amountInput)) {
        $amount = [double]$amountInput
    }
}

Write-Host ""
Write-Host "Execution du test..." -ForegroundColor Yellow
Write-Host ""

# Exécuter le test
$testCommand = "node scripts/test-discord-webhook.js --gameId=$gameId --action=$action --amount=$amount"
Invoke-Expression $testCommand

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test termine !" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Appuyez sur Entree pour quitter"

