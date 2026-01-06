# Script simple pour reinitialiser tous les utilisateurs (sauf admin)
# Cette action supprime tous les utilisateurs non-admin et leurs transactions

$apiBaseUrl = "https://compta-lmb.vercel.app"
$adminUsername = "Switch"
$adminPassword = "Switch57220"

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  REINITIALISATION DES UTILISATEURS" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "Cette action va supprimer TOUS les utilisateurs (sauf admin)" -ForegroundColor Yellow
Write-Host "et TOUTES leurs transactions !`n" -ForegroundColor Red

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
    }
    
    $usersResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/users" -Method Get -Headers $headers
    $users = $usersResponse.users
    
    foreach ($user in $users) {
        $adminBadge = if ($user.isAdmin) { " [ADMIN]" } else { "" }
        $transCount = $user._count.transactions
        Write-Host "  - $($user.username) ($($user.name))$adminBadge - $transCount transaction(s)" -ForegroundColor White
    }
    Write-Host ""
} catch {
    Write-Host "Erreur lors de la recuperation des utilisateurs" -ForegroundColor Red
}

# Demander confirmation
$confirmation = Read-Host "Tapez 'RESET' pour supprimer tous les utilisateurs non-admin"

if ($confirmation -ne "RESET") {
    Write-Host "`nOperation annulee.`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nSuppression en cours...`n" -ForegroundColor Cyan

# Réinitialiser tous les utilisateurs
try {
    $resetResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/users/reset/all" -Method Delete -Headers $headers
    
    Write-Host "Succes !" -ForegroundColor Green
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
Write-Host "Operation terminee !`n" -ForegroundColor Green
Write-Host "Identifiants admin conserves:" -ForegroundColor Cyan
Write-Host "  Utilisateur: $adminUsername" -ForegroundColor White
Write-Host "  Mot de passe: $adminPassword`n" -ForegroundColor White

