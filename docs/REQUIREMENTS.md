# T06 requirements

Status: **OFFICIAL — reconciled on 2026-09-01**

## Authoritative source

- `docs/source/T06-OFFICIAL-ASSIGNMENT.md`
- Planned effort: 8–10 hours
- Product: public Plan → Do → See diary without authentication

If another document conflicts with the official source, this file and the official
source take precedence. The fixed observable expectations are in
`docs/T06-ACCEPTANCE-MATRIX.md`.

## Product boundary

- Store plans, tasks, execution logs, reflections, and plan revision history in a
  real server database.
- Keep stored values after refresh and return the same IDs, dates, values, and units.
- Do not add signup, login, sessions, or claims that data is private. Authentication
  belongs to T07.
- Show the exact public-data warning on the first screen.
- Use only non-sensitive personal entries in the deployed app and synthetic data in
  automated tests, screenshots, exports committed to Git, and public evidence.
- Escape user-provided text so script-shaped input is displayed as text and never
  executed.
- Never expose secret values in client code, deployment files, responses, console
  output, or Git history.

## Card 1 — Plan

- A plan has an immutable UUID, title, start date, end date, priority, success
  criterion, estimated minutes, and timestamps.
- Editing a plan retains the same plan ID and stores the complete pre-edit values as
  an immutable revision row.
- At least one deployed plan must describe the user's real, non-sensitive work.

Acceptance IDs: T06-C04–T06-C08.

## Card 2 — Tasks

- A task belongs to one plan and has an immutable UUID, content, status, due date,
  priority, tags, estimated minutes, and timestamps.
- Users can create, edit, complete, reopen, and delete tasks.
- Users can search and filter tasks.
- The screen states the sort rule. Sorting is deterministic, including tie-breaks.
- The deployed plan contains at least five real, non-sensitive tasks.

Acceptance IDs: T06-C09–T06-C20 and T06-C79.

## Card 3 — Do

- An execution log belongs to one task and stores start time, end time, actual
  minutes, blocker reason, and timestamps without changing the original estimates.
- Completion accepts an idempotency key. Repeating the same completion request
  produces one completion event and increases the completion aggregate by one only.
- The database, not only the button state, enforces completion-event uniqueness.
- The deployed app contains at least three real, non-sensitive execution logs.

Acceptance IDs: T06-C21–T06-C27 and T06-C80.

## Card 4 — See

- For a selected plan or period, calculate task count, completed count, overdue
  count, blocked-task count, estimated minutes, actual minutes, and variance.
- Overdue means incomplete and due date earlier than today in `Asia/Seoul`.
- Blocked-task count counts each task once when at least one execution log has a
  non-empty blocker reason.
- Estimated minutes sum non-deleted tasks; actual minutes sum their execution logs;
  variance is actual minus estimated. Empty aggregates are zero.
- Every aggregate number links to or reveals the exact source records counted.
- A reflection stores one improvement line and can create the next plan with that
  line carried forward.

Acceptance IDs: T06-C28–T06-C33 and T06-C83.

## Card 5 — persistence, export, and submission safety

- Plans, tasks, execution logs, and reflections use a real server database.
- Export all stored user data as one JSON file.
- Store the final table, field, relationship, unit, and date rules in
  `contracts/pds-schema-v2.json`.
- The public app contains at least one real plan, five tasks, and three execution
  logs, and the See screen has at least one non-zero aggregate.
- Both the product URL and full-commit source URL open in a private browser without
  authentication, invitation, password, OAuth, or CAPTCHA.
- Submission includes the required four verification lines and three judgment lines.

Acceptance IDs: T06-C01, T06-C34–T06-C36, T06-C57–T06-C60, and T06-C78–T06-C82.

## Explicitly not required by the final source

The preliminary material mentioned the following, but the official assignment does
not require them. They may not consume the 8–10 hour scope unless a later official
notice changes the cards.

- v1 → v2 data migration behavior
- JSON import or restore
- delete-all
- five distinct days of observation
- authentication

