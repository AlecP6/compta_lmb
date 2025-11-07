# Script pour arrêter tous les serveurs Node.js du projet
Write-Host "Arrêt des processus Node.js..." -ForegroundColor Yellow

# Arrêter tous les processus Node.js (sauf ceux de Cursor et autres apps)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*nodejs*" -and 
    $_.Path -notlike "*Cursor*" -and 
    $_.Path -notlike "*StreamDeck*" -and
    $_.Path -notlike "*Elgato*"
}

if ($nodeProcesses) {
    Write-Host "Arrêt de $($nodeProcesses.Count) processus Node.js..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "✅ Processus arrêtés" -ForegroundColor Green
} else {
    Write-Host "✅ Aucun processus à arrêter" -ForegroundColor Green
}

Write-Host ""
Write-Host "Vous pouvez maintenant exécuter :" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run prisma:generate" -ForegroundColor White
Write-Host "  npm run setup:admin" -ForegroundColor White

