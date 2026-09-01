from flask import jsonify, request

from app.api import api
from app.api.plans import error_response
from app.extensions import db
from app.models import Plan, Task
from app.services.plans import ValidationError
from app.services.executions import CompletionConflict, complete_task, serialize_completion
from app.services.tasks import (
    create_task,
    delete_task,
    reopen_task,
    serialize_task,
    task_query,
    update_task,
)


def active_task(task_id: str):
    task = db.session.get(Task, task_id)
    return task if task and task.deleted_at is None else None


@api.get("/plans/<plan_id>/tasks")
def list_tasks(plan_id: str):
    if db.session.get(Plan, plan_id) is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    try:
        statement = task_query(
            plan_id,
            query=request.args.get("q"),
            status=request.args.get("status"),
            priority=request.args.get("priority"),
            tag=request.args.get("tag"),
        )
    except ValidationError as exc:
        return error_response("할 일 조건이 올바르지 않습니다.", details=exc.errors)
    tasks = db.session.execute(statement).scalars()
    return jsonify(
        {
            "tasks": [serialize_task(task) for task in tasks],
            "sort": "priority → dueDate → createdAt → id",
        }
    )


@api.post("/plans/<plan_id>/tasks")
def post_task(plan_id: str):
    plan = db.session.get(Plan, plan_id)
    if plan is None:
        return error_response("계획을 찾을 수 없습니다.", status=404)
    try:
        task = create_task(plan, request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("할 일을 저장할 수 없습니다.", details=exc.errors)
    return jsonify({"task": serialize_task(task)}), 201


@api.get("/tasks/<task_id>")
def get_task(task_id: str):
    task = active_task(task_id)
    if task is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    return jsonify({"task": serialize_task(task)})


@api.patch("/tasks/<task_id>")
def patch_task(task_id: str):
    task = active_task(task_id)
    if task is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    try:
        task = update_task(task, request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("할 일을 고칠 수 없습니다.", details=exc.errors)
    return jsonify({"task": serialize_task(task)})


@api.post("/tasks/<task_id>/complete")
def post_complete_task(task_id: str):
    task = active_task(task_id)
    if task is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    try:
        task, event, replayed = complete_task(task, request.get_json(silent=True))
    except ValidationError as exc:
        return error_response("완료 요청이 올바르지 않습니다.", details=exc.errors)
    except CompletionConflict as exc:
        return error_response(str(exc), status=409)
    return jsonify({"task": serialize_task(task), "completionEvent": serialize_completion(event), "replayed": replayed})


@api.post("/tasks/<task_id>/reopen")
def post_reopen_task(task_id: str):
    task = active_task(task_id)
    if task is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    try:
        return jsonify({"task": serialize_task(reopen_task(task))})
    except CompletionConflict as exc:
        return error_response(str(exc), status=409)


@api.delete("/tasks/<task_id>")
def remove_task(task_id: str):
    task = active_task(task_id)
    if task is None:
        return error_response("할 일을 찾을 수 없습니다.", status=404)
    delete_task(task)
    return "", 204

