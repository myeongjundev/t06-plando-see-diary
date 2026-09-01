# Local development

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

