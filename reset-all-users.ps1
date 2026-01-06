# Script pour reinitialiser tous les utilisateurs
# ATTENTION: Cette action supprime TOUS les utilisateurs et recree l'admin

$apiBaseUrl = "https://compta-lmb.vercel.app"
$adminUsername = "Switch"
$adminPassword = "Switch57220"

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  REINITIALISATION DE TOUS LES UTILISATEURS" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "Ce script va:" -ForegroundColor Cyan
Write-Host "1. Supprimer TOUS les utilisateurs existants" -ForegroundColor Yellow
Write-Host "2. Recreer l'utilisateur admin: $adminUsername" -ForegroundColor Yellow
Write-Host "`nATTENTION: Toutes les transactions seront aussi supprimees !`n" -ForegroundColor Red

$confirmation = Read-Host "Tapez 'RESET' pour confirmer"

if ($confirmation -ne "RESET") {
    Write-Host "`nOperation annulee.`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nConnexion avec l'admin actuel..." -ForegroundColor Cyan

# Essayer de se connecter avec l'admin actuel
try {
    $loginResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{
        username = $adminUsername
        password = $adminPassword
    } | ConvertTo-Json) -ErrorAction Stop
    
    $token = $loginResponse.token
    Write-Host "Connecte avec succes !`n" -ForegroundColor Green
    
    # Recuperer la liste de tous les utilisateurs
    Write-Host "Recuperation de la liste des utilisateurs..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $usersResponse = Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/users" -Method Get -Headers $headers -ErrorAction Stop
    $users = $usersResponse.users
    
    Write-Host "Nombre d'utilisateurs trouves: $($users.Count)`n" -ForegroundColor Cyan
    
    # Supprimer tous les utilisateurs sauf l'admin actuel
    foreach ($user in $users) {
        if ($user.username -ne $adminUsername) {
            Write-Host "Suppression de l'utilisateur: $($user.username)..." -ForegroundColor Yellow
            try {
                Invoke-RestMethod -Uri "$apiBaseUrl/api/admin/users/$($user.id)" -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
                Write-Host "  -> Supprime" -ForegroundColor Green
            } catch {
                Write-Host "  -> Erreur: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "`nTous les utilisateurs ont ete supprimes (sauf admin)" -ForegroundColor Green
    Write-Host "`nIdentifiants admin:" -ForegroundColor Cyan
    Write-Host "  Utilisateur: $adminUsername" -ForegroundColor White
    Write-Host "  Mot de passe: $adminPassword`n" -ForegroundColor White
    
} catch {
    Write-Host "`nL'admin n'existe pas encore ou erreur de connexion." -ForegroundColor Yellow
    Write-Host "Creation de l'utilisateur admin...`n" -ForegroundColor Cyan
    
    # Si l'admin n'existe pas, on doit le creer via le backend directement
    # On va simplement informer l'utilisateur de lancer le script setup-admin
    Write-Host "Veuillez executer le script de configuration admin:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm run setup:admin`n" -ForegroundColor White
}

Write-Host "========================================`n" -ForegroundColor Yellow
Write-Host "Operation terminee !`n" -ForegroundColor Green

