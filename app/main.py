from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import asyncio
import subprocess
import json
from .llm_wrapper import call_llm

app = FastAPI(
    title="CV & Lettre de Motivation API",
    description="API pour générer des CV et lettres de motivation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample resumes (keeps API working without the CSV)
SAMPLE_RESUMES = [
    {
        "id": "sample-1",
        "title": "Développeur Frontend",
        "summary": "Développeur React spécialisé en interfaces performantes.",
        "skills": ["React", "TypeScript", "CSS"],
        "experience": "3 years",
        "category": "IT",
        "fullText": "Sample resume 1 full text",
        "html": ""
    },
    {
        "id": "sample-2",
        "title": "Data Analyst Junior",
        "summary": "Analyste de données avec Excel et SQL.",
        "skills": ["SQL", "Python", "Tableau"],
        "experience": "2 years",
        "category": "Data",
        "fullText": "Sample resume 2 full text",
        "html": ""
    }
]


# ✅ Route racine pour accueil et infos API
@app.get("/")
def read_root():
    """Root endpoint - returns API status and available endpoints"""
    return {
        "message": "API Backend pour CV et Lettre de Motivation",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "resumes": "/api/resumes",
            "assistant": "/api/assistant",
            "generate_pdf": "/api/generate-pdf"
        }
    }


async def _validate_api_key(request: Request):
    """Allow an optional API key to protect endpoints. Set env `API_KEY` to enable."""
    expected = os.environ.get('API_KEY')
    if not expected:
        return
    key = request.headers.get('x-api-key') or request.query_params.get('api_key')
    if not key or key != expected:
        raise HTTPException(status_code=401, detail='Invalid API Key')




@app.get('/api/health')
async def health():
    return {"status": "ok", "timestamp": asyncio.get_event_loop().time()}


@app.get('/api/resumes')
async def get_resumes():
    return {"success": True, "count": len(SAMPLE_RESUMES), "data": SAMPLE_RESUMES}


@app.get('/api/resumes/{resume_id}')
async def get_resume(resume_id: str):
    for r in SAMPLE_RESUMES:
        if r.get('id') == resume_id:
            return {"success": True, "data": r}
    raise HTTPException(status_code=404, detail="Resume not found")


@app.post('/api/assistant')
async def assistant(request: Request):
    """
    Assistant IA - Endpoint pour générer des suggestions et réponses
    """
    try:
        body = await request.json()
        prompt = body.get('prompt', '') if isinstance(body, dict) else ''
        
        if not prompt:
            raise HTTPException(status_code=400, detail='Prompt required')

        LLM_CMD = os.environ.get('LLM_CMD')
        OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

        # Try local LLM first
        if LLM_CMD:
            try:
                safe_prompt = prompt.replace('"', '\\"')
                proc = await asyncio.create_subprocess_shell(
                    f'{LLM_CMD} "{safe_prompt}"',
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                stdout, stderr = await proc.communicate()
                if proc.returncode == 0:
                    response_text = stdout.decode('utf-8', errors='ignore').strip()
                    return {
                        "success": True,
                        "response": response_text if response_text else "Réponse générée par LLM local"
                    }
            except Exception as e:
                print(f"❌ LLM local error: {e}")
                # Fall through to OpenAI or default

        # Try OpenAI fallback
        if OPENAI_API_KEY:
            try:
                import openai
                openai.api_key = OPENAI_API_KEY
                resp = openai.ChatCompletion.create(
                    model=os.environ.get('OPENAI_MODEL', 'gpt-3.5-turbo'),
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=512,
                )
                text = resp.choices[0].message.content
                return {"success": True, "response": text}
            except Exception as e:
                print(f"❌ OpenAI error: {e}")
                # Fall through to default

        # Rule-based fallback
        msg = prompt.lower()
        reply = "Je ne suis pas sûr de comprendre votre question. "
        
        if 'créer' in msg or 'nouveau' in msg or 'cv' in msg:
            reply += "Utilisez le bouton 'Créer un CV' pour démarrer."
        elif 'compétence' in msg or 'skill' in msg or 'talent' in msg:
            reply += "Compétences recommandées : Communication, Gestion de projet, Résolution de problèmes, Leadership, Adaptabilité."
        elif 'exporter' in msg or 'export' in msg or 'pdf' in msg:
            reply += "Utilisez le bouton 'Exporter en PDF' depuis l'aperçu ou la carte du CV."
        elif 'lettre' in msg or 'motivation' in msg:
            reply += "Cliquez sur 'Créer une lettre de motivation' pour générer une nouvelle lettre."
        elif 'aide' in msg or 'help' in msg:
            reply += "Je peux vous aider avec : créer un CV, générer une lettre, exporter en PDF, ou ajouter des compétences."
        else:
            reply += "Essayez : 'Créer un CV', 'Quelles compétences ajouter?', 'Comment exporter en PDF?'"
        
        return {"success": True, "response": reply}
        
    except Exception as e:
        print(f"❌ Assistant error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e), "response": "Erreur du serveur assistant"}
        )


@app.post('/api/generate-pdf')
async def generate_pdf(request: Request, _=Depends(_validate_api_key)):
    """Generate a PDF from provided HTML payload and return it as an attachment.

    Body JSON: { "html": "<html>...</html>", "filename": "mon-cv.pdf" }
    If `API_KEY` env var is set, client must provide header `x-api-key` with the same value.
    """
    body = await request.json()
    html = body.get('html') or body.get('content')
    filename = body.get('filename') or 'export.pdf'
    if not html:
        raise HTTPException(status_code=400, detail='HTML content required')
    try:
        # Import here to avoid hard dependency until this endpoint is used
        from weasyprint import HTML
        pdf_bytes = HTML(string=html).write_pdf()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'PDF generation failed: {e}')
    return Response(content=pdf_bytes, media_type='application/pdf', headers={
        'Content-Disposition': f'attachment; filename="{filename}"'
    })


# Serve static build if present (mount on /static, not root)
BUILD_DIR = os.path.join(os.path.dirname(__file__), '..', 'build')
if os.path.isdir(BUILD_DIR):
    app.mount('/static', StaticFiles(directory=BUILD_DIR), name='static')
