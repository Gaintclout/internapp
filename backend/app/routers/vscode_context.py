from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.db.models.student import Student
from app.db.models.student_task_status import StudentTaskStatus, TaskState
from app.db.models.project_tasks import ProjectTask
from app.db.models.student_project import StudentProject
from app.db.models.user import User


router = APIRouter(prefix="/vscode", tags=["VSCode"])

@router.get("/context")
def vscode_context(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(400, "Student not found")

    sp = db.query(StudentProject).filter(
        StudentProject.student_id == student.id
    ).first()

    if not sp:
        raise HTTPException(400, "Project not selected")

    sts = db.query(StudentTaskStatus).filter(
        StudentTaskStatus.student_project_id == sp.id,
        StudentTaskStatus.unlocked == True
    ).order_by(StudentTaskStatus.seq.desc()).first()

    if not sts:
        raise HTTPException(400, "No unlocked task")

    return {
        "student_id": str(student.id),

        # ✅ THIS IS THE REAL TASK ID (ProjectTask.id)
        "project_task_id": str(sts.task_id),

        # optional but useful
        "task_seq": sts.seq,
    }
