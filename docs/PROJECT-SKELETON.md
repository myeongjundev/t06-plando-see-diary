# T06 project skeleton

Status: **design only; create implementation files after official reconciliation**

```text
t06-plando-see-diary/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── backend/
│   ├── pyproject.toml
│   ├── app/
│   │   ├── __init__.py          # Flask application factory
│   │   ├── config.py            # environment-driven settings
│   │   ├── api/                 # HTTP routes and error responses
│   │   ├── domain/              # record and summary rules
│   │   ├── storage/             # SQLAlchemy repositories and transactions
│   │   ├── migration/           # v1 → v2 pure conversion
│   │   └── services/            # import/export and weekly summary orchestration
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── fixtures/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/records/
│   │   ├── features/summary/
│   │   ├── features/transfer/
│   │   └── pages/
│   └── test/
├── contracts/
│   └── pds-schema-v2.json       # only if the official assignment requires it
├── tests/
│   ├── e2e/
│   └── fixtures/                # public synthetic datasets
└── docs/
    ├── REQUIREMENTS.md
    ├── STATUS.md
    ├── DECISIONS.md
    ├── HANDOFF-TEMPLATE.md
    └── evidence/
```

## Dependency direction

```text
HTTP/API → services → domain
                    ↘ storage
```

- Domain logic does not import Flask or SQLAlchemy.
- Migration and weekly aggregation are pure functions where practical.
- API routes translate validated domain results into stable JSON responses.
- Frontend never calculates authoritative weekly totals independently.
- Import uses one database transaction after full validation.

## Work slices

| Slice | Primary files | Required proof |
|---|---|---|
| Contract baseline | requirements, schema, fixtures | fixed inputs and expectations |
| CRUD vertical slice | record domain, repository, API, one UI flow | exact-ID create/edit/delete |
| Transfer and reset | export/import services, confirmation UI | round trip, atomic rejection, zero records |
| Migration | v1/v2 fixtures and pure converter | value preservation, idempotence |
| Weekly summary | KST boundary rules and summary UI | Monday/Sunday and invalid input cases |
| Five-day improvement | private local log, masked evidence | five real dates and one measured improvement |

