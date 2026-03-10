from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import os
from app.core.security import get_current_user
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter(prefix="/vscode", tags=["VSCode"])


class FolderRequest(BaseModel):
    task_id: str


@router.post("/create-folder")
def create_workspace_folder(data: FolderRequest, user=Depends(get_current_user)):
    """
    Creates a workspace folder for the student task.
    """

    base_path = r"C:\Users\DELL\InternAppWorkspaces"   # change if needed

    if not os.path.exists(base_path):
        os.makedirs(base_path)

    # Example folder path C:\Users\DELL\InternAppWorkspaces\task_123
    folder_path = os.path.join(base_path, f"task_{data.task_id}")

    try:
        os.makedirs(folder_path, exist_ok=True)

        # Create starter file
        starter_file = os.path.join(folder_path, "main.py")
        if not os.path.exists(starter_file):
            with open(starter_file, "w") as f:
                f.write("# Write your solution here\n")

        return {"folder_path": folder_path}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
