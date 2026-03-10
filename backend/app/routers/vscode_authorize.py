# app/routers/vscode_authorize.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime   # ✅ REQUIRED
from app.db.session import get_db
from app.routers.auth import auth_codes   # SAME AUTH CODES MEMORY STORE

router = APIRouter(prefix="/vscode", tags=["VSCode"])

@router.get("/authorize")
def vscode_authorize(auth_code: str, db: Session = Depends(get_db)):

    # 1️⃣ Check if auth_code exists
    if auth_code not in auth_codes:
        raise HTTPException(401, "Invalid or expired auth code")

    entry = auth_codes[auth_code]

    # 2️⃣ Verify expiry
    if entry["expires"] < datetime.utcnow():
        del auth_codes[auth_code]
        raise HTTPException(401, "Auth code expired")

    # 3️⃣ Return SAME user token (stored earlier)
    return {"access_token": entry["token"]}
