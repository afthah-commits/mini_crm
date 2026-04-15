from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.routes import auth_router, dashboard_router, leads_router, users_router

app = FastAPI(title=settings.APP_NAME)

# Create database tables on startup (with error handling)
@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database initialization warning: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(leads_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(users_router, prefix=settings.API_PREFIX)


@app.get("/")
def health_check():
    return {"message": "Lead Management API is running"}
