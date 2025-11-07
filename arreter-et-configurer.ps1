# Script pour arrêter les serveurs et configurer le compte admin

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Arrêt des serveurs et configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ajouter Node.js au PATH
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "🛑 Étape 1/4 : Arrêt de tous les processus Node.js..." -ForegroundColor Yellow

# Arrêter tous les processus Node.js (sauf ceux de Cursor et autres apps)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*nodejs*" -and 
    $_.Path -notlike "*Cursor*" -and 
    $_.Path -notlike "*StreamDeck*" -and
    $_.Path -notlike "*Elgato*"
}

if ($nodeProcesses) {
    Write-Host "   Arrêt de $($nodeProcesses.Count) processus Node.js..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Processus arrêtés" -ForegroundColor Green
} else {
    Write-Host "   ✅ Aucun processus à arrêter" -ForegroundColor Green
}

Write-Host ""
Write-Host "⏳ Attente de 3 secondes pour libérer les fichiers..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🔧 Étape 2/4 : Régénération de Prisma..." -ForegroundColor Yellow

# Aller dans le dossier backend
$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

# Essayer de régénérer Prisma plusieurs fois si nécessaire
$maxRetries = 3
$retryCount = 0
$success = $false

while ($retryCount -lt $maxRetries -and -not $success) {
    $retryCount++
    Write-Host "   Tentative $retryCount/$maxRetries..." -ForegroundColor Gray
    
    npm run prisma:generate 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Prisma régénéré avec succès" -ForegroundColor Green
        $success = $true
    } else {
        if ($retryCount -lt $maxRetries) {
            Write-Host "   ⚠️  Échec, nouvelle tentative dans 2 secondes..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        } else {
            Write-Host "   ⚠️  Impossible de régénérer Prisma (le serveur est peut-être encore actif)" -ForegroundColor Yellow
            Write-Host "   On continue quand même..." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "🔧 Étape 3/4 : Création du compte admin..." -ForegroundColor Yellow
npm run setup:admin

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors de la création du compte admin" -ForegroundColor Red
    Write-Host "   Le serveur est peut-être encore en cours d'exécution." -ForegroundColor Yellow
    Write-Host "   Fermez tous les terminaux et réessayez." -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Compte admin créé avec succès !" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Configuration terminée !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Identifiants de connexion :" -ForegroundColor Cyan
Write-Host "  Identifiant : Switch" -ForegroundColor White
Write-Host "  Mot de passe : Switch57220" -ForegroundColor White
Write-Host ""
Write-Host "Pour démarrer les serveurs :" -ForegroundColor Yellow
Write-Host "  cd .." -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"

