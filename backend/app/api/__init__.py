from flask import Blueprint

api = Blueprint("api", __name__, url_prefix="/api")

from app.api import plans  # noqa: E402, F401
from app.api import tasks  # noqa: E402, F401
