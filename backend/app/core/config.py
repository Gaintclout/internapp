from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import Field 
import os

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)


class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    GOOGLE_CLIENT_ID: str = "988749016628-hufd7eg88f5crjpc33ljlcod6rrkr32u.apps.googleusercontent.com"
    
    OPENAI_API_KEY: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    JWT_SECRET: str = Field(..., env="JWT_SECRET")
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # -----------------------------
    # Razorpay Keys
    # -----------------------------
    RAZORPAY_KEY_ID: str = Field(..., env="RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET: str = Field(..., env="RAZORPAY_KEY_SECRET")

    # # SMS Gateway settings (using Fast2SMS as example)
    # SMS_API_KEY: Optional[str] = Field(default=None, env="SMS_API_KEY")
    # SMS_SENDER_ID: str = Field("TXTIND", env="SMS_SENDER_ID")

    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str

    # Email settings for password reset
    MAIL_USERNAME: str = "your-email@gmail.com"
    MAIL_PASSWORD: str = "your-app-specific-password"
    MAIL_FROM: str = "your-email@gmail.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_SSL_TLS: bool = False
    MAIL_STARTTLS: bool = True
    FRONTEND_URL: str = "http://localhost:3000"  # URL where frontend is hosted
    JUDGE0_URL: str = Field(
        default="http://localhost:2358",
        env="JUDGE0_URL"
    )
    #JUDGE0_BASE: str = "https://judge0-ce.p.rapidapi.com"
    #JUDGE0_KEY: str = "649850c0ebmshecc75bed8229d02p100b9bjsnc75b1e041ea0"
    #JUDGE0_RAPIDAPI: bool = True

    STORAGE_BUCKET: str = "internapp"

    UPI_ID: str = "mab.037348048560208@axisbank"
    QR_IMAGE_URL: str = ""

    # Accept either a boolean or a string (some environments set DEBUG to e.g. 'WARN')
    DEBUG: bool = Field(default=False, env="DEBUG")

    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# PostgreSQL database setup
#os.system("psql -U postgres -c 'CREATE DATABASE interns;'")
