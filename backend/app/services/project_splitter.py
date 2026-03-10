import zipfile
import os
import shutil

BASE_DIR = "app/static/predefined_projects/"
EXTRACT_DIR = "app/static/extracted_projects/"

def extract_zip(project_slug: str):
    zip_path = os.path.join(BASE_DIR, f"{project_slug}.zip")
    
    if not os.path.exists(zip_path):
        raise FileNotFoundError("Project ZIP not found")

    # clean old extraction
    project_dir = os.path.join(EXTRACT_DIR, project_slug)
    if os.path.exists(project_dir):
        shutil.rmtree(project_dir)

    os.makedirs(project_dir, exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(project_dir)

    return project_dir


def get_files_for_task(project_slug: str, mode: str, seq: int):
    """
    mode = fasttrack, days45, semester
    """

    base = os.path.join(EXTRACT_DIR, project_slug)

    # FAST TRACK
    if mode == "fasttrack":
        return [base]

    # 45 DAYS
    if mode == "45days":
        if seq == 1: return [os.path.join(base, "backend")]
        if seq == 2: return [os.path.join(base, "frontend")]
        if seq == 3: return [base]

    # SEMESTER
    if mode == "semester":
        if seq == 1: return [os.path.join(base, "learning")]
        if seq == 2: return [os.path.join(base, "exercises")]
        if seq == 3: return [os.path.join(base, "database")]
        if seq == 4: return [os.path.join(base, "backend")]
        if seq == 5: return [os.path.join(base, "frontend")]
        if seq == 6: return [os.path.join(base, "navigation")]
        if seq == 7: return [os.path.join(base, "integration")]
        if seq == 8: return [os.path.join(base, "testing")]

    return []
