

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import User, RoleEnum
from app.db.models.student import Student
from app.db.models.project import Project
from app.core.deps import require_mentor

router = APIRouter(prefix="/mentors", tags=["mentors"])
@router.get("/dashboard")
def mentor_dashboard(
    mentor: User = Depends(require_mentor),
    db: Session = Depends(get_db)
):
    interns = (
        db.query(
            User.name.label("intern_name"),
            Project.title.label("project"),
            Student.progress_percent.label("progress")
        )
        .join(Student, Student.user_id == User.id)
        .join(Project, Project.id == Student.project_id)
        .filter(Student.progress_percent >= 100)
        .all()
    )

    return [
        {
            "intern_name": i.intern_name,
            "project": i.project,
            "progress": f"{int(i.progress)}%",
            "feedback": "Completed"
        }
        for i in interns
    ]
