# Script automatique pour supprimer TOUTES les transactions
# ATTENTION: Cette action est irreversible !

$apiBaseUrl = "https://compta-lmb.vercel.app"
$username = "Switch"
$password = "Switch57220"

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  SUPPRESSION DE TOUTES LES TRANSACTIONS" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "URL de l'API: $apiBaseUrl" -ForegroundColor Cyan
Write-Host "Utilisateur: $username`n" -ForegroundColor Cyan

Write-Host "Connexion en cours..." -ForegroundColor Cyan

# Se connecter pour obtenir le token
try {
    $loginResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{
        username = $username
        password = $password
    } | ConvertTo-Json)
    
    $token = $loginResponse.token
    Write-Host "Connecte avec succes !`n" -ForegroundColor Green
} catch {
    Write-Host "Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Suppression de toutes les transactions en cours...`n" -ForegroundColor Cyan

# Supprimer toutes les transactions
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $deleteResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/transactions/all" -Method Delete -Headers $headers
    
    Write-Host "SUCCES !" -ForegroundColor Green
    Write-Host "Message: $($deleteResponse.message)" -ForegroundColor Green
    Write-Host "Nombre de transactions supprimees: $($deleteResponse.deletedCount)`n" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur lors de la suppression: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Operation terminee avec succes !`n" -ForegroundColor Green

