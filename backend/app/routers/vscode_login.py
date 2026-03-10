from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.core.security import create_access_token
from app.routers.auth import auth_codes

router = APIRouter(prefix="/vscode", tags=["VSCode Login"])



from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.core.security import create_access_token
from app.routers.auth import auth_codes

router = APIRouter(prefix="/vscode", tags=["VSCode Login"])

@router.get("/authorize")
def vscode_authorize(code: str = None, auth_code: str = None):
    actual_code = code or auth_code

    if not actual_code:
        raise HTTPException(400, "Authorization code missing")

    if actual_code not in auth_codes:
        raise HTTPException(400, "Invalid authorization code")

    data = auth_codes[actual_code]

    if data["expires"] < datetime.utcnow():
        del auth_codes[actual_code]
        raise HTTPException(400, "Authorization code expired")

    # token = create_access_token({"sub": data["user_id"]})
    token = data["token"]   # return the SAME token the frontend used


    del auth_codes[actual_code]

    return {"access_token": token, "token_type": "bearer"}

