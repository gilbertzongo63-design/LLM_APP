@echo off
REM Script pour lancer Backend + Frontend en parallèle
color 0B
cls
echo.
echo ========================================
echo.  Démarrage Backend + Frontend
echo ========================================
echo.

REM Lancer Backend dans un nouveau terminal
echo Lancement Backend sur port 8000...
start cmd /k "title Backend && cd /d %CD% && python -m uvicorn app.main:app --reload --port 8000"

REM Attendre 2 secondes
timeout /t 2 /nobreak

REM Lancer Frontend dans un nouveau terminal
echo Lancement Frontend sur port 3000...
start cmd /k "title Frontend && cd /d %CD%\frontend && npm start"

echo.
echo ✓ Backend: http://localhost:8000
echo ✓ Frontend: http://localhost:3000
echo.
echo Attendez 30-60 secondes que les deux se compilent...
echo.
pause
