"""
Admin Routes
Superadmin-only endpoints — manage user roles
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
    """
    Search for a user by email.
    Returns user info (id, name, email, role).
    Superadmin only.
    """
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


@router.patch("/users/role")
def update_user_role(
    data: RoleUpdateRequest,
    current_user: dict = Depends(require_superadmin)
):
    """
    Promote or demote a user's role.
    - Any superadmin can assign: 'teacher', 'student'
    - Only root superadmin can assign: 'superadmin'
    - Root superadmin email can never be demoted by anyone
    """
    is_root = current_user.get("email", "").lower() == ROOT_SUPERADMIN_EMAIL.lower()
    role_lower = data.role.lower()
    target_email_lower = data.email.lower()

    # Validate role
    allowed_roles = ("teacher", "student", "superadmin")
    if role_lower not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role '{data.role}'. Allowed: teacher, student, superadmin."
        )

    # Only root can assign superadmin role
    if role_lower == "superadmin" and not is_root:
        raise HTTPException(
            status_code=403,
            detail="Only the root superadmin can promote users to superadmin."
        )

    # Nobody can touch the root superadmin account
    if target_email_lower == ROOT_SUPERADMIN_EMAIL.lower():
        raise HTTPException(
            status_code=403,
            detail="The root superadmin account cannot be modified."
        )

    # Find target user
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

    # Non-root superadmins cannot change other superadmins' roles
    if target_user.get("role") == "superadmin" and not is_root:
        raise HTTPException(
            status_code=403,
            detail="Only the root superadmin can change another superadmin's role."
        )

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