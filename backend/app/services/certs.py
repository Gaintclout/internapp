


from asyncio import tasks
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor, white
from io import BytesIO
from datetime import date
from sqlalchemy.orm import Session
from fastapi import HTTPException
import os


from app.db.models.student import Student
from app.db.models.student_task_status import StudentTaskStatus, TaskState
from app.db.models.certificate import Certificate
from app.db.models.project import Project
from app.db.models.student_project import StudentProject


def render_certificate_pdf(db: Session, st: Student):
    # ---------------------------------
    # 1️⃣ FETCH TASKS
    # ---------------------------------
    tasks = (
        db.query(StudentTaskStatus)
        .filter(StudentTaskStatus.student_id == st.id)
        .order_by(StudentTaskStatus.seq.asc())
        .all()
    )

    if not tasks:
        raise HTTPException(403, "No tasks found")

    # ---------------------------------
    # 2️⃣ DETERMINE COMPLETION TASK
    # ---------------------------------
    internship_type = (
        st.internship_type.value
        if hasattr(st.internship_type, "value")
        else st.internship_type
    )

    if internship_type == "fasttrack":
        # ✅ FastTrack → 1 task
        completion_task = tasks[0]
        if completion_task.status != TaskState.passed.value:
            raise HTTPException(403, "FastTrack task not completed")

    elif internship_type == "days45":
        # ✅ 45 Days → first 3 tasks
        required_tasks = tasks[:3]

        if len(required_tasks) < 3:
            raise HTTPException(403, "45 Days tasks not completed")

        if any(t.status != TaskState.passed.value for t in required_tasks):
            raise HTTPException(403, "45 Days tasks not completed")

        completion_task = required_tasks[-1]

    elif internship_type == "semester4m":
        # ✅ 4 Months → first 8 tasks
        required_tasks = tasks[:8]

        if len(required_tasks) < 8:
            raise HTTPException(403, "4 Months tasks not completed")

        if any(t.status != TaskState.passed.value for t in required_tasks):
            raise HTTPException(403, "4 Months tasks not completed")

        completion_task = required_tasks[-1]

    else:
        raise HTTPException(400, "Unknown internship type")

    # ✅ Final safety check
    if not completion_task.passed_at:
        raise HTTPException(500, "Completion timestamp missing")

    # ---------------------------------
    # 3️⃣ RESOLVE PROJECT NAME
    # ---------------------------------
    # project_name = "Project"

    # if st.project_id:
    #     project = db.query(Project).filter(Project.id == st.project_id).first()
    #     if project:
    #         project_name = project.name

        # ---------------------------------
    # 3️⃣ RESOLVE PROJECT NAME
    # ---------------------------------
    project_name = "Project"

    sp = (
        db.query(StudentProject)
        .filter(StudentProject.student_id == st.id)
        .order_by(StudentProject.id.desc())
        .first()
    )

    if sp:
        project = db.query(Project).filter(Project.id == sp.project_id).first()
        if project:
            project_name = project.title
    # ---------------------------------
    # 4️⃣ CERTIFICATE (SAFE UNIQUENESS)
    # ---------------------------------
    cert = (
        db.query(Certificate)
        .filter(
            Certificate.person_name == st.user.name,
            Certificate.project_name == project_name
        )
        .first()
    )

    if not cert:
        next_no = db.query(Certificate).count() + 1
        cert = Certificate(
            project_name=project_name,
            person_name=st.user.name,
            joining_date=st.created_at.date(),
            ending_date=completion_task.passed_at.date(),
            certificate_id=f"GAINT-{str(next_no).zfill(2)}"
        )
        db.add(cert)
        db.commit()
        db.refresh(cert)

    # ---------------------------------
    # 5️⃣ PDF GENERATION
    # ---------------------------------
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)

    pdf.setFillColor(white)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    template_path = os.path.join("app", "static", "certificate_template.png")

    if not os.path.exists(template_path):
        raise HTTPException(500, "Certificate template missing")

    pdf.drawImage(
        ImageReader(template_path),
        0,
        0,
        width=width,
        height=height,
        mask="auto"
    )

    navy = HexColor("#0A2A66")
    gold = HexColor("#C9A24D")

    # ---------------------------------
    # 6️⃣ TEXT OVERLAYS
    # ---------------------------------
    pdf.setFillColor(navy)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawCentredString(
        width / 2,
        height - 80,
        f"Certificate ID: {cert.certificate_id}"
    )

    pdf.setFont("Times-BoldItalic", 30)
    pdf.drawCentredString(
        width / 2,
        height - 240,
        "We Present This Certificate To"
    )

    pdf.setFillColor(gold)
    pdf.drawCentredString(
        width / 2,
        height - 300,
        cert.person_name
    )

    pdf.setFillColor(navy)
    pdf.setFont("Helvetica", 13)
    pdf.drawCentredString(
        width / 2,
        height - 330,
        f'This is to certify that the project entitled "{cert.project_name}"'
    )

    pdf.drawCentredString(
        width / 2,
        height - 350,
        "is a bonafide work carried out at"
    )

    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawCentredString(
        width / 2,
        height - 380,
        "GAINT CLOUT TECHNOLOGIES PVT LTD, HYDERABAD"
    )

    pdf.setFont("Helvetica", 13)
    pdf.drawCentredString(
        width / 2,
        height - 400,
        f"from {cert.joining_date} to {cert.ending_date}"
    )

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    return buffer, cert.certificate_id
