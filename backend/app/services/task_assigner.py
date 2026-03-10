


import os
from sqlalchemy.orm import Session

from app.db.models.project_tasks import ProjectTask
from app.db.models.student_task_status import StudentTaskStatus
from app.db.models.student_project import StudentProject
from app.db.models.student import Student

# -------------------------
# CONFIG
# -------------------------

# MATCH ENUM VALUES EXACTLY
INTERNSHIP_FOLDER_MAP = {
    "fasttrack": 1,
    "days45": 3,
    "semester4m": 8,
}


# -------------------------
# ASSIGN TASKS (PROJECT-DRIVEN, SAFE)
# -------------------------
# def assign_tasks_for_student(
#     db: Session,
#     sp: StudentProject,
# ):
#     """
#     Assign tasks to a student strictly based on:
#     StudentProject.project_id + internship_type

#     ❌ No technology-based guessing
#     ❌ No default project
#     ✅ Deterministic & safe
#     """

#     # -------------------------------------------------
#     # Load student
#     # -------------------------------------------------
#     student = (
#         db.query(Student)
#         .filter(Student.id == sp.student_id)
#         .first()
#     )

#     if not student:
#         raise Exception("Student not found for task assignment")

#     internship_type = (student.internship_type or "").lower()

#     if internship_type not in INTERNSHIP_FOLDER_MAP:
#         raise Exception(f"Invalid internship type: {internship_type}")

#     num_tasks = INTERNSHIP_FOLDER_MAP[internship_type]

#     # -------------------------------------------------
#     # Assign tasks by project_id + seq
#     # -------------------------------------------------
#     for seq in range(1, num_tasks + 1):

#         # ✅ FETCH PROJECT TASK (STRICT)
#         task = (
#             db.query(ProjectTask)
#             .filter(
#                 ProjectTask.project_id == sp.project_id,
#                 ProjectTask.seq == seq,
#             )
#             .first()
#         )

#         if not task:
#             raise Exception(
#                 f"ProjectTask missing: project={sp.project_id}, seq={seq}"
#             )

#         # -------------------------------------------------
#         # Prevent duplicate StudentTaskStatus
#         # -------------------------------------------------
#         existing = (
#             db.query(StudentTaskStatus)
#             .filter(
#                 StudentTaskStatus.student_project_id == sp.id,
#                 StudentTaskStatus.task_id == task.id,
#             )
#             .first()
#         )

#         if existing:
#             continue

#         sts = StudentTaskStatus(
#             student_id=sp.student_id,
#             student_project_id=sp.id,
#             task_id=task.id,
#             seq=seq,
#             unlocked=True if seq == 1 else False,
#         )

#         db.add(sts)

#     db.commit()




def assign_tasks_for_student(
    db: Session,
    sp: StudentProject,
    technology: str,
):
    student = db.query(Student).filter(Student.id == sp.student_id).first()
    if not student:
        raise Exception("Student missing")

    internship_type = (student.internship_type or "").lower()

    INTERNSHIP_FOLDER_MAP = {
        "fasttrack": 1,
        "days45": 3,
        "semester4m": 8,
    }

    if internship_type not in INTERNSHIP_FOLDER_MAP:
        raise Exception(f"Invalid internship type: {internship_type}")

    total_tasks = INTERNSHIP_FOLDER_MAP[internship_type]

    print(f"🧠 Assigning {total_tasks} tasks for {internship_type}")

    for seq in range(1, total_tasks + 1):
        task = db.query(ProjectTask).filter(
            ProjectTask.project_id == sp.project_id,
            ProjectTask.seq == seq
        ).first()

        if not task:
            raise Exception(f"ProjectTask missing for seq={seq}")

        exists = db.query(StudentTaskStatus).filter(
            StudentTaskStatus.student_project_id == sp.id,
            StudentTaskStatus.task_id == task.id
        ).first()

        if exists:
            continue

        sts = StudentTaskStatus(
            student_id=sp.student_id,
            student_project_id=sp.id,
            task_id=task.id,
            seq=seq,
            unlocked=True if seq == 1 else False,
            status="in_progress"
        )
        db.add(sts)

    db.commit()
    print("✅ Tasks inserted successfully")
