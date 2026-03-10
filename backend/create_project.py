import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid
from datetime import datetime

from app.db.session import Base, engine, SessionLocal
from app.db.models.project import Project 
from app.db.models.task import ProjectTask

# Read desired internship type from environment (default to 45-days style)
INTERNSHIP_TYPE = os.getenv("INTERNSHIP_TYPE", "45days").lower()

def create_project_with_tasks():
    # Create a new SQLAlchemy session
    db = SessionLocal()
    
    try:
        # Create project
        project = Project(
            id=str(uuid.uuid4()),
            title="Full Stack Development with FastAPI and React",
            technology="Python, FastAPI, React, PostgreSQL",
            description_md="""# Full Stack Development Project
This project will help you learn both backend and frontend development using modern tools.

## Technologies
- Backend: FastAPI, PostgreSQL, SQLAlchemy
- Frontend: React, TypeScript
- Testing: pytest
""",
            is_active=True
        )
        
        db.add(project)
        db.flush()  # Get project ID while transaction is open

        created = 0

        # If fasttrack, create a single comprehensive task that represents the whole project
        if INTERNSHIP_TYPE in ("fasttrack", "fast-track", "fast_track"):
            db.add(ProjectTask(
                id=str(uuid.uuid4()),
                project_id=project.id,
                seq=1,
                title="Comprehensive Task: Full Project Delivery",
                description_md="""Deliver the complete project. This single comprehensive task
represents implementing the entire project end-to-end: backend services, frontend UI,
database schema, tests and deployment instructions. Treat this as a capstone deliverable.
""",
                judge0_language_id=71,  # Python3
                is_learning_task=False,
            ))
            created = 1
        else:
            # If 45-days internship requested, create 3 tasks: backend, frontend, integration
            if INTERNSHIP_TYPE in ("45days", "days45", "45d", "45-day"):
                plan_45 = [
                    ("Backend Task: Core Services", False, "Implement core backend services, APIs and data models."),
                    ("Frontend Task: UI & UX", False, "Build the frontend UI and connect it to backend APIs."),
                    ("Integration Task: E2E & Deployment", False, "Integrate frontend and backend, add end-to-end tests and deployment docs."),
                ]
                seq = 1
                for title, is_learning, short_desc in plan_45:
                    db.add(ProjectTask(
                        id=str(uuid.uuid4()),
                        project_id=project.id,
                        seq=seq,
                        title=title,
                        description_md=f"""# {title}\n{short_desc}\n""",
                        judge0_language_id=71,
                        is_learning_task=is_learning,
                    ))
                    seq += 1
                created = len(plan_45)
            # If semester4m requested create 8 tasks split as:
            # 1-2: learning (is_learning_task=True)
            # 3-4: backend
            # 5-6: frontend
            # 7-8: integration
            elif INTERNSHIP_TYPE in ("semester4m", "sem4m", "semester", "4m"):
                plan = [
                    ("Learning Task 1: Foundations", True, "Introductory exercises to build core knowledge."),
                    ("Learning Task 2: Intermediate Concepts", True, "Deeper exercises to consolidate fundamentals."),
                    ("Backend Task 1: Auth & Users", False, "Build authentication, user model, and protected routes."),
                    ("Backend Task 2: Business Logic & APIs", False, "Implement main backend APIs and data models."),
                    ("Frontend Task 1: UI Basics", False, "Create core UI screens and components."),
                    ("Frontend Task 2: Advanced UI & Integration", False, "Build complex UI flows and integrate with backend."),
                    ("Integration Task 1: End-to-end Integration", False, "Integrate frontend and backend, ensure end-to-end flows."),
                    ("Integration Task 2: Deployment & Tests", False, "Write deployment instructions and end-to-end tests."),
                ]
                seq = 1
                for title, is_learning, short_desc in plan:
                    db.add(ProjectTask(
                        id=str(uuid.uuid4()),
                        project_id=project.id,
                        seq=seq,
                        title=title,
                        description_md=f"""# {title}\n{short_desc}\n""",
                        judge0_language_id=71,
                        is_learning_task=is_learning,
                    ))
                    seq += 1
                created = len(plan)
            else:
                # Default: create a small learning + two backend tasks (legacy behavior)
                tasks = [
                    ProjectTask(
                        id=str(uuid.uuid4()),
                        project_id=project.id,
                        seq=1,
                        title="Learning Task: Python Basics and FastAPI Introduction",
                        description_md="""# Python and FastAPI Learning Task
Complete the following exercises:

1. Create a simple FastAPI endpoint that returns \"Hello, World!\"\n2. Add path parameters and query parameters\n3. Create a Pydantic model and use it in POST request\n4. Add input validation using Pydantic\n5. Connect to database using SQLAlchemy\n\nSubmit your code with proper documentation.""",
                        judge0_language_id=71,  # Python3
                        is_learning_task=True
                    ),
                    ProjectTask(
                        id=str(uuid.uuid4()),
                        project_id=project.id,
                        seq=2,
                        title="Backend Task: User Authentication System",
                        description_md="""# User Authentication System
Implement a complete user authentication system with:\n\n1. User registration with email verification\n2. Login with JWT tokens\n3. Password reset functionality\n4. Protected routes with role-based access\n5. Token refresh mechanism\n\nUse FastAPI security best practices.""",
                        judge0_language_id=71,
                        is_learning_task=False
                    ),
                    ProjectTask(
                        id=str(uuid.uuid4()),
                        project_id=project.id,
                        seq=3,
                        title="Backend Task: RESTful API Development",
                        description_md="""# RESTful API Development
Create a RESTful API for a product management system with:\n\n1. CRUD operations for products\n2. Category management\n3. File upload for product images\n4. Search and filtering\n5. API documentation with OpenAPI/Swagger\n\nInclude unit tests and API tests.""",
                        judge0_language_id=71,
                        is_learning_task=False
                    ),
                ]

                # Add all tasks
                for task in tasks:
                    db.add(task)
                created = len(tasks)

        # Commit the transaction
        db.commit()
        print(f"Project and tasks created successfully! Tasks created: {created}")
        print(f"Project ID: {project.id}")
        
        return project.id
        
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    create_project_with_tasks()