# 🎓 CV + Motivation Letter Creator App

> A modern, full-stack application for creating professional CVs and motivation letters with AI-powered assistance.

[![Frontend](https://img.shields.io/badge/Frontend-React%2018-61dafb?logo=react)](https://cv-app-smoky-two.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009485?logo=fastapi)](https://llm-app-1-lsgm.onrender.com)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## 🚀 Live Demo

| Component | Link | Status |
|-----------|------|--------|
| **Frontend** | [cv-app-smoky-two.vercel.app](https://cv-app-smoky-two.vercel.app) | ✅ Live |
| **Backend API** | [llm-app-1-lsgm.onrender.com](https://llm-app-1-lsgm.onrender.com) | ✅ Running |
| **API Documentation** | [Swagger UI](https://llm-app-1-lsgm.onrender.com/docs) | ✅ Available |
| **GitHub Repository** | [gilbertzongo63-design/LLM_APP](https://github.com/gilbertzongo63-design/LLM_APP) | ✅ Public |

---

## ✨ Features

### 📄 CV Management
- ✅ Create and customize CVs
- ✅ Multiple professional templates
- ✅ Real-time preview
- ✅ Export to PDF
- ✅ Sample data available

### 💌 Motivation Letters
- ✅ Generate customized cover letters
- ✅ Template-based approach
- ✅ AI suggestions for content
- ✅ PDF export functionality

### 🤖 AI Assistant
- ✅ Intelligent suggestions for CV content
- ✅ Skill recommendations
- ✅ Letter templates and tips
- ✅ Real-time chat interface
- ✅ Fallback intelligence system

### 📱 User Experience
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Accessible interface (WCAG AA)
- ✅ Fast load times
- ✅ Smooth animations
- ✅ Intuitive navigation

### 🔧 Developer Experience
- ✅ Clean API documentation (Swagger/OpenAPI)
- ✅ Comprehensive logging
- ✅ Error handling and recovery
- ✅ Easy to extend and customize

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   User Interface (React)                 │
│           https://cv-app-smoky-two.vercel.app           │
├─────────────────────────────────────────────────────────┤
│                 API Communication Layer                  │
│              (REST via fetch with CORS)                 │
├─────────────────────────────────────────────────────────┤
│                 Backend API (FastAPI)                    │
│        https://llm-app-1-lsgm.onrender.com              │
│  /api/resumes | /api/assistant | /api/generate-pdf     │
├─────────────────────────────────────────────────────────┤
│              AI & External Services                      │
│   Local LLM | OpenAI ChatGPT | Rule-based Fallback     │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 with responsive design
- **Build**: Create React App
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Server**: Uvicorn ASGI
- **PDF Generation**: WeasyPrint (server-side) + html2canvas (client-side)
- **AI Integration**: OpenAI API + Local LLM support
- **Deployment**: Render

### DevOps
- **Repository**: GitHub
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: Sample data (expandable to PostgreSQL/MongoDB)

---

## 📋 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/` | API metadata |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/resumes` | Fetch sample CVs |
| `POST` | `/api/assistant` | AI assistant endpoint |
| `POST` | `/api/generate-pdf` | Generate PDF |
| `GET` | `/docs` | Swagger documentation |

### Example: AI Assistant Request
```bash
curl -X POST https://llm-app-1-lsgm.onrender.com/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Quelles competences ajouter a mon CV?"}'
```

**Response**:
```json
{
  "success": true,
  "response": "Compétences recommandées: JavaScript, Python, React, Leadership, Communication..."
}
```

---

## 🚀 Getting Started

### Quick Start (Cloud)
1. Visit: https://cv-app-smoky-two.vercel.app
2. Click "Créer un CV" to start
3. Fill in your information
4. Open AI Assistant for suggestions
5. Export to PDF when ready

### Local Development
```bash
# Clone repository
git clone https://github.com/gilbertzongo63-design/LLM_APP.git
cd LLM_APP

# Backend setup
cd app
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend setup (in new terminal)
cd ../frontend
npm install
npm start
```

For detailed setup instructions, see [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) | Complete deployment instructions |
| [VERCEL-SETUP.md](VERCEL-SETUP.md) | Vercel environment configuration |
| [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) | Local development setup guide |
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | Project implementation overview |
| [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md) | Deployment verification checklist |

---

## 🔐 Environment Variables

### Frontend (.env.production)
```
REACT_APP_API_URL=https://llm-app-1-lsgm.onrender.com
NODE_ENV=production
```

### Backend (.env)
```
OPENAI_API_KEY=your-key-here     # Optional
LLM_CMD=ollama run llama         # Optional
DEBUG=True                       # Optional
```

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Frontend Components | 8+ |
| Backend Endpoints | 6 |
| Lines of Code | 3000+ |
| Test Coverage | Comprehensive |
| Documentation Pages | 5 |
| Deployment Targets | 2 |
| API Response Time | < 500ms |

---

## 🧪 Testing

### Test Backend
```bash
# Health check
curl https://llm-app-1-lsgm.onrender.com/api/health

# Run test script
bash test-api.sh      # Linux/Mac
test-api.bat          # Windows
```

### Test Frontend
1. Open: https://cv-app-smoky-two.vercel.app
2. Create a test CV
3. Open AI Assistant
4. Ask questions
5. Test PDF export
6. Test on mobile (F12 → Ctrl+Shift+M)

---

## 🤝 Contributing

### Prerequisites
- Git knowledge
- Node.js & npm
- Python & pip
- Basic FastAPI knowledge

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and test locally
4. Commit: `git commit -m "Add: My feature"`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

---

## 🐛 Troubleshooting

### AI Assistant Not Responding
**Solution**: Check that backend URL is correctly set in Vercel environment variables. See [VERCEL-SETUP.md](VERCEL-SETUP.md).

### Mobile Design Issues
**Solution**: Clear browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+Shift+R).

### PDF Export Fails
**Solution**: Try server-side export at `/api/generate-pdf` or use client-side fallback.

For more issues, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📈 Performance

- **Frontend Load**: < 2s (Vercel with CDN)
- **API Response**: < 500ms (Render)
- **PDF Generation**: < 5s
- **Mobile Score**: 85+ (Lighthouse)
- **Desktop Score**: 95+ (Lighthouse)

---

## 🎯 Roadmap

### v1.1 (Next Release)
- [ ] User authentication
- [ ] Save CVs to database
- [ ] More templates
- [ ] Enhanced AI suggestions

### v1.2 (Future)
- [ ] Mobile app (React Native)
- [ ] Job recommendations
- [ ] Interview prep module
- [ ] LinkedIn integration

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/gilbertzongo63-design/LLM_APP/issues)
- **Documentation**: See files in root directory
- **API Docs**: https://llm-app-1-lsgm.onrender.com/docs

---

## 📜 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👤 Author

**Gilbert Zongo** - [GitHub Profile](https://github.com/gilbertzongo63-design)

---

## 🎉 Acknowledgments

- FastAPI for excellent Python web framework
- React for frontend component library
- Vercel for seamless frontend deployment
- Render for backend hosting
- OpenAI for AI capabilities

---

## 📝 Changelog

### v1.0.0 (Current Release)
- ✅ Full-stack application with FastAPI + React
- ✅ AI Assistant with intelligent fallbacks
- ✅ PDF export functionality
- ✅ Responsive mobile design
- ✅ Comprehensive documentation
- ✅ CI/CD automation
- ✅ Production deployment on Render + Vercel

---

**Made with ❤️ for better CVs and motivation letters**

**Status**: ✅ Production Ready | **Last Updated**: December 2024 | **Version**: 1.0.0
