# Local development

## Card 5 production and export

The selected public host is Render Free with Neon Free PostgreSQL. See
`RENDER-NEON.md`. Render probes `/api/live` without querying the database; use
`/api/health` explicitly to verify PostgreSQL readiness. Connections are checked
with SQLAlchemy pre-ping when reused after database sleep.

See `DEPLOYMENT.md` for the tested Docker/PostgreSQL stack. The UI's “전체 JSON
내려받기” calls `GET /api/export` and downloads `t06-diary-v2.json`. It includes all
seven tables, including deleted-task history and normalized tag IDs. The contract
maps every stored column; API/export instants always carry a UTC offset.

Run `python scripts/postgres_smoke.py` against the local production stack and,
after restarting web and waiting for health, rerun with `--verify`. The script
creates synthetic data only. Run `python scripts/audit_secrets.py` to scan common
credential patterns in source, built frontend and Git history. Both commands run
from `backend/` using the installed virtual environment.

## Backend

Working directory: `backend`

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
.\.venv\Scripts\flask.exe --app app:create_app db upgrade
.\.venv\Scripts\flask.exe --app app:create_app run --port 5000
```

The default local database is `backend/instance/t06.db` and is ignored by Git.
Set `DATABASE_URL` to a PostgreSQL connection string for deployment.

## Frontend

Working directory: `frontend`

```powershell
npm install
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`. Vite forwards `/api` requests to Flask on port 5000.

## Checks

```powershell
# backend
.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing

# frontend
npm run build

# repository root
python -m json.tool contracts/pds-schema-v2.json > $null
git diff --check
```

Never copy the local SQLite database, `.env`, private exports, or real diary details
into Git. Production must use PostgreSQL and non-sensitive public entries only.

## Card 3 API and verification

Apply migrations with `flask --app app:create_app db upgrade` before running the UI.
The current head is `b84587642a1b` (Card 4); `flask --app app:create_app db check` checks model drift.

- `POST /api/tasks/:id/complete` now requires `{"idempotencyKey":"client-unique-key"}`.
  Keys are 8–100 characters and scoped to a task. The response contains `task`,
  `completionEvent`, and `replayed`. Reuse the key when retrying a failed/uncertain
  request. A replay returns the same event, including after reopen, without another
  status transition. Use a new key for a new completion after reopening.
- The browser retains a pending key in session storage until the request succeeds,
  including across refresh; it also disables the status button during the request.
- A different key on an already completed task returns 409. A missing/invalid key
  returns 400. Deleted tasks return 404.
- `GET /api/tasks/:id/completions` lists immutable completion events.
- `GET/POST /api/tasks/:id/executions` lists or creates immutable execution records.
  POST fields are `startedAt`, `endedAt`, `actualMinutes`, `blockerReason`; timestamps
  require an explicit offset and end must follow start. Actual minutes are an integer
  from 0 to 1000000; blocker text is at most 500 characters, including empty text.
- `GET /api/plans/:id/see` preserves `planId`, `completedCount`, and
  `completedTaskIds` and now includes all Card 4 metrics (see below).

Browser check with synthetic records: create a 90-minute task, open **Do · 실행 기록**,
save Seoul 2026-09-01 13:00–14:30 / actual 75 / `배포 환경 변수 확인`. The task still
shows 90 minutes; the record shows 75 minutes and the same Seoul instants. Double-click
complete: completion history is 1 and See completed count is 1. Refresh and reopen Do
to confirm the execution UUID and values persist.

The automated suite also checks concurrent requests using four independent SQLite
connections, direct duplicate INSERT rejection, replay after reopen, validation
atomicity, and upgrade from Card 2 with unchanged plan/task values. These are local
checks, not evidence of PostgreSQL deployment. The generated migration environment
currently emits a Flask-SQLAlchemy `get_engine()` deprecation warning during its test.

## Card 4 API and verification

- `GET /api/plans/:id/see`: seven numbers (`taskCount`, `completedCount`,
  `overdueCount`, `blockedTaskCount`, `estimatedMinutes`, `actualMinutes`,
  `varianceMinutes`), `sources` per metric, and full `records.tasks` /
  `records.executions` for drill-down. The response includes Seoul `today`, UTC
  `asOf`, the effective date range, and `scope` (`plan` or `dueDate`).
- Optional query fields `periodStart` / `periodEnd` must both be valid YYYY-MM-DD
  dates in order. They select tasks by inclusive due date. Actual minutes count all
  logs of those tasks, including logs executed outside the due-date period. Omit
  both fields to review the entire plan. Other query fields are rejected.
- `GET/POST /api/plans/:id/reflections`: list stored reflections or save
  `periodStart`, `periodEnd`, `improvement` (one nonblank line, at most 500 characters).
- `POST /api/reflections/:id/next-plan`: accepts normal plan creation fields except
  `carriedImprovement`, which comes from the stored reflection. The first response
  is 201; repeats return the same linked plan with 200 and `replayed: true`.
  The first valid creation determines the plan; retries do not revise it.

Browser check: open **See · 돌아보고 이어가기**, choose a synthetic plan, and press
each metric to inspect source content, values, task IDs, and execution IDs. Apply
a due-date period and return to **계획 전체 보기**. Save `작업을 30분 단위로 나눈다`
as the reflection, open its next-plan form, and create the next plan. Its plan card
must show that exact improvement after refresh. New empty plans show all zeros.

Current checks: 47 tests passed, 92% coverage; seven metric/source assertions,
Seoul midnight transition, period boundaries, soft-deleted and other-plan exclusion,
reflection validation, exact carry-over, Card 3 data preservation on upgrade, and
four simultaneous next-plan requests producing one plan. The two migration tests
currently emit 12 existing `get_engine()` deprecation warnings in total.

