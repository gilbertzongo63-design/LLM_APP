# Deployment Guide

This document explains how to deploy the project: backend (FastAPI) to Render and frontend (React) to Vercel. It includes required environment variables, system packages for server-side PDF generation (WeasyPrint), recommended Dockerfile, and local testing steps.

**Files referenced**
- Backend: [Createur-CV-lettre_Motivation-app/main.py](Createur-CV-lettre_Motivation-app/main.py)
- Python deps: [Createur-CV-lettre_Motivation-app/requirements.txt](Createur-CV-lettre_Motivation-app/requirements.txt)
- Procfile: [Createur-CV-lettre_Motivation-app/Procfile](Createur-CV-lettre_Motivation-app/Procfile)
- Frontend: [Createur-CV-lettre_Motivation-app/package.json](Createur-CV-lettre_Motivation-app/package.json)
- Frontend PDF fallback/client code: [Createur-CV-lettre_Motivation-app/src/utils/PdfExportService.js](Createur-CV-lettre_Motivation-app/src/utils/PdfExportService.js)

---

## Summary
- Backend: FastAPI app in `main.py`. Optional server-side PDF endpoint at `/api/generate-pdf` uses WeasyPrint when available.
- Frontend: Create React App in the same repository. When `REACT_APP_API_URL` is set, frontend tries server-side PDF generation first and falls back to client-side export.

## Environment variables

- Backend (Render):
  - `API_KEY` (optional but recommended) — API key required by `/api/generate-pdf` when set.
  - `LLM_CMD` (optional) — path/command to a local CLI LLM wrapper if you use a local LLM.
  - `OPENAI_API_KEY` (optional) — used as fallback if `LLM_CMD` is not set.
  - `OPENAI_MODEL` (optional) — model name for OpenAI fallback.

- Frontend (Vercel):
  - `REACT_APP_API_URL` — URL of the backend (no trailing slash), e.g. `https://my-backend.onrender.com`.
  - `REACT_APP_SERVER_API_KEY` (optional) — if backend requires `API_KEY`, set the same value here.

## Backend: Render (recommended)

Two options:

1) Quick deploy (no custom system packages):
   - Use Render web service that runs the FastAPI app via the Procfile: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
   - Drawback: WeasyPrint may fail because it requires OS libraries (libcairo, libpango, etc.). If you do not need server-side WeasyPrint, client-side fallback will still work.

2) Docker (recommended if you want server-side PDFs with WeasyPrint):
   - Create a Docker image that installs system deps required by WeasyPrint.
   - Example Dockerfile (minimal, build on top of python slim):

```Dockerfile
FROM python:3.11-slim
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libffi-dev \
    libgdk-pixbuf2.0-0 \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]
```

Render can deploy a Dockerfile directly — use that if you need WeasyPrint.

Render service settings
- Environment: `API_KEY` (if you want to protect the PDF endpoint), and optionally `LLM_CMD` / `OPENAI_API_KEY`.
- Start Command: Use Procfile or set `uvicorn main:app --host 0.0.0.0 --port $PORT`.

## Frontend: Vercel

Option A — Quick manual import (recommended):

1. Import the repository in Vercel (GitHub) and set the **Root Directory** to `Createur-CV-lettre_Motivation-app`.
2. Build Command: `npm run build` (or `npm ci && npm run build`).
3. Output Directory: `build`.
4. Environment variables (Project Settings):
   - `REACT_APP_API_URL` = `https://<your-backend-render-url>` (optional)
   - `REACT_APP_SERVER_API_KEY` = `Render17g415` (optional — note: this will be bundled client-side)

Notes: The app will call the server `/api/generate-pdf` endpoint automatically if `REACT_APP_API_URL` is set; otherwise it uses client-side export.

Serverless assistant on Vercel
- A lightweight serverless assistant is available at `/api/assistant` when you deploy the frontend to Vercel (no backend required). It provides a rule-based fallback and optionally integrates with OpenAI if you set `OPENAI_API_KEY` in Vercel environment variables.
- To enable OpenAI in Vercel, add `OPENAI_API_KEY` and (optionally) `OPENAI_MODEL` in Project Settings → Environment Variables.
- This is useful when you do not want to run a backend service but still want the assistant to work publicly.

Option B — Automated deploy via GitHub Actions (CI):

1. Add the following secrets in your GitHub repository (Settings → Secrets → Actions):
   - `VERCEL_TOKEN` — your Vercel personal token
   - `VERCEL_ORG_ID` — the Vercel organization id for your account
   - `VERCEL_PROJECT_ID` — the Vercel project id (you can find it in the Vercel dashboard)
2. The repository already includes a GitHub Actions workflow at `.github/workflows/deploy-vercel.yml` which will build and deploy the frontend to Vercel on each push to `main`.

How to get the Vercel secrets:
- `VERCEL_TOKEN`: In Vercel Dashboard → Account Settings → Tokens → Create Token
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`: In Vercel Dashboard → Project Settings → General → you will find the IDs

Security note: Do not place `API_KEY` (Render) directly in the Vercel project environment unless you accept that it becomes part of the client bundle (public). Prefer server-only secrets.

## Local testing

1. Backend (FastAPI)
```powershell
# from repo root
cd Createur-CV-lettre_Motivation-app
# set API_KEY in the environment for testing (PowerShell)
$env:API_KEY = "mytestkey"
pip install -r requirements.txt
uvicorn main:app --reload
```

2. Frontend (React)
```bash
cd Createur-CV-lettre_Motivation-app
npm install
# create a .env file or set vars in your shell
# .env content (development):
# REACT_APP_API_URL=http://localhost:8000
# REACT_APP_SERVER_API_KEY=mytestkey
npm start
```

3. Test: open the app, create a CV or cover letter, press Export PDF. If `REACT_APP_API_URL` is set and backend running, the client will call `/api/generate-pdf`. If backend is not available, pdf is produced client-side.

## Troubleshooting

- WeasyPrint fails on Render: install system packages (see Dockerfile) or switch to `wkhtmltopdf` or rely on client-side export.
- 403/401 on `/api/generate-pdf`: check `API_KEY` on backend and `REACT_APP_SERVER_API_KEY` on frontend match (header `x-api-key`).
- CORS errors: the FastAPI app sets permissive CORS for development; for production, tighten origins in `main.py`.

## Alternatives

- Use wkhtmltopdf or a cloud PDF service if you prefer not to manage system libs.
- Deploy both frontend and backend together using Docker Compose or a single Docker image that serves static files and the FastAPI app.

---

If you want, I can:
- Create a production-ready Dockerfile and test build here.
- Add Render/Vercel step-by-step screenshots or a CI workflow (GitHub Actions) to automate deployments.

## Docker build note
I added a `Dockerfile` that performs a multi-stage build: it compiles the React app then creates a Python runtime image that includes the frontend `build/` directory. You can build it locally with:

```powershell
cd Createur-CV-lettre_Motivation-app
docker build -t llm_app:prod .
```

If Docker is not available locally, use your CI or Render's Docker deploy option. The image installs WeasyPrint system dependencies — the build may take several minutes.
# 📦 Guide de Déploiement Complet

## Options de Déploiement

### Option 1 : Vercel (Frontend) + Heroku (Backend) ⭐ Recommandé

#### Étape 1 : Préparer le Frontend pour Vercel

```bash
npm run build
```

#### Étape 2 : Créer un compte sur Vercel
- Visitez https://vercel.com
- Connectez-vous avec GitHub
- Importez votre repository

#### Étape 3 : Configurer les variables d'environnement sur Vercel
```
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com
REACT_APP_ENV=production
```

#### Étape 4 : Déployer le Backend sur Heroku

```bash
# Installer Heroku CLI
# Windows: Télécharger depuis https://devcenter.heroku.com/articles/heroku-cli

# Se connecter
heroku login

# Créer une app
heroku create your-app-name

# Configurer les variables
heroku config:set REACT_APP_API_URL=https://your-app-name.herokuapp.com
heroku config:set REACT_APP_ENV=production
heroku config:set NODE_ENV=production

# Déployer
git push heroku main

# Vérifier les logs
heroku logs --tail
```

---

### Option 2 : Docker + Any VPS

#### Prérequis
- Docker installé
- VPS avec Docker (DigitalOcean, AWS, Linode, etc.)

#### Build Docker
```bash
docker build -t cv-app .
```

#### Run localement
```bash
docker run -p 5000:5000 cv-app
```

#### Déployer sur VPS
```bash
# 1. SSH sur votre VPS
ssh root@your-vps-ip

# 2. Cloner le repo
git clone https://github.com/yourname/cv-application.git
cd cv-application

# 3. Lancer avec docker-compose
docker-compose up -d

# 4. Vérifier
curl http://localhost:5000/api/health
```

---

### Option 3 : Railway.app

#### Étape 1 : Connecter votre GitHub
- Visitez https://railway.app
- Connectez votre GitHub

#### Étape 2 : Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez votre repository

#### Étape 3 : Configurer les variables
```
REACT_APP_API_URL=https://your-railway-app.railway.app
REACT_APP_ENV=production
```

#### Étape 4 : Déployer
- Railway déploiera automatiquement depuis `main`

---

### Option 4 : Render.com

#### Étape 1 : Créer un Web Service
- Visitez https://render.com
- Cliquez sur "New +"
- Sélectionnez "Web Service"
- Connectez votre GitHub

#### Étape 2 : Configuration
```
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

#### Étape 3 : Variables d'environnement
```
REACT_APP_API_URL=https://your-app.onrender.com
REACT_APP_ENV=production
```

---

### Option 5 : AWS (Complet)

#### Frontend avec S3 + CloudFront

```bash
# 1. Build
npm run build

# 2. Créer bucket S3
aws s3 mb s3://my-cv-app

# 3. Upload
aws s3 sync build/ s3://my-cv-app --delete

# 4. Créer CloudFront distribution pour HTTPS
```

#### Backend avec Elastic Beanstalk

```bash
# 1. Installer EB CLI
pip install awsebcli

# 2. Initialiser
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" cv-app

# 3. Déployer
eb create cv-app-env
eb deploy

# 4. Configurer les variables
eb setenv REACT_APP_API_URL=https://cv-app-env.elasticbeanstalk.com
```

---

## ✅ Checklist de Déploiement

- [ ] `.env` configuré avec les bonnes URLs
- [ ] `package.json` à jour
- [ ] `npm run build` fonctionne sans erreurs
- [ ] `src/data/Resume.csv` existe
- [ ] Tests en local réussis
- [ ] Git configuré et commits prêts
- [ ] Domaine custom configuré (optionnel)
- [ ] HTTPS activé
- [ ] Variables d'environnement définies
- [ ] Logs configurés
- [ ] Backup des données CSV

---

## 🔒 Sécurité en Production

### Fichier .env pour production

Ne jamais committer `.env` ! Utiliser les secrets du platform :

```bash
# Heroku
heroku config:set VARIABLE=value

# Vercel
vercel env add REACT_APP_API_URL

# GitHub Secrets (pour CI/CD)
# Settings > Secrets > New repository secret
```

### Headers de sécurité

Ajouter dans `server.js` :
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Rate Limiting

```bash
npm install express-rate-limit
```

---

## 📊 Monitoring

### Heroku
```bash
heroku logs --tail
heroku metrics
```

### Railway/Render
- Dashboard intégré
- Alertes email

### Docker
```bash
docker logs cv-app
docker stats cv-app
```

---

## 🔄 CI/CD avec GitHub Actions

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

---

## 🚨 Troubleshooting

### Erreur "Port déjà utilisé"
```bash
# Trouver l'app qui utilise le port
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

### API non accessible
```bash
# Vérifier la santé
curl https://your-api.com/api/health

# Vérifier les logs
heroku logs --tail
```

### Build failure
```bash
# Voir les logs détaillés
heroku logs --tail --app your-app-name

# Redéployer après correction
git push heroku main
```

---

## 📞 Support

- **Heroku Support** : https://help.heroku.com
- **Vercel Docs** : https://vercel.com/docs
- **Railway Docs** : https://docs.railway.app
- **Docker Docs** : https://docs.docker.com

---

## ✅ Préparation rapide pour Vercel (FR)
Suivez ces étapes pour déployer uniquement le frontend (gratuit, sans carte) et activer l'assistant serverless :

1. Sur Vercel, cliquez sur **Import Project** → **From Git Repository** → choisissez votre repo.
2. **Root Directory** : laissez vide (racine du repo) — le projet contient `package.json` à la racine.
3. **Build Command** : `npm run build`
4. **Output Directory** : `build`
5. **Environment Variables** (optionnel) :
   - `REACT_APP_API_URL` = `https://<votre-backend>` (laisser vide pour frontend-only)
   - N'ajoutez **pas** de secret serveur public comme `REACT_APP_SERVER_API_KEY` si vous voulez garder la clé privée côté backend.
6. Cliquez sur **Deploy** → une URL publique sera disponible, ex. `https://votre-projet.vercel.app`.
7. Vérifiez `https://<votre-projet>.vercel.app/api/assistant` pour confirmer que la fonction serverless `api/assistant.js` est active.

Conseil : si vous préférez que Vercel gère directement la build+API, gardez l'arborescence actuelle (`api/assistant.js` à la racine) — `vercel.json` (présent) configure le build et l'API.

---

**Dernière mise à jour** : Janvier 2026
