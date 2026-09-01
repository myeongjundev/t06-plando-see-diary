from flask import jsonify, request
from sqlalchemy import select

from app.api import api
from app.api.plans import error_response
from app.extensions import db
from app.models import Plan, Reflection
from app.services.plans import ValidationError, serialize_plan
from app.services.reflections import aggregate_plan, create_reflection, next_plan, serialize_reflection


@api.get("/plans/<plan_id>/see")
def see_plan(plan_id):
    plan = db.session.get(Plan, plan_id)
    if plan is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    try:
        if set(request.args) - {"periodStart", "periodEnd"}:
            raise ValidationError({"query": "지원하지 않는 집계 조건입니다."})
        return jsonify(aggregate_plan(plan, request.args.get("periodStart"), request.args.get("periodEnd")))
    except ValidationError as exc:
        return error_response("집계 조건이 올바르지 않습니다.", details=exc.errors)


@api.get("/plans/<plan_id>/reflections")
def list_reflections(plan_id):
    if db.session.get(Plan, plan_id) is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    rows = db.session.scalars(select(Reflection).where(Reflection.plan_id == plan_id)
                             .order_by(Reflection.created_at, Reflection.id))
    return jsonify({"reflections": [serialize_reflection(row) for row in rows]})


@api.post("/plans/<plan_id>/reflections")
def post_reflection(plan_id):
    plan = db.session.get(Plan, plan_id)
    if plan is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    try:
        row = create_reflection(plan, request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("회고를 저장할 수 없습니다.", details=exc.errors)
    return jsonify({"reflection": serialize_reflection(row)}), 201


@api.post("/reflections/<reflection_id>/next-plan")
def post_next_plan(reflection_id):
    row = db.session.get(Reflection, reflection_id)
    if row is None:
        return error_response("회고를 찾을 수 없습니다.", status=404)
    try:
        plan, replayed = next_plan(row, request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("다음 계획을 만들 수 없습니다.", details=exc.errors)
    return jsonify({"plan": serialize_plan(plan), "reflection": serialize_reflection(row),
                    "replayed": replayed}), 200 if replayed else 201
