from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Literal

class RegisterStudent(BaseModel):
    name: str
    college_email: str
    phone: str | None = None
    password: str
    college_name: str | None = None
    pursuing_year: str | None = None

    internship_type: Literal["fasttrack", "days45", "semester4m"]
    preferred_language: str 

class Login(BaseModel):
    email: str
    password: str

class TokenOut(BaseModel): 
    access_token: str
    token_type: str = "bearer"

class RequestOTPRequest(BaseModel):
     phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str
    #new_password: str
    
class ResetPasswordRequest(BaseModel):
    # phone_number: str
    # otp: str
    new_password: str


