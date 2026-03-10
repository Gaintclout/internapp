import random
from datetime import datetime, timedelta
from typing import Dict, Tuple
from fastapi import HTTPException, status

# OTP stored using phone numbers now
otp_store: Dict[str, Tuple[str, datetime]] = {}

def generate_otp() -> str:
    return f"{random.randint(1000, 9999)}"

def store_otp(phone: str, otp: str, expiry_minutes: int = 10) -> None:
    expiry = datetime.utcnow() + timedelta(minutes=expiry_minutes)
    otp_store[phone] = (otp, expiry)

def verify_otp(phone: str, otp: str) -> bool:
    if phone not in otp_store:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP requested for this phone number."
        )
    
    stored_otp, expiry = otp_store[phone]

    if datetime.utcnow() > expiry:
        del otp_store[phone]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired. Please request a new one."
        )
    
    if otp != stored_otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP."
        )

    del otp_store[phone]
    return True
def clear_expired_otps() -> None:
    """Clear expired OTPs (Optional)."""
    now = datetime.utcnow()
    expired = [phone for phone, (_, expiry) in otp_store.items() if now > expiry]
    
    for phone in expired:
        del otp_store[phone]
