# from datetime import date, datetime
# from sqlalchemy.orm import Session

# from app.db.models.student import Student, InternshipType
# from app.db.models.project_tasks import ProjectTask
# from app.db.models.student_task_status import StudentTaskStatus, TaskState


# # ----------------------------------------------------
# # 1. Learning window (future-proof)
# # ----------------------------------------------------
# def within_learning_window(start: date, internship_type: InternshipType) -> bool:
#     if internship_type == InternshipType.days45:
#         return (date.today() - start).days < 10
#     if internship_type == InternshipType.semester4m:
#         return (date.today() - start).days < 30
#     return True


# # ----------------------------------------------------
# # 2. Visible tasks for student (UI)
# # ----------------------------------------------------
# def visible_tasks_for_student(db: Session, st: Student):
#     tasks = (
#         db.query(ProjectTask)
#         .filter(ProjectTask.project_id == st.project_id)
#         .order_by(ProjectTask.seq.asc())
#         .all()
#     )

#     # ------------------------------------------------
#     # 1️⃣ FASTTRACK → no locking at all
#     # ------------------------------------------------
#     if st.internship_type == InternshipType.fasttrack:
#         return [
#             {
#                 "id": t.id,
#                 "seq": t.seq,
#                 "title": t.title,
#                 "is_learning": t.is_learning_task,
#             }
#             for t in tasks
#         ]

#     # ------------------------------------------------
#     # 2️⃣ 45 DAYS / SEMESTER 4M → sequential unlock
#     # ------------------------------------------------
#     visible = []

#     for idx, task in enumerate(tasks):
#         sts = (
#             db.query(StudentTaskStatus)
#             .filter(
#                 StudentTaskStatus.student_id == st.id,
#                 StudentTaskStatus.task_id == task.id,
#             )
#             .first()
#         )

#         # Learning tasks → always visible
#         if task.is_learning_task:
#             visible.append(
#                 {
#                     "id": task.id,
#                     "seq": task.seq,
#                     "title": task.title,
#                     "is_learning": True,
#                 }
#             )
#             continue

#         # First task → always visible
#         if idx == 0:
#             visible.append(
#                 {
#                     "id": task.id,
#                     "seq": task.seq,
#                     "title": task.title,
#                     "is_learning": False,
#                 }
#             )
#             continue

#         # Check previous task
#         prev_task = tasks[idx - 1]
#         prev_sts = (
#             db.query(StudentTaskStatus)
#             .filter(
#                 StudentTaskStatus.student_id == st.id,
#                 StudentTaskStatus.task_id == prev_task.id,
#             )
#             .first()
#         )

#      # Unlock if previous task was ATTEMPTED (submitted at least once)
#         if prev_sts:
#             visible.append(
#                 {
#                     "id": task.id,
#                     "seq": task.seq,
#                     "title": task.title,
#                     "is_learning": False,
#                 }
#             )
#         else:
#             break


#     return visible



# # ----------------------------------------------------
# # 3. Mark task as PASSED
# # ----------------------------------------------------
# def mark_task_passed(db: Session, sts: StudentTaskStatus):
#     sts.status = TaskState.passed.value
#     sts.passed_at = datetime.utcnow()
#     db.add(sts)
#     db.commit()
#     return True


# # ----------------------------------------------------
# # 4. Unlock NEXT task
# # ----------------------------------------------------
# def unlock_next_task(db: Session, student_id, project_id, current_seq):
#     """
#     After passing seq N, unlock seq N+1
#     """
#     next_seq = current_seq + 1

#     next_task = (
#         db.query(ProjectTask)
#         .filter(
#             ProjectTask.project_id == project_id,
#             ProjectTask.seq == next_seq,
#         )
#         .first()
#     )

#     if not next_task:
#         return None  # All tasks completed

#     sts = (
#         db.query(StudentTaskStatus)
#         .filter(
#             StudentTaskStatus.student_id == student_id,
#             StudentTaskStatus.task_id == next_task.id,
#         )
#         .first()
#     )

#     if not sts:
#         sts = StudentTaskStatus(
#             student_id=student_id,
#             task_id=next_task.id,
#             seq=next_seq,
#             unlocked=True,
#             unlocked_at=datetime.utcnow(),
#             status=TaskState.not_started.value,
#         )
#     else:
#         sts.unlocked = True
#         sts.unlocked_at = datetime.utcnow()
#         if sts.status == TaskState.locked.value:
#             sts.status = TaskState.not_started.value

#     db.add(sts)
#     db.commit()

#     return {
#         "next_task_id": str(next_task.id),
#         "message": f"Task {next_seq} unlocked",
#     }


# # ----------------------------------------------------
# # 5. Judge0 test validation
# # ----------------------------------------------------
# def mark_pass_if_all_tests_pass(results: list[dict]) -> bool:
#     # Judge0 → status.id == 3 → Accepted
#     return all((r.get("status") or {}).get("id") == 3 for r in results)



from datetime import date, datetime
from sqlalchemy.orm import Session

from app.db.models.student import Student, InternshipType
from app.db.models.project_tasks import ProjectTask
from app.db.models.student_task_status import StudentTaskStatus, TaskState


# ----------------------------------------------------
# 1. Learning window (future-proof)
# ----------------------------------------------------
def within_learning_window(start: date, internship_type: InternshipType) -> bool:
    if internship_type == InternshipType.days45:
        return (date.today() - start).days < 10
    if internship_type == InternshipType.semester4m:
        return (date.today() - start).days < 30
    return True


# ----------------------------------------------------
# 2. Visible tasks for student (UI)
# ----------------------------------------------------
def visible_tasks_for_student(db: Session, st: Student):
    tasks = (
        db.query(ProjectTask)
        .filter(ProjectTask.project_id == st.project_id)
        .order_by(ProjectTask.seq.asc())
        .all()
    )

    # FASTTRACK → all visible
    if st.internship_type == InternshipType.fasttrack:
        return [
            {
                "id": t.id,
                "seq": t.seq,
                "title": t.title,
                "is_learning": t.is_learning_task,
            }
            for t in tasks
        ]

    visible = []

    for idx, task in enumerate(tasks):

        # Learning tasks → always visible
        if task.is_learning_task:
            visible.append(
                {
                    "id": task.id,
                    "seq": task.seq,
                    "title": task.title,
                    "is_learning": True,
                }
            )
            continue

        # First task → always visible
        if idx == 0:
            visible.append(
                {
                    "id": task.id,
                    "seq": task.seq,
                    "title": task.title,
                    "is_learning": False,
                }
            )
            continue

        prev_task = tasks[idx - 1]
        prev_sts = (
            db.query(StudentTaskStatus)
            .filter(
                StudentTaskStatus.student_id == st.id,
                StudentTaskStatus.task_id == prev_task.id,
            )
            .first()
        )

        # Unlock ONLY if previous task exists (submitted at least once)
        if prev_sts:
            visible.append(
                {
                    "id": task.id,
                    "seq": task.seq,
                    "title": task.title,
                    "is_learning": False,
                }
            )
        else:
            break

    return visible


# ----------------------------------------------------
# 3. Mark task as PASSED
# ----------------------------------------------------
def mark_task_passed(db: Session, sts: StudentTaskStatus):
    sts.status = TaskState.passed.value
    sts.passed_at = datetime.utcnow()
    db.add(sts)
    db.commit()
    return True


# ----------------------------------------------------
# 4. Unlock NEXT task  ✅ FIXED
# ----------------------------------------------------
def unlock_next_task(db: Session, student_id, project_id, current_seq):
    """
    After passing seq N, unlock seq N+1
    AND update students.current_task_seq (CRITICAL)
    """

    next_seq = current_seq + 1

    next_task = (
        db.query(ProjectTask)
        .filter(
            ProjectTask.project_id == project_id,
            ProjectTask.seq == next_seq,
        )
        .first()
    )

    # No more tasks
    if not next_task:
        return None

    # ------------------------------------------------
    # 🔥 FIX 1: UPDATE STUDENT TABLE (FRONTEND READS THIS)
    # ------------------------------------------------
    student = db.query(Student).filter(Student.id == student_id).first()
    if student and (student.current_task_seq or 1) < next_seq:
        student.current_task_seq = next_seq
        db.add(student)

    # ------------------------------------------------
    # EXISTING: StudentTaskStatus (VS CODE FLOW)
    # ------------------------------------------------
    sts = (
        db.query(StudentTaskStatus)
        .filter(
            StudentTaskStatus.student_id == student_id,
            StudentTaskStatus.task_id == next_task.id,
        )
        .first()
    )

    if not sts:
        sts = StudentTaskStatus(
            student_id=student_id,
            task_id=next_task.id,
            seq=next_seq,
            unlocked=True,
            unlocked_at=datetime.utcnow(),
            status=TaskState.not_started.value,
        )
    else:
        sts.unlocked = True
        sts.unlocked_at = datetime.utcnow()
        if sts.status == TaskState.locked.value:
            sts.status = TaskState.not_started.value

    db.add(sts)
    db.commit()

    return {
        "next_task_id": str(next_task.id),
        "next_seq": next_seq,
        "message": f"Task {next_seq} unlocked",
    }


# ----------------------------------------------------
# 5. Judge0 test validation
# ----------------------------------------------------
def mark_pass_if_all_tests_pass(results: list[dict]) -> bool:
    return all((r.get("status") or {}).get("id") == 3 for r in results)

