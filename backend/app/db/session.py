from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings


Base = declarative_base()


connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, echo=False, future=True, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.db import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    # Lightweight, idempotent migrations for Postgres: add new columns if missing
    try:
        if engine.url.get_backend_name().startswith("postgres"):
            with engine.begin() as conn:
                conn.execute(text(
                    """
                    ALTER TABLE reports_fortnight
                    ADD COLUMN IF NOT EXISTS progress_percentage double precision;
                    """
                ))
                conn.execute(text(
                    """
                    ALTER TABLE reports_fortnight
                    ADD COLUMN IF NOT EXISTS feedback text;
                    """
                ))
                conn.execute(text(
                    """
                    ALTER TABLE reports_fortnight
                    ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone;
                    """
                ))
    except Exception:
        # Best-effort; avoid crashing app on startup for migration issues
        pass

    # Seed curated showcase projects (idempotent)
    try:
        from app.db.models.project import Project

        db = SessionLocal()
        try:
            showcase = [
                {
                    "title": "Cogniflow",
                    "technology": "python",
                    "description_md": "Cogniflow example project (Jarvis).",
                    "doc_pdf_url": "temp_uploads/jarvis-main.zip",
                },
                {
                    "title": "GPT3.5 (Flask)",
                    "technology": "python",
                    "description_md": "Example GPT3.5 Flask project.",
                    "doc_pdf_url": "temp_uploads/my-flask-project-main.zip",
                },
                {
                    "title": "GPT3.5 (FastAPI)",
                    "technology": "python",
                    "description_md": "Example GPT3.5 FastAPI project.",
                    "doc_pdf_url": "temp_uploads/my-fastapi-project-main.zip",
                },
                {
                    "title": "Fake News Detector",
                    "technology": "python",
                    "description_md": "Fake news detection project.",
                    "doc_pdf_url": "temp_uploads/fake-news-detector.zip",
                },
                {
                    "title": "MAC",
                    "technology": "python",
                    "description_md": "MAC assistant (React front-end included).",
                    "doc_pdf_url": "temp_uploads/siri_assistant_react.zip",
                },
                {
                    "title": "Movie Recommendation System",
                    "technology": "python",
                    "description_md": "Movie recommendation example.",
                    "doc_pdf_url": "temp_uploads/movie-recomendation-system-main.zip",
                },
                {
                    "title": "Hiresense",
                    "technology": "nextjs",
                    "description_md": "Hiresense Next.js template.",
                },
                {
                    "title": "Identiq",
                    "technology": "nextjs",
                    "description_md": "Identiq Next.js template.",
                },
                {
                    "title": "SpamShieldX",
                    "technology": "nextjs",
                    "description_md": "SpamShieldX Next.js template.",
                },
            ]

            for item in showcase:
                exists = db.query(Project).filter(Project.title == item["title"]).first()
                if not exists:
                    p = Project(
                        title=item["title"],
                        technology=item.get("technology"),
                        description_md=item.get("description_md"),
                        doc_pdf_url=item.get("doc_pdf_url"),
                    )
                    db.add(p)
            db.commit()
        finally:
            db.close()
    except Exception:
        # Don't allow seeding problems to crash the app; log in future if needed
        pass
