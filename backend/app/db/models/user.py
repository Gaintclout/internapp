from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid, enum
from datetime import datetime
from app.db.session import Base
from sqlalchemy.types import CHAR
from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy import Text   


class RoleEnum(str, enum.Enum):
    student = "student"
    admin = "admin"
    mentor = "mentor"

def UUIDCol():
    try:
        from sqlalchemy.dialects.postgresql import UUID as PGUUID
        return Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    except Exception:
        # SQLite fallback as CHAR(36)
        return Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))

class User(Base):
    __tablename__ = "users"
    id = UUIDCol()
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.student)
    name = Column(String, nullable=False)
    college_email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    otp = Column(String, nullable=True)
    photo = Column(Text, nullable=True) 
    bio = Column(Text, nullable=True)    
    password_hash = Column(String, nullable=False)
    college_name = Column(String, nullable=True)
    pursuing_year = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="user", uselist=False)
    mentor = relationship("Mentor", back_populates="user", uselist=False)
