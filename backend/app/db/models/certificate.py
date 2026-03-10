# from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text
# from datetime import datetime, date
# from app.db.session import Base
# from app.db.models.user import UUIDCol

# # UUID type helper
# try:
#     from sqlalchemy.dialects.postgresql import UUID as PGUUID
#     UUIDType = PGUUID(as_uuid=True)
# except Exception:
#     from sqlalchemy.types import CHAR
#     UUIDType = CHAR(36)

# class Certificate(Base):
#     __tablename__ = "certificates"
#     id = UUIDCol()
#     student_id = Column(UUIDType, ForeignKey("students.id"), unique=True)
#     project_id = Column(UUIDType, ForeignKey("projects.id"))
#     internship_type = Column(String, nullable=False)
#     completion_date = Column(Date, default=date.today)
#     pdf_url = Column(Text, nullable=True)
#     issued_at = Column(DateTime, default=datetime.utcnow)


from sqlalchemy import Column, Integer, String, Date
from app.db.session import Base



class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    person_name = Column(String, nullable=False)
    joining_date = Column(Date, nullable=False)
    ending_date = Column(Date, nullable=False)
    certificate_id = Column(String, unique=True, nullable=False)
