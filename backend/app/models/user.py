from enum import Enum

from sqlalchemy import Column, DateTime, Enum as SqlEnum, Integer, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserRole(str, Enum):
    ADMIN = "Admin"
    USER = "User"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(SqlEnum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    assigned_leads = relationship("Lead", back_populates="assignee")
    notes = relationship("Note", back_populates="author")
