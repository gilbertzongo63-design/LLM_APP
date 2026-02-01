# 🔧 LOCAL DEVELOPMENT SETUP

## Prerequisites

- **Node.js** 16+ (https://nodejs.org)
- **Python** 3.9+ (https://www.python.org)
- **Git** (https://git-scm.com)
- **curl** or **Postman** for testing APIs

## Backend Setup

### 1. Clone Repository
```bash
git clone https://github.com/gilbertzongo63-design/LLM_APP.git
cd LLM_APP
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
cd app
pip install -r requirements.txt
```

**Dependencies**:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `python-multipart` - Form data handling
- `aiofiles` - Async file operations
- `weasyprint` - PDF generation (optional)
- `openai` - ChatGPT integration (optional)

### 4. Configure Environment Variables (Optional)
```bash
# Create .env file in app directory
OPENAI_API_KEY=sk-your-key-here
LLM_CMD=your-local-llm-command
```

### 5. Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Output should show:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 6. Verify Backend
Open in browser: http://localhost:8000/docs

You should see Swagger UI with all endpoints documented.

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- React 18
- React Router (for navigation)
- html2pdf.js (for PDF export)
- And other dependencies

### 3. Environment Configuration
The `.env.local` file already has:
```
REACT_APP_API_URL=http://localhost:8000
```

### 4. Start Development Server
```bash
npm start
```

This will:
- Start development server on http://localhost:3000
- Open browser automatically
- Enable hot-reloading (changes update instantly)

### 5. Build for Production
```bash
npm run build
```

This creates optimized build in `frontend/build/` directory.

---

## Testing Workflow

### 1. Backend API Testing

#### Using curl:
```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test resumes endpoint
curl http://localhost:8000/api/resumes

# Test AI assistant
curl -X POST http://localhost:8000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Quelles competences ajouter?"}'
```

#### Using Postman:
1. Import collection or create requests manually
2. Base URL: `http://localhost:8000`
3. Test each endpoint with different prompts

### 2. Frontend Testing

1. Open http://localhost:3000
2. Open DevTools (F12)
3. Check Console for logs
4. Test features:
   - Create CV
   - Add resume data
   - Open AI Assistant
   - Ask questions
   - Export to PDF

### 3. Integration Testing

**Test 1: Full CV Creation Flow**
1. Click "Créer un CV"
2. Fill form completely
3. Submit
4. Verify resume appears in list
5. Click "Aperçu" to view

**Test 2: AI Assistant**
1. Open AI Assistant button
2. Type question: "Quelles competences?"
3. Should see response from backend
4. Check console logs for API calls

**Test 3: PDF Export**
1. Open resume preview
2. Click "Exporter en PDF"
3. Should download PDF file
4. Open PDF to verify content

**Test 4: Responsive Design**
1. Press F12 (DevTools)
2. Press Ctrl+Shift+M (Device Toggle)
3. Test mobile sizes: 320px, 480px, 768px, 1024px
4. Verify all elements are visible and functional

---

## Common Development Tasks

### Adding a New Feature

1. **Create branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes**
3. **Test locally**:
   ```bash
   npm start         # Frontend
   uvicorn ...       # Backend
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "Add: My new feature"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/my-feature
   ```

### Debugging Backend

**View logs:**
```bash
# Terminal where uvicorn is running shows:
- INFO logs for requests
- ERROR logs for exceptions
- Custom print() statements
```

**Enable verbose logging:**
```bash
# Add to main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Debugging Frontend

**Console logs:**
```javascript
// In JavaScript files
console.log('🔗 Debug message:', data);
console.error('❌ Error:', error);
```

**React DevTools:**
1. Install React DevTools extension
2. Open DevTools → Components tab
3. Inspect component state and props
4. Trace re-renders

### Clearing Cache & Rebuilding

```bash
# Frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start

# Backend
pip cache purge
python -m venv venv --clear
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
```

---

## Environment Variables Reference

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true          # Optional: enable debug logs
```

### Backend (app/.env)
```
OPENAI_API_KEY=sk-...         # Optional: for ChatGPT
LLM_CMD=ollama run llama      # Optional: for local LLM
DEBUG=True                    # Optional: verbose logging
```

---

## Project Structure

```
LLM_APP/
├── app/
│   ├── main.py              # FastAPI application
│   ├── llm_wrapper.py        # LLM utilities
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Main component
│   │   ├── config.js        # API configuration
│   │   ├── components/      # React components
│   │   └── services/        # API services
│   ├── package.json         # NPM dependencies
│   └── .env.local          # Development config
├── .github/workflows/       # CI/CD automation
└── README.md               # Project documentation
```

---

## Troubleshooting

### Issue: Backend won't start
```
Error: Address already in use

Solution:
# Kill existing process on port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Issue: Frontend won't connect to backend
```
CORS error in console

Solution:
1. Ensure backend is running on http://localhost:8000
2. Check REACT_APP_API_URL in .env.local
3. Verify backend CORS settings in app/main.py
4. Restart frontend: npm start
```

### Issue: AI Assistant not responding
```
Console shows: "Error contacting AI service"

Solution:
1. Check if backend is running
2. Test directly: curl http://localhost:8000/api/assistant
3. Check browser console for detailed error
4. Check backend logs for exceptions
```

### Issue: PDF export fails
```
Solution:
1. Check if weasyprint is installed: pip list | grep weasyprint
2. May need system dependencies (Windows/Mac/Linux specific)
3. Verify /api/generate-pdf endpoint is working
4. Check client-side fallback (html2canvas + jsPDF)
```

---

## Running in Production Mode

### Build Frontend
```bash
cd frontend
npm run build
# Creates optimized build in frontend/build/
```

### Test Production Build Locally
```bash
# Using serve package
npm install -g serve
serve -s build -l 3000
```

### Deploy Backend
```bash
# Using Heroku
heroku login
heroku create cv-app-backend
git push heroku main

# Using Render (configured)
# Automatic deployment on push to master
```

---

## Performance Tips

### Frontend Optimization
- Use React DevTools Profiler to identify slow renders
- Implement code splitting for large components
- Use lazy loading for routes
- Optimize images and assets

### Backend Optimization
- Use async/await for I/O operations
- Implement caching for frequent requests
- Profile with Py-Spy for performance issues
- Monitor database queries

---

## Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Uvicorn**: https://www.uvicorn.org
- **npm Docs**: https://docs.npmjs.com

---

**Happy Coding! 🚀**
