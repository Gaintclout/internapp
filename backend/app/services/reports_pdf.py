# app/services/reports_pdf.py
from io import BytesIO
from datetime import datetime
from typing import List, Dict, Any

# Use reportlab to generate PDF. Install: pip install reportlab
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors

# Short mentor feedback templates (≈20 words)
FEEDBACK_TEXT = {
    "completed": "Good — task completed. Nicely done; keep following the same approach for subsequent tasks.",
    "started": "Work in progress — please complete remaining items, focus on edge cases and hidden requirements.",
    "not_started": "Not started — you must begin this task immediately. Reach out if you need clarification."
}

def _status_to_feedback_and_percent(progress_percent: int) -> tuple[str, int]:
    """
    Map progress_percent to feedback label and display percentage.
    Rules (as discussed):
      - >= 90 => completed (100%)
      - 40..89 => started/partial (50%)
      - < 40 => not started (10%)
    """
    if progress_percent >= 90:
        return FEEDBACK_TEXT["completed"], 100
    if progress_percent >= 40:
        return FEEDBACK_TEXT["started"], 50
    return FEEDBACK_TEXT["not_started"], 10

def _format_date(dt):
    if not dt:
        return ""
    if isinstance(dt, str):
        return dt
    return dt.strftime("%Y-%m-%d")

def generate_fortnight_pdf(db_session, student_id: str, from_date: datetime, to_date: datetime) -> bytes:
    """
    Generate a fortnight report PDF for a given student between from_date and to_date.
    """
    from app.db.models.student import Student
    from app.db.models.project import Project
    from app.db.models.student_task_status import StudentTaskStatus

    try:
        from app.db.models.task import ProjectTask
    except Exception:
        ProjectTask = None

    student = db_session.query(Student).filter(Student.id == student_id).first()
    if not student:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="student not found")

    from app.db.models.task import ProjectTask

    if ProjectTask is None:
        raise ImportError("ProjectTask model not found")

    # Fetch all StudentTaskStatus rows
    sts_rows = db_session.query(StudentTaskStatus).filter(
        StudentTaskStatus.student_id == student_id
    ).all()

    tasks_for_period = []
    for s in sts_rows:
        t = db_session.query(ProjectTask).filter(ProjectTask.id == s.task_id).first()
        if not t:
            continue

        in_period = False
        if getattr(s, "unlocked_at", None):
            in_period = (from_date <= s.unlocked_at <= to_date)
        if getattr(s, "passed_at", None):
            in_period = in_period or (from_date <= s.passed_at <= to_date)
        if not in_period and getattr(s, "last_submission_id", None):
            in_period = True

        tasks_for_period.append({
            "task_title": getattr(t, "title", "Untitled"),
            "task_id": str(t.id),
            "progress_percent": getattr(s, "progress_percent", 0) or 0,
            "hidden_attempts": getattr(s, "hidden_attempts", 0) or 0,
            "status": getattr(s, "status", "unknown"),
        })

    # Build PDF
    buff = BytesIO()
    doc = SimpleDocTemplate(
        buff,
        pagesize=A4,
        rightMargin=18*mm,
        leftMargin=18*mm,
        topMargin=18*mm,
        bottomMargin=18*mm
    )
    styles = getSampleStyleSheet()
    flow: List[Any] = []

    # Header
    flow.append(Paragraph("<b>Quincena Report</b>", styles["Title"]))
    flow.append(Spacer(1, 6))

    # Student info
    reg_html = f"""
    <b>Name:</b> {student.name if hasattr(student, 'name') else ''} <br/>
    <b>Email:</b> {student.email if hasattr(student, 'email') else ''} <br/>
    <b>College:</b> {getattr(student,'college_name','')} <br/>
    <b>College ID:</b> {getattr(student,'college_id','')} <br/>
    <b>Project ID:</b> {getattr(student,'project_id','')} <br/>
    <b>Period:</b> {from_date.strftime('%Y-%m-%d')} to {to_date.strftime('%Y-%m-%d')}
    """
    flow.append(Paragraph(reg_html, styles["Normal"]))
    flow.append(Spacer(1, 10))

    # -----------------------------
    # UPDATED TABLE ALIGNMENT HERE
    # -----------------------------
    data = [
        ["#", "Task", "Assigned (15 days)", "Progress (%)", "Mentor Feedback", "Marks"]
    ]

    for i, row in enumerate(tasks_for_period, start=1):
        fb_text, marks = _status_to_feedback_and_percent(int(row["progress_percent"]))
        fb_short = " ".join(fb_text.split()[:20])

        data.append([
            str(i),
            row["task_title"],
            "Yes",
            str(row["progress_percent"]),
            fb_short,
            f"{marks}%"
        ])

    if len(data) == 1:
        flow.append(Paragraph("No tasks found for this fortnight.", styles["Normal"]))
    else:
        tbl = Table(
            data,
            colWidths=[
                12*mm,   # index
                60*mm,   # task name
                30*mm,   # assigned
                25*mm,   # progress
                60*mm,   # feedback
                18*mm    # marks
            ],
            hAlign='LEFT'
        )

        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#E6E0E0")),
            ("TEXTCOLOR", (0,0), (-1,0), colors.black),
            ("ALIGN", (0,0), (-1,0), "CENTER"),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),

            ("ALIGN", (0,1), (0,-1), "CENTER"),
            ("ALIGN", (2,1), (2,-1), "CENTER"),
            ("ALIGN", (3,1), (3,-1), "CENTER"),
            ("ALIGN", (5,1), (5,-1), "CENTER"),

            ("GRID", (0,0), (-1,-1), 0.5, colors.black),
            ("FONTSIZE", (0,0), (-1,-1), 9),
            ("LEFTPADDING", (0,0), (-1,-1), 4),
            ("RIGHTPADDING", (0,0), (-1,-1), 4),
            ("TOPPADDING", (0,0), (-1,-1), 3),
            ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ]))

        flow.append(tbl)

    flow.append(Spacer(1, 12))

    # Signature
    flow.append(Paragraph("Guide Signature: ____________________", styles["Normal"]))
    flow.append(Spacer(1, 6))
    flow.append(Paragraph("Stamp: ____________________", styles["Normal"]))

    # Build PDF
    doc.build(flow)

    pdf_bytes = buff.getvalue()
    buff.close()
    return pdf_bytes
