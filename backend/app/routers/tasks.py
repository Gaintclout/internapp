from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.student import Student
from app.db.models.student_project import StudentProject
from app.services.unlocks import visible_tasks_for_student

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/")
def list_visible_tasks(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get student profile
    st = db.query(Student).filter(Student.user_id == user.id).first()
    if not st:
        raise HTTPException(status_code=400, detail="Not registered as student")

    # Get assigned project
    sp = db.query(StudentProject).filter(StudentProject.student_id == st.id).first()
    if not sp or not sp.project_id:
        raise HTTPException(status_code=400, detail="No project selected")

    # Return visible tasks logic
    from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.student import Student
from app.db.models.student_project import StudentProject
from app.services.unlocks import visible_tasks_for_student

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/")
def list_visible_tasks(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get student profile
    st = db.query(Student).filter(Student.user_id == user.id).first()
    if not st:
        raise HTTPException(status_code=400, detail="Not registered as student")

    # Get assigned project
    sp = db.query(StudentProject).filter(StudentProject.student_id == st.id).first()
    if not sp or not sp.project_id:
        raise HTTPException(status_code=400, detail="No project selected")

    # Return visible tasks logic
    return visible_tasks_for_student(db, sp)

