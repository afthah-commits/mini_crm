# Deployment Guide

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available)
- PostgreSQL database URL
- GitHub repository (already pushed)

### Steps:

1. **Create a Web Service on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `mini_crm`
   - Choose `main` branch

2. **Configure the Service:**
   - **Name:** `mini-crm-api` (or any name)
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** `backend`

3. **Add Environment Variables:**
   In Render dashboard, go to "Environment" and add:
   ```
   DATABASE_URL=your_postgresql_url
   SECRET_KEY=your_secret_key_here
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete (2-5 minutes)
   - Your API will be live at `https://mini-crm-api.onrender.com`

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository

### Steps:

1. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository `mini_crm`
   - Vercel will auto-detect it's a Vite project

2. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `frontend`

3. **Add Environment Variables:**
   In Vercel dashboard, add environment variable:
   ```
   VITE_API_URL=https://mini-crm-api.onrender.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment (1-2 minutes)
   - Your app will be live at `https://yourproject.vercel.app`

---

## Update Backend CORS

After getting your Vercel URL, update your backend `app/core/config.py`:

```python
CORS_ORIGINS = ["https://yourproject.vercel.app", "http://localhost:3000"]
```

Then redeploy the backend on Render.

---

## Database Setup (if needed)

If you don't have a PostgreSQL database yet:

### Option 1: Free PostgreSQL (Railway)
1. Go to [railway.app](https://railway.app)
2. Create account, add PostgreSQL plugin
3. Copy the database URL

### Option 2: Free PostgreSQL (Supabase)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get the connection string from Settings → Database

---

## Test Deployment

1. Visit your frontend URL: `https://yourproject.vercel.app`
2. Try to login/register
3. Check browser console for any API errors
4. Verify API is responding at `https://mini-crm-api.onrender.com`

---

## Troubleshooting

### Backend not connecting to database:
- Check DATABASE_URL in Render environment
- Ensure PostgreSQL server is accessible
- Check logs in Render dashboard

### Frontend showing "Cannot connect to API":
- Verify backend URL in `VITE_API_URL`
- Check CORS settings in backend
- Check browser console for exact error

### Build fails on Vercel:
- Check that root directory is set to `frontend`
- Ensure `npm run build` works locally
- Check build logs in Vercel dashboard

---

## Next Steps

After successful deployment:
1. Test all features (login, create lead, dashboard)
2. Monitor error logs regularly
3. Set up error tracking (optional: Sentry)
4. Plan database backups
