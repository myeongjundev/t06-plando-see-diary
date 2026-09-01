from __future__ import annotations

from flask import Flask, jsonify

from app.config import Config
from app.extensions import db, migrate


def create_app(test_config: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    migrate.init_app(app, db)

    from app.api import api
    from app import models  # noqa: F401

    app.register_blueprint(api)

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": {"message": "요청한 주소를 찾을 수 없습니다.", "details": {}}}), 404

    return app

