"""
Admin Routes
Superadmin-only endpoints — manage user roles, add teachers, view submissions, analytics
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from firebase_admin import db
from app.routes.auth import require_superadmin, hash_password, get_user_by_email

import os
import uuid
import string
import random
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/api/admin", tags=["admin"])

ROOT_SUPERADMIN_EMAIL = "sahuaditya2305@gmail.com"

SMTP_EMAIL    = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
PLATFORM_URL  = os.getenv("PLATFORM_URL", "https://testslashcoder.netlify.app")


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class RoleUpdateRequest(BaseModel):
    email: str
    role: str


class AddTeacherRequest(BaseModel):
    name: str
    email: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def generate_password(length: int = 12) -> str:
    chars = string.ascii_letters + string.digits + "!@#$%"
    password = [
        random.choice(string.ascii_uppercase),
        random.choice(string.ascii_lowercase),
        random.choice(string.digits),
        random.choice("!@#$%"),
    ]
    password += random.choices(chars, k=length - 4)
    random.shuffle(password)
    return "".join(password)


def send_teacher_welcome_email(to_email: str, name: str, password: str) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Welcome to SlashCoder — Your Teacher Account is Ready"
        msg["From"]    = f"SlashCoder Platform <{SMTP_EMAIL}>"
        msg["To"]      = to_email

        html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Arial, sans-serif; background: #0b1120; color: #f1f5f9; margin: 0; padding: 0; }}
    .container {{ max-width: 520px; margin: 40px auto; background: #111827; border: 1px solid #1f2d45; border-radius: 14px; overflow: hidden; }}
    .header {{ background: linear-gradient(135deg, #1e3a5f, #1a3a2a); padding: 32px 36px; border-bottom: 1px solid #1f2d45; }}
    .header h1 {{ margin: 0; font-size: 22px; font-weight: 800; color: #f1f5f9; }}
    .header p {{ margin: 6px 0 0; color: #94a3b8; font-size: 14px; }}
    .body {{ padding: 32px 36px; }}
    .body p {{ color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 20px; }}
    .cred-box {{ background: #0b1120; border: 1px solid #1f2d45; border-radius: 10px; padding: 20px 24px; margin: 20px 0; }}
    .cred-row {{ padding: 10px 0; border-bottom: 1px solid #1a2535; }}
    .cred-row:last-child {{ border-bottom: none; }}
    .cred-label {{ font-size: 11px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }}
    .cred-value {{ font-size: 15px; color: #f1f5f9; font-weight: 600; font-family: monospace; }}
    .btn {{ display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 8px 0 20px; }}
    .footer {{ padding: 20px 36px; border-top: 1px solid #1f2d45; color: #334155; font-size: 12px; }}
    .badge {{ display: inline-block; background: #1a3a2a; color: #34d399; border: 1px solid #059669; border-radius: 6px; padding: 2px 10px; font-size: 12px; font-weight: 700; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👋 Welcome to SlashCoder</h1>
      <p>Your teacher account has been created</p>
    </div>
    <div class="body">
      <p>Hi <strong style="color:#f1f5f9">{name}</strong>,</p>
      <p>A superadmin has created a <span class="badge">Teacher</span> account for you on the SlashCoder DSA Assessment Platform. Here are your login credentials:</p>
      <div class="cred-box">
        <div class="cred-row">
          <div class="cred-label">Email</div>
          <div class="cred-value">{to_email}</div>
        </div>
        <div class="cred-row">
          <div class="cred-label">Password</div>
          <div class="cred-value">{password}</div>
        </div>
        <div class="cred-row">
          <div class="cred-label">Role</div>
          <div class="cred-value">Teacher</div>
        </div>
      </div>
      <p>Click below to log in and start creating tests:</p>
      <a href="{PLATFORM_URL}" class="btn">Login to SlashCoder →</a>
      <p style="color:#475569; font-size:13px;">⚠️ Please change your password after your first login.</p>
    </div>
    <div class="footer">
      This email was sent by the SlashCoder platform. If you weren't expecting this, please ignore it.
    </div>
  </div>
</body>
</html>
"""
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        return True

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send to {to_email}: {e}")
        return False


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/users/search")
def search_user_by_email(
    email: str = Query(...),
    current_user: dict = Depends(require_superadmin)
):
    all_users = db.reference("/users").get() or {}
    for user_id, user_data in all_users.items():
        if user_data.get("email", "").lower() == email.lower():
            return {
                "id":            user_id,
                "name":          user_data.get("name"),
                "email":         user_data.get("email"),
                "role":          user_data.get("role"),
                "created_at":    user_data.get("created_at"),
                "auth_provider": user_data.get("auth_provider", "email")
            }
    raise HTTPException(status_code=404, detail="User not found.")


@router.get("/users")
def get_all_users(current_user: dict = Depends(require_superadmin)):
    all_users = db.reference("/users").get() or {}
    result = []
    for user_id, user_data in all_users.items():
        result.append({
            "id":            user_id,
            "name":          user_data.get("name"),
            "email":         user_data.get("email"),
            "role":          user_data.get("role"),
            "created_at":    user_data.get("created_at"),
            "auth_provider": user_data.get("auth_provider", "email")
        })
    result.sort(key=lambda x: x.get("created_at") or "", reverse=True)
    return result


@router.post("/add-teacher")
def add_teacher(
    data: AddTeacherRequest,
    current_user: dict = Depends(require_superadmin)
):
    existing = get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="A user with this email already exists.")

    password  = generate_password()
    user_id   = str(uuid.uuid4())
    user_data = {
        "name":          data.name,
        "email":         data.email,
        "password_hash": hash_password(password),
        "role":          "teacher",
        "auth_provider": "email",
        "created_by":    current_user.get("email"),
        "created_at":    datetime.utcnow().isoformat()
    }

    db.reference(f"/users/{user_id}").set(user_data)

    email_sent = send_teacher_welcome_email(data.email, data.name, password)

    return {
        "message":            "Teacher account created successfully.",
        "email_sent":         email_sent,
        "generated_password": password,
        "user": {
            "id":    user_id,
            "name":  data.name,
            "email": data.email,
            "role":  "teacher",
        }
    }


@router.delete("/users/{user_id}")
def delete_user(user_id: str, current_user: dict = Depends(require_superadmin)):
    is_root     = current_user.get("email", "").lower() == ROOT_SUPERADMIN_EMAIL.lower()
    user_ref    = db.reference(f"/users/{user_id}")
    target_user = user_ref.get()

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found.")
    if target_user.get("email", "").lower() == ROOT_SUPERADMIN_EMAIL.lower():
        raise HTTPException(status_code=403, detail="Root superadmin account cannot be deleted.")
    if target_user.get("role") == "superadmin" and not is_root:
        raise HTTPException(status_code=403, detail="Only root superadmin can delete another superadmin.")
    if user_id == current_user.get("id"):
        raise HTTPException(status_code=403, detail="You cannot delete your own account.")

    user_ref.delete()
    return {
        "message": "User deleted successfully.",
        "deleted_user": {
            "id":    user_id,
            "name":  target_user.get("name"),
            "email": target_user.get("email"),
            "role":  target_user.get("role")
        }
    }


@router.patch("/users/role")
def update_user_role(
    data: RoleUpdateRequest,
    current_user: dict = Depends(require_superadmin)
):
    is_root            = current_user.get("email", "").lower() == ROOT_SUPERADMIN_EMAIL.lower()
    role_lower         = data.role.lower()
    target_email_lower = data.email.lower()

    if role_lower not in ("teacher", "student", "superadmin"):
        raise HTTPException(status_code=400, detail=f"Invalid role '{data.role}'.")
    if role_lower == "superadmin" and not is_root:
        raise HTTPException(status_code=403, detail="Only the root superadmin can promote users to superadmin.")
    if target_email_lower == ROOT_SUPERADMIN_EMAIL.lower():
        raise HTTPException(status_code=403, detail="The root superadmin account cannot be modified.")

    all_users   = db.reference("/users").get() or {}
    target_id   = None
    target_user = None

    for user_id, user_data in all_users.items():
        if user_data.get("email", "").lower() == target_email_lower:
            target_id   = user_id
            target_user = user_data
            break

    if not target_id:
        raise HTTPException(status_code=404, detail="User not found.")
    if target_user.get("role") == "superadmin" and not is_root:
        raise HTTPException(status_code=403, detail="Only the root superadmin can change another superadmin's role.")

    db.reference(f"/users/{target_id}").update({"role": role_lower})
    return {
        "message": "Role updated successfully.",
        "user": {
            "id":    target_id,
            "name":  target_user.get("name"),
            "email": target_user.get("email"),
            "role":  role_lower
        }
    }


@router.get("/submissions")
def get_all_submissions(
    limit: int = 100,
    current_user: dict = Depends(require_superadmin)
):
    all_subs      = db.reference("/submissions").get() or {}
    all_users     = db.reference("/users").get() or {}
    all_questions = db.reference("/questions").get() or {}

    user_map     = {uid: u for uid, u in all_users.items()}
    question_map = {qid: q for qid, q in all_questions.items()}

    result = []
    for sub_id, sub in all_subs.items():
        student  = user_map.get(sub.get("student_id"), {})
        question = question_map.get(sub.get("question_id"), {})
        result.append({
            "id":             sub_id,
            "student_name":   student.get("name", "Unknown"),
            "student_email":  student.get("email", ""),
            "question_title": question.get("title", "Unknown"),
            "test_id":        sub.get("test_id"),
            "language":       sub.get("language"),
            "score":          sub.get("score"),
            "passed":         sub.get("passed"),
            "total":          sub.get("total"),
            "submitted_at":   sub.get("submitted_at"),
        })

    result.sort(key=lambda x: x.get("submitted_at") or "", reverse=True)
    return result[:limit]


@router.get("/analytics")
def get_platform_analytics(current_user: dict = Depends(require_superadmin)):
    all_users       = db.reference("/users").get() or {}
    all_tests       = db.reference("/tests").get() or {}
    all_questions   = db.reference("/questions").get() or {}
    all_submissions = db.reference("/submissions").get() or {}

    role_counts = {"student": 0, "teacher": 0, "superadmin": 0}
    for u in all_users.values():
        role = u.get("role", "student")
        role_counts[role] = role_counts.get(role, 0) + 1

    active_tests   = sum(1 for t in all_tests.values() if t.get("is_active"))
    inactive_tests = len(all_tests) - active_tests

    lang_counts = {}
    for s in all_submissions.values():
        lang = s.get("language", "unknown")
        lang_counts[lang] = lang_counts.get(lang, 0) + 1

    scores    = [s.get("score", 0) for s in all_submissions.values() if s.get("score") is not None]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0

    return {
        "users": {
            "total":       len(all_users),
            "students":    role_counts.get("student", 0),
            "teachers":    role_counts.get("teacher", 0),
            "superadmins": role_counts.get("superadmin", 0),
        },
        "tests": {
            "total":    len(all_tests),
            "active":   active_tests,
            "inactive": inactive_tests,
        },
        "questions": {
            "total": len(all_questions),
        },
        "submissions": {
            "total":         len(all_submissions),
            "average_score": avg_score,
            "by_language":   lang_counts,
        }
    }