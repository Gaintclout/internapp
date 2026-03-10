from app.db.session import Base
from sqlalchemy import Column, String,Boolean, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.models.user import UUIDCol
from sqlalchemy.orm import relationship
import uuid

class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # 🔥 FK → projects.id 
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)

    seq = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    is_learning_task = Column(Boolean, default=False)
    execution_language = Column(String, nullable=False)
    expected_output = Column(String, nullable=True)


    judge0_language_id = Column(Integer, nullable=True)
    visible_tests = Column(Text, nullable=True) 
    # 🔥 Relationship back to Project
    project = relationship("Project", back_populates="tasks")
