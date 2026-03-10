from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/files", tags=["Files"])

# Path: app/static/files
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FILE_DIR = os.path.join(BASE_DIR, "static", "files")

@router.get("/movie-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "movie_recommendation_workflow.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="movie_recommendation_workflow.pdf"
    )
@router.get("/media-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "MAC work flow .pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="MAC work flow .pdf "
    )

@router.get("/Chatbotf-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "gpt 3.5 fastapi workflow.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="gpt 3.5 fastapi workflow.pdf"
    )
@router.get("/Chatbotflask-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "gpt 3.5 flask workflow.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="gpt 3.5 flask workflow.pdf"
    )

@router.get("/Fakenews-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "FAKE NEWS DETECTOR workflow.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="FAKE NEWS DETECTOR workflow.pdf",
    ) 
@router.get("/cogniflow-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "guide.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="guide.pdf",
    )

@router.get("/spamshield-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "spamshieldX.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="spamshieldX.pdf",
    )


@router.get("/hiresense-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "hiresense workflow.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="hiresense workflow.pdf",
    )

@router.get("/identiq-workflow")
def download_movie_workflow():
    file_path = os.path.join(FILE_DIR, "identiq flow.pdf")

    if not os.path.exists(file_path):
        return {"error": "File not found", "path": file_path}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="identiq flow.pdf",
    )
