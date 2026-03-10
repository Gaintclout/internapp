# app/routers/project_auto_split.py
import zipfile, os, uuid
from fastapi import APIRouter, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.project import Project
from app.db.models.project_tasks import ProjectTask

router = APIRouter(prefix="/project_auto_split", tags=["predefined-projects"])

def _collect_code_files(root_dir: str):
    code_files = []
    for root, dirs, files in os.walk(root_dir):
        for filename in files:
            if filename.endswith((".py", ".js", ".ts", ".jsx", ".tsx", ".cpp", ".java")):
                file_path = os.path.join(root, filename)
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as code_file:
                        code = code_file.read()
                    code_files.append({"path": file_path, "name": filename, "code": code})
                except Exception:
                    continue
    # sort by size desc as a heuristic for importance
    code_files.sort(key=lambda x: len(x.get("code") or ""), reverse=True)
    return code_files

def _bucketize_for_45days(files: list[dict]):
    # naive split by heuristics
    backend = [f for f in files if any(seg in f["path"].lower() for seg in ["/api/", "\\api\\", "server", "backend"])]
    frontend = [f for f in files if any(seg in f["path"].lower() for seg in ["/ui/", "\\ui\\", "client", "frontend", "components"])]
    used = set(id(x) for x in backend + frontend)
    integration = [f for f in files if id(f) not in used]
    # ensure each bucket is non-empty by distributing if necessary
    buckets = [backend, frontend, integration]
    flat = [f for f in files]
    i = 0
    for idx, b in enumerate(buckets):
        if not b and flat:
            buckets[idx] = [flat[i % len(flat)]]
            i += 1
    return buckets[0], buckets[1], buckets[2]

def _bucketize_for_sem4m(files: list[dict]):
    # Return 8 slices: 2 learning, 2 backend, 2 frontend, 2 integration
    backend, frontend, integration = _bucketize_for_45days(files)
    # learning: smallest/simple files
    learning = sorted(files, key=lambda x: len(x.get("code") or ""))[:2]
    # pad each to required counts
    def pad(lst, count):
        lst = lst[:]
        i = 0
        while len(lst) < count and files:
            lst.append(files[i % len(files)])
            i += 1
        return lst[:count]
    l1, l2 = pad(learning[:1], 1), pad(learning[1:2], 1)
    b = pad(backend, 2)
    f = pad(frontend, 2)
    integ = pad(integration, 2)
    return l1[0], l2[0], b[0], b[1], f[0], f[1], integ[0], integ[1]

def _create_project_with_tasks(db: Session, project_title: str, language_id: int, internship_type: str, files: list[dict]):
    proj = Project(id=str(uuid.uuid4()), title=project_title, technology="AutoImported")
    db.add(proj)
    db.flush()

    created = 0
    seq = 1
    itype = (internship_type or "").lower()

    if itype == "fasttrack":
        top = files[0] if files else {"name": "main", "code": ""}
        db.add(ProjectTask(
            id=str(uuid.uuid4()),
            project_id=proj.id,
            seq=seq,
            title=f"Comprehensive Task",
            description_md=f"Auto-generated task from {top['name']}",
            judge0_language_id=language_id,
            hidden_tests=[],
            is_learning_task=False,
        ))
        created += 1

    elif itype in ("45days", "days45", "45d"):
        backend, frontend, integration = _bucketize_for_45days(files)
        buckets = [("Backend", backend), ("Frontend", frontend), ("Integration", integration)]
        for label, bucket in buckets:
            db.add(ProjectTask(
                id=str(uuid.uuid4()),
                project_id=proj.id,
                seq=seq,
                title=f"{label} Task",
                description_md=f"Auto-generated {label.lower()} task",
                judge0_language_id=language_id,
                hidden_tests=[],
                is_learning_task=False,
            ))
            seq += 1
            created += 1

    else:
        t = (itype or "").replace(" ", "")
        if t in ("semester4m", "sem4m", "semester", "4m"):
            l1, l2, b1, b2, f1, f2, i1, i2 = _bucketize_for_sem4m(files)
            plan = [
                ("Learning Task 1", True),
                ("Learning Task 2", True),
                ("Backend Task 1", False),
                ("Backend Task 2", False),
                ("Frontend Task 1", False),
                ("Frontend Task 2", False),
                ("Integration Task 1", False),
                ("Integration Task 2", False),
            ]
            for title, is_learning in plan:
                db.add(ProjectTask(
                    id=str(uuid.uuid4()),
                    project_id=proj.id,
                    seq=seq,
                    title=title,
                    description_md=f"Auto-generated {title.lower()}",
                    judge0_language_id=language_id,
                    hidden_tests=[],
                    is_learning_task=is_learning,
                ))
                seq += 1
                created += 1
        else:
            db.add(ProjectTask(
                id=str(uuid.uuid4()),
                project_id=proj.id,
                seq=seq,
                title=f"General Task",
                description_md=f"Auto-generated task",
                judge0_language_id=language_id,
                hidden_tests=[],
                is_learning_task=False,
            ))
            created += 1

    db.commit()
    return {"message": "Project imported successfully", "tasks_created": created, "project_id": str(proj.id)}

@router.post("/upload")
async def upload_project_zip(
    file: UploadFile,
    project_title: str,
    language_id: int,
    internship_type: str,
    db: Session = Depends(get_db),
):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    zip_path = os.path.join(temp_dir, file.filename)

    with open(zip_path, "wb") as f:
        f.write(await file.read())

    extract_dir = os.path.join(temp_dir, file.filename.split(".")[0])
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_dir)

    files = _collect_code_files(extract_dir)
    return _create_project_with_tasks(db, project_title, language_id, internship_type, files)

def _predefined_dir() -> str:
    here = os.path.dirname(__file__)
    base = os.path.abspath(os.path.join(here, "..", "static", "predefined_projects"))
    return base

@router.get("/predefined")
def list_predefined_projects():
    base = _predefined_dir()
    try:
        files = [f for f in os.listdir(base) if f.lower().endswith(".zip")]
    except Exception:
        files = []
    return {"zips": files}

@router.post("/import-predefined")
async def import_predefined_project(
    project_zip: str,
    language_id: int,
    internship_type: str,
    project_title: str | None = None,
    db: Session = Depends(get_db),
):
    base = _predefined_dir()
    zip_path = os.path.join(base, project_zip)
    if not os.path.isfile(zip_path):
        raise HTTPException(status_code=404, detail="Predefined zip not found")

    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    extract_dir = os.path.join(temp_dir, os.path.splitext(os.path.basename(zip_path))[0] + "_pre")
    if os.path.isdir(extract_dir):
        # clean previous to avoid mixing content
        try:
            for root, dirs, files in os.walk(extract_dir, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            os.rmdir(extract_dir)
        except Exception:
            pass
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_dir)

    files = _collect_code_files(extract_dir)
    title = project_title or os.path.splitext(os.path.basename(zip_path))[0]
    return _create_project_with_tasks(db, title, language_id, internship_type, files)
