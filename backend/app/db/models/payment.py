from sqlalchemy import Column, String, Integer, Enum, DateTime, ForeignKey, Text
from datetime import datetime
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

class PaymentPurpose(str, enum.Enum):
    project = "project"
    certificate = "certificate"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    success = "success"

class Payment(Base):
    __tablename__ = "payments"
    id = UUIDCol()
    student_id = Column(UUIDType, ForeignKey("students.id"), nullable=False)
    purpose = Column(Enum(PaymentPurpose), nullable=False)
    amount_inr = Column(Integer, nullable=False)
    payment_mode = Column(String, default="upi")
    payment_id = Column(String, nullable=False)  # UPI txn ID
    screenshot_url = Column(Text, nullable=True)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.success)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
