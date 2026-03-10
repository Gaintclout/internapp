from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Text,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.db.models.user import UUIDCol
from datetime import datetime
from enum import Enum as PyEnum


# ==============================
# Task State ENUM (STRING BASED)
# ==============================
class TaskState(PyEnum):
    locked = "locked"                # Task exists but not yet unlocked
    not_started = "not_started"      # Unlocked but student has not started
    in_progress = "in_progress"      # Student started working
    passed = "passed"                # Task successfully completed
    failed = "failed"                # Task attempted but failed


# ==============================
# Student Task Status Table
# ==============================
class StudentTaskStatus(Base):
    __tablename__ = "student_task_status"

    # --------------------------
    # Primary Key
    # --------------------------
    id = UUIDCol()

    # --------------------------
    # Foreign Keys
    # --------------------------
    student_id = Column(
        UUIDCol().type,
        ForeignKey("students.id"),
        nullable=False
    )

    task_id = Column(
        UUIDCol().type,
        ForeignKey("project_tasks.id"),
        nullable=False
    )

    # --------------------------
    # Task Order inside project
    # --------------------------
    seq = Column(Integer, nullable=False)

    # --------------------------
    # Unlock Information
    # --------------------------
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)

    # For students with multiple projects
    student_project_id = Column(Integer, nullable=True)

    # --------------------------
    # Task Status (ENUM as STRING)
    # --------------------------
    status = Column(
        String,
        default=TaskState.locked.value,
        nullable=False
    )

    # --------------------------
    # Attempts & Submission
    # --------------------------
    attempts = Column(Integer, default=0)
    last_submission_id = Column(String, nullable=True)
    passed_at = Column(DateTime, nullable=True)

    # --------------------------
    # Hidden / Judge Overrides
    # --------------------------
    hidden_attempts = Column(Integer, default=0)
    first_hidden_attempt_at = Column(DateTime, nullable=True)

    mentor_override = Column(Boolean, default=False)
    mentor_override_by = Column(String, nullable=True)
    mentor_override_at = Column(DateTime, nullable=True)
    mentor_override_note = Column(Text, nullable=True)

    # --------------------------
    # Progress Tracking
    # --------------------------
    progress_percent = Column(Integer, default=0)

    # --------------------------
    # Relationships (Optional)
    # --------------------------
    task = relationship("ProjectTask", backref="student_statuses")
    student = relationship("Student", backref="task_statuses")
