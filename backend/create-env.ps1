# Script pour créer le fichier .env pour le développement local

$envContent = @"
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="votre-secret-jwt-tres-securise-changez-moi-en-production"
PORT=3001
"@

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host "⚠️  Le fichier .env existe déjà" -ForegroundColor Yellow
} else {
    Set-Content -Path $envPath -Value $envContent
    Write-Host "✅ Fichier .env créé avec succès !" -ForegroundColor Green
}

