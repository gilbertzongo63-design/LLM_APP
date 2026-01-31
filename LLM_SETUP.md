LLM Setup (local, non‑paid)
============================

This project can use a local open-source LLM instead of a paid API. The server exposes `/api/assistant` and will execute a local command specified in the `LLM_CMD` environment variable.

Quick steps to enable a basic local LLM:

1. Install a local model runtime (examples):
   - gpt4all: https://gpt4all.io/ (follow their install instructions)
   - llama.cpp / ggml based builds (various wrappers)

2. Option A — Use the provided `llm_wrapper.py`:
   - Place `llm_wrapper.py` in the project root (already included).
   - Make it executable: `chmod +x llm_wrapper.py` (Unix) or run with Python on Windows.
   - Set `LLM_CMD` to point to it. Example with PowerShell:

```powershell
$env:LLM_CMD = "python C:\\path\\to\\cv-application\\llm_wrapper.py"
npm run server
```

3. Option B — Point `LLM_CMD` to your local model's CLI (gpt4all for example):

```powershell
$env:LLM_CMD = "C:\\path\\to\\gpt4all.exe"
npm run server
```

Notes
- The included `llm_wrapper.py` tries to call `gpt4all` if available. If not, it returns a simple fallback message.
- Local models can be large and require GPU/CPU resources. Make sure you have enough disk space and RAM.
- The server executes the command you provide — be careful with permissions and security when deploying.

If you want, I can add a Docker setup that bundles a small open-source runtime, but that will increase the image size significantly.
