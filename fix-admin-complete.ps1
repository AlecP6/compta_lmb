# Script complet pour créer le compte admin
# Arrête les serveurs, régénère Prisma et crée le compte admin

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration complète du compte admin" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ajouter Node.js au PATH
$env:PATH += ";C:\Program Files\nodejs"

# Aller dans le dossier backend
$backendPath = Join-Path $PSScriptRoot "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "📁 Dossier backend : $backendPath" -ForegroundColor Yellow
} else {
    Write-Host "❌ Le dossier backend n'existe pas !" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "🛑 Étape 1/3 : Arrêt des processus Node.js du projet..." -ForegroundColor Yellow

# Arrêter les processus Node.js qui utilisent les fichiers du projet
$projectPath = $PSScriptRoot
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*nodejs*" -and $_.Path -notlike "*Cursor*" -and $_.Path -notlike "*StreamDeck*"
}

if ($nodeProcesses) {
    Write-Host "   Arrêt de $($nodeProcesses.Count) processus Node.js..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "   ✅ Processus arrêtés" -ForegroundColor Green
} else {
    Write-Host "   ✅ Aucun processus à arrêter" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Étape 2/3 : Régénération de Prisma..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️  Erreur lors de la régénération, mais on continue..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Étape 3/3 : Création du compte admin..." -ForegroundColor Yellow
npm run setup:admin
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors de la création du compte admin" -ForegroundColor Red
    Write-Host "   Essayez de fermer tous les terminaux et réessayez" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Configuration terminée !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Identifiants de connexion :" -ForegroundColor Cyan
Write-Host "  Identifiant : Switch" -ForegroundColor White
Write-Host "  Mot de passe : Switch57220" -ForegroundColor White
Write-Host ""
Write-Host "Pour démarrer les serveurs, exécutez depuis la racine :" -ForegroundColor Yellow
Write-Host "  cd .." -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"

