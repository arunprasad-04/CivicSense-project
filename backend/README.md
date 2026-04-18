# CivicSense Backend (MVP)

This is a minimal FastAPI backend backed by Postgres + PostGIS.

## Run

Start Postgres + PostGIS:

```bash
cd ..
docker compose up -d
```

Copy the example env file if you want to override the defaults:

```bash
cd backend
copy .env.example .env
```

Then run the API:

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints

- POST /api/reports
- GET /api/reports/{id}
- GET /api/reports/nearby?lat=..&lng=..&radius=..
- GET /api/citizen/reports
- GET /api/health

## Configuration

Set the database connection string with `DATABASE_URL`. See
[backend/.env.example](backend/.env.example) for the default local value.
