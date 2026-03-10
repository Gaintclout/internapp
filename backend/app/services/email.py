from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
import os
from app.core.config import settings

mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    USE_CREDENTIALS=True
)

fastmail = FastMail(mail_config)

async def send_password_reset_email(email: str, token: str, username: str):
    """Send password reset email with reset link"""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"""
        Hi {username},
        
        You requested to reset your password. Click the link below to proceed:
        
        {reset_url}
        
        If you didn't request this, you can safely ignore this email.
        
        This link will expire in 30 minutes.
        
        Best regards,
        Your App Team
        """,
        subtype="plain"
    )
    
    await fastmail.send_message(message)