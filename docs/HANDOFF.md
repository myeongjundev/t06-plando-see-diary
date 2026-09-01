# T06 handoff · Plan/Do/See usability

## 1. Goal

Implement the user's approved first three improvements: saved plans first,
consistent plan selection with step navigation, and mobile datetime layout.

## 2. Current state

Saved plans precede the optional create form. With no plans, creation is immediately
available after loading. Creating a plan selects it and focuses Do. The sticky
Plan/Do/See links navigate mounted sections; same-plan drafts survive navigation.
App owns one plan selection, passed to both Do and See. Changing plans remounts
TaskPanel to prevent old filters/tasks/drafts from being carried to another plan.
Next-plan creation and existing reflection links update the shared selection.
ExecutionPanel now spans the full card, with shrinkable native inputs and grid
children. Mobile step labels and priority badges remain readable at 320px.

Previous design/font deployment is live; this usability change awaits push and
public asset confirmation at this checkpoint. No backend/schema/CSP changes.

## 3. Run commands

Repository: C:\gov\project\skt aleph\t06-plando-see-diary.
`npm --prefix frontend run build`.
`backend/.venv/Scripts/python.exe -m pytest backend/tests -q`.
Local browser verification uses ignored tmp/review_design_server.py with isolated
synthetic SQLite records on 5173; --empty serves a separate empty fixture on 5181.
These are single-threaded temporary review servers, not deployment launchers.

## 4. Passed acceptance IDs

Build and 53 existing tests passed. Targeted synthetic UI checks:
- Exact public warning, priority literal high, stored success criterion and sort
  rule remain present (C05/C06/C15/C20/C82).
- Selecting plan B shows its one task and 20-minute estimate in both Do and See;
  plan A retains its five-task cohort (C28/C32).
- A task draft survives Do -> See -> Do, retaining the same selected plan.
- Empty-state plan creation selects the returned plan, closes the form and focuses
  Do below the sticky bar. Reload preserves its dates/criterion and hides the form.
- A 25-minute mobile execution saves and See updates to 25 actual minutes, while
  the original estimate stays 20 (C23–C27/C32).
- Saving a reflection and creating its next plan preserves the exact improvement,
  selects the next plan and focuses Plan. Returning through the existing reflection
  link also selects that plan (C33).
- At 320px, document width is 320px; datetime fields are 228px wide, right edge 274px
  inside their card's right edge 287px. high uses nowrap. Desktop layout also checked.

## 5. Failed or unrun acceptance IDs

No failing tests; 12 existing get_engine deprecation warnings. Browser native
 datetime fill needed keyboard confirmation; the saved record succeeded afterward.
Public interaction/persistence/export, private-browser access, real-use C78–C81 and
final user judgment lines remain pending. This is not a full 44-ID certification.
The fourth suggestion (natural-language metric interpretation) was not part of
this first-three-improvements implementation.

## 6. Next action

Commit/push and verify the new public assets; then complete final submission checks.

## 7. Do not change

Keep all 44 fixed expectations, exact warning, no T06 authentication, immutable
IDs/history, units/time rules, source records and transaction semantics. Keep free
Render/Neon idle behavior. Never commit real records or credentials.

## 8. Changed files

App.tsx controls plan selection, creation visibility and step navigation.
TaskPanel.tsx consumes the selected plan and moves execution forms across the card.
SeePanel.tsx consumes that same plan and connects next-plan navigation.
styles.css adds sticky navigation, selected-card styling and mobile layout fixes.
STATUS/DECISIONS/HANDOFF record scope and verification.

## 9. Git state

Started at b5a056e on main. Current usability implementation and documentation are
prepared for commit/push. Temporary scripts, databases and build outputs are ignored.
A deployment follow-up will record the application commit and source URL.

---

# Historical handoff · Render + Neon deployment preparation

The current nine-section handoff above supersedes the account/deployment status below.

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
Fix commit 7bb42551308c5d90ab717227982d563e5b9f7a99 was pushed and auto-deployed.
Public root HTML, referenced JS/CSS, /api/live and /api/health all return 200.
The browser tool blocked this origin; user visual confirmation is still needed.

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

Immediate: user reloads the public URL to confirm the rendered screen. HTTP root,
assets and PostgreSQL readiness are verified after the fix; continue deployed
save/refresh/export and actual-use checks.

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

Runtime fix commit: 7bb42551308c5d90ab717227982d563e5b9f7a99, pushed to main and
verified publicly. This documentation-only follow-up records recovery.

Branch main; origin https://github.com/myeongjundev/t06-plando-see-diary.git.
Start HEAD f8e04fd1d9c413ccf6999a9d666f78f6f3e349b2. Cards 3–5 and free-hosting
preparation were committed and pushed to origin/main as
150a9052610705dad52274d94d28f674ab07d324. A documentation-only follow-up records
this result. No application changes remain uncommitted.
Only ignored local databases, .env, dependency folders and tmp evidence remain local.
