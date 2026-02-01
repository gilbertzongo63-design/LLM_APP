# Render.com Backend Deployment Guide

## Quick Deploy Steps

### 1. Prepare Your Repository
Ensure your repo has:
- `requirements.txt` at the root
- `Procfile` with command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- `app/main.py` with FastAPI app

### 2. Create Service on Render

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `llm-app-backend` (or your preferred name)
   - **Environment**: `Python 3.11`
   - **Region**: Choose your region
   - **Branch**: `main` or `master`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3. Add Environment Variables

In Render Dashboard → Your Service → Environment:

```
API_KEY=your-secret-api-key-here
OPENAI_API_KEY=your-openai-key-here
OPENAI_MODEL=gpt-4
LLM_CMD=your-local-llm-command
```

### 4. Deploy

Click **"Deploy"**. Render will:
1. Clone your repo
2. Install dependencies
3. Start the service
4. Provide a URL like `https://llm-app-xxxxx.onrender.com`

### 5. Test the Deployment

```bash
# Should return status
curl https://llm-app-xxxxx.onrender.com/api/health

# Should return app info
curl https://llm-app-xxxxx.onrender.com/

# Should return sample resumes
curl https://llm-app-xxxxx.onrender.com/api/resumes
```

---

## Troubleshooting

### 404 Errors
- Ensure `main.py` is in the `app/` directory
- Verify routes exist (e.g., `/`, `/api/health`, `/api/resumes`)
- Check the Render logs: Dashboard → Your Service → Logs

### Deployment Fails
- Check `requirements.txt` syntax
- Verify Python 3.11 is available
- Look at Render build logs for errors

### Dependencies Missing
Add missing packages to `requirements.txt`:
```
fastapi>=0.95.0
uvicorn[standard]>=0.22.0
openai>=1.0.0
weasyprint>=58.0
```

### CORS Issues
FastAPI CORS is already configured in `app.main:app` for development.

---

## Using GitHub Actions to Auto-Deploy

The workflow `.github/workflows/deploy-render.yml` automatically triggers deploys when you push to `main` or `master`.

**Required GitHub Secrets** (Settings → Secrets → Actions):
- `RENDER_API_KEY` — Your Render API token (get from https://dashboard.render.com/api-tokens)
- `RENDER_SERVICE_ID` — Your service ID (visible in Render Dashboard URL)

Once set, just commit and push to trigger the deploy!

---

## Next Steps

1. Deploy frontend to Vercel → set `REACT_APP_API_URL=https://your-render-url`
2. Configure API_KEY if you need protected endpoints
3. Add your own environment variables (LLM_CMD, OPENAI_API_KEY, etc.)
4. Monitor logs in Render Dashboard
