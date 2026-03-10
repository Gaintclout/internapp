from pydantic import BaseModel

class PaymentIn(BaseModel):
    student_id: str
    payment_id: str  # UPI txn ID

class PaymentOut(BaseModel):
    message: str
