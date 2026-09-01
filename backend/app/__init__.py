from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from sqlalchemy.engine import make_url
from sqlalchemy.exc import SQLAlchemyError

from app.config import Config, database_url
from app.extensions import db, migrate


def create_app(test_config: dict | None = None) -> Flask:
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    app.config["REQUIRE_POSTGRES"] = os.getenv("REQUIRE_POSTGRES", "0") == "1"
    if test_config:
        app.config.update(test_config)
    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        app.config["SQLALCHEMY_DATABASE_URI"] = database_url()
    if app.config["REQUIRE_POSTGRES"] and make_url(app.config["SQLALCHEMY_DATABASE_URI"]).get_backend_name() != "postgresql":
        raise RuntimeError("Production requires a PostgreSQL DATABASE_URL.")

    db.init_app(app)
    migrate.init_app(app, db)

    from app.api import api
    from app import models  # noqa: F401

    app.register_blueprint(api)

    @app.get("/")
    def frontend():
        return send_from_directory(app.config["STATIC_DIST"], "index.html")

    @app.get("/assets/<path:filename>")
    def assets(filename):
        return send_from_directory(Path(app.config["STATIC_DIST"]) / "assets", filename)

    @app.after_request
    def response_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; "
            "connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
        )
        if request.path.startswith("/api/") or request.path == "/":
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.errorhandler(SQLAlchemyError)
    def database_failure(_error):
        db.session.rollback()
        # Never serialize/log raw database exceptions: they can contain credentials or records.
        app.logger.error("Database operation failed.")
        return jsonify({"error": {"message": "데이터베이스 요청을 처리하지 못했습니다.", "details": {}}}), 503

    @app.errorhandler(500)
    def internal_error(_error):
        return jsonify({"error": {"message": "요청을 처리하지 못했습니다.", "details": {}}}), 500

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": {"message": "요청한 주소를 찾을 수 없습니다.", "details": {}}}), 404

    return app

