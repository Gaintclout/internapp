from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.db.session import get_db
from app.routers.auth import get_current_user
from app.db.models.project_tasks import ProjectTask
from app.db.models.project_internship_files import ProjectInternshipFiles
from app.db.models.student import Student
from app.core.paths import BASE_DIR
from app.services.similarity_helper import (
    extract_reference_code,
    similarity_percent,
)

router = APIRouter(prefix="/vscode", tags=["VS Code"])


# -------------------------------------------------
# Request Body Schema
# -------------------------------------------------
class SimilarityPayload(BaseModel):
    task_id: UUID
    source_code: str


# -------------------------------------------------
# Check Similarity API
# -------------------------------------------------
@router.post("/check-similarity")
def check_similarity(
    payload: SimilarityPayload,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    print("🔥 CHECK-SIMILARITY API HIT")
    print("🧪 Incoming task_id:", payload.task_id)
    print("🧪 Incoming source_code length:", len(payload.source_code))

    # -------------------------------------------------
    # 1️⃣ Load task
    # -------------------------------------------------
    task = (
        db.query(ProjectTask)
        .filter(ProjectTask.id == payload.task_id)
        .first()
    )

    if not task:
        raise HTTPException(404, "Task not found")

    # -------------------------------------------------
    # 2️⃣ Load student (internship_type lives here)
    # -------------------------------------------------
    student = (
        db.query(Student)
        .filter(Student.user_id == user.id)
        .first()
    )

    if not student:
        raise HTTPException(404, "Student profile not found")

    # -------------------------------------------------
    # 3️⃣ Skip similarity for Task-1 (ALL internship types)
    # -------------------------------------------------
    if task.seq == 1:
        return {
            "similarity": None,
            "allowed": True,
            "note": "Task 1 – similarity check skipped",
        }

    # -------------------------------------------------
    # 4️⃣ Load ZIP mapped to project + internship type
    # -------------------------------------------------
    zip_record = (
        db.query(ProjectInternshipFiles)
        .filter(
            ProjectInternshipFiles.project_id == task.project_id,
            ProjectInternshipFiles.internship_type == student.internship_type,
        )
        .first()
    )

    if not zip_record:
        raise HTTPException(400, "ZIP mapping not found")

    zip_path = BASE_DIR / zip_record.zip_file_path

    if not zip_path.exists():
        raise HTTPException(400, "ZIP file missing on server")

    # -------------------------------------------------
    # 5️⃣ Extract reference code + similarity
    # -------------------------------------------------
    reference_code = extract_reference_code(zip_path)
    similarity = similarity_percent(reference_code, payload.source_code)
    return {
        "similarity": round(similarity, 2),
        "allowed": similarity >= 10,
    }
    