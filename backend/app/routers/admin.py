from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import RoleEnum
from app.db.models.user import User
from app.db.models.report import ReportFortnight
from app.db.models.payment import Payment
from app.db.models.project import Project
from app.db.models.student import Student 
from app.core.deps import require_admin
from sqlalchemy import func


router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard/metrics")
def metrics(user: User = Depends(require_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_projects = db.query(Project).count()
    total_payments = db.query(Payment).count()
    total_collected = sum(p.amount_inr for p in db.query(Payment).all())
    return {"total_users": total_users, "projects": total_projects, "payments": total_payments, "amount_collected": total_collected}

@router.get("/users")
def admin_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)   # ✅ db is defined HERE
):
    rows = (
        db.query(
            User.id.label("user_id"),
            User.name,
            User.college_email,
            User.college_name,
            Student.internship_type,
            Student.progress_percent
        )
        .join(Student, Student.user_id == User.id)
        .filter(User.role == RoleEnum.student)
        .all()
    )

    return [
        {
            "user_id": str(r.user_id),
            "name": r.name,
            "email": r.college_email,
            "college": r.college_name,
            "internship_type": r.internship_type,
            "progress": r.progress_percent
        }
        for r in rows
    ]

@router.get("/projects")
def admin_projects(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    rows = (
        db.query(
            Project.id,
            Project.title,
            Project.technology,
            func.count(Student.id).label("interns_assigned"),
            Project.is_active
        )
        .outerjoin(Student, Student.project_id == Project.id)
        .group_by(Project.id)
        .all()
    )

    return [
        {
            "project_id": str(r.id),
            "title": r.title,
            "technology": r.technology,
            "interns_assigned": r.interns_assigned,
            "status": "Active" if r.is_active else "Inactive"
        }
        for r in rows
    ]


from app.db.models.payment import Payment
from app.db.models.student import Student
from app.db.models.user import User

@router.get("/payments")
def admin_payments(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    rows = (
        db.query(
            User.name.label("student_name"),
            Payment.amount_inr,
            Payment.created_at,
            Payment.status
        )
        .join(Student, Student.id == Payment.student_id)
        .join(User, User.id == Student.user_id)
        .order_by(Payment.created_at.desc())
        .all()
    )

    return [
        {
            "student_name": r.student_name,
            "amount": r.amount_inr,
            "date": r.created_at,
            "status": r.status
        }
        for r in rows
    ]


from sqlalchemy.orm import aliased

from app.db.models.mentor import Mentor
from app.db.models.mentor_allocation import MentorAllocation
from app.db.models.user import User
from app.db.models.student import Student
from app.db.models.project import Project

@router.get("/mentors")
def admin_mentors(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    MentorUser = aliased(User)
    StudentUser = aliased(User)

    rows = (
        db.query(
            MentorUser.name.label("mentor_name"),
            Project.title.label("project_title"),
            StudentUser.name.label("student_name"),
            MentorAllocation.status,
            Mentor.active
        )
        .join(Mentor, Mentor.id == MentorAllocation.mentor_id)
        .join(MentorUser, MentorUser.id == Mentor.user_id)
        .join(Student, Student.id == MentorAllocation.student_id)
        .join(StudentUser, StudentUser.id == Student.user_id)
        .join(Project, Project.id == MentorAllocation.project_id)
        .all()
    )

    return [
        {
            "mentor_name": r.mentor_name,
            "project": r.project_title,
            "student_name": r.student_name,
            "status": r.status,
            "active": r.active
        }
        for r in rows
    ]

@router.get("/reports")
def list_all_fortnight_reports(user: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = db.query(ReportFortnight).order_by(ReportFortnight.generated_at.desc()).all()
    return {
        "reports": [
            {
                "id": str(r.id),
                "student_id": str(r.student_id),
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
