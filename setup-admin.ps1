# Script PowerShell pour configurer le compte admin automatiquement
# Double-cliquez sur ce fichier ou exécutez-le dans PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration du compte admin" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ajouter Node.js au PATH
$env:PATH += ";C:\Program Files\nodejs"

# Vérifier que Node.js est disponible
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté : $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas trouvé. Installez Node.js d'abord." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

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
Write-Host "🔧 Étape 1/2 : Régénération de Prisma..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la régénération de Prisma" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "🔧 Étape 2/2 : Création du compte admin..." -ForegroundColor Yellow
npm run setup:admin
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la création du compte admin" -ForegroundColor Red
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
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"

