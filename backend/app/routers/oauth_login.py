# app/routers/oauth_login.py
from fastapi import APIRouter, HTTPException, Depends
from app.db.session import get_db
from app.db.models.user import User, RoleEnum
from app.db.models.student import Student
from app.core.security import create_access_token
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
import httpx, os, uuid

router = APIRouter(prefix="/auth/oauth", tags=["oauth"])

# ---------------- GOOGLE LOGIN -----------------
@router.post("/google")
async def google_login(token: str, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
        email = idinfo.get("email")
        name = idinfo.get("name")

        # check if user exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(id=str(uuid.uuid4()), email=email, full_name=name, role=RoleEnum.student)
            db.add(user)
            db.flush()
            student = Student(user_id=user.id)
            db.add(student)
            db.commit()

        jwt_token = create_access_token({"sub": user.email, "role": user.role.value})
        return {"access_token": jwt_token, "token_type": "bearer", "email": email}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google token invalid: {str(e)}")


# ---------------- LINKEDIN LOGIN -----------------
@router.post("/linkedin")
async def linkedin_login(access_token: str, db: Session = Depends(get_db)):
    try:
        async with httpx.AsyncClient() as client:
            # get profile info
            profile = await client.get(
                "https://api.linkedin.com/v2/me",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            email_resp = await client.get(
                "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                headers={"Authorization": f"Bearer {access_token}"}
            )
        if profile.status_code != 200 or email_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="LinkedIn token invalid")

        profile_data = profile.json()
        email_data = email_resp.json()
        email = email_data["elements"][0]["handle~"]["emailAddress"]
        name = profile_data.get("localizedFirstName", "") + " " + profile_data.get("localizedLastName", "")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(id=str(uuid.uuid4()), email=email, full_name=name, role=RoleEnum.student)
            db.add(user)
            db.flush()
            student = Student(user_id=user.id)
            db.add(student)
            db.commit()

        jwt_token = create_access_token({"sub": user.email, "role": user.role.value})
        return {"access_token": jwt_token, "token_type": "bearer", "email": email}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
