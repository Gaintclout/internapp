from sqlalchemy import Column, String, Enum, Date, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.db.session import Base
from app.db.models.user import UUIDCol
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, Integer

# UUID type compatible with Postgres (UUID) and SQLite fallback (CHAR(36))
try:
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    UUIDType = PGUUID(as_uuid=True)
except Exception:
    from sqlalchemy.types import CHAR
    UUIDType = CHAR(36)

class InternshipType(str, enum.Enum):
    fasttrack = "fasttrack"
    days45 = "days45"
    semester4m = "semester4m"

class Student(Base):
    __tablename__ = "students"
    id = UUIDCol()
    user_id = Column(UUIDType, ForeignKey("users.id"), unique=True, nullable=False)
    internship_type = Column(Enum(InternshipType), nullable=True)
    uploads_recent_memo_url = Column(Text, nullable=True)
    uploads_allotment_letter_url = Column(Text, nullable=True)
    preferred_language = Column(String, nullable=True)
    area_of_interest = Column(String, nullable=True)
    project_id = Column(UUIDType, ForeignKey("projects.id"), nullable=True)
    project_start_date = Column(Date, nullable=True)
    progress_percent = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    current_task_seq = Column(Integer, default=1)

    user = relationship("User", back_populates="student")
    student_projects = relationship("StudentProject", back_populates="student")

    
