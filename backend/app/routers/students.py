# app/routers/students.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import User, RoleEnum
from app.db.models.student import Student, InternshipType
from app.schemas.student import StudentProfileUpdate, ReportWindow
from app.services.reports import fortnight_windows
from app.core.deps import require_student



router = APIRouter(prefix="/students", tags=["students"])


@router.put("/profile")
def update_profile(
    body: StudentProfileUpdate,
    user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    if user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Only students can update profile")

    st = db.query(Student).filter(Student.user_id == user.id).first()
    if not st:
        raise HTTPException(status_code=404, detail="Student profile not found for this user")

    # Pydantic already gives us an InternshipType enum or None
    if body.internship_type is not None:
        st.internship_type = body.internship_type

    # Update other optional fields only when provided
    if body.preferred_language is not None:
        st.preferred_language = body.preferred_language
    if body.area_of_interest is not None:
        st.area_of_interest = body.area_of_interest
    if body.uploads_recent_memo_url is not None:
        st.uploads_recent_memo_url = body.uploads_recent_memo_url
    if body.uploads_allotment_letter_url is not None:
        st.uploads_allotment_letter_url = body.uploads_allotment_letter_url
    if body.photo is not None:
        user.photo = body.photo

    if body.bio is not None:
        user.bio = body.bio

    db.add(st)
    db.commit()
    db.refresh(st)

    return {"message": "Profile updated", "student_id": str(st.id),"photo": user.photo}


@router.get("/reports")
def list_report_windows(user: User = Depends(require_student), db: Session = Depends(get_db)):
    st = db.query(Student).filter(Student.user_id == user.id).first()
    if not st or not st.project_start_date or not st.internship_type:
        return {"windows": []}
    wins = fortnight_windows(st.project_start_date, st.internship_type.value)
    return {"windows": wins}
