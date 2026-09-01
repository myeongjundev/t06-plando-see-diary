from flask import jsonify, request

from app.api import api
from app.extensions import db
from app.models import Plan
from app.services.plans import ValidationError, create_plan, serialize_plan, serialize_revision, update_plan


def error_response(message: str, *, details: dict[str, str] | None = None, status: int = 400):
    return jsonify({"error": {"message": message, "details": details or {}}}), status


@api.get("/health")
def health():
    engine = db.engine.url.get_backend_name()
    return jsonify({"status": "ok", "database": engine})


@api.get("/plans")
def list_plans():
    plans = db.session.execute(db.select(Plan).order_by(Plan.created_at, Plan.id)).scalars()
    return jsonify({"plans": [serialize_plan(plan) for plan in plans]})


@api.post("/plans")
def post_plan():
    try:
        plan = create_plan(request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("계획을 저장할 수 없습니다.", details=exc.errors)
    return jsonify({"plan": serialize_plan(plan)}), 201


@api.get("/plans/<plan_id>")
def get_plan(plan_id: str):
    plan = db.session.get(Plan, plan_id)
    if plan is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    return jsonify({"plan": serialize_plan(plan)})


@api.patch("/plans/<plan_id>")
def patch_plan(plan_id: str):
    plan = db.session.get(Plan, plan_id)
    if plan is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    try:
        plan = update_plan(plan, request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("계획을 고칠 수 없습니다.", details=exc.errors)
    return jsonify({"plan": serialize_plan(plan)})


@api.get("/plans/<plan_id>/revisions")
def get_plan_revisions(plan_id: str):
    plan = db.session.get(Plan, plan_id)
    if plan is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    return jsonify({"revisions": [serialize_revision(item) for item in plan.revisions]})

