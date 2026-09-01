from datetime import datetime, timezone


def utc_iso(value: datetime) -> str:
    # SQLite omits timezone metadata; persisted instants are always UTC.
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat()
