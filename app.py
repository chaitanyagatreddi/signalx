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

app = Flask(__name__)


@app.route("/health")
def health():
    """Lightweight healthcheck endpoint for Render / Docker probes."""
    return jsonify({
        "status": "ok",
        "uptime_s": round(time.time() - _START_TIME, 2)
    }), 200
