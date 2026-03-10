# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Security
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from typing import Optional
from passlib.exc import UnknownHashError
from sqlalchemy import text  
import random
from datetime import datetime



from app.db.session import get_db
from app.db.models.user import User, RoleEnum
from app.db.models.student import Student
from app.db.models.student_project import StudentProject
from app.core.security import hash_password, verify_password, create_access_token, decode_token, get_current_user
from app.schemas.auth import RegisterStudent, TokenOut, RequestOTPRequest, VerifyOTPRequest
from app.services.otp import generate_otp, store_otp, verify_otp
from app.services.sms import send_otp
from app.db.models.project import Project
from app.db.models.student_task_status import StudentTaskStatus

# NEW IMPORTS FOR GOOGLE LOGIN
from google.oauth2 import id_token
from google.auth.transport import requests

auth_codes: dict[str, dict] = {}

security = HTTPBearer()

router = APIRouter(prefix="/auth", tags=["auth"])

# --- Fixed credentials (as requested) ---
MENTOR_FIXED_EMAIL = "rohinireddy242@gmail.com"
MENTOR_FIXED_PASSWORD = "Rohini#123"

ADMIN_FIXED_EMAIL = "gaintclout@gmail.com"
ADMIN_FIXED_PASSWORD = "Clout#123"
# ------------------------------------------------


def _ensure_user_exists(db: Session, email: str, role: RoleEnum, name: Optional[str] = None, password: Optional[str] = None) -> User:
    user = db.query(User).filter(User.college_email == email).first()
    if user:
        if user.role != role:
            user.role = role
            db.add(user); db.commit(); db.refresh(user)
        return user

    user = User(
        role=role,
        name=name or role.value.capitalize(),
        college_email=email,
        phone=None,
        password_hash=hash_password(password) if password is not None else hash_password("changeMe123!"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if role == RoleEnum.student:
        st = db.query(Student).filter_by(user_id=user.id).first()
        if not st:
            db.add(Student(user_id=user.id))
            db.commit()
    return user


@router.post("/register-student", response_model=TokenOut)
def register_student(payload: RegisterStudent, db: Session = Depends(get_db)):

    # check existing email
    existing = db.query(User).filter(User.college_email == payload.college_email).first()
    if existing:
        raise HTTPException(400, "Email already registered")

    # Create user (NO internship_type/preferred_language here)
    user = User(
        role=RoleEnum.student,
        name=payload.name,
        college_email=payload.college_email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        college_name=payload.college_name,
        pursuing_year=payload.pursuing_year,
        
    )
    db.add(user)
    db.flush()   # get user.id

    # Create student entry (THIS is where preferred_language goes)
    student = Student(
        user_id=user.id,
        internship_type=payload.internship_type,
        preferred_language=payload.preferred_language
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    token = create_access_token({"sub": str(user.id), "role": user.role})

    return TokenOut(access_token=token)


from app.services.task_assigner import assign_tasks_for_student



@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    identifier = form_data.username
    password = form_data.password

    # -------------------------------------------------
    # 1️⃣ FIND USER
    # -------------------------------------------------
    user = (
        db.query(User)
        .filter(
            (User.college_email == identifier) |
            (User.phone == identifier)
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # -------------------------------------------------
    # 2️⃣ ENSURE STUDENT EXISTS
    # -------------------------------------------------
    student = (
        db.query(Student)
        .filter(Student.user_id == user.id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=500,
            detail="Student profile missing"
        )

    # -------------------------------------------------
    # 3️⃣ ISSUE TOKEN ONLY
    # -------------------------------------------------
    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/request-otp")
def request_otp(request: RequestOTPRequest, db: Session = Depends(get_db)):

    # 1️⃣ Find user by phone
    user = (
        db.query(User)
        .filter(User.phone == request.phone_number)
        .order_by(User.created_at.desc())
        .first()
    )

    # 2️⃣ Create user if not exists (OTP user)
    if not user:
        user = User(
            phone=request.phone_number,
            name=f"USER_{request.phone_number[-4:]}",
            role=RoleEnum.student,
            college_email=f"{request.phone_number}@otp.gaintclout.com",
            password_hash=hash_password("OTP_LOGIN_USER"),
            is_otp_user=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 3️⃣ Generate OTP
    otp = str(random.randint(1000, 9999))

    # 4️⃣ Store OTP
    user.otp = otp
    user.updated_at = datetime.utcnow()
    db.commit()

    print("🔐 LOCAL TEST OTP:", otp)  # dev only

    return {"message": "OTP sent successfully"}




# @router.post("/verify-otp")
# def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(
#         User.phone == request.phone_number
#     ).first()

#     if not user or not user.otp:
#         raise HTTPException(400, "OTP not generated")

#     if str(user.otp) != str(request.otp):
#         raise HTTPException(400, "Invalid OTP")

#     # ❌ DO NOT CLEAR OTP HERE
#     return {"message": "OTP verified"}


@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == request.phone_number).first()

    if not user or not user.otp:
        raise HTTPException(400, "OTP not generated")

    if str(user.otp) != str(request.otp):
        raise HTTPException(400, "Invalid OTP")

    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {
        "message": "OTP verified",
        "access_token": access_token
    }



from app.schemas.auth import (
    RequestOTPRequest,
    VerifyOTPRequest,
    ResetPasswordRequest   )

from uuid import uuid4
from datetime import datetime, timedelta


# @router.post("/reset-password")
# def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):

#     # ✅ Always get the SAME user login uses
#     user = db.query(User).filter(
#         User.phone == request.phone_number
#     ).order_by(User.created_at.asc()).first()

#     if not user or not user.otp:
#         raise HTTPException(400, "OTP not generated or expired")

#     if request.otp.strip() != user.otp.strip():
#         raise HTTPException(400, "Invalid or expired OTP")

#     user.password_hash = hash_password(request.new_password)
#     user.otp = None

#     db.commit()

#     return {"message": "Password reset successful"}



@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # user already verified
):
    user = db.query(User).filter(User.id == current_user.id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = hash_password(request.new_password)

    db.commit()

    return {"message": "Password reset successful"}





@router.post("/login-mentor")
def login_mentor(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password

    if username != MENTOR_FIXED_EMAIL or password != MENTOR_FIXED_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user = _ensure_user_exists(db, MENTOR_FIXED_EMAIL, RoleEnum.mentor, name="Mentor", password=MENTOR_FIXED_PASSWORD)
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login-admin")
def login_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password

    if username != ADMIN_FIXED_EMAIL or password != ADMIN_FIXED_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user = _ensure_user_exists(db, ADMIN_FIXED_EMAIL, RoleEnum.admin, name="Admin", password=ADMIN_FIXED_PASSWORD)
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}



# -------------------------------------------------
# ✅ NEW GOOGLE LOGIN ROUTE (No changes to your code)
# -------------------------------------------------
GOOGLE_CLIENT_ID = "988749016628-hufd7eg88f5crjpc33ljlcod6rrkr32u.apps.googleusercontent.com"

@router.post("/google-login")
def google_login(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token missing")

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]
        name = idinfo.get("name", "Google User")
        picture = idinfo.get("picture")

        # Check if user exists
        user = db.query(User).filter(User.college_email == email).first()

        # If not exists → create
        if not user:
            user = User(
                role=RoleEnum.student,
                name=name,
                college_email=email,
                password_hash=hash_password("google_user_default_password")
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            db.add(Student(user_id=user.id))
            db.commit()

        access_token = create_access_token({"sub": str(user.id), "role": user.role})

        return {
            "message": "Google Login Successful",
            "access_token": access_token,
            "email": email,
            "name": name,
            "picture": picture
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")













from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from app.db.session import get_db
from app.db.models.user import User
bearer_scheme = HTTPBearer()

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    token = creds.credentials
    print("🔥 Received Token:", token)

    try:
        payload = decode_token(token)
        print("🔥 Decoded Payload:", payload)

        user_id = payload["sub"]   # <-- FIXED (UUID)
    except Exception as e:
        print("❌ Decode Error:", str(e))
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user











from uuid import uuid4
from app.db.session import SessionLocal
from datetime import datetime, timedelta

#auth_codes = {}

@router.post("/generate-auth-code")
def generate_auth_code(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload["sub"]

    code = str(uuid4())

    # auth_codes[code] = {
    #     "user_id": user_id,
    #     "expires": datetime.utcnow() + timedelta(minutes=5)
    # }

    auth_codes[code] = {
        "user_id": user_id,
        "token": token,   # <-- IMPORTANT FIX
        "expires": datetime.utcnow() + timedelta(minutes=5)
    }

    redirect_url = f"vscode://gaintclout.internapp-vscode/auth?auth_code={code}"

    return {
        "auth_code": code,
        "auth_url": redirect_url
    }




@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.college_email,
        "role": user.role
    }

