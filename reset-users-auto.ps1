# Script automatique pour reinitialiser tous les utilisateurs (sauf admin)
# ATTENTION: Ce script supprime TOUS les utilisateurs non-admin sans confirmation !

$apiBaseUrl = "https://compta-lmb.vercel.app"
$adminUsername = "Switch"
$adminPassword = "Switch57220"

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  REINITIALISATION AUTOMATIQUE DES UTILISATEURS" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "Connexion en cours..." -ForegroundColor Cyan

# Se connecter avec l'admin
try {
    $loginResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{
        username = $adminUsername
        password = $adminPassword
    } | ConvertTo-Json)
    
    $token = $loginResponse.token
    Write-Host "Connecte avec succes !`n" -ForegroundColor Green
} catch {
    Write-Host "Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Lister les utilisateurs actuels
Write-Host "Liste des utilisateurs actuels:" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $usersResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/users" -Method Get -Headers $headers
    $users = $usersResponse.users
    $nonAdminCount = ($users | Where-Object { -not $_.isAdmin }).Count
    
    Write-Host "Utilisateurs totaux: $($users.Count)" -ForegroundColor White
    Write-Host "Utilisateurs non-admin a supprimer: $nonAdminCount`n" -ForegroundColor Yellow
} catch {
    Write-Host "Erreur lors de la recuperation des utilisateurs" -ForegroundColor Red
    exit 1
}

Write-Host "Suppression de tous les utilisateurs non-admin en cours...`n" -ForegroundColor Cyan

# Réinitialiser tous les utilisateurs
try {
    $resetResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/users/reset/all" -Method Delete -Headers $headers
    
    Write-Host "SUCCES !" -ForegroundColor Green
    Write-Host "Message: $($resetResponse.message)" -ForegroundColor Green
    Write-Host "Utilisateurs supprimes: $($resetResponse.deletedCount)`n" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur lors de la reinitialisation: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Operation terminee avec succes !`n" -ForegroundColor Green
Write-Host "Seul l'utilisateur admin reste:" -ForegroundColor Cyan
Write-Host "  Utilisateur: $adminUsername" -ForegroundColor White
Write-Host "  Mot de passe: $adminPassword`n" -ForegroundColor White

