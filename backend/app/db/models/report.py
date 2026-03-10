from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, Text, Float
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

class ReportFortnight(Base):
    __tablename__ = "reports_fortnight"
    id = UUIDCol()
    student_id = Column(UUIDType, ForeignKey("students.id"))
    window_index = Column(Integer, nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    pdf_url = Column(Text, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
    # Fields used by fortnight feedback API
    progress_percentage = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    updated_at = Column(DateTime, nullable=True)
