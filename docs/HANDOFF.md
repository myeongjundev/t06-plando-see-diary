# T06 handoff · Card 1 complete

## 1. Goal

Establish the official baseline and complete Card 1 plan creation and immutable
pre-edit history for T06-C04–T06-C08.

## 2. Current state

- Official source and all 44 acceptance IDs are reconciled.
- React + Vite and Flask + SQLAlchemy skeletons run locally.
- PostgreSQL is the production database contract; isolated SQLite is used for tests
  and local development only.
- Users can create a plan with dates, priority, success criterion, and estimated
  minutes, edit its estimated minutes, inspect the prior values, and refresh without
  losing the local database values.
- The first screen displays the exact no-login warning.

## 3. Run commands

Use `docs/DEVELOPMENT.md`. Verified commands:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing

cd ..\frontend
npm run build
```

Local servers use Flask at `http://127.0.0.1:5000` and Vite at
`http://127.0.0.1:5173`.

## 4. Passed acceptance IDs

- T06-C04: start and end dates persisted and appeared in the browser.
- T06-C05: priority `high` persisted.
- T06-C06: success criterion persisted.
- T06-C07: `600` minutes and the `minutes` unit persisted.
- T06-C08: editing to `540` retained revision #1 at `600` under the same plan ID.

Evidence: 3 Pytest tests passed, 89% backend coverage, frontend production build
passed, and the local browser showed `540분 예상` plus
`#1 · 600분 · 44개 검사 통과` after refresh.

## 5. Failed or unrun acceptance IDs

- Failed: none in the Card 1 slice.
- Unrun: the remaining 39 official IDs, including all Card 2–5 deployment checks.
- PostgreSQL deployment has not been run; local persistence alone does not claim
  T06-C34 or T06-C35.

## 6. Next action

Implement Card 2 task models, migration, API, and tests for T06-C09–T06-C20 before
expanding the React screen.

## 7. Do not change

- Do not change the 44 fixed expectations to make code pass.
- Do not add authentication in T06.
- Do not commit real diary data, local databases, exports, or secrets.
- Keep UUID identity, minute units, UTC storage, and `Asia/Seoul` date rules.
- Keep plan revisions immutable and completion idempotency protected by a database
  unique constraint.

## 8. Changed files

- `contracts/pds-schema-v2.json`: canonical database and export contract.
- `backend/app`, `backend/migrations`, `backend/tests`: Card 1 Flask slice and tests.
- `frontend/src`, frontend configuration and lockfile: Card 1 React screen.
- `.gitignore`: excludes local databases, dependencies, coverage, and build products.
- `docs/DEVELOPMENT.md`, `docs/STATUS.md`, `docs/HANDOFF.md`: reproducible continuation.

## 9. Git state

- Start commit: `f25841f` (`docs: reconcile official T06 requirements`)
- Card 1 implementation commit: `1bb2c42` (`feat: implement T06 plan history slice`)
- Documentation/cleanup commit: pending at the time this handoff was written.

