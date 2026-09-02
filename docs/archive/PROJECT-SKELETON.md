# T06 project skeleton

Status: **ACTIVE after official reconciliation**

```text
t06-plando-see-diary/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── backend/
│   ├── pyproject.toml
│   ├── migrations/
│   ├── app/
│   │   ├── __init__.py          # Flask application factory
│   │   ├── config.py            # environment-driven settings
│   │   ├── extensions.py        # SQLAlchemy and migration objects
│   │   ├── api/                 # routes and stable error responses
│   │   ├── models/              # plans, revisions, tasks, logs, reflections
│   │   └── services/            # business rules and aggregates
│   └── tests/
│       ├── acceptance/
│       ├── integration/
│       └── fixtures/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/plan/
│   │   ├── features/tasks/
│   │   ├── features/do/
│   │   ├── features/see/
│   │   └── pages/
│   └── test/
├── contracts/
│   └── pds-schema-v2.json
├── tests/
│   ├── e2e/
│   └── fixtures/
└── docs/
    ├── source/T06-OFFICIAL-ASSIGNMENT.md
    ├── REQUIREMENTS.md
    ├── T06-ACCEPTANCE-MATRIX.md
    ├── FLASK-ARCHITECTURE.md
    ├── STATUS.md
    ├── DECISIONS.md
    ├── HANDOFF-TEMPLATE.md
    └── evidence/
```

## Dependency direction

```text
React → HTTP API → services → SQLAlchemy models → PostgreSQL
```

- React never calculates authoritative See totals independently.
- Routes translate validated service results into stable JSON responses.
- Services own revision snapshots, idempotency, ordering, and aggregate rules.
- Database constraints protect foreign keys and completion idempotency.
- User text is rendered as text, never injected as raw HTML.

## Work slices

| Slice | Acceptance IDs | Required proof |
|---|---|---|
| Contract and plan history | C04–C08 | create, refresh, edit, immutable prior values |
| Task workflow | C09–C20 | CRUD, state transitions, search, filter, deterministic order |
| Execution and idempotency | C21–C27 | linked logs, unchanged estimates, duplicate completion once |
| See and next plan | C28–C33, C83 | exact totals, source IDs, carried improvement line |
| Persistence and safety | C01, C34–C36, C57–C60, C78–C82 | server DB, export, warning, XSS, public URLs |

