#!/usr/bin/env python3
"""
Simple wrapper that attempts to call a local gpt4all CLI or echoes the prompt.
Set the environment variable LLM_CMD to the path of this script to enable server-side LLM calls.

Usage: llm_wrapper.py "Your prompt here"
"""
import sys
import subprocess

def call_llm(prompt: str) -> str:
    """Call local LLM or return simulated response."""
    # Try gpt4all (example). Adjust path if needed.
    try:
        # This is an example command; users must install gpt4all or similar locally.
        proc = subprocess.run(['gpt4all', '-p', prompt], capture_output=True, text=True, timeout=120)
        if proc.returncode == 0 and proc.stdout:
            return proc.stdout
    except Exception:
        pass

    # Fallback: simple echo / rule-based reply
    reply = "Réponse locale simulée: " + (prompt[:400] + ('...' if len(prompt) > 400 else ''))
    return reply


def main():
    if len(sys.argv) < 2:
        print('')
        return
    prompt = sys.argv[1]
    result = call_llm(prompt)
    print(result)


if __name__ == '__main__':
    main()
