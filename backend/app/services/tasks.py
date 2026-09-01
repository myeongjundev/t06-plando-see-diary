from __future__ import annotations

from datetime import date
from typing import Any

from sqlalchemy import case, or_, select
from sqlalchemy.orm import selectinload

from app.extensions import db
from app.models import Plan, Task, TaskTag
from app.models.plan import utc_now
from app.services.plans import PRIORITIES, ValidationError
from app.services.executions import lock_task
from app.time import utc_iso

EDITABLE_FIELDS = {"content", "dueDate", "priority", "tags", "estimatedMinutes"}
STATUSES = {"active", "completed"}


def _parse_date(value: Any) -> date:
    if not isinstance(value, str):
        raise ValidationError({"dueDate": "YYYY-MM-DD 형식의 날짜를 입력하세요."})
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValidationError({"dueDate": "YYYY-MM-DD 형식의 날짜를 입력하세요."}) from exc


def _parse_tags(value: Any) -> list[str]:
    if not isinstance(value, list):
        raise ValidationError({"tags": "태그는 문자열 목록이어야 합니다."})
    if len(value) > 10:
        raise ValidationError({"tags": "태그는 10개 이하여야 합니다."})
    cleaned: list[str] = []
    for raw in value:
        if not isinstance(raw, str) or not raw.strip():
            raise ValidationError({"tags": "빈 태그를 저장할 수 없습니다."})
        tag = raw.strip().lower()
        if len(tag) > 40:
            raise ValidationError({"tags": "태그는 40자 이하여야 합니다."})
        if tag not in cleaned:
            cleaned.append(tag)
    return cleaned


def validate_task(payload: dict[str, Any] | None, *, partial: bool = False) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValidationError({"body": "JSON 객체가 필요합니다."})
    unknown = set(payload) - EDITABLE_FIELDS
    if unknown:
        raise ValidationError({"body": f"알 수 없는 항목: {', '.join(sorted(unknown))}"})
    if partial and not payload:
        raise ValidationError({"body": "고칠 항목을 하나 이상 보내세요."})
    if not partial:
        missing = EDITABLE_FIELDS - set(payload)
        if missing:
            raise ValidationError({"body": f"필수 항목 누락: {', '.join(sorted(missing))}"})

    values: dict[str, Any] = {}
    if "content" in payload:
        content = payload.get("content")
        if not isinstance(content, str) or not content.strip():
            raise ValidationError({"content": "할 일을 입력하세요."})
        if len(content.strip()) > 500:
            raise ValidationError({"content": "할 일은 500자 이하여야 합니다."})
        values["content"] = content.strip()
    if "dueDate" in payload:
        values["due_date"] = _parse_date(payload.get("dueDate"))
    if "priority" in payload:
        priority = payload.get("priority")
        if not isinstance(priority, str) or priority not in PRIORITIES:
            raise ValidationError({"priority": "high, medium, low 중 하나여야 합니다."})
        values["priority"] = priority
    if "estimatedMinutes" in payload:
        minutes = payload.get("estimatedMinutes")
        if isinstance(minutes, bool) or not isinstance(minutes, int) or not 0 <= minutes <= 1_000_000:
            raise ValidationError({"estimatedMinutes": "0 이상의 정수 분이어야 합니다."})
        values["estimated_minutes"] = minutes
    if "tags" in payload:
        values["tags"] = _parse_tags(payload.get("tags"))
    return values


def create_task(plan: Plan, payload: dict[str, Any] | None) -> Task:
    values = validate_task(payload)
    tags = values.pop("tags")
    task = Task(plan_id=plan.id, **values)
    task.tags = [TaskTag(value=value) for value in tags]
    db.session.add(task)
    db.session.commit()
    return task


def update_task(task: Task, payload: dict[str, Any] | None) -> Task:
    values = validate_task(payload, partial=True)
    tags = values.pop("tags", None)
    for key, value in values.items():
        setattr(task, key, value)
    if tags is not None:
        task.tags = [TaskTag(value=value) for value in tags]
    db.session.commit()
    return task


def reopen_task(task: Task) -> Task:
    task = lock_task(task)
    if task.status != "active":
        task.status = "active"
        task.completed_at = None
    db.session.commit()
    return task


def delete_task(task: Task) -> None:
    if task.deleted_at is None:
        task.deleted_at = utc_now()
        db.session.commit()


def task_query(plan_id: str, *, query: str | None, status: str | None, priority: str | None, tag: str | None):
    statement = (
        select(Task)
        .options(selectinload(Task.tags))
        .where(Task.plan_id == plan_id, Task.deleted_at.is_(None))
    )
    if status:
        if status not in STATUSES:
            raise ValidationError({"status": "active 또는 completed여야 합니다."})
        statement = statement.where(Task.status == status)
    if priority:
        if priority not in PRIORITIES:
            raise ValidationError({"priority": "high, medium, low 중 하나여야 합니다."})
        statement = statement.where(Task.priority == priority)
    if tag:
        statement = statement.where(Task.tags.any(TaskTag.value == tag.strip().lower()))
    if query and query.strip():
        pattern = f"%{query.strip()}%"
        statement = statement.where(
            or_(Task.content.ilike(pattern), Task.tags.any(TaskTag.value.ilike(pattern)))
        )

    priority_rank = case((Task.priority == "high", 0), (Task.priority == "medium", 1), else_=2)
    return statement.order_by(
        priority_rank,
        case((Task.due_date.is_(None), 1), else_=0),
        Task.due_date,
        Task.created_at,
        Task.id,
    )


def serialize_task(task: Task) -> dict[str, Any]:
    return {
        "id": task.id,
        "planId": task.plan_id,
        "content": task.content,
        "status": task.status,
        "dueDate": task.due_date.isoformat(),
        "priority": task.priority,
        "tags": [tag.value for tag in task.tags],
        "estimatedMinutes": task.estimated_minutes,
        "durationUnit": "minutes",
        "completedAt": utc_iso(task.completed_at) if task.completed_at else None,
        "deletedAt": utc_iso(task.deleted_at) if task.deleted_at else None,
        "createdAt": utc_iso(task.created_at),
        "updatedAt": utc_iso(task.updated_at),
    }

