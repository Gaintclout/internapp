from app.db.session import Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class StudentProject(Base):
    __tablename__ = "student_projects"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)

    project_name = Column(String)
    language_id = Column(Integer)
    internship_type = Column(String(50), nullable=True)


    student = relationship("Student", back_populates="student_projects")
    project = relationship("Project", back_populates="student_projects")
