from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.lead import Lead, LeadStatus
from app.models.user import User, UserRole


def get_dashboard_stats(db: Session, current_user: User) -> dict[str, int | dict[str, int]]:
    base_query = db.query(Lead)
    if current_user.role != UserRole.ADMIN:
        base_query = base_query.filter(Lead.assigned_to == current_user.id)

    total_leads = base_query.count()

    grouped = (
        base_query.with_entities(Lead.status, func.count(Lead.id))
        .group_by(Lead.status)
        .all()
    )
    status_map = {status.value: 0 for status in LeadStatus}
    for status, count in grouped:
        status_map[status.value] = count

    user_assigned_leads = db.query(Lead).filter(Lead.assigned_to == current_user.id).count()

    return {
        "total_leads": total_leads,
        "leads_by_status": status_map,
        "user_assigned_leads": user_assigned_leads,
    }
