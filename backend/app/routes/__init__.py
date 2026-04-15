from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.leads import router as leads_router
from app.routes.users import router as users_router

__all__ = ["auth_router", "leads_router", "dashboard_router", "users_router"]
