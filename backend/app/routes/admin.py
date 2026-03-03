"""
Admin Routes
Superadmin-only endpoints — manage user roles, view submissions, analytics
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from firebase_admin import db
from app.routes.auth import require_superadmin

router = APIRouter(prefix="/api/admin", tags=["admin"])

# ── Root superadmin — can never be demoted, only one who can promote to superadmin
ROOT_SUPERADMIN_EMAIL = "sahuaditya2305@gmail.com"


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class RoleUpdateRequest(BaseModel):
    email: str
    role: str  # "teacher", "student", or "superadmin" (root only)


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/users/search")
def search_user_by_email(
    email: str = Query(..., description="Email to search for"),
    current_user: dict = Depends(require_superadmin)
):
    """Search for a user by email. Superadmin only."""
    all_users = db.reference("/users").get() or {}
    for user_id, user_data in all_users.items():
        if user_data.get("email", "").lower() == email.lower():
            return {
                "id": user_id,
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "role": user_data.get("role"),
                "created_at": user_data.get("created_at"),
                "auth_provider": user_data.get("auth_provider", "email")
            }
    raise HTTPException(status_code=404, detail="User not found.")


@router.get("/users")
def get_all_users(current_user: dict = Depends(require_superadmin)):
    """
    List all users on the platform.
    Superadmin only.
    """
    all_users = db.reference("/users").get() or {}
    result = []
    for user_id, user_data in all_users.items():
        result.append({
            "id": user_id,
            "name": user_data.get("name"),
            "email": user_data.get("email"),
            "role": user_data.get("role"),
            "created_at": user_data.get("created_at"),
            "auth_provider": user_data.get("auth_provider", "email")
        })
    # Sort by created_at descending
    result.sort(key=lambda x: x.get("created_at") or "", reverse=True)
    return result


@router.delete("/users/{user_id}")
def delete_user(user_id: str, current_user: dict = Depends(require_superadmin)):
    """
    Delete a user by ID.
    - Cannot delete root superadmin
    - Non-root superadmin cannot delete other superadmins
    Superadmin only.
    """
    is_root = current_user.get("email", "").lower() == ROOT_SUPERADMIN_EMAIL.lower()

    user_ref = db.reference(f"/users/{user_id}")
    target_user = user_ref.get()

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Protect root superadmin
    if target_user.get("email", "").lower() == ROOT_SUPERADMIN_EMAIL.lower():
        raise HTTPException(status_code=403, detail="Root superadmin account cannot be deleted.")

    # Non-root cannot delete other superadmins
    if target_user.get("role") == "superadmin" and not is_root:
        raise HTTPException(status_code=403, detail="Only root superadmin can delete another superadmin.")

    # Prevent self-deletion
    if user_id == current_user.get("id"):
        raise HTTPException(status_code=403, detail="You cannot delete your own account.")

    user_ref.delete()

    return {
        "message": "User deleted successfully.",
        "deleted_user": {
            "id": user_id,
            "name": target_user.get("name"),
            "email": target_user.get("email"),
            "role": target_user.get("role")
        }
    }


@router.patch("/users/role")
def update_user_role(
    data: RoleUpdateRequest,
    current_user: dict = Depends(require_superadmin)
):
    """
    Promote or demote a user's role.
    - Any superadmin: 'teacher', 'student'
    - Root superadmin only: 'superadmin'
    - Root superadmin cannot be modified by anyone
    """
    is_root = current_user.get("email", "").lower() == ROOT_SUPERADMIN_EMAIL.lower()
    role_lower = data.role.lower()
    target_email_lower = data.email.lower()

    allowed_roles = ("teacher", "student", "superadmin")
    if role_lower not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role '{data.role}'. Allowed: teacher, student, superadmin.")

    if role_lower == "superadmin" and not is_root:
        raise HTTPException(status_code=403, detail="Only the root superadmin can promote users to superadmin.")

    if target_email_lower == ROOT_SUPERADMIN_EMAIL.lower():
        raise HTTPException(status_code=403, detail="The root superadmin account cannot be modified.")

    all_users = db.reference("/users").get() or {}
    target_id = None
    target_user = None

    for user_id, user_data in all_users.items():
        if user_data.get("email", "").lower() == target_email_lower:
            target_id = user_id
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
            "id": target_id,
            "name": target_user.get("name"),
            "email": target_user.get("email"),
            "role": role_lower
        }
    }


@router.get("/submissions")
def get_all_submissions(
    limit: int = 100,
    current_user: dict = Depends(require_superadmin)
):
    """
    Get all submissions across all teachers and students.
    Superadmin only.
    """
    all_subs = db.reference("/submissions").get() or {}
    all_users = db.reference("/users").get() or {}
    all_questions = db.reference("/questions").get() or {}

    # Build lookup maps
    user_map = {uid: u for uid, u in all_users.items()}
    question_map = {qid: q for qid, q in all_questions.items()}

    result = []
    for sub_id, sub in all_subs.items():
        student = user_map.get(sub.get("student_id"), {})
        question = question_map.get(sub.get("question_id"), {})
        result.append({
            "id": sub_id,
            "student_name": student.get("name", "Unknown"),
            "student_email": student.get("email", ""),
            "question_title": question.get("title", "Unknown"),
            "test_id": sub.get("test_id"),
            "language": sub.get("language"),
            "score": sub.get("score"),
            "passed": sub.get("passed"),
            "total": sub.get("total"),
            "submitted_at": sub.get("submitted_at"),
        })

    result.sort(key=lambda x: x.get("submitted_at") or "", reverse=True)
    return result[:limit]


@router.get("/analytics")
def get_platform_analytics(current_user: dict = Depends(require_superadmin)):
    """
    Platform-wide analytics.
    Returns total users, tests, questions, submissions broken down by role.
    Superadmin only.
    """
    all_users = db.reference("/users").get() or {}
    all_tests = db.reference("/tests").get() or {}
    all_questions = db.reference("/questions").get() or {}
    all_submissions = db.reference("/submissions").get() or {}

    # Count users by role
    role_counts = {"student": 0, "teacher": 0, "superadmin": 0}
    for u in all_users.values():
        role = u.get("role", "student")
        role_counts[role] = role_counts.get(role, 0) + 1

    # Active vs inactive tests
    active_tests = sum(1 for t in all_tests.values() if t.get("is_active"))
    inactive_tests = len(all_tests) - active_tests

    # Submissions by language
    lang_counts = {}
    for s in all_submissions.values():
        lang = s.get("language", "unknown")
        lang_counts[lang] = lang_counts.get(lang, 0) + 1

    # Average score across all submissions
    scores = [s.get("score", 0) for s in all_submissions.values() if s.get("score") is not None]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0

    return {
        "users": {
            "total": len(all_users),
            "students": role_counts.get("student", 0),
            "teachers": role_counts.get("teacher", 0),
            "superadmins": role_counts.get("superadmin", 0),
        },
        "tests": {
            "total": len(all_tests),
            "active": active_tests,
            "inactive": inactive_tests,
        },
        "questions": {
            "total": len(all_questions),
        },
        "submissions": {
            "total": len(all_submissions),
            "average_score": avg_score,
            "by_language": lang_counts,
        }
    }