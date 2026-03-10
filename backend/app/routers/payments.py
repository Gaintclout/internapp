

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import uuid
import razorpay
import hmac
import hashlib

from app.db.session import get_db
from app.core.config import settings
from app.core.deps import get_current_user

from app.db.models.user import User, RoleEnum
from app.db.models.student import Student
from app.db.models.payment import Payment, PaymentPurpose, PaymentStatus

router = APIRouter(prefix="/payments", tags=["payments"])


# =====================================
# RAZORPAY CLIENT
# =====================================

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# =====================================
# CREATE PROJECT PAYMENT ORDER
# =====================================

@router.post("/project")
def project_payment(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Only students can pay")

    student = db.query(Student).filter(
        Student.user_id == user.id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Prevent duplicate payment
    existing = db.query(Payment).filter(
        Payment.student_id == student.id,
        Payment.purpose == PaymentPurpose.project
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Project payment already recorded"
        )

    # 🔵 DEBUG PRINT (VERY IMPORTANT)
    print("RAZORPAY KEY ID:", settings.RAZORPAY_KEY_ID)
    print("RAZORPAY KEY SECRET:", settings.RAZORPAY_KEY_SECRET)

    try:
        order = razorpay_client.order.create({
            "amount": 999900,  # ₹9999 in paise
            "currency": "INR",
            "payment_capture": 1
        })

    except Exception as e:
        print("RAZORPAY ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

    payment = Payment(
        id=str(uuid.uuid4()),
        student_id=student.id,
        purpose=PaymentPurpose.project,
        amount_inr=9999,
        payment_id=order["id"],
        status=PaymentStatus.pending
    )

    db.add(payment)
    db.commit()

    return {
        "order_id": order["id"],
        "amount": 9999,
        "currency": "INR",
        "razorpay_key": settings.RAZORPAY_KEY_ID
    }


# =====================================
# VERIFY PAYMENT
# =====================================

@router.post("/verify")
async def verify_payment(
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    data = await request.json()

    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    generated_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()

    if generated_signature != razorpay_signature:
        raise HTTPException(status_code=400, detail="Payment verification failed")

    student = db.query(Student).filter(
        Student.user_id == user.id
    ).first()

    payment = db.query(Payment).filter(
        Payment.student_id == student.id,
        Payment.payment_id == razorpay_order_id
    ).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    payment.status = PaymentStatus.success

    db.commit()

    return {
        "message": "Payment verified successfully"
    }


# =====================================
# PAYMENT STATUS
# =====================================

@router.get("/status")
def payment_status(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Only students can view")

    student = db.query(Student).filter(
        Student.user_id == user.id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    project_paid = db.query(Payment).filter(
        Payment.student_id == student.id,
        Payment.purpose == PaymentPurpose.project,
        Payment.status == PaymentStatus.success
    ).first() is not None

    return {
        "project_paid": project_paid
    }


# =====================================
# PAYMENT INFO
# =====================================

@router.get("/info")
def payment_info():

    return {
        "upi_id": settings.UPI_ID,
        "qr_image_url": settings.QR_IMAGE_URL,
        "project_amount_inr": 9999
    }