from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.extensions import db
from app.models import CompletionEvent, ExecutionLog, Plan, PlanRevision, Reflection, Task, TaskTag
from app.models.plan import utc_now
from app.services.executions import serialize_completion, serialize_execution
from app.services.plans import serialize_plan, serialize_revision
from app.services.reflections import serialize_reflection
from app.services.tasks import serialize_task
from app.time import utc_iso


def export_all() -> dict:
    # A dedicated read transaction gives every exported table the same snapshot.
    with db.engine.connect() as connection:
        if connection.dialect.name == "postgresql":
            connection = connection.execution_options(isolation_level="REPEATABLE READ")
        elif connection.dialect.name == "sqlite":
            connection.exec_driver_sql("BEGIN")
        with Session(connection) as snapshot:
            def rows(model, key):
                return snapshot.scalars(select(model).order_by(key)).all()

            tasks = []
            for task in snapshot.scalars(select(Task).options(selectinload(Task.tags)).order_by(Task.id)):
                item = serialize_task(task)
                del item["tags"]  # Export retains normalized tag IDs in taskTags.
                tasks.append(item)
            return {
                "schemaVersion": 2, "exportedAt": utc_iso(utc_now()),
                "plans": [serialize_plan(row) for row in rows(Plan, Plan.id)],
                "planRevisions": [serialize_revision(row) for row in rows(PlanRevision, PlanRevision.revision_id)],
                "tasks": tasks,
                "taskTags": [{"id": row.id, "taskId": row.task_id, "value": row.value}
                             for row in rows(TaskTag, TaskTag.id)],
                "completionEvents": [serialize_completion(row) for row in rows(CompletionEvent, CompletionEvent.id)],
                "executionLogs": [serialize_execution(row) for row in rows(ExecutionLog, ExecutionLog.id)],
                "reflections": [serialize_reflection(row) for row in rows(Reflection, Reflection.id)],
            }
