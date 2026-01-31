#!/usr/bin/env python3
"""
LLM wrapper supporting local gpt4all CLI, OpenAI API, or rule-based fallback.
Set environment variables:
  - LLM_CMD: path to local LLM CLI (gpt4all)
  - OPENAI_API_KEY: for OpenAI ChatGPT responses
"""
import sys
import os
import subprocess

def call_llm(prompt: str) -> str:
    """Call LLM with priority: OpenAI > Local CLI > Fallback."""
    # Try OpenAI first if key is available
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            import openai
            openai.api_key = openai_key
            resp = openai.ChatCompletion.create(
                model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
                messages=[{"role": "user", "content": prompt}],
                max_tokens=512,
            )
            return resp.choices[0].message.content
        except Exception as e:
            print(f"OpenAI error: {e}", file=sys.stderr)
    
    # Try local LLM CLI if configured
    llm_cmd = os.getenv("LLM_CMD")
    if llm_cmd:
        try:
            proc = subprocess.run([llm_cmd, "-p", prompt], capture_output=True, text=True, timeout=120)
            if proc.returncode == 0 and proc.stdout:
                return proc.stdout
        except Exception as e:
            print(f"Local LLM error: {e}", file=sys.stderr)

    # Fallback: rule-based response
    msg = prompt.lower()
    if 'créer' in msg or 'nouveau' in msg:
        return "Pour créer un nouveau CV, utilisez le bouton Créer un CV."
    if 'compétence' in msg or 'skill' in msg:
        return "Compétences exemples: React, Python, SQL, Gestion de projet."
    if 'exporter' in msg or 'export' in msg:
        return "Utilisez le bouton Exporter en PDF depuis la carte ou l'aperçu."
    
    return "Réponse simulée: " + (prompt[:400] + ('...' if len(prompt) > 400 else ''))


def main():
    if len(sys.argv) < 2:
        print('')
        return
    prompt = sys.argv[1]
    result = call_llm(prompt)
    print(result)


if __name__ == '__main__':
    main()
