from flask import jsonify

from app.api import api
from app.services.export import export_all


@api.get("/export")
def download_export():
    response = jsonify(export_all())
    response.headers["Content-Disposition"] = 'attachment; filename="t06-diary-v2.json"'
    response.headers["Cache-Control"] = "no-store"
    return response
