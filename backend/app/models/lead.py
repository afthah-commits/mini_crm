from enum import Enum

from sqlalchemy import Column, Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class LeadStatus(str, Enum):
    NEW = "New"
    CONTACTED = "Contacted"
    INTERESTED = "Interested"
    CLOSED = "Closed"


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    source = Column(String, nullable=True)
    status = Column(SqlEnum(LeadStatus), default=LeadStatus.NEW, nullable=False)
    follow_up_date = Column(Date, nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    assignee = relationship("User", back_populates="assigned_leads")
    notes = relationship("Note", back_populates="lead", cascade="all, delete-orphan")
