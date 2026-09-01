from __future__ import annotations

import os
from pathlib import Path


def database_url() -> str:
    configured = os.getenv("DATABASE_URL")
    if configured:
        for prefix in ("postgres://", "postgresql://"):
            if configured.startswith(prefix):
                return "postgresql+psycopg://" + configured[len(prefix):]
        return configured

    instance_dir = Path(__file__).resolve().parents[1] / "instance"
    instance_dir.mkdir(exist_ok=True)
    return f"sqlite:///{(instance_dir / 't06.db').as_posix()}"


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Check cached connections on use, including after the hosted DB sleeps.
    # This does not issue any background queries.
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    JSON_SORT_KEYS = False
    MAX_CONTENT_LENGTH = 1_048_576
    STATIC_DIST = str(Path(__file__).resolve().parents[2] / "frontend" / "dist")

