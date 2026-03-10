# app/schemas/student.py
from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.db.models.student import InternshipType

class StudentProfileUpdate(BaseModel):
    """
    All fields optional so the frontend can send partial updates (PATCH-like behavior).
    Using InternshipType (the Enum) makes FastAPI accept the enum values:
      "fasttrack", "days45", "semester4m"
    """
    internship_type: Optional[InternshipType] = None
    preferred_language: Optional[str] = None
    area_of_interest: Optional[str] = None
    uploads_recent_memo_url: Optional[str] = None
    uploads_allotment_letter_url: Optional[str] = None
    photo: Optional[str] = None   # base64 image
    bio: Optional[str] = None

class ReportWindow(BaseModel):
    start: date
    end: date
    label: Optional[str] = None
