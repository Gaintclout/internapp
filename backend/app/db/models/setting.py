from sqlalchemy import Column, String, Boolean
from app.db.session import Base
from app.db.models.user import UUIDCol

class Setting(Base):
    __tablename__ = "settings"
    id = UUIDCol()
    upi_id = Column(String, nullable=True)
    qr_image_url = Column(String, nullable=True)
    active = Column(Boolean, default=True)
