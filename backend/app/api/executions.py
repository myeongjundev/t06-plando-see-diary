from flask import jsonify, request
from sqlalchemy import select

from app.api import api
from app.api.plans import error_response
from app.api.tasks import active_task
from app.extensions import db
from app.models import CompletionEvent, ExecutionLog
from app.services.executions import create_execution, serialize_completion, serialize_execution
from app.services.plans import ValidationError


@api.get("/tasks/<task_id>/executions")
def list_executions(task_id):
    if active_task(task_id) is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    logs = db.session.scalars(select(ExecutionLog).where(ExecutionLog.task_id == task_id)
                              .order_by(ExecutionLog.started_at, ExecutionLog.id))
    return jsonify({"executions": [serialize_execution(log) for log in logs]})


@api.post("/tasks/<task_id>/executions")
def post_execution(task_id):
    task = active_task(task_id)
    if task is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    try:
        log = create_execution(task, request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("실행 기록을 저장할 수 없습니다.", details=exc.errors)
    return jsonify({"execution": serialize_execution(log)}), 201


@api.get("/tasks/<task_id>/completions")
def list_completions(task_id):
    if active_task(task_id) is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    events = db.session.scalars(select(CompletionEvent).where(CompletionEvent.task_id == task_id)
                                .order_by(CompletionEvent.completed_at, CompletionEvent.id))
    return jsonify({"completionEvents": [serialize_completion(event) for event in events]})
