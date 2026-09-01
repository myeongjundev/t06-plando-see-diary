# T06 deployment and verification

Status: production image and local PostgreSQL verified on 2026-09-01. The user
selected **Render Free + Neon Free** for approximately three months. Follow
`RENDER-NEON.md` and the root `render.yaml`. Account connection and public deployment
remain pending. The GCP proposal is superseded; no GCP VM was created.

## Local production stack

Create an ignored root `.env` containing `POSTGRES_PASSWORD=<random hexadecimal
password>`. This workstation already has this file. Never copy its value into
Git, screenshots, terminal output or chat. From the repository root:

```powershell
docker compose up --build -d
docker compose ps
docker compose exec -T web flask --app app:create_app db check
```

Open `http://127.0.0.1:8000`. The image builds React, serves it and `/api` using
Flask/Waitress, and runs Alembic before starting. PostgreSQL is mandatory in the
image; missing configuration cannot silently select SQLite. `/api/health` queries
the database. PostgreSQL has no host port; web binds to loopback. The named
`diary-data` volume retains records across web rebuilds. Stop with `docker compose
stop`; do not remove the database volume to stop the app.

From `backend/`, with development dependencies installed:

```powershell
.\.venv\Scripts\python.exe scripts/postgres_smoke.py
# From repository root: docker compose restart web
# Wait until docker compose ps reports web healthy, then from backend:
.\.venv\Scripts\python.exe scripts/postgres_smoke.py --verify
.\.venv\Scripts\python.exe scripts/audit_secrets.py
```

The smoke command creates synthetic localhost records and checks four concurrent
completion requests, four next-plan requests, aggregates, the JSON contract, and
unchanged values after restart (except export time). Its ignored snapshot is
`tmp/postgres-smoke.json`. Do not edit records between snapshot and comparison.

## Public deployment inputs

Use a Docker-capable server/project with HTTPS and durable PostgreSQL. Build from
the repository root using `Dockerfile`. Configure these server-side settings:

| Setting | Value |
|---|---|
| `DATABASE_URL` | PostgreSQL URL from the database service, with its required TLS options |
| `REQUIRE_POSTGRES` | `1`, already the image default |
| `PORT` | Hosting HTTP port, default `8000` |
| Health check | `/api/health` |

Never put database URLs into `VITE_*`, browser code, committed configuration or
build arguments. No frontend environment variables are needed. For a VM, place
an HTTPS reverse proxy before the loopback web port. Configure database backups
on the chosen host. Run one migration startup at a time; for multiple replicas,
migrate once in a release job before starting replicas.

## Finish the official checks

1. Open the public product and final 40-character commit URL in a new private
   browser without sign-in. Current local edits are not yet on GitHub.
2. The user supplies/enters a real non-sensitive plan, five linked tasks and three
   actual logs. Do not infer actual times from coding logs or present synthetic
   fixtures as personal use. Check non-zero See totals against source records.
3. Save plan/task/log/reflection through the deployed UI, refresh and compare IDs,
   dates, values and minute units with the database/API. Download one full JSON.
4. Check the exact warning, literal script-shaped text, console, API errors,
   frontend assets, deployment settings and Git history. The pattern scanner is
   supporting evidence, not proof of every possible secret's absence.
5. Complete `SUBMISSION.md` with URLs, observations and the user's own judgments.
   Recheck all 44 fixed acceptance IDs. Keep real records/exports outside Git.

No public host, URL or production credentials were configured in this session.
Local PostgreSQL checks do not establish public deployment acceptance.
