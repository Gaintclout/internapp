# app/core/deps.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import decode_token
from app.db.session import get_db
from app.db.models.user import User, RoleEnum
import uuid
from typing import Optional, Callable

# Three explicit OAuth2 schemes -> produces three named securitySchemes in OpenAPI
# Use stable scheme_name values matching the custom OpenAPI component names
oauth2_user = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    auto_error=False,
    scheme_name="OAuth2_user",
)
oauth2_mentor = OAuth2PasswordBearer(
    tokenUrl="/auth/login-mentor",
    auto_error=False,
    scheme_name="OAuth2_mentor",
)
oauth2_admin = OAuth2PasswordBearer(
    tokenUrl="/auth/login-admin",
    auto_error=False,
    scheme_name="OAuth2_admin",
)

# Backwards-compat symbol many modules expect
oauth2_scheme = oauth2_user

def _get_user_from_token(token: Optional[str], db: Session) -> User:
    if not token:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    parsed_uuid = None
    try:
        if isinstance(user_id, uuid.UUID):
            parsed_uuid = user_id
        else:
            parsed_uuid = uuid.UUID(str(user_id))
    except Exception:
        parsed_uuid = None

    user = None
    if parsed_uuid is not None:
        user = db.query(User).filter(User.id == parsed_uuid).first()

    if not user:
        user = db.query(User).filter(User.id == str(user_id)).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Generic: accept any of the three tokens (user/mentor/admin) — convenient fallback
def get_current_user(
    token_user: str = Depends(oauth2_user),
    token_mentor: str = Depends(oauth2_mentor),
    token_admin: str = Depends(oauth2_admin),
    db: Session = Depends(get_db),
) -> User:
    token = token_user or token_mentor or token_admin
    return _get_user_from_token(token, db)

# Scheme-specific getters (these will make OpenAPI show separate auth boxes)
def get_current_user_via_user(token: str = Depends(oauth2_user), db: Session = Depends(get_db)) -> User:
    return _get_user_from_token(token, db)

def get_current_user_via_mentor(token: str = Depends(oauth2_mentor), db: Session = Depends(get_db)) -> User:
    return _get_user_from_token(token, db)

def get_current_user_via_admin(token: str = Depends(oauth2_admin), db: Session = Depends(get_db)) -> User:
    return _get_user_from_token(token, db)

# Role guards (use these in role-specific routers)
def require_student(user: User = Depends(get_current_user_via_user)) -> User:
    if user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user

def require_mentor(user: User = Depends(get_current_user_via_mentor)) -> User:
    if user.role != RoleEnum.mentor:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user

def require_admin(user: User = Depends(get_current_user_via_admin)) -> User:
    if user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user

# Backwards-compatible role_required factory (keeps existing callers working)
def role_required(role: RoleEnum) -> Callable:
    def _dep(user: User = Depends(get_current_user)):
        if user.role != role:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return _dep
