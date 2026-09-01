from datetime import datetime, timezone

from sqlalchemy import select, update

from app.extensions import db
from app.models import CompletionEvent, ExecutionLog, Task
from app.models.plan import utc_now
from app.services.plans import ValidationError
from app.time import utc_iso


class CompletionConflict(ValueError):
    pass


def parse_instant(value, field: str) -> datetime:
    try:
        if not isinstance(value, str) or "T" not in value:
            raise ValueError
        result = datetime.fromisoformat(value)
        if result.utcoffset() is None:
            raise ValueError
        return result.astimezone(timezone.utc)
    except (ValueError, OverflowError) as exc:
        raise ValidationError({field: "시간대가 포함된 ISO 시각을 입력하세요."}) from exc


def create_execution(task: Task, payload) -> ExecutionLog:
    fields = {"startedAt", "endedAt", "actualMinutes", "blockerReason"}
    if not isinstance(payload, dict) or set(payload) != fields:
        raise ValidationError({"body": "시작·종료 시각, 실제 시간, 막힌 이유가 필요합니다."})
    start = parse_instant(payload["startedAt"], "startedAt")
    end = parse_instant(payload["endedAt"], "endedAt")
    if end <= start:
        raise ValidationError({"endedAt": "종료 시각은 시작 시각보다 늦어야 합니다."})
    minutes = payload["actualMinutes"]
    if isinstance(minutes, bool) or not isinstance(minutes, int) or not 0 <= minutes <= 1_000_000:
        raise ValidationError({"actualMinutes": "0~1000000 사이의 정수 분을 입력하세요."})
    blocker = payload["blockerReason"]
    if not isinstance(blocker, str) or len(blocker) > 500:
        raise ValidationError({"blockerReason": "막힌 이유는 500자 이하의 글자여야 합니다."})
    log = ExecutionLog(task_id=task.id, started_at=start, ended_at=end,
                       actual_minutes=minutes, blocker_reason=blocker)
    db.session.add(log)
    db.session.commit()
    return log


def lock_task(task: Task) -> Task:
    # A no-op UPDATE obtains the database write/row lock on SQLite/PostgreSQL.
    # Refresh after locking so concurrent requests never act on stale status.
    result = db.session.execute(
        update(Task).where(Task.id == task.id, Task.deleted_at.is_(None))
        .values(updated_at=Task.updated_at).execution_options(synchronize_session=False)
    )
    if result.rowcount != 1:
        db.session.rollback()
        raise CompletionConflict("삭제된 할 일의 상태를 바꿀 수 없습니다.")
    db.session.refresh(task)
    return task


def complete_task(task: Task, payload) -> tuple[Task, CompletionEvent, bool]:
    if not isinstance(payload, dict) or set(payload) != {"idempotencyKey"}:
        raise ValidationError({"idempotencyKey": "완료 요청 키가 필요합니다."})
    key = payload["idempotencyKey"]
    if not isinstance(key, str) or not 8 <= len(key) <= 100 or not key.strip():
        raise ValidationError({"idempotencyKey": "완료 요청 키는 8~100자여야 합니다."})
    task = lock_task(task)
    existing = db.session.scalar(select(CompletionEvent).where(
        CompletionEvent.task_id == task.id, CompletionEvent.idempotency_key == key,
    ))
    if existing:
        # A replay after reopen must not complete the task again.
        db.session.commit()
        return task, existing, True
    if task.status == "completed":
        db.session.rollback()
        raise CompletionConflict("이미 완료된 할 일입니다. 다시 시작한 후 완료하세요.")
    now = utc_now()
    event = CompletionEvent(task_id=task.id, idempotency_key=key, completed_at=now)
    task.status = "completed"
    task.completed_at = now
    db.session.add(event)
    db.session.commit()
    return task, event, False


def serialize_execution(log: ExecutionLog) -> dict:
    return {
        "id": log.id, "taskId": log.task_id,
        "startedAt": utc_iso(log.started_at), "endedAt": utc_iso(log.ended_at),
        "actualMinutes": log.actual_minutes, "durationUnit": "minutes",
        "blockerReason": log.blocker_reason, "createdAt": utc_iso(log.created_at),
    }


def serialize_completion(event: CompletionEvent) -> dict:
    return {"id": event.id, "taskId": event.task_id,
            "idempotencyKey": event.idempotency_key, "completedAt": utc_iso(event.completed_at)}
