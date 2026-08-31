# health.py - SignalX health check endpoint
"""
Registers /health and /ready endpoints on the Flask app.

Usage in app.py:
    from health import register_health, run_server
    register_health(app)
    # ... routes ...
    if __name__ == '__main__':
        run_server(app)
"""
import os
import time
from flask import Flask, jsonify

_START_TIME = time.time()


def register_health(app: Flask) -> None:
    """Attach /health and /ready probes to an existing Flask app."""

    @app.route("/health")
    def health():
        """Liveness probe - always 200 if the process is up."""
        return jsonify({
            "status": "ok",
            "uptime_seconds": round(time.time() - _START_TIME, 1),
            "service": "signalx",
            "version": "1.0.0",
        })

    @app.route("/ready")
    def ready():
        """Readiness probe - checks required env vars are set."""
        missing = [
            v for v in ["GITHUB_TOKEN", "OPENAI_API_KEY"]
            if not os.environ.get(v)
        ]
        if missing:
            return jsonify({
                "status": "degraded",
                "missing_env": missing,
            }), 503
        return jsonify({"status": "ready"})


def run_server(app: Flask, port: int | None = None) -> None:
    """
    Run the Flask app with environment-aware debug mode.

    Logic:
      - PORT env not set (local dev) -> debug=True
      - PORT env set (Render/HuggingFace) -> debug=False
    """
    if port is None:
        port = int(os.environ.get("PORT", 7860))
    is_production = "PORT" in os.environ
    debug_mode = not is_production

    env_label = "prod" if is_production else "dev"
    print(f"[{:i>5s}] http://localhost:{port}  debug={debug_mode}")

    app.run(host="0.0.0.0", port=port, debug=debug_mode)
