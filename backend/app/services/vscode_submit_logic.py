
# from pathlib import Path
# import os
# import base64
# import requests
# import zipfile
# import difflib
# import random
# from datetime import datetime
# from fastapi import HTTPException

# from app.core.paths import BASE_DIR
# from app.db.models.student_task_status import StudentTaskStatus, TaskState
# from app.db.models.project_internship_files import ProjectInternshipFiles
# from app.services.unlocks import unlock_next_task
# from app.core.judge0_languages import LANGUAGE_MAP


# JUDGE0_URL = os.getenv("JUDGE0_URL", "http://localhost:2358").rstrip("/")

# LOW_LIMIT = 10
# HIGH_LIMIT = 100


# # -------------------------------------------------
# # Detect framework
# # -------------------------------------------------
# def contains_framework(code: str) -> bool:

#     FRAMEWORK_KEYWORDS = [
#         "flask","fastapi","django","uvicorn",
#         "express","react","next.js","nextjs",
#         "useState(","useEffect(",
#         "import react","export default",
#         "<div","<span","<h1","<p>",
#         "return (","app.run(","app.listen("
#     ]

#     code_lower = code.lower()

#     for keyword in FRAMEWORK_KEYWORDS:
#         if keyword in code_lower:
#             return True

#     return False


# # -------------------------------------------------
# # Judge0 execution
# # -------------------------------------------------
# def judge0_simple_run(source_code: str, language_id: int, stdin: str = ""):

#     if not source_code.strip():
#         raise HTTPException(400, "Empty source code received")

#     encoded_code = base64.b64encode(source_code.encode()).decode()
#     encoded_input = base64.b64encode(stdin.encode()).decode()

#     payload = {
#         "source_code": encoded_code,
#         "language_id": language_id,
#         "stdin": encoded_input,
#         "redirect_stderr_to_stdout": True,
#         "cpu_time_limit": 2,
#         "memory_limit": 128000,
#     }

#     try:

#         res = requests.post(
#             f"{JUDGE0_URL}/submissions?base64_encoded=true&wait=true",
#             json=payload,
#             timeout=20,
#         )

#         res.raise_for_status()

#         return res.json()

#     except requests.exceptions.RequestException:
#         raise HTTPException(500, "Judge0 execution failed")


# # -------------------------------------------------
# # Decode Judge0 output
# # -------------------------------------------------
# def decode_output(encoded):

#     if not encoded:
#         return ""

#     try:
#         return base64.b64decode(encoded).decode(errors="ignore").strip()
#     except Exception:
#         return encoded


# # -------------------------------------------------
# # Similarity
# # -------------------------------------------------
# def similarity_percent(a: str, b: str) -> float:
#     return difflib.SequenceMatcher(None, a, b).ratio() * 100


# # -------------------------------------------------
# # MAIN EVALUATION
# # -------------------------------------------------
# def evaluate_vscode_submission(
#     db,
#     student,
#     task,
#     source_code,
#     framework: bool = False,
# ):

#     print("\n🔥 VS CODE SUBMIT STARTED")
#     print("Student:", student.id)
#     print("Task:", task.id, "Seq:", task.seq)

#     # -------------------------------------------------
#     # Student task status
#     # -------------------------------------------------
#     sts = (
#         db.query(StudentTaskStatus)
#         .filter(
#             StudentTaskStatus.student_id == student.id,
#             StudentTaskStatus.task_id == task.id,
#         )
#         .first()
#     )

#     if not sts:

#         sts = StudentTaskStatus(
#             student_id=student.id,
#             task_id=task.id,
#             seq=task.seq,
#             unlocked=True,
#             unlocked_at=datetime.utcnow(),
#             attempts=0,
#             hidden_attempts=0,
#             status=TaskState.in_progress.value,
#         )

#         db.add(sts)
#         db.commit()

#     sts.attempts += 1
#     db.commit()


#     # -------------------------------------------------
#     # Locate ZIP reference
#     # -------------------------------------------------
#     zip_record = (
#         db.query(ProjectInternshipFiles)
#         .filter(
#             ProjectInternshipFiles.project_id == task.project_id,
#             ProjectInternshipFiles.internship_type == student.internship_type,
#         )
#         .first()
#     )

#     if not zip_record:
#         raise HTTPException(400, "Project ZIP mapping missing")

#     zip_path = BASE_DIR / zip_record.zip_file_path

#     print("📦 ZIP PATH:", zip_path)

#     if not zip_path.exists():
#         raise HTTPException(400, "ZIP file not found on server")


#     # -------------------------------------------------
#     # Allowed / Ignored filters
#     # -------------------------------------------------
#     ALLOWED_EXTENSIONS = (
#         ".py",".js",".jsx",".ts",".tsx",
#         ".java",".cpp",".html",".css"
#     )

#     IGNORED_EXTENSIONS = (
#         ".md",".env",".txt",".yml",".yaml",
#         ".gitignore",".dockerignore",
#         ".png",".jpg",".jpeg",".svg",".ico"
#     )

#     IGNORED_FOLDERS = (
#         "clean_env","venv","env",
#         "site-packages","__pycache__",
#         "node_modules","dist","build"
#     )

#     task_key = f"task{task.seq}".lower()

#     reference_code = ""

#     # -------------------------------------------------
#     # Read ZIP reference code
#     # -------------------------------------------------
#     with zipfile.ZipFile(zip_path, "r") as z:

#         for f in z.namelist():

#             if f.endswith("/"):
#                 continue

#             f_lower = f.lower()

#             if task_key not in f_lower:
#                 continue

#             if any(folder in f_lower for folder in IGNORED_FOLDERS):
#                 print("⏭ Ignoring env file:", f)
#                 continue

#             if f_lower.endswith(IGNORED_EXTENSIONS):
#                 print("⏭ Ignoring config file:", f)
#                 continue

#             if not f_lower.endswith(ALLOWED_EXTENSIONS):
#                 continue

#             try:

#                 file_content = z.read(f).decode("utf-8", errors="ignore")

#                 reference_code += f"\n/* FILE: {f} */\n{file_content}\n"

#                 print("📄 Loaded reference:", f)

#             except Exception:
#                 continue


#     # -------------------------------------------------
#     # Similarity calculation
#     # -------------------------------------------------
#     if not reference_code.strip():

#         print("⚠️ No code files → generating random similarity")

#         similarity = random.randint(20, 80)

#     else:

#         similarity = round(
#             similarity_percent(reference_code, source_code), 2
#         )

#     print(f"🔍 Similarity Score: {similarity}%")


#     # -------------------------------------------------
#     # Similarity rules
#     # -------------------------------------------------
#     force_pass = False

#     internship_type = (student.internship_type or "").lower()

#     # FASTTRACK RULE (ADDED)
#     if internship_type == "fasttrack":

#         print("⚡ FASTTRACK similarity rule")

#         if similarity < 30:
#             return {
#                 "passed": False,
#                 "reason": "FastTrack requires minimum 30% similarity",
#                 "similarity": similarity,
#                 "unlock": None,
#             }

#         if similarity > 100:
#             return {
#                 "passed": False,
#                 "reason": "Similarity exceeds allowed limit",
#                 "similarity": similarity,
#                 "unlock": None,
#             }

#         force_pass = True


#     # EXISTING RULE (UNCHANGED)
#     elif task.seq >= 2:

#         if similarity < LOW_LIMIT:

#             return {
#                 "passed": False,
#                 "reason": "Similarity below required minimum (10%)",
#                 "similarity": similarity,
#                 "unlock": None,
#             }

#         if similarity >= HIGH_LIMIT:

#             return {
#                 "passed": False,
#                 "reason": "Similarity too high (possible copy)",
#                 "similarity": similarity,
#                 "unlock": None,
#             }

#         force_pass = True

#     else:
#         print("ℹ️ Task-1 similarity calculated but not enforced")


#     # -------------------------------------------------
#     # Code execution
#     # -------------------------------------------------
#     if force_pass:

#         print("✅ Similarity accepted → skipping execution")

#         passed = True
#         output = "Similarity accepted"

#     elif contains_framework(source_code):

#         print("⚠️ Framework detected → skipping Judge0")

#         passed = True
#         output = "Framework project detected"

#     else:

#         raw_lang = (task.execution_language or "python").lower()

#         if raw_lang in ["python","fastapi","flask"]:
#             language_key = "python"
#         else:
#             language_key = "javascript"

#         language_id = LANGUAGE_MAP.get(language_key)

#         if not language_id:
#             raise HTTPException(400, "Judge0 language mapping missing")

#         result = judge0_simple_run(source_code, language_id)

#         status_id = result.get("status", {}).get("id")

#         passed = status_id in [3,4]

#         output = decode_output(
#             result.get("stdout") or result.get("stderr")
#         )


#     # -------------------------------------------------
#     # Update status
#     # -------------------------------------------------
#     if passed:

#         print("✅ TASK PASSED")

#         sts.status = TaskState.passed.value
#         sts.passed_at = datetime.utcnow()

#     else:

#         print("❌ TASK FAILED")

#         sts.status = TaskState.in_progress.value

#     db.commit()


#     # -------------------------------------------------
#     # Unlock next task
#     # -------------------------------------------------
#     unlock = None

#     if passed:

#         unlock = unlock_next_task(
#             db=db,
#             student_id=student.id,
#             project_id=task.project_id,
#             current_seq=task.seq,
#         )


#     return {
#         "passed": passed,
#         "similarity": similarity,
#         "output": output,
#         "unlock": unlock,
#     }


from pathlib import Path
import os
import base64
import requests
import zipfile
import difflib
import random
from datetime import datetime
from fastapi import HTTPException

from app.core.paths import BASE_DIR
from app.db.models.student_task_status import StudentTaskStatus, TaskState
from app.db.models.project_internship_files import ProjectInternshipFiles
from app.services.unlocks import unlock_next_task
from app.core.judge0_languages import LANGUAGE_MAP


JUDGE0_URL = os.getenv("JUDGE0_URL", "http://localhost:2358").rstrip("/")

LOW_LIMIT = 10
HIGH_LIMIT = 100


# -------------------------------------------------
# Detect framework
# -------------------------------------------------
def contains_framework(code: str) -> bool:

    FRAMEWORK_KEYWORDS = [
        "flask","fastapi","django","uvicorn",
        "express","react","next.js","nextjs",
        "useState(","useEffect(",
        "import react","export default",
        "<div","<span","<h1","<p>",
        "return (","app.run(","app.listen("
    ]

    code_lower = code.lower()

    for keyword in FRAMEWORK_KEYWORDS:
        if keyword in code_lower:
            return True

    return False


# -------------------------------------------------
# Detect Next.js
# -------------------------------------------------
def is_nextjs_project(code: str):

    NEXTJS_MARKERS = [
        "next",
        "next.js",
        "useState(",
        "useEffect(",
        "export default",
        "import react"
    ]

    code_lower = code.lower()

    return any(marker.lower() in code_lower for marker in NEXTJS_MARKERS)


# -------------------------------------------------
# Judge0 execution
# -------------------------------------------------
def judge0_simple_run(source_code: str, language_id: int, stdin: str = ""):

    if not source_code.strip():
        raise HTTPException(400, "Empty source code received")

    encoded_code = base64.b64encode(source_code.encode()).decode()
    encoded_input = base64.b64encode(stdin.encode()).decode()

    payload = {
        "source_code": encoded_code,
        "language_id": language_id,
        "stdin": encoded_input,
        "redirect_stderr_to_stdout": True,
        "cpu_time_limit": 2,
        "memory_limit": 128000,
    }

    try:

        res = requests.post(
            f"{JUDGE0_URL}/submissions?base64_encoded=true&wait=true",
            json=payload,
            timeout=20,
        )

        res.raise_for_status()

        return res.json()

    except requests.exceptions.RequestException:
        raise HTTPException(500, "Judge0 execution failed")


# -------------------------------------------------
# Decode Judge0 output
# -------------------------------------------------
def decode_output(encoded):

    if not encoded:
        return ""

    try:
        return base64.b64decode(encoded).decode(errors="ignore").strip()
    except Exception:
        return encoded


# -------------------------------------------------
# Similarity
# -------------------------------------------------
def similarity_percent(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, a, b).ratio() * 100


# -------------------------------------------------
# MAIN EVALUATION
# -------------------------------------------------
def evaluate_vscode_submission(
    db,
    student,
    task,
    source_code,
    framework: bool = False,
):

    print("\n🔥 VS CODE SUBMIT STARTED")
    print("Student:", student.id)
    print("Task:", task.id, "Seq:", task.seq)

    # -------------------------------------------------
    # Student task status
    # -------------------------------------------------
    sts = (
        db.query(StudentTaskStatus)
        .filter(
            StudentTaskStatus.student_id == student.id,
            StudentTaskStatus.task_id == task.id,
        )
        .first()
    )

    if not sts:

        sts = StudentTaskStatus(
            student_id=student.id,
            task_id=task.id,
            seq=task.seq,
            unlocked=True,
            unlocked_at=datetime.utcnow(),
            attempts=0,
            hidden_attempts=0,
            status=TaskState.in_progress.value,
        )

        db.add(sts)
        db.commit()

    sts.attempts += 1
    db.commit()


    # -------------------------------------------------
    # Locate ZIP reference
    # -------------------------------------------------
    zip_record = (
        db.query(ProjectInternshipFiles)
        .filter(
            ProjectInternshipFiles.project_id == task.project_id,
            ProjectInternshipFiles.internship_type == student.internship_type,
        )
        .first()
    )

    if not zip_record:
        raise HTTPException(400, "Project ZIP mapping missing")

    zip_path = BASE_DIR / zip_record.zip_file_path

    print("📦 ZIP PATH:", zip_path)

    if not zip_path.exists():
        raise HTTPException(400, "ZIP file not found on server")


    # -------------------------------------------------
    # Allowed / Ignored filters
    # -------------------------------------------------
    ALLOWED_EXTENSIONS = (
        ".py",".js",".jsx",".ts",".tsx",
        ".java",".cpp",".html",".css"
    )

    IGNORED_EXTENSIONS = (
        ".md",".env",".txt",".yml",".yaml",
        ".gitignore",".dockerignore",
        ".png",".jpg",".jpeg",".svg",".ico",".lock",".json"
    )

    IGNORED_FOLDERS = (
        "clean_env","venv","env",
        "site-packages","__pycache__",
        "node_modules","dist","build","ui","components"
    )

    task_key = f"task{task.seq}".lower()

    reference_code = ""

    # -------------------------------------------------
    # Read ZIP reference code
    # -------------------------------------------------
    with zipfile.ZipFile(zip_path, "r") as z:

        for f in z.namelist():

            if f.endswith("/"):
                continue

            f_lower = f.lower()

            if task_key not in f_lower:
                continue

            if any(folder in f_lower for folder in IGNORED_FOLDERS):
                print("⏭ Ignoring env file:", f)
                continue

            if f_lower.endswith(IGNORED_EXTENSIONS):
                print("⏭ Ignoring config file:", f)
                continue

            if not f_lower.endswith(ALLOWED_EXTENSIONS):
                continue

            try:

                file_content = z.read(f).decode("utf-8", errors="ignore")

                reference_code += f"\n/* FILE: {f} */\n{file_content}\n"

                print("📄 Loaded reference:", f)

            except Exception:
                continue


    # -------------------------------------------------
    # Similarity calculation
    # -------------------------------------------------
    if not reference_code.strip():

        print("⚠️ No code files → generating random similarity")

        similarity = random.randint(20, 80)

    else:

        # Next.js special similarity
        if is_nextjs_project(source_code):

            print("🚀 NEXTJS FILE LEVEL SIMILARITY")

            similarity = 0

            files = reference_code.split("/* FILE:")

            for file_block in files:

                if not file_block.strip():
                    continue

                try:
                    ref_code = file_block.split("*/",1)[1]

                    score = similarity_percent(ref_code, source_code)

                    if score > similarity:
                        similarity = score

                except:
                    continue

            similarity = round(similarity,2)

        else:

            similarity = round(
                similarity_percent(reference_code, source_code), 2
            )

    print(f"🔍 Similarity Score: {similarity}%")


    # -------------------------------------------------
    # Similarity rules
    # -------------------------------------------------
    force_pass = False

    internship_type = (student.internship_type or "").lower()

    if internship_type == "fasttrack":

        print("⚡ FASTTRACK similarity rule")

        if similarity < 30:
            return {
                "passed": False,
                "reason": "FastTrack requires minimum 30% similarity",
                "similarity": similarity,
                "unlock": None,
            }

        if similarity > 100:
            return {
                "passed": False,
                "reason": "Similarity exceeds allowed limit",
                "similarity": similarity,
                "unlock": None,
            }

        force_pass = True


    elif task.seq >= 2:

        if similarity < LOW_LIMIT:

            return {
                "passed": False,
                "reason": "Similarity below required minimum (10%)",
                "similarity": similarity,
                "unlock": None,
            }

        if similarity >= HIGH_LIMIT:

            return {
                "passed": False,
                "reason": "Similarity too high (possible copy)",
                "similarity": similarity,
                "unlock": None,
            }

        force_pass = True

    else:
        print("ℹ️ Task-1 similarity calculated but not enforced")


    # -------------------------------------------------
    # Code execution
    # -------------------------------------------------
    if force_pass:

        print("✅ Similarity accepted → skipping execution")

        passed = True
        output = "Similarity accepted"

    elif contains_framework(source_code):

        print("⚠️ Framework detected → skipping Judge0")

        passed = True
        output = "Framework project detected"

    else:

        raw_lang = (task.execution_language or "python").lower()

        if raw_lang in ["python","fastapi","flask"]:
            language_key = "python"
        else:
            language_key = "javascript"

        language_id = LANGUAGE_MAP.get(language_key)

        if not language_id:
            raise HTTPException(400, "Judge0 language mapping missing")

        result = judge0_simple_run(source_code, language_id)

        status_id = result.get("status", {}).get("id")

        passed = status_id in [3,4]

        output = decode_output(
            result.get("stdout") or result.get("stderr")
        )


    # -------------------------------------------------
    # Update status
    # -------------------------------------------------
    if passed:

        print("✅ TASK PASSED")

        sts.status = TaskState.passed.value
        sts.passed_at = datetime.utcnow()

    else:

        print("❌ TASK FAILED")

        sts.status = TaskState.in_progress.value

    db.commit()


    # -------------------------------------------------
    # Unlock next task
    # -------------------------------------------------
    unlock = None

    if passed:

        unlock = unlock_next_task(
            db=db,
            student_id=student.id,
            project_id=task.project_id,
            current_seq=task.seq,
        )


    return {
        "passed": passed,
        "similarity": similarity,
        "output": output,
        "unlock": unlock,
    }