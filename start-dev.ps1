# Script pour lancer Backend + Frontend en parallèle
Write-Host "🚀 Démarrage Backend + Frontend..." -ForegroundColor Cyan

# Terminal 1: Backend (Port 8000)
Write-Host "📡 Lancement Backend (Port 8000)..." -ForegroundColor Yellow
$backendPath = Get-Location
$backendCmd = "cd `"$backendPath`" ; python -m uvicorn app.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Attendre 2 secondes avant de lancer le frontend
Start-Sleep -Seconds 2

# Terminal 2: Frontend (Port 3000)
Write-Host "⚛️ Lancement Frontend (Port 3000)..." -ForegroundColor Green
$frontendPath = Join-Path $backendPath "frontend"
$frontendCmd = "cd `"$frontendPath`" ; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host ""
Write-Host "✅ Deux nouveaux terminaux ouverts:" -ForegroundColor Green
Write-Host "   • Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Attendez 30-60 secondes que les deux se compilent..." -ForegroundColor Yellow
