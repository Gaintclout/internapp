import zipfile
import difflib
from fastapi import HTTPException

ALLOWED_EXTENSIONS = (
    ".py", ".js", ".jsx", ".ts", ".tsx",
    ".java", ".cpp", ".css", ".html", ".json"
)

IGNORED_FOLDERS = (
    "node_modules",
    "dist",
    "build",
    "__MACOSX",
)

def extract_reference_code(zip_path):
    reference_code = ""

    with zipfile.ZipFile(zip_path, "r") as z:
        for f in z.namelist():
            if f.endswith("/"):
                continue
            if any(x in f for x in IGNORED_FOLDERS):
                continue
            if not f.endswith(ALLOWED_EXTENSIONS):
                continue

            try:
                content = z.read(f).decode("utf-8", errors="ignore")
                reference_code += f"\n/* FILE: {f} */\n{content}\n"
            except Exception:
                continue

    if not reference_code.strip():
        raise HTTPException(400, "No valid source files found in ZIP")

    return reference_code


def similarity_percent(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, a, b).ratio() * 100
