# app/routers/debug.py
from fastapi import APIRouter, Depends, Request, HTTPException
from app.core.deps import get_current_user, oauth2_scheme
from app.core.security import decode_token

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/whoami")
def whoami(user = Depends(get_current_user)):
    # returns basic user info (requires Authorization Bearer token)
    return {"id": str(user.id), "email": getattr(user, "email", None), "role": getattr(user, "role", None)}

@router.get("/headers")
def headers(req: Request):
    # returns request headers so you can inspect Authorization etc
    return {"headers": dict(req.headers)}

@router.get("/token-info")
def token_info(token: str = Depends(oauth2_scheme)):
    # decode and show token payload (if token present/valid)
    if not token:
        return {"error": "no token provided"}
    try:
        payload = decode_token(token)
        return {"payload": payload}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
