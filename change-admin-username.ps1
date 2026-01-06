# Script pour changer le nom d'utilisateur admin

$apiBaseUrl = "https://compta-lmb.vercel.app"
$currentUsername = "Switch"
$currentPassword = "Switch57220"
$newUsername = "Lamar"

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  CHANGEMENT DU NOM D'UTILISATEUR ADMIN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "Ancien nom d'utilisateur: $currentUsername" -ForegroundColor White
Write-Host "Nouveau nom d'utilisateur: $newUsername`n" -ForegroundColor Green

Write-Host "Connexion en cours..." -ForegroundColor Cyan

# Se connecter avec les identifiants actuels
try {
    $loginResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{
        username = $currentUsername
        password = $currentPassword
    } | ConvertTo-Json)
    
    $token = $loginResponse.token
    Write-Host "Connecte avec succes !`n" -ForegroundColor Green
} catch {
    Write-Host "Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Changement du nom d'utilisateur en cours...`n" -ForegroundColor Cyan

# Mettre à jour le profil
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $updateResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/auth/profile" -Method Put -Headers $headers -Body (@{
        username = $newUsername
    } | ConvertTo-Json)
    
    Write-Host "SUCCES !" -ForegroundColor Green
    Write-Host "Message: $($updateResponse.message)" -ForegroundColor Green
    Write-Host "Nouveau nom d'utilisateur: $($updateResponse.user.username)`n" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur lors du changement: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Operation terminee avec succes !`n" -ForegroundColor Green
Write-Host "Nouveaux identifiants admin:" -ForegroundColor Cyan
Write-Host "  Utilisateur: $newUsername" -ForegroundColor White
Write-Host "  Mot de passe: $currentPassword (inchange)`n" -ForegroundColor White

