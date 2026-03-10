from sqlalchemy import Column, String, Enum, ForeignKey
import enum
from app.db.session import Base
from app.db.models.user import UUIDCol

# UUID type helper
try:
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    UUIDType = PGUUID(as_uuid=True)
except Exception:
    from sqlalchemy.types import CHAR
    UUIDType = CHAR(36)

class AllocationStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    paused = "paused"

class MentorAllocation(Base):
    __tablename__ = "mentor_allocations"
    id = UUIDCol()
    mentor_id = Column(UUIDType, ForeignKey("mentors.id"))
    student_id = Column(UUIDType, ForeignKey("students.id"))
    project_id = Column(UUIDType, ForeignKey("projects.id"))
    status = Column(Enum(AllocationStatus), default=AllocationStatus.active)
