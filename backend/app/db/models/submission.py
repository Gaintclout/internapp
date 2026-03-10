from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from datetime import datetime
from app.db.session import Base
from app.db.models.user import UUIDCol

# UUID type helper
try:
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    UUIDType = PGUUID(as_uuid=True)
except Exception:
    from sqlalchemy.types import CHAR
    UUIDType = CHAR(36)

class Submission(Base):
    __tablename__ = "submissions"
    id = UUIDCol()
    student_id = Column(UUIDType, ForeignKey("students.id"))
    task_id = Column(UUIDType, ForeignKey("project_tasks.id"))
    code_url = Column(Text, nullable=True)
    judge0_token = Column(Text, nullable=True)
    judge0_status = Column(Text, nullable=True)  # Keep as text (portable)
    passed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
