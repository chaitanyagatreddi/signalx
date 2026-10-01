#!/usr/bin/env python3
"""
Toplyne — Standalone Web App
===================================
Dev contributor crawler with Browserbase + gpt-4o-mini analysis.
Crawls repos, profiles, and publicly available emails.
"""

import asyncio
import json
import os
import sys
import queue
import threading
import time

_START_TIME = time.time()

try:
    from flask import Flask, render_template_string, request, Response, jsonify
except ImportError:
    print("pip3 install flask")
    sys.exit(1)

app = Flash(__name__)


@app.route("/health")
def health():
    """Lightweight healthcheck endpoint for Render / Docker probes."""
    return jsonify({
        "status": "ok",
        "uptime_s": round(time.time() - _START_TIME, 2)
    }), 200


GITHUB_RADAR_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Toplyne | Dev Contributors</title>
</head>
<body>
<h1>П��️ Toplyne</h1>
<p>Please use the full app.py from the main branch.</p>
</body>
</html>"""


@app.route("/")
def index():
    return GITHUB_RADAR_HTML


@app.route("/api/capture-email", methods=["POST"])
def capture_email():
    from flask import request, jsonify
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip()
    if email:
        import datetime
        with open("leads.csv", "a") as f:
            f.write(f"{datetime.datetime.utcnow().isoformat()},{email}\n")
    return jsonify({"ok": True})


@app.route("/og.png")
def og_image():
    from flask import send_from_directory
    return send_from_directory(os.path.dirname(__file__), "og.png")


@app.route("/api/github/stream")
def github_stream():
    keyword = request.args.get("keyword", "")
    github_url = request.args.get("url", "").strip()
    max_repos = int(request.args.get("max_repos", 5))
    max_contributors = int(request.args.get("max_contributors", 8))
    sources_raw = request.args.get("sources", "github,website,stackoverflow,websearch")
    enabled_sources = set(s.strip() for s in sources_raw.split(",") if s.strip())

    if not keyword and not github_url:
        keyword = "vulnerability scanner"

    q = queue.Queue()

    def yield_event(type_, message, data=None):
        payload = {"type": type_, "message": message, "data": data or {}}
        q.put(json.dumps(payload))

    def run_crawler():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            from github_crawler import GitHubRadarAgent
            agent = GitHubRadarAgent(
                keyword=keyword,
                github_url=github_url,
                max_repos=max_repos,
                max_contributors=max_contributors,
                enabled_sources=enabled_sources,
            )
            loop.run_until_complete(agent.run(yield_event=yield_event))
        except Exception as e:
            import traceback
            yield_event("error", f"{str(e)}\n{traceback.format_exc()}")
        finally:
            q.put(None)
            loop.close()

    thread = threading.Thread(target=run_crawler, daemon=True)
    thread.start()

    def generate():
        while True:
            item = q.get()
            if item is None:
                break
            yield f"data: {item}\n\n"

    return Response(generate(), mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"\n🛡️  Toplyne")
    print(f"   http://localhost:{port}")
    print(f"   GitHub Token: {'✅' if os.environ.get('GITHUB_TOKEN') else '❌'}")
    print(f"   OpenAI: {'✅' if os.environ.get('OPENAI_API_KEY') else '��'}")
    # debug=True removed -- use FLASK_DEBUG=1 env var for development only
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
