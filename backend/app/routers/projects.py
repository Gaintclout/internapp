from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from fastapi.responses import FileResponse
import os
from app.db.session import get_db
from app.db.models.user import User, RoleEnum
from app.db.models.student import Student
from app.db.models.project import Project
from app.db.models.payment import Payment, PaymentPurpose, PaymentStatus
from app.core.deps import get_current_user
from app.services.task_assigner import assign_tasks_for_student
from app.db.models.student_project import StudentProject
from app.db.models.project_internship_files import ProjectInternshipFiles


router = APIRouter(prefix="/projects", tags=["projects"])
@router.get("/suggestions")
def suggestions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    # Ensure student record exists
    st = db.query(Student).filter(Student.user_id == user.id).first()
    if st is None:
        st = Student(user_id=user.id)
        db.add(st)
        db.commit()
        db.refresh(st)

    # Ensure student has done payment
    paid = db.query(Payment).filter(
        Payment.student_id == st.id,
        Payment.purpose == PaymentPurpose.project
    ).first()

    #if not paid:
       # raise HTTPException(status_code=402, detail="Payment required")

    # Detect preferred language
    lang = (st.preferred_language or "").lower()

    # Python group = Python / R 
    python_group = ["python", "r"]

    # Next.js group = Java / Next.js / Node.js/ JavaScript
    next_group = ["java", "next", "nextjs", "node", "nodejs", "javascript", "js"]

    q = db.query(Project).filter(Project.is_active == True)

    # Rule 1: Python/R→ Show Python projects
    if any(x in lang for x in python_group):
        q = q.filter(Project.technology.ilike("%python%"))

    # Rule 2: Java/Next/Node/JS  → Show Next.js projects
    elif any(x in lang for x in next_group):
        q = q.filter(Project.technology.ilike("%next%"))

    # Default → Show Python projects
    else:
        q = q.filter(Project.technology.ilike("%python%"))

    items = q.all()

    return [
        {
            "id": p.id,
            "title": p.title,
            "technology": p.technology
        }
        for p in items
    ]

@router.post("/select")
def select_project(
    project_id: str = Query(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != RoleEnum.student:
        raise HTTPException(403, "Only students allowed")

    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(404, "Student not found")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(404, "Project not found")

    # ❌ REMOVE THIS LINE FOREVER
    # student.project_id = project.id

    # ✅ CHECK student_projects INSTEAD
    sp = db.query(StudentProject).filter(
        StudentProject.student_id == student.id,
        StudentProject.project_id == project.id
    ).first()

    if sp:
        return {"message": "Project already selected"}

    # ✅ CREATE StudentProject (THIS IS WHAT WAS MISSING)
    sp = StudentProject(
        student_id=student.id,
        project_id=project.id,
        internship_type=student.internship_type
    )
    db.add(sp)
    db.commit()
    db.refresh(sp)

    # ✅ ASSIGN TASKS (CRITICAL)
    assign_tasks_for_student(
        db=db,
        sp=sp,
        technology=project.technology
    )

    return {
        "message": "Project selected",
        "project_id": str(project.id)
    }


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FILES_DIR = os.path.join(BASE_DIR, "static", "files")


@router.get("/materials")
def list_materials():
    """
    Returns a list of all PDF/DOCX files from static/files folder.
    """
    if not os.path.exists(FILES_DIR):
        return {"error": "Files directory not found"}

    files = os.listdir(FILES_DIR)

    # Only return pdf/docx files
    materials = []
    for f in files:
        if f.endswith(".pdf") or f.endswith(".docx"):
            materials.append({
                "name": f,
                "url": f"/projects/materials/download/{f}"
                
            })

    return {"materials": materials}


@router.get("/materials/download/{filename}")
def download_material(filename: str):
    """
    Download a specific PDF/DOCX file.
    """
    file_path = os.path.join(FILES_DIR, filename)

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    return FileResponse(
        file_path,
        filename=filename,
        media_type="application/octet-stream"
    )

@router.get("/showcase")
def showcase(
    tech: str = Query(..., description="Technology filter: 'python' or 'nextjs'"),
):
    """Return a curated list of example projects for a given technology.

    Supported values (case-insensitive): 'python', 'nextjs' (or 'next.js').
    This endpoint returns simple metadata (title and archive filename when available)
    so the frontend can visualise project templates for the selected stack.
    """
    t = tech.strip().lower()
    if t in ("python", "py"):
        items = [
            {"id": "cogniflow", "title": "Cogniflow", "archive": "jarvis-main.zip"},
            {"id": "gpt3-flask", "title": "GPT3.5 (Flask)", "archive": "my-flask-project-main.zip"},
            {"id": "gpt3-fastapi", "title": "GPT3.5 (FastAPI)", "archive": "my-fastapi-project-main.zip"},
            {"id": "fake-news-detector", "title": "Fake News Detector", "archive": "fake-news-detector.zip"},
            {"id": "mac", "title": "MAC", "archive": "siri_assistant_react.zip"},
            {"id": "movie-recommendation", "title": "Movie Recommendation System", "archive": "movie-recomendation-system-main.zip"},
        ]
    elif t in ("nextjs", "next.js", "next"):
        items = [
            {"id": "hiresense", "title": "Hiresense"},
            {"id": "identiq", "title": "Identiq"},
            {"id": "spamshieldx", "title": "SpamShieldX"},
        ]
    else:
        raise HTTPException(status_code=400, detail="Unsupported technology. Use 'python' or 'nextjs'.")

    return {"technology": tech, "projects": items}

# 🚫 BLOCK PROJECT CREATION
@router.post("/")
def block_project_creation():
    raise HTTPException(
        status_code=403,
        detail="Project creation is disabled. Projects are fixed by InternApp."
    )


# 🚫 BLOCK PROJECT UPDATES
@router.put("/{project_id}")
def block_project_update(project_id: str):
    raise HTTPException(
        status_code=403,
        detail="Editing projects is disabled. Projects are fixed and cannot be modified."
    )


# 🚫 BLOCK PROJECT DELETION
@router.delete("/{project_id}")
def block_project_deletion(project_id: str):
    raise HTTPException(
        status_code=403,
        detail="Deleting projects is disabled. Projects are fixed and permanent."
    )


@router.get("/project/{project_id}/zip/{internship_type}")
def get_zip(project_id: str, internship_type: str, db: Session = Depends(get_db)):
    file = db.query(ProjectInternshipFiles).filter_by(
        project_id=project_id,
        internship_type=internship_type
    ).first()

    if not file:
        raise HTTPException(404, "Zip file not found")

    return {"zip_url": file.zip_file_path}


# @router.get("/my-project")
# def my_project(
#     user: User = Depends(get_current_user),
#     db: Session = Depends(get_db),
# ):
#     st = db.query(Student).filter(Student.user_id == user.id).first()
#     if not st or not st.project_id:
#         return {"project": None}

#     proj = db.query(Project).filter(Project.id == st.project_id).first()
#     if not proj:
#         return {"project": None}

#     return {
#         "project": {
#             "id": str(proj.id),
#             "title": proj.title,
#             "technology": proj.technology,
#         }
#     }


@router.get("/my-project")
def my_project(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # get student
    st = db.query(Student).filter(Student.user_id == user.id).first()
    if not st:
        return {"project": None}

    # get student_project mapping
    sp = db.query(StudentProject).filter(
        StudentProject.student_id == st.id
    ).first()

    if not sp:
        return {"project": None}

    # get actual project
    proj = db.query(Project).filter(Project.id == sp.project_id).first()
    if not proj:
        return {"project": None}

    return {
        "project": {
            "id": str(proj.id),
            "title": proj.title,
            "technology": proj.technology,
        }
    }