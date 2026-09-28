#!/usr/bin/env python3
"""
signalx — Standalone Web App
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
import datetime

try:
    from flask import Flask, render_template_string, request, Response, jsonify
except ImportError:
    print("pip3 install flask")
    sys.exit(1)

app = Flask(__name__)


@app.route("/health")
def health():
    """Lightweight health check for Render / load balancers.
    Returns 200 JSON in <1ms with no DB calls.
    """
    return jsonify({
        "status": "ok",
        "version": "1.0",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    }), 200

