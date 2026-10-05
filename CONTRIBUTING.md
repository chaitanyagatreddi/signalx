# Contributing to SignalX

Thank you for your interest in SignalX!

---

## Prerequisites

- Python 3.10+
- pip 23+
- Playwright: run `playwright install chromium` after installing deps
- Git

---

## Local Setup

```bash
git clone https://github.com/chaitanyagatreddi/signalx.git
cd signalx
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
cp .env.example .env
# Edit .env with your actual keys
```

---

## Running the App

```bash
# Development
FLASK_DEBUG=1 python3 app.py

# Production
gunicorn -w 1 -b 0.0.0.0:7860 app:app

# Run the crawler directly
python3 github_crawler.py --keyword "vulnerability scanner" --repos 5
```

Health check: `curl http://localhost:7860/health`

---

## Project Structure

```
app.py             # Flask web server + SSE streaming
github_crawler.py  # Crawl4AI + OpenAI pipeline
requirements.txt   # PyPI dependencies
.env.example       # Env var template -- copy to .env
render.yaml        # Render deploy config
```

---

## Branching Strategy

```
main                   # production-ready only
feat/your-feature-name  # new features
fix/your-bug-name       # bug fixes
docs/your-change        # docs updates
```

---

## Commit Messages

Use Conventional Commits:

```
<type>: <short summary>
```

Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `perf`, `test`

Examples:
```
feat: add LinkedIn enrichment via Firecrawl
fix: prevent duplicate contributors in multi-repo scan
docs: update .env.example with Prospeo key
```

---

## Submitting a PR

1. Fork the repo and create your branch from `main`.
2. Make your changes with clear commit messages.
3. Ensure `python3 app.py` starts without errors.
4. If you changed `github_crawler.py`, run a local scan to verify.
5. Open a PR against `main` with a descriptive title and summary.

PR checklist:
- [ ] App runs locally without errors
- [ ] No real API keys or secrets in the diff
- [ ] `.env` is not committed (it is in `.gitignore`)
- [ ] `requirements.txt` updated if you added new PyPI packages

---

## Code Style

- Follow PEP8 for Python.
- All API keys must come from `os.environ.get()` - never hardcoded.
- Never set `debug=True` hardcoded in production code.
- Use type hints where possible.

---

Questions? Open an issue or reach out via the repo's Discussions tab.
