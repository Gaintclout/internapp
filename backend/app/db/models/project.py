from app.db.session import Base
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    technology = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    tasks = relationship("ProjectTask", back_populates="project")
    student_projects = relationship("StudentProject", back_populates="project")
    internship_files = relationship("ProjectInternshipFiles", back_populates="project", cascade="all, delete-orphan")
