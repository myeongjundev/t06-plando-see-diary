from __future__ import annotations

import os
from pathlib import Path


def database_url() -> str:
    configured = os.getenv("DATABASE_URL")
    if configured:
        return configured.replace("postgres://", "postgresql+psycopg://", 1)

    instance_dir = Path(__file__).resolve().parents[1] / "instance"
    instance_dir.mkdir(exist_ok=True)
    return f"sqlite:///{(instance_dir / 't06.db').as_posix()}"


class Config:
    SQLALCHEMY_DATABASE_URI = database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False

