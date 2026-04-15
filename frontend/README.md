# Lead Management Frontend (React + Tailwind)

## Setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - `copy .env.example .env`
3. Run app:
   - `npm run dev`

App URL: `http://localhost:5173`

## Connected Backend APIs

Set `VITE_API_BASE_URL` in `.env` to your FastAPI base:

`http://127.0.0.1:8000/api/v1`

## Implemented UI Features

- JWT login/register pages
- Responsive layout:
  - Desktop sidebar
  - Mobile top navbar
- Dashboard:
  - Total leads
  - Leads by status
  - User-specific lead count
  - Today's and overdue follow-ups
- Leads:
  - Create/update/delete
  - Search by name or phone
  - Filter by status
  - Notes history and note creation
- Loading states and toast notifications
