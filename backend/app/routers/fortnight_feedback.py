# app/routers/fortnight_feedback.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import require_mentor
from app.db.session import get_db
from app.db.models.user import User, RoleEnum
from app.db.models.report import ReportFortnight
from datetime import datetime
import uuid
from fastapi.responses import StreamingResponse
from app.services.reports_pdf import generate_fortnight_pdf
from io import BytesIO

router = APIRouter(prefix="/fortnight", tags=["fortnight-feedback"])

@router.post("/update")
def update_fortnight_feedback(
    report_id: str,
    progress_percentage: float,
    feedback: str,
    user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    if user.role != RoleEnum.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can update reports")

    # Validate report_id as UUID to avoid SQL errors
    try:
        uuid.UUID(str(report_id))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report_id")

    report = db.query(ReportFortnight).filter(ReportFortnight.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.progress_percentage = progress_percentage
    report.feedback = feedback
    report.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Fortnight feedback updated successfully"}

@router.get("/student/{student_id}")
def get_report(student_id: str, db = Depends(get_db)):
    from datetime import datetime, timedelta
    # example: last 15 days
    to_date = datetime.utcnow()
    from_date = to_date - timedelta(days=15)
    pdf_bytes = generate_fortnight_pdf(db, student_id, from_date, to_date)
    return StreamingResponse(BytesIO(pdf_bytes), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=fortnight_{student_id}.pdf"})

# Helpers to manage/create fortnight report records so mentors can obtain IDs

@router.get("/list")
def list_reports(student_id: str, db: Session = Depends(get_db)):
    rows = db.query(ReportFortnight).filter(ReportFortnight.student_id == student_id).order_by(ReportFortnight.period_start.asc()).all()
    return {
        "reports": [
            {
                "id": str(r.id),
                "window_index": r.window_index,
                "period_start": r.period_start.isoformat() if r.period_start else None,
                "period_end": r.period_end.isoformat() if r.period_end else None,
                "progress_percentage": r.progress_percentage,
                "feedback": r.feedback,
                "generated_at": r.generated_at.isoformat() if r.generated_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            }
            for r in rows
        ]
    }

@router.post("/create")
def create_report_record(
    student_id: str,
    window_index: int,
    period_start: str,
    period_end: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_mentor),
):
    # parse dates
    try:
        ps = datetime.fromisoformat(period_start).date()
        pe = datetime.fromisoformat(period_end).date()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format; use ISO YYYY-MM-DD")

    r = ReportFortnight(
        student_id=student_id,
        window_index=window_index,
        period_start=ps,
        period_end=pe,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return {"id": str(r.id)}





