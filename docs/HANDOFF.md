# T06 handoff · Render + Neon deployment preparation

## 1. Goal

Deploy Cards 1–5 using Render Free and Neon Free for approximately three months,
then complete public acceptance and submission evidence.

## 2. Current state

Latest: user created Neon project green-pine-50634235 and Render Free at
https://t06-plando-see-diary.onrender.com. /api/live and /api/health return 200,
but the initial root URL returned 404. Waitress resolves the installed app package
from site-packages; Config's source-relative frontend path was wrong there.
Fix: Docker STATIC_DIST=/app/frontend/dist, factory environment override, and
fail production startup if index.html is absent. Earlier account-pending notes
below are historical and superseded by this update.

Cards 1–4 are implemented locally: plans/revisions, tasks/tags, execution logs,
atomic keyed completion, seven See metrics with source records, reflections and
atomic next-plan links. Card 5 exports all seven tables from one snapshot,
including deleted tasks/history; the JSON contract maps every stored column.

The user chose Render Free + Neon Free, superseding the GCP proposals. render.yaml
uses the existing non-root Waitress Docker image and prompts for secret DATABASE_URL.
Startup migrates before serving React and /api on one origin. /api/live is the
DB-independent hosting probe; /api/health explicitly checks PostgreSQL. SQLAlchemy
pre-ping checks reused connections after DB sleep without background queries.

Render's browser is at Sign In. No Render/Neon CLI or connector was available;
GitHub CLI is authenticated as myeongjundev. The user was asked to sign into Render
with GitHub while local preparation was finished. Neon account/DB are not yet
verified. Do not claim a public deployment or URL exists.

## 3. Run commands

Repository: C:\gov\project\skt aleph\t06-plando-see-diary.
Backend: `.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term`.
Frontend: `npm run build`.
Root: `docker compose up --build -d` for the LOCAL PostgreSQL stack on port 8000.
Backend: `python scripts/postgres_smoke.py`, restart web and wait until healthy,
then `python scripts/postgres_smoke.py --verify`. This writes synthetic local data.
Backend: `python scripts/audit_secrets.py` scans common patterns without printing values.
Use docs/RENDER-NEON.md for cloud setup. Never paste DATABASE_URL into chat or Git.

## 4. Passed acceptance IDs

Latest: 53 tests pass. Rebuilt image tested from /tmp imports the installed
package and serves / and all referenced JS/CSS assets with HTTP 200.

Cards 1–4 (C04–C33/C83) retain local regression coverage. C36 local validates
all exported tables/IDs/history against the canonical schema. C82 local warning
is exact. C57 local script-shaped text renders literally without a script node.
Local browser download reports success, with no warning/error console entries.

Latest run: 52 backend tests passed, 91% coverage; frontend build passed.
The new test fails if /api/live attempts any database session/engine access.
Prior production Docker build, PostgreSQL migrations and schema check passed.
Four concurrent completion requests produced one event; four next-plan requests
produced one linked plan. Web restart preserved all exported values except time.
Synthetic See: 5 tasks, 1 completed, 3 blocked, estimated 300, actual 150, variance -150.
Prior Git/worktree/bundle credential-pattern scan found no concrete credentials.

## 5. Failed or unrun acceptance IDs

No final test failures. 12 existing get_engine deprecation warnings remain.
Production local browser port 8000 was blocked by the browser tool; HTTP and DB
checks passed, while UI checks used dev port 5173.
Public C01, deployed C34/C35, comprehensive live C58 and actual-use C78–C81 are
unrun. C59/C60 have a draft; public URL and the user's own judgments are missing.
Actual Neon idle/reconnect and Render startup behavior still require cloud verification.

## 6. Next action

Immediate: push the frontend-path fix and wait for Render's auto-deploy, then
verify the PUBLIC root page, assets and browser before reporting recovery.

Finish Render sign-in, create a Neon Free project, then configure DATABASE_URL
in Render and create the free blueprint from main. The user directly enters
secrets in provider settings. Verify the generated HTTPS URL, DB readiness, save/
refresh/export, first request after idle and private-browser access. Complete
SUBMISSION.md with actual non-sensitive records and user-confirmed judgments.

## 7. Do not change

Keep all 44 fixed acceptance expectations. No T06 authentication. Preserve UUIDs,
revisions, minute units, UTC instants, Seoul dates, soft deletion, deterministic
sorting, task locks/idempotency keys and atomic next-plan linking. See counts
current non-deleted tasks in its declared due-date cohort.
Do not create the superseded GCP VM or any paid hosting plan. Keep Render/Neon
within free quotas and retain idle sleep. Do not add periodic keep-awake pings.
Do not commit secrets, actual diary records, private exports or local databases.
Do not invent actual times, user judgment or rejected AI advice.

## 8. Changed files

Root-page fix: Dockerfile, backend/app/__init__.py and test_card5_export.py;
deployment guide, status and this handoff record the production failure and checks.

Cards 3–5: backend models/services/APIs, additive migrations, acceptance tests,
PostgreSQL smoke and credential audit scripts; frontend Do/See/export panels;
canonical contract; Docker/Compose/launch configuration and project documentation.
This deployment step adds render.yaml and docs/RENDER-NEON.md, the DB-independent
/api/live route/test, SQLAlchemy pre-ping, and updated deployment decisions/status.
GCP-SETUP.md is retained as a superseded proposal.

## 9. Git state

Branch main; origin https://github.com/myeongjundev/t06-plando-see-diary.git.
Start HEAD f8e04fd1d9c413ccf6999a9d666f78f6f3e349b2. Cards 3–5 and free-hosting
preparation were committed and pushed to origin/main as
150a9052610705dad52274d94d28f674ab07d324. A documentation-only follow-up records
this result. No application changes remain uncommitted.
Only ignored local databases, .env, dependency folders and tmp evidence remain local.
