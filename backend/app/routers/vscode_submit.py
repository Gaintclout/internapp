from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.routers.auth import get_current_user

from app.db.models.student import Student
from app.db.models.project_tasks import ProjectTask
from app.db.models.student_project import StudentProject
from app.db.models.student_task_status import StudentTaskStatus

from app.services.vscode_submit_logic import evaluate_vscode_submission


# ---------------------------------------
# Router
# ---------------------------------------
router = APIRouter(
    prefix="/vscode",
    tags=["VS Code"]
)


# ---------------------------------------
# Request Schema
# ---------------------------------------
class VSCodeSubmit(BaseModel):
    source_code: str
    framework: Optional[bool] = True


# ---------------------------------------
# Submit Endpoint
# ---------------------------------------
@router.post("/submit")
def vscode_submit(
    payload: VSCodeSubmit,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    print("\n🔥 VS CODE SUBMIT STARTED")

    # ---------------------------------------
    # Only students allowed
    # ---------------------------------------
    if user.role != "student":
        raise HTTPException(
            status_code=403,
            detail="Only students can submit tasks"
        )

    # ---------------------------------------
    # Get student profile
    # ---------------------------------------
    student = (
        db.query(Student)
        .filter(Student.user_id == user.id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=400,
            detail="Student profile missing"
        )

    # ---------------------------------------
    # Get student's selected project
    # ---------------------------------------
    student_project = (
        db.query(StudentProject)
        .filter(StudentProject.student_id == student.id)
        .first()
    )

    if not student_project:
        raise HTTPException(
            status_code=400,
            detail="Student project not found"
        )

    # ---------------------------------------
    # Find unlocked task
    # ---------------------------------------
    task_status = (
        db.query(StudentTaskStatus)
        .filter(
            StudentTaskStatus.student_project_id == student_project.id,
            StudentTaskStatus.unlocked == True
        )
        .order_by(StudentTaskStatus.seq.desc())
        .first()
    )

    if not task_status:
        raise HTTPException(
            status_code=400,
            detail="No unlocked task"
        )

    # ---------------------------------------
    # Get actual task
    # ---------------------------------------
    task = (
        db.query(ProjectTask)
        .filter(ProjectTask.id == task_status.task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=400,
            detail="Task not found"
        )

    print("Student:", student.id)
    print("Task:", task.id, "Seq:", task.seq)

    # ---------------------------------------
    # Run evaluation
    # ---------------------------------------
    result = evaluate_vscode_submission(
        db=db,
        student=student,
        task=task,
        source_code=payload.source_code,
        framework=payload.framework
    )

    return {
        "message": "Evaluation completed",
        "result": result
    }