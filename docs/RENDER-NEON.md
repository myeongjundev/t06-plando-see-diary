# Render Free + Neon Free deployment

Selected by the user on 2026-09-01 for approximately three months of low-traffic
coursework hosting. Supersedes the GCP VM proposal; no new GCP VM is needed.

## 1. Create the database

Sign in at [Neon](https://neon.com/), select the Free plan, and create a project
named `t06-plando-see-diary`. Prefer AWS US West (Oregon) to match the Render
service. Select PostgreSQL 17 if offered (the version tested locally).

From Connect, select the primary branch and database. Copy the direct/unpooled
PostgreSQL connection URL for this small single-service app. Keep the generated
TLS parameters, including sslmode=require. Use this URL only in Render's secret
DATABASE_URL field; never put it into Git, chat, screenshots or frontend variables.
Direct connections also support the startup Alembic migration without transaction
pooler restrictions. The Flask app normalizes postgresql:// to psycopg automatically.

## 2. Create the free web service

Sign in at [Render](https://dashboard.render.com/) and connect the GitHub repository
`myeongjundev/t06-plando-see-diary`. Choose New → Blueprint and select `main`.
The committed `render.yaml` defines one Free Docker web service in Oregon.
When prompted for DATABASE_URL, paste the Neon connection URL. Review that the
service uses the Free plan and that no Render database or paid resource is included.

Alternatively, New → Web Service with the same repository:

| Field | Value |
|---|---|
| Branch | main |
| Runtime | Docker |
| Root directory | repository root (leave blank) |
| Dockerfile | ./Dockerfile |
| Region | Oregon |
| Instance type | Free |
| DATABASE_URL | Neon secret URL |
| REQUIRE_POSTGRES | 1 |
| Health check | /api/live |

Keep the Dockerfile's startup command. It runs migrations then Waitress on PORT.
After the deploy is Live, open Render's generated HTTPS onrender.com URL.
The Docker build includes React; a separate frontend service is unnecessary.

## 3. Verify and record

- Open `/api/health` once: expect status ok and database postgresql. `/api/live`
  only proves that the HTTP process is responding; it does not verify the DB.
- Save synthetic plan/task/log/reflection records, refresh and compare values.
- Download full JSON, check sources in See, and verify the public-data warning.
- After an idle interval, confirm that the first real request reconnects and that
  previously saved records remain. SQLAlchemy pre-ping checks reused connections.
- Complete the public/private-browser and real-use requirements in SUBMISSION.md.
  Do not commit real user records or exports as evidence.

## Free-tier behavior

Render Free sleeps after 15 minutes without inbound traffic; waking takes about
one minute. Neon Free has no fixed trial expiry, but has monthly compute/network
quotas and 0.5 GB storage per project. Hosting is $0 only while within current
free allowances; account verification or exhausted quotas can block deployment.

Render's repeated platform checks use `/api/live` to avoid sending continuous
database queries that prevent Neon from sleeping. Do not schedule pings to keep
the app or DB awake. The DB-aware `/api/health` is for explicit verification.

Keep Neon on Free, enable its idle scale-to-zero behavior, and check usage in both
dashboards. Back up important records with JSON export before ending the project.

Sources checked 2026-09-01:
- https://render.com/docs/free
- https://render.com/docs/blueprint-spec
- https://neon.com/pricing

Status: deployment configuration prepared; account connection and actual public
deployment still need verification. A checked-in blueprint is not a deployed URL.
