@echo off
REM Testing script for CV App - Backend & Frontend
setlocal enabledelayedexpansion

echo.
echo 🧪 TESTING CV APP - BACKEND ^& FRONTEND
echo ========================================
echo.

echo 1️⃣  Testing Backend at https://llm-app-1-lsgm.onrender.com
echo ----------------------------------------
echo.

echo Testing /api/health endpoint...
powershell -Command "Invoke-WebRequest -Uri 'https://llm-app-1-lsgm.onrender.com/api/health' -ContentType 'application/json' -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Indent 2" 2>nul || echo ⚠️  Could not connect

echo.
echo Testing /api/resumes endpoint...
powershell -Command "Invoke-WebRequest -Uri 'https://llm-app-1-lsgm.onrender.com/api/resumes' -ContentType 'application/json' -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Indent 2" 2>nul || echo ⚠️  Could not connect

echo.
echo Testing /api/assistant endpoint...
powershell -Command "Invoke-WebRequest -Uri 'https://llm-app-1-lsgm.onrender.com/api/assistant' -ContentType 'application/json' -Method POST -Body '{\"prompt\":\"Quelles competences ajouter a mon CV?\"}' | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Indent 2" 2>nul || echo ⚠️  Could not connect

echo.
echo 2️⃣  Frontend Deployment
echo ----------------------------------------
echo Frontend URL: https://cv-app-smoky-two.vercel.app
echo ✅ Visit the URL and test:
echo    1. Create a new CV
echo    2. Open the AI Assistant (check console for logs)
echo    3. Test responsive design on mobile (F12 ^> Toggle Device Toolbar)
echo    4. Export to PDF
echo.

echo 3️⃣  Key Files Updated
echo ----------------------------------------
echo ✅ app/main.py - Enhanced /api/assistant route with error handling
echo ✅ frontend/src/services/aiService.js - New service layer for AI
echo ✅ frontend/src/components/Assistant.jsx - Updated to use aiService
echo ✅ frontend/.env.local - Development environment config
echo ✅ frontend/.env.production - Production environment config
echo.

echo 4️⃣  Environment Configuration
echo ----------------------------------------
echo For Production (Vercel), go to:
echo   - Vercel Dashboard ^> cv-app project ^> Settings ^> Environment Variables
echo   - Add: REACT_APP_API_URL=https://llm-app-1-lsgm.onrender.com
echo   - Click Save ^& Redeploy
echo.

echo 🎉 Testing complete!
pause
