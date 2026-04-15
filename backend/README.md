# Lead Management Backend (FastAPI)

## 1) Setup

1. Create virtual environment:
   - Windows PowerShell: `python -m venv .venv`
2. Activate:
   - `.\.venv\Scripts\Activate.ps1`
3. Install packages:
   - `pip install -r requirements.txt`
4. Copy env:
   - `copy .env.example .env`
5. Update `.env` database credentials as needed.

## 2) Run

`uvicorn app.main:app --reload`

API base URL: `http://127.0.0.1:8000/api/v1`

Swagger docs: `http://127.0.0.1:8000/docs`

## 3) Implemented Features

- JWT registration/login (`Admin` and `User` roles)
- Lead CRUD
- Lead assignment to users
- Lead status updates (`New`, `Contacted`, `Interested`, `Closed`)
- Follow-up date support + today/overdue endpoints
- Notes per lead with history
- Dashboard summary (total, by status, user-assigned leads)
- Search by name/phone + status filter
- CORS + env-based configuration (deployment ready baseline)
