from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.lead import LeadStatus
from app.models.user import User
from app.schemas.lead import LeadCreate, LeadResponse, LeadUpdate, NoteCreate, NoteResponse
from app.services.lead_service import (
    add_note,
    create_lead,
    delete_lead,
    get_lead_by_id,
    get_overdue_follow_ups,
    get_todays_follow_ups,
    list_leads,
    update_lead,
)

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead_api(
    payload: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Any authenticated user can create and assign leads.
    _ = current_user
    return create_lead(db, payload)


@router.get("", response_model=list[LeadResponse])
def list_leads_api(
    q: str | None = Query(default=None, description="Search by name or phone"),
    status_filter: LeadStatus | None = Query(default=None, alias="status"),
    my_only: bool = Query(default=False, description="Force only own leads"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_leads(db, current_user, q=q, status_filter=status_filter, my_only=my_only)


@router.get("/followups/today", response_model=list[LeadResponse])
def today_followups_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_todays_follow_ups(db, current_user)


@router.get("/followups/overdue", response_model=list[LeadResponse])
def overdue_followups_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_overdue_follow_ups(db, current_user)


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead_api(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_lead_by_id(db, lead_id, current_user)


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead_api(
    lead_id: int,
    payload: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = get_lead_by_id(db, lead_id, current_user)
    return update_lead(db, lead, payload)


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead_api(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = get_lead_by_id(db, lead_id, current_user)
    delete_lead(db, lead)
    return None


@router.post("/{lead_id}/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def add_note_api(
    lead_id: int,
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = get_lead_by_id(db, lead_id, current_user)
    return add_note(db, lead, current_user, payload)
