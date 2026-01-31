from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import asyncio
import subprocess
import json

app = FastAPI()

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
    body = await request.json()
    prompt = body.get('prompt', '') if isinstance(body, dict) else ''
    if not prompt:
        raise HTTPException(status_code=400, detail='Prompt required')

    LLM_CMD = os.environ.get('LLM_CMD')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

    if LLM_CMD:
        # run a local CLI wrapper
        # ensure prompt is safely passed
        try:
            proc = await asyncio.create_subprocess_shell(
                f'{LLM_CMD} "{prompt.replace("\"","\\\"")}"',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await proc.communicate()
            if proc.returncode != 0:
                return JSONResponse(status_code=500, content={"success": False, "error": "LLM execution failed", "details": stderr.decode('utf-8', errors='ignore')})
            return {"success": True, "response": stdout.decode('utf-8', errors='ignore')}
        except Exception as e:
            return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

    # Optional: fallback to OpenAI if key present
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
            return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

    # Default rule-based fallback
    msg = prompt.lower()
    reply = "Je ne suis pas sûr de comprendre votre question. Essayez: 'Créer un CV', 'Exporter', 'Compétences'."
    if 'créer' in msg or 'nouveau' in msg:
        reply = 'Pour créer un nouveau CV, utilisez le bouton Créer un CV.'
    if 'compétence' in msg or 'skill' in msg:
        reply = 'Compétences exemples: React, Python, SQL, Gestion de projet.'
    if 'exporter' in msg or 'export' in msg:
        reply = "Utilisez le bouton Exporter en PDF depuis la carte ou l'aperçu."
    return {"success": True, "response": reply}


# Serve static build if present
BUILD_DIR = os.path.join(os.path.dirname(__file__), 'build')
if os.path.isdir(BUILD_DIR):
    app.mount('/', StaticFiles(directory=BUILD_DIR, html=True), name='static')


@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    # If build exists, serve index.html for SPA routing
    index_path = os.path.join(BUILD_DIR, 'index.html')
    if os.path.exists(index_path):
        return HTMLResponse(open(index_path, 'r', encoding='utf-8').read())
    return JSONResponse(status_code=404, content={"detail": "Not Found"})
