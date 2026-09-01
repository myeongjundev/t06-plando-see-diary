# T06 Flask architecture

Status: **ACTIVE — reconciled with the official assignment on 2026-09-01**

## Stack

- Frontend: React + Vite + TypeScript
- API: Flask
- ORM and migrations: SQLAlchemy + Alembic
- Production database: PostgreSQL
- Automated API tests: Pytest with isolated SQLite in-memory databases
- Timezone: store instants in UTC; display and overdue dates in `Asia/Seoul`
- Duration unit: integer minutes

## Service boundaries

```text
React UI
  └─ /api
      ├─ plan_service       plan creation, revision snapshots, next-plan carry-over
      ├─ task_service       CRUD, search, filters, deterministic sorting
      ├─ execution_service  logs and idempotent completion
      ├─ reflection_service aggregates and source-record drill-down
      └─ export_service     one-file JSON export
             └─ SQLAlchemy repositories ── PostgreSQL
```

Business rules live in services, not React event handlers. Database constraints
protect identity and idempotency. API responses never contain database credentials.

## Core tables

| Table | Purpose | Key relationships |
|---|---|---|
| `plans` | Current plan values | parent of tasks, revisions, reflections |
| `plan_revisions` | Immutable pre-edit snapshots | many-to-one plan |
| `tasks` | Current task values and soft-delete marker | many-to-one plan |
| `task_tags` | Normalized tag values | many-to-one task |
| `completion_events` | One logical completion per idempotency key | many-to-one task; unique key |
| `execution_logs` | Start/end/actual minutes/blocker | many-to-one task |
| `reflections` | Aggregate period and improvement line | many-to-one plan |

The exact fields, nullability, units, relationships, and date rules are canonical in
`contracts/pds-schema-v2.json`.

## API outline

| Method | Path | Purpose |
|---|---|---|
| GET, POST | `/api/plans` | list and create plans |
| GET, PATCH | `/api/plans/:id` | read and revise a plan |
| GET | `/api/plans/:id/revisions` | immutable plan history |
| GET, POST | `/api/plans/:id/tasks` | query and create linked tasks |
| PATCH, DELETE | `/api/tasks/:id` | edit or soft-delete one task |
| POST | `/api/tasks/:id/complete` | idempotent completion |
| POST | `/api/tasks/:id/reopen` | return task to active |
| GET, POST | `/api/tasks/:id/executions` | linked execution logs |
| GET | `/api/plans/:id/see` | aggregates plus source IDs |
| GET, POST | `/api/plans/:id/reflections` | list reflections or save improvement line |
| POST | `/api/reflections/:id/next-plan` | carry improvement into a new plan |
| GET | `/api/export` | download one complete JSON file |
| GET | `/api/health` | deployment and database readiness |

## Deterministic task ordering

The UI states and the API implements:

1. priority: high, medium, low;
2. due date: earlier first, missing last;
3. created time: earlier first;
4. UUID: ascending final tie-break.

Search and filters are applied before the same ordering rule.

## See and reflection rules (Card 4)

- `GET /api/plans/:id/see` accepts both `periodStart` and `periodEnd`, or neither.
  The period selects tasks by inclusive due date; all execution logs of those tasks
  are included. Without a period all non-deleted plan tasks are included.
- A single task/log outer-join result supplies the seven numbers, metric-specific
  source IDs, and serialized task/log records. Completed count is current status,
  overdue uses Seoul today, and blocked count deduplicates tasks with nonblank reasons.
- Reflections store a single improvement line and date range. A whole-plan review's
  range spans plan dates and included task due dates. Reflection text is immutable.
- Next-plan creation locks the reflection, creates the plan with exact copied text,
  and links its UUID in one transaction. A replay returns the already linked plan.

## Security and T07 boundary

- React renders user content as text; no raw HTML rendering is allowed.
- Flask validates types, lengths, enum values, date ranges, and start/end ordering.
- Secrets exist only as deployment environment variables.
- T06 adds no authentication. The first screen always states that anyone with the
  link can view the data.
- Service and repository boundaries leave room for an `owner_id` in T07 without
  pretending that T06 data is private.

