# Script pour supprimer TOUTES les transactions via l'API de production
# ATTENTION: Cette action est irreversible !

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  SUPPRESSION DE TOUTES LES TRANSACTIONS" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Yellow

# URL de l'API (a modifier si necessaire)
$apiBaseUrl = Read-Host "URL de votre API (par ex: https://votre-api.vercel.app ou http://localhost:3001)"

if (-not $apiBaseUrl) {
    Write-Host "Erreur: URL requise`n" -ForegroundColor Red
    exit 1
}

$apiBaseUrl = $apiBaseUrl.TrimEnd('/')

# Demander les identifiants admin
$username = Read-Host "Nom d'utilisateur admin"
$password = Read-Host "Mot de passe" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host "`nConnexion en cours..." -ForegroundColor Cyan

# Se connecter pour obtenir le token
try {
    $loginResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{
        username = $username
        password = $passwordPlain
    } | ConvertTo-Json)
    
    $token = $loginResponse.token
    Write-Host "Connecte avec succes`n" -ForegroundColor Green
} catch {
    Write-Host "Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# Confirmer la suppression
Write-Host "ATTENTION: Cette action va supprimer TOUTES les transactions de la base de donnees!" -ForegroundColor Red
Write-Host "Cette action est IRREVERSIBLE!`n" -ForegroundColor Red
$confirmation = Read-Host "Tapez 'SUPPRIMER' pour confirmer"

if ($confirmation -ne "SUPPRIMER") {
    Write-Host "`nOperation annulee.`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nSuppression en cours...`n" -ForegroundColor Cyan

# Supprimer toutes les transactions
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $deleteResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/transactions/all" -Method Delete -Headers $headers
    
    Write-Host "Succes: $($deleteResponse.message)" -ForegroundColor Green
    Write-Host "Transactions supprimees: $($deleteResponse.deletedCount)`n" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur lors de la suppression: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host "========================================`n" -ForegroundColor Yellow
Write-Host "Operation terminee avec succes !`n" -ForegroundColor Green

Read-Host "Appuyez sur Entree pour quitter"
