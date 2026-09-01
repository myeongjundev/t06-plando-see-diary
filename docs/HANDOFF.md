# T06 handoff · Cards 1–2 complete

## 1. Goal

Complete the Card 2 task workflow for T06-C09–T06-C20 without changing the fixed
expectations established for Card 1.

## 2. Current state

- Official source and all 44 acceptance IDs remain fixed.
- Card 1 creates plans and preserves immutable pre-edit revisions.
- Card 2 creates, edits, completes, reopens, and soft-deletes tasks linked to a plan.
- Tasks store a due date, priority, normalized tags, estimated minutes, and UUID.
- Server-side search covers content and tags; filters support status, priority, and
  an exact tag.
- The API and screen use the declared deterministic order: priority, due date,
  created time, then UUID.
- React provides inline edit and delete confirmation instead of native browser
  prompts.

## 3. Run commands

Use `docs/DEVELOPMENT.md`. Verified checks:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing

cd ..\frontend
npm run build
```

Local servers use Flask at `http://127.0.0.1:5000` and Vite at
`http://127.0.0.1:5173`.

## 4. Passed acceptance IDs

- Card 1: T06-C04–T06-C08.
- Card 2: T06-C09–T06-C20.

Card 2 evidence: the automated suite created a task with a UUID and all required
fields, edited the same ID, completed and reopened it, soft-deleted only one task,
searched a unique phrase, combined completed/high filters, and reproduced the same
declared order twice. The local browser also completed create, edit, complete,
reopen, and search flows with no console errors.

## 5. Failed or unrun acceptance IDs

- Failed: none in Cards 1–2.
- Unrun: 27 remaining official IDs, including Card 3–5 and all deployment checks.
- PostgreSQL deployment has not been run; local persistence does not claim T06-C34
  or T06-C35.
- T06-C79 requires five real, safe-to-disclose deployed tasks and is not claimed by
  synthetic automated fixtures.

## 6. Next action

Implement execution logs and completion-event idempotency for T06-C21–T06-C27.
Add the database unique constraint before relying on the React button state.

## 7. Do not change

- Do not change the 44 fixed expectations to make code pass.
- Do not add authentication in T06.
- Do not commit local databases, real diary data, exports, or secrets.
- Keep UUID identity, minute units, UTC storage, and `Asia/Seoul` date rules.
- Keep plan revisions immutable and task deletion soft.
- Keep task ordering as priority → due date → created time → UUID.
- Completion idempotency must be enforced by the database in Card 3.

## 8. Changed files

- `backend/app/models/task.py`: task and normalized-tag tables.
- `backend/app/services/tasks.py`: validation, transitions, soft delete, filtering,
  searching, and deterministic ordering.
- `backend/app/api/tasks.py`: Card 2 HTTP routes.
- `backend/migrations/versions/7f02f5379407_add_task_workflow_tables.py`: database
  migration.
- `backend/tests/acceptance/test_card2_tasks.py`: observable C09–C20 checks.
- `frontend/src/api/tasks.ts` and `frontend/src/features/tasks/TaskPanel.tsx`: Card 2
  screen workflow.
- `frontend/src/App.tsx` and `frontend/src/styles.css`: integration and presentation.

## 9. Git state

- Card 1 handoff baseline: `c1b8fe9`
- Card 2 implementation: `f2b9c8c` (`feat: implement T06 task workflow`)
- Card 2 handoff: `22a6655` (`docs: hand off completed T06 card 2`)
