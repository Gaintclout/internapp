from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
import uuid
from app.core.deps import get_current_user
from app.db.session import get_db
from app.db.models.user import User, RoleEnum
from app.db.models.student import Student
from app.db.models.payment import Payment, PaymentPurpose, PaymentStatus
from app.db.models.certificate import Certificate
from app.services.certs import render_certificate_pdf
from starlette.responses import StreamingResponse


router = APIRouter(prefix="/certificate", tags=["Certificate"])

# @router.get("/download")
# def download_certificate(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     st = db.query(Student).filter(Student.user_id == user.id).first()
#     if not st or not st.project_id:
#         raise HTTPException(status_code=400, detail="Project not completed or missing")

#     pay = db.query(Payment).filter(Payment.student_id == st.id, Payment.purpose == PaymentPurpose.certificate).first()
#     if not pay:
#         raise HTTPException(status_code=402, detail="Certificate payment required")

#     # TODO: check all tasks passed (left as exercise depending on progress rules)
#     cert = db.query(Certificate).filter(Certificate.student_id == st.id).first()
#     if not cert:
#         pdf_url = render_and_store_certificate(db, st)
#         cert = Certificate(
#             id=str(uuid.uuid4()),
#             student_id=st.id,
#             project_id=st.project_id,
#             internship_type=st.internship_type.value if st.internship_type else "NA",
#             pdf_url=pdf_url
#         )
#         db.add(cert); db.commit()
#     return {"pdf_url": cert.pdf_url}




from app.db.models.student import Student

@router.get("/download")
def download_certificate(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    # ✅ ALWAYS fetch student fresh
    student = db.query(Student).filter(
        Student.user_id == user.id
    ).first()

    if not student:
        raise HTTPException(404, "Student not found")

    buffer, cert_id = render_certificate_pdf(db, student)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={cert_id}.pdf"
        }
    )

