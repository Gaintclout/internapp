import base64
import json
from typing import Any, Dict
import httpx

from app.core.config import settings
from fastapi import HTTPException
from app.core.judge0_languages import LANGUAGE_MAP



# ============================================================
# 🔥 SELF-HOSTED JUDGE0 — SIMPLE & CLEAN
# ============================================================

JUDGE0_BASE = settings.JUDGE0_URL.rstrip("/")   # e.g. http://localhost:2358/submissions

HEADERS = {"Content-Type": "application/json"}


# ------------------------------------------------------------
# CREATE SUBMISSION
# ------------------------------------------------------------
async def create_submission(
    source_code: str,
    project_language: str,
    stdin: str = "",
    expected_output: str | None = None,
) -> Dict[str, Any]:

    language_key = project_language.lower().strip()

    language_id = LANGUAGE_MAP.get(language_key)

    if not language_id:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language: {project_language}"
        )

    payload = {
        "source_code": base64.b64encode(source_code.encode()).decode(),
        "language_id": language_id,
        "stdin": base64.b64encode(stdin.encode()).decode(),
    }

    if expected_output is not None:
        payload["expected_output"] = base64.b64encode(expected_output.encode()).decode()

    url = f"{JUDGE0_BASE}?base64_encoded=true&wait=false"

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, json=payload, headers=HEADERS)
    except httpx.RequestError as e:
        raise RuntimeError(f"Cannot reach Judge0 at {url}. Error: {e}") from e

    if r.status_code >= 400:
        raise RuntimeError(f"Judge0 error ({r.status_code}): {r.text}")

    return r.json()


# ------------------------------------------------------------
# GET SUBMISSION RESULT
# ------------------------------------------------------------
async def get_submission(token: str) -> Dict[str, Any]:

    url = f"{JUDGE0_BASE}/{token}?base64_encoded=true"

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.get(url, headers=HEADERS)
    except httpx.RequestError as e:
        raise RuntimeError(f"Cannot reach Judge0 at {url}. Error: {e}") from e

    if r.status_code >= 400:
        raise RuntimeError(f"Judge0 error ({r.status_code}): {r.text}")

    return r.json()
