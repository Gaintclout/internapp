from sqlalchemy import Column, Integer, String
from app.db.base_class import Base
from sqlalchemy.dialects.postgresql import UUID

class StudentTaskScore(Base):
    __tablename__ = "student_task_scores"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(UUID, nullable=False)
    task_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
