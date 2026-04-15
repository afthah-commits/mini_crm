from datetime import date, datetime

from pydantic import BaseModel, EmailStr

from app.models.lead import LeadStatus
from app.schemas.auth import UserResponse


class NoteCreate(BaseModel):
    content: str


class NoteResponse(BaseModel):
    id: int
    content: str
    lead_id: int
    author: UserResponse
    created_at: datetime

    class Config:
        from_attributes = True


class LeadBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    source: str | None = None
    status: LeadStatus = LeadStatus.NEW
    follow_up_date: date | None = None
    assigned_to: int | None = None


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    source: str | None = None
    status: LeadStatus | None = None
    follow_up_date: date | None = None
    assigned_to: int | None = None


class LeadResponse(LeadBase):
    id: int
    created_at: datetime
    updated_at: datetime
    assignee: UserResponse | None = None
    notes: list[NoteResponse] = []

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    total_leads: int
    leads_by_status: dict[str, int]
    user_assigned_leads: int
