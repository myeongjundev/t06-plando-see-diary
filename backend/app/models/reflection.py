from datetime import date, datetime

from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db
from app.models.plan import new_uuid, utc_now


class Reflection(db.Model):
    __tablename__ = "reflections"
    __table_args__ = (CheckConstraint("period_end >= period_start", name="ck_reflection_period"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    plan_id: Mapped[str] = mapped_column(ForeignKey("plans.id"), index=True)
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)
    improvement: Mapped[str] = mapped_column(Text)
    next_plan_id: Mapped[str | None] = mapped_column(ForeignKey("plans.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
