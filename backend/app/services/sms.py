# from typing import Optional
# import httpx
# from app.core.config import settings

# async def send_sms(phone_number: str, message: str) -> bool:
#     """
#     Send an SMS using the configured SMS gateway.
#     Returns True if successful, False otherwise.
    
#     Currently using Fast2SMS as an example. Replace with your preferred provider.
#     """
#     try:
#         # Remove any spaces or special characters from phone number
#         cleaned_phone = ''.join(filter(str.isdigit, phone_number))
        
#         # Fast2SMS API endpoint (example)
#         url = "https://www.fast2sms.com/dev/bulkV2"
        
#         headers = {
#             "authorization": settings.SMS_API_KEY,
#             "Content-Type": "application/json"
#         }
        
#         payload = {
#             "route": "v3",
#             "sender_id": "TXTIND",
#             "message": message,
#             "language": "english",
#             "flash": 0,
#             "numbers": cleaned_phone,
#         }
        
#         async with httpx.AsyncClient() as client:
#             response = await client.post(url, json=payload, headers=headers)
#             return response.status_code == 200
            
#     except Exception as e:
#         print(f"Error sending SMS: {str(e)}")
#         return False

# async def send_otp(phone_number: str, otp: str) -> bool:
#     """Send OTP via SMS."""
#     message = f"Your OTP for password reset is: {otp}. Valid for 5 minutes. Do not share this with anyone."
#     return await send_sms(phone_number, message)



from typing import Optional
from twilio.rest import Client
from app.core.config import settings


async def send_sms(phone_number: str, message: str) -> bool:
    """
    Send SMS using Twilio
    """
    try:
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )

        message = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )

        return True if message.sid else False

    except Exception as e:
        print(f"Error sending SMS: {str(e)}")
        return False


async def send_otp(phone_number: str, otp: str) -> bool:
    """
    Send OTP SMS
    """
    message = f"Your OTP for password reset is: {otp}. Valid for 5 minutes. Do not share this with anyone."
    return await send_sms(phone_number, message)