from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.db.models.user import UUIDCol

# UUID type helper
try:
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    UUIDType = PGUUID(as_uuid=True)
except Exception:
    from sqlalchemy.types import CHAR
    UUIDType = CHAR(36)

class Mentor(Base):
    __tablename__ = "mentors"
    id = UUIDCol()
    user_id = Column(UUIDType, ForeignKey("users.id"), unique=True, nullable=False)
    expertise = Column(String, nullable=True)
    active = Column(Boolean, default=True)

    user = relationship("User", back_populates="mentor")
