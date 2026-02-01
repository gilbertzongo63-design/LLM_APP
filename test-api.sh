#!/bin/bash

echo "🧪 TESTING CV APP - BACKEND & FRONTEND"
echo "========================================"
echo ""

# Test Backend
echo "1️⃣  Testing Backend at https://llm-app-1-lsgm.onrender.com"
echo "----------------------------------------"

echo "Testing /api/health endpoint..."
curl -s https://llm-app-1-lsgm.onrender.com/api/health | jq . 2>/dev/null || echo "⚠️  Could not parse JSON"

echo ""
echo "Testing /api/resumes endpoint..."
curl -s https://llm-app-1-lsgm.onrender.com/api/resumes | jq . 2>/dev/null || echo "⚠️  Could not parse JSON"

echo ""
echo "Testing /api/assistant endpoint..."
curl -X POST https://llm-app-1-lsgm.onrender.com/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Quelles compétences ajouter à mon CV?"}' | jq . 2>/dev/null || echo "⚠️  Could not parse JSON"

echo ""
echo "2️⃣  Frontend Deployment"
echo "----------------------------------------"
echo "Frontend URL: https://cv-app-smoky-two.vercel.app"
echo "✅ Visit the URL and test:"
echo "   1. Create a new CV"
echo "   2. Open the AI Assistant (check console for logs)"
echo "   3. Test responsive design on mobile (F12 → Toggle Device Toolbar)"
echo "   4. Export to PDF"
echo ""

echo "3️⃣  Key Files Updated"
echo "----------------------------------------"
echo "✅ app/main.py - Enhanced /api/assistant route with error handling"
echo "✅ frontend/src/services/aiService.js - New service layer for AI communication"
echo "✅ frontend/src/components/Assistant.jsx - Updated to use aiService"
echo "✅ frontend/.env.local - REACT_APP_API_URL=http://localhost:8000"
echo "✅ frontend/.env.production - REACT_APP_API_URL=https://llm-app-1-lsgm.onrender.com"
echo ""

echo "4️⃣  Environment Configuration"
echo "----------------------------------------"
echo "For Production (Vercel), go to:"
echo "  → Vercel Dashboard → cv-app project → Settings → Environment Variables"
echo "  → Add: REACT_APP_API_URL=https://llm-app-1-lsgm.onrender.com"
echo "  → Click Save & Redeploy"
echo ""

echo "🎉 Testing complete!"
