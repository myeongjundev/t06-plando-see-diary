from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db
from app.models.plan import new_uuid, utc_now


class ExecutionLog(db.Model):
    __tablename__ = "execution_logs"
    __table_args__ = (
        CheckConstraint("ended_at > started_at", name="ck_execution_time_order"),
        CheckConstraint("actual_minutes BETWEEN 0 AND 1000000", name="ck_execution_minutes"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    task_id: Mapped[str] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    actual_minutes: Mapped[int] = mapped_column(Integer)
    blocker_reason: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class CompletionEvent(db.Model):
    __tablename__ = "completion_events"
    __table_args__ = (
        UniqueConstraint("task_id", "idempotency_key", name="uq_completion_task_key"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    task_id: Mapped[str] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), index=True)
    idempotency_key: Mapped[str] = mapped_column(String(100))
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
