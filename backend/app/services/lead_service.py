from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session, joinedload

from app.models.lead import Lead, LeadStatus
from app.models.note import Note
from app.models.user import User, UserRole
from app.schemas.lead import LeadCreate, LeadUpdate, NoteCreate


def _ensure_assignee_exists(db: Session, assignee_id: int | None) -> None:
    if assignee_id is None:
        return
    user = db.query(User).filter(User.id == assignee_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assigned user not found")


def _can_access_lead(user: User, lead: Lead) -> bool:
    return user.role == UserRole.ADMIN or lead.assigned_to == user.id


def create_lead(db: Session, payload: LeadCreate) -> Lead:
    _ensure_assignee_exists(db, payload.assigned_to)
    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def list_leads(
    db: Session,
    current_user: User,
    q: str | None = None,
    status_filter: LeadStatus | None = None,
    my_only: bool = False,
) -> list[Lead]:
    query = db.query(Lead).options(joinedload(Lead.assignee), joinedload(Lead.notes).joinedload(Note.author))

    if current_user.role != UserRole.ADMIN or my_only:
        query = query.filter(Lead.assigned_to == current_user.id)

    if q:
        like = f"%{q}%"
        query = query.filter(or_(Lead.name.ilike(like), Lead.phone.ilike(like)))

    if status_filter:
        query = query.filter(Lead.status == status_filter)

    return query.order_by(Lead.created_at.desc()).all()


def get_lead_by_id(db: Session, lead_id: int, current_user: User) -> Lead:
    lead = (
        db.query(Lead)
        .options(joinedload(Lead.assignee), joinedload(Lead.notes).joinedload(Note.author))
        .filter(Lead.id == lead_id)
        .first()
    )
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    if not _can_access_lead(current_user, lead):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to access this lead")
    return lead


def update_lead(db: Session, lead: Lead, payload: LeadUpdate) -> Lead:
    if payload.assigned_to is not None:
        _ensure_assignee_exists(db, payload.assigned_to)

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(lead, key, value)

    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(db: Session, lead: Lead) -> None:
    db.delete(lead)
    db.commit()


def add_note(db: Session, lead: Lead, current_user: User, payload: NoteCreate) -> Note:
    note = Note(content=payload.content, lead_id=lead.id, author_id=current_user.id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def get_todays_follow_ups(db: Session, current_user: User) -> list[Lead]:
    query = db.query(Lead).options(joinedload(Lead.assignee)).filter(Lead.follow_up_date == date.today())
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Lead.assigned_to == current_user.id)
    return query.order_by(Lead.follow_up_date.asc()).all()


def get_overdue_follow_ups(db: Session, current_user: User) -> list[Lead]:
    query = db.query(Lead).options(joinedload(Lead.assignee)).filter(
        and_(Lead.follow_up_date.isnot(None), Lead.follow_up_date < date.today())
    )
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Lead.assigned_to == current_user.id)
    return query.order_by(Lead.follow_up_date.asc()).all()
