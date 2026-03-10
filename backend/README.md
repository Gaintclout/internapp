# Interns App Backend (FastAPI)

## Quick Start

```bash
cd interns_app_backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env  # edit if needed


```

Open http://127.0.0.1:8000/health

## Default DB
- Uses SQLite file `internapp.db` by default.
- Set `DATABASE_URL` in `.env` for PostgreSQL.u

## Auth
- /auth/register-student
- /auth/login

## Payments (Manual UPI)
- /payments/project   (Form: payment_id)
- /payments/certificate (Form: payment_id)

## Projects
- /projects/suggestions
- /projects/select
- /projects/materials

## Tasks & Submissions
- /tasks
- /submissions  (Form: task_id, code)

## Certificates
- /certificates/download
```

## Notes
- Configure Judge0 in `.env` for real execution.
- This is a starter skeleton; extend admin/mentor views and task pass checks as needed.
