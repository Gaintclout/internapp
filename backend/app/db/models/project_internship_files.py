from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base
import uuid

class ProjectInternshipFiles(Base):
    __tablename__ = "project_internship_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"))
    internship_type = Column(String, nullable=False)
    zip_file_path = Column(String, nullable=False)

    project = relationship("Project", back_populates="internship_files")