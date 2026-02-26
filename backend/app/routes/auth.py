# """
# Authentication Routes
# JWT-based login and registration
# """

# from fastapi import APIRouter, HTTPException, Depends, status
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from sqlalchemy.orm import Session
# from pydantic import BaseModel, EmailStr
# from datetime import datetime, timedelta
# from typing import Optional
# import bcrypt
# import jwt
# import os

# from app.database import get_db
# from app.models.db_models import User, UserRole

# router = APIRouter(prefix="/api/auth", tags=["auth"])

# # ── Config ────────────────────────────────────────────────────────────────────
# SECRET_KEY = os.getenv("SECRET_KEY", "dsa-platform-secret-key-change-in-production")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_HOURS = 24

# security = HTTPBearer()


# # ── Pydantic schemas ──────────────────────────────────────────────────────────
# class RegisterRequest(BaseModel):
#     name: str
#     email: str
#     password: str
#     role: str  # "teacher" or "student"


# class LoginRequest(BaseModel):
#     email: str
#     password: str


# class AuthResponse(BaseModel):
#     token: str
#     user: dict


# # ── Helpers ───────────────────────────────────────────────────────────────────
# def hash_password(password: str) -> str:
#     return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


# def verify_password(password: str, hashed: str) -> bool:
#     return bcrypt.checkpw(password.encode(), hashed.encode())


# def create_token(user_id: int, role: str, name: str, email: str) -> str:
#     payload = {
#         "sub": str(user_id),
#         "role": role,
#         "name": name,
#         "email": email,
#         "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
#     }
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# def decode_token(token: str) -> dict:
#     try:
#         return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired. Please login again.")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token.")


# # ✅ FIX: Safe role getter — handles both enum and plain string in DB
# def get_role_str(user: User) -> str:
#     """Returns role as plain lowercase string regardless of how it's stored"""
#     role = user.role
#     if isinstance(role, str):
#         return role.lower()
#     return role.value.lower()  # enum


# def get_current_user(
#     credentials: HTTPAuthorizationCredentials = Depends(security),
#     db: Session = Depends(get_db)
# ) -> User:
#     """Dependency: extract and validate JWT, return User object"""
#     payload = decode_token(credentials.credentials)
#     user = db.query(User).filter(User.id == int(payload["sub"])).first()
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found.")
#     return user


# def require_teacher(current_user: User = Depends(get_current_user)) -> User:
#     """Dependency: ensure current user is a teacher"""
#     # ✅ FIX: Compare string values, not enum objects — handles both storage formats
#     if get_role_str(current_user) != "teacher":
#         raise HTTPException(status_code=403, detail="Teacher access required.")
#     return current_user


# def require_student(current_user: User = Depends(get_current_user)) -> User:
#     """Dependency: ensure current user is a student"""
#     # ✅ FIX: Compare string values, not enum objects — handles both storage formats
#     if get_role_str(current_user) != "student":
#         raise HTTPException(status_code=403, detail="Student access required.")
#     return current_user


# # ── Routes ────────────────────────────────────────────────────────────────────
# @router.post("/register", response_model=AuthResponse)
# def register(data: RegisterRequest, db: Session = Depends(get_db)):
#     """Register a new teacher or student account"""
#     existing = db.query(User).filter(User.email == data.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered.")

#     role_lower = data.role.lower()
#     if role_lower not in ("teacher", "student"):
#         raise HTTPException(status_code=400, detail="Role must be 'teacher' or 'student'.")

#     user = User(
#         name=data.name,
#         email=data.email,
#         password_hash=hash_password(data.password),
#         role=UserRole.TEACHER if role_lower == "teacher" else UserRole.STUDENT
#     )
#     db.add(user)
#     db.commit()
#     db.refresh(user)

#     token = create_token(user.id, get_role_str(user), user.name, user.email)
#     return {
#         "token": token,
#         "user": {"id": user.id, "name": user.name, "email": user.email, "role": get_role_str(user)}
#     }


# @router.post("/login", response_model=AuthResponse)
# def login(data: LoginRequest, db: Session = Depends(get_db)):
#     """Login with email and password, returns JWT token"""
#     user = db.query(User).filter(User.email == data.email).first()
#     if not user or not verify_password(data.password, user.password_hash):
#         raise HTTPException(status_code=401, detail="Invalid email or password.")

#     token = create_token(user.id, get_role_str(user), user.name, user.email)
#     return {
#         "token": token,
#         "user": {"id": user.id, "name": user.name, "email": user.email, "role": get_role_str(user)}
#     }


# @router.get("/me")
# def get_me(current_user: User = Depends(get_current_user)):
#     """Get current logged-in user info"""
#     return {
#         "id": current_user.id,
#         "name": current_user.name,
#         "email": current_user.email,
#         "role": get_role_str(current_user)
#     }

"""
Authentication Routes
JWT-based login and registration — Firebase Realtime Database
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
import bcrypt
import jwt
import os
import uuid

from firebase_admin import db

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "dsa-platform-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()


# ── Pydantic schemas ──────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str  # "teacher" or "student"


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict


# ── Helpers ───────────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_token(user_id: str, role: str, name: str, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "name": name,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")


def get_user_by_email(email: str):
    """Find a user in Firebase by email"""
    users_ref = db.reference("/users")
    all_users = users_ref.get() or {}
    for user_id, user_data in all_users.items():
        if user_data.get("email") == email:
            user_data["id"] = user_id
            return user_data
    return None


def get_user_by_id(user_id: str):
    """Find a user in Firebase by ID"""
    user_ref = db.reference(f"/users/{user_id}")
    user = user_ref.get()
    if user:
        user["id"] = user_id
    return user


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """Dependency: extract and validate JWT, return user dict"""
    payload = decode_token(credentials.credentials)
    user = get_user_by_id(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    return user


def require_teacher(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency: ensure current user is a teacher"""
    if current_user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="Teacher access required.")
    return current_user


def require_student(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency: ensure current user is a student"""
    if current_user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Student access required.")
    return current_user


# ── Routes ────────────────────────────────────────────────────────────────────
@router.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest):
    """Register a new teacher or student account"""
    existing = get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")

    role_lower = data.role.lower()
    if role_lower not in ("teacher", "student"):
        raise HTTPException(status_code=400, detail="Role must be 'teacher' or 'student'.")

    user_id = str(uuid.uuid4())
    user_data = {
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "role": role_lower,
        "created_at": datetime.utcnow().isoformat()
    }

    db.reference(f"/users/{user_id}").set(user_data)

    token = create_token(user_id, role_lower, data.name, data.email)
    return {
        "token": token,
        "user": {"id": user_id, "name": data.name, "email": data.email, "role": role_lower}
    }


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest):
    """Login with email and password, returns JWT token"""
    user = get_user_by_email(data.email)
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_token(user["id"], user["role"], user["name"], user["email"])
    return {
        "token": token,
        "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Get current logged-in user info"""
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"]
    }