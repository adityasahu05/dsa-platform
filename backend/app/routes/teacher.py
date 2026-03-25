


"""
Teacher Routes
API endpoints for teacher operations — Firebase Realtime Database
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
from firebase_admin import db
from app.routes.auth import require_teacher, get_current_user
import random
import string
import uuid

router = APIRouter(prefix="/api/teacher", tags=["teacher"])

ALL_LANGUAGES = ["python", "c", "cpp", "java"]


# ─── Pydantic Models ──────────────────────────────────────────────────────────

class TestCreate(BaseModel):
    title: str
    description: str
    duration_minutes: int = 60
    is_active: bool = True
    allowed_languages: List[str] = ["python", "c", "cpp", "java"]
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    test_type: str = "invite_only"
    tags: Optional[str] = ""
    anti_paste_enabled: Optional[bool] = True
    tab_switch_enabled: Optional[bool] = True
    tab_switch_limit: Optional[int] = 3
    auto_end_at_end_date: Optional[bool] = True


class TestUpdate(BaseModel):
    is_active: Optional[bool] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    test_type: Optional[str] = None
    tags: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    anti_paste_enabled: Optional[bool] = None
    tab_switch_enabled: Optional[bool] = None
    tab_switch_limit: Optional[int] = None
    auto_end_at_end_date: Optional[bool] = None


class QuestionCreate(BaseModel):
    test_id: str
    title: str
    description: str
    difficulty: str
    topic: str
    points: int = 10
    time_limit_ms: int = 2000


class QuestionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    topic: Optional[str] = None
    points: Optional[int] = None
    time_limit_ms: Optional[int] = None


class TestCaseCreate(BaseModel):
    question_id: str
    input: str
    expected_output: str
    is_hidden: bool = False
    points: int = 1


class TestCaseUpdate(BaseModel):
    input: Optional[str] = None
    expected_output: Optional[str] = None
    is_hidden: Optional[bool] = None
    points: Optional[int] = None


class SubmitRequest(BaseModel):
    question_id: str
    test_id: str
    language: str
    code: str
    score: float
    passed: int
    total: int
    auto_submit: Optional[bool] = False
    execution_time_ms: Optional[int] = None
    compilation_time_ms: Optional[int] = None


class ForfeitRequest(BaseModel):
    tab_switches: Optional[int] = None


class TabSwitchLogRequest(BaseModel):
    count: int
    timestamp: Optional[str] = None


class PasteLogRequest(BaseModel):
    count: int
    timestamp: Optional[str] = None


# ─── Helpers ──────────────────────────────────────────────────────────────────

def parse_languages(lang_str: str) -> List[str]:
    return [l.strip() for l in (lang_str or "python").split(",") if l.strip()]

def format_languages(langs: List[str]) -> str:
    valid = [l.lower() for l in langs if l.lower() in ALL_LANGUAGES]
    return ",".join(valid) if valid else "python"

def generate_assessment_id() -> str:
    return ''.join(random.choices(string.digits, k=7))

def parse_date(date_str: Optional[str]):
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00')).isoformat()
    except Exception:
        return None

def utcnow_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

def ensure_session_id(test_id: str, test: dict) -> str:
    session_id = test.get("current_session_id")
    if not session_id:
        session_id = str(uuid.uuid4())
        db.reference(f"/tests/{test_id}").update({"current_session_id": session_id})
        test["current_session_id"] = session_id
    return session_id

# AFTER
def parse_iso_ts(value: Optional[str]):
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        # If naive (no timezone), assume UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None

def is_test_expired(test: dict, now: Optional[datetime] = None) -> bool:
    end_dt = parse_iso_ts(test.get("end_date"))
    if not end_dt:
        return False
    ref = now or datetime.now(timezone.utc)
    return ref >= end_dt

def ensure_test_closed_if_expired(test_id: str, test: dict, now: Optional[datetime] = None) -> dict:
    if not test:
        return test
    auto_end = test.get("auto_end_at_end_date")
    if auto_end is None:
        auto_end = True
    if test.get("is_active") and auto_end and is_test_expired(test, now=now):
        db.reference(f"/tests/{test_id}").update({"is_active": False})
        test["is_active"] = False
    return test

def compute_live_status(test_id: str, test: dict, now: Optional[datetime] = None) -> dict:
    if not test:
        return {
            "test_id": test_id,
            "is_active": False,
            "active_count": 0,
            "total_attempts": 0,
            "forfeited_count": 0,
            "expired_count": 0,
            "submitted_count": 0,
            "active_students": [],
        }
    ref_now = now or datetime.now(timezone.utc)
    session_id = ensure_session_id(test_id, test)
    attempts = db.reference(f"/attempts/{test_id}/{session_id}").get() or {}
    all_users = db.reference("/users").get() or {}
    all_subs = db.reference("/submissions").get() or {}
    submitted_student_ids = {
        s.get("student_id")
        for s in all_subs.values()
        if s.get("test_id") == test_id
        and s.get("session_id") == session_id
        and s.get("student_id")
    }

    active_students = []
    total_attempts = 0
    forfeited_count = 0
    expired_count = 0
    submitted_count = 0

    for student_id, attempt in attempts.items():
        started_at = attempt.get("started_at")
        if not started_at:
            continue
        total_attempts += 1
        duration_seconds = get_effective_duration_seconds(test, started_at=started_at, now=ref_now)
        expired = is_attempt_expired(attempt, duration_seconds)
        forfeited = is_attempt_forfeited(attempt)
        submitted = student_id in submitted_student_ids

        if forfeited:
            forfeited_count += 1
        if expired:
            expired_count += 1
        if submitted:
            submitted_count += 1

        if (not expired) and (not forfeited):
            started_dt = parse_iso_ts(started_at)
            elapsed = (ref_now - started_dt).total_seconds() if started_dt else 0
            remaining = max(0, int(duration_seconds - elapsed))
            user = all_users.get(student_id, {}) if student_id else {}
            active_students.append({
                "student_id": student_id,
                "student_name": user.get("name") or user.get("full_name") or "Unknown",
                "student_email": user.get("email") or "Unknown",
                "started_at": started_at,
                "remaining_seconds": remaining,
            })

    return {
        "test_id": test_id,
        "current_session_id": session_id,
        "is_active": bool(test.get("is_active")),
        "start_date": test.get("start_date"),
        "end_date": test.get("end_date"),
        "auto_end_at_end_date": test.get("auto_end_at_end_date", True),
        "now": ref_now.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "active_count": len(active_students),
        "total_attempts": total_attempts,
        "forfeited_count": forfeited_count,
        "expired_count": expired_count,
        "submitted_count": submitted_count,
        "active_students": active_students,
        "session_history": test.get("session_history", []),
    }

def get_test_duration_seconds(test: dict) -> int:
    try:
        minutes = int(test.get("duration_minutes", 60))
    except Exception:
        minutes = 60
    return max(1, minutes * 60)

def get_effective_duration_seconds(test: dict, started_at: Optional[str] = None, now: Optional[datetime] = None) -> int:
    """
    Effective duration is the smaller of:
    - configured test duration
    - time remaining until end_date (if set)
    """
    base = get_test_duration_seconds(test)
    end_dt = parse_iso_ts(test.get("end_date"))
    if not end_dt:
        return base
    ref_dt = parse_iso_ts(started_at) if started_at else (now or datetime.now(timezone.utc))
    if not ref_dt:
        return base
    remaining_window = (end_dt - ref_dt).total_seconds()
    return max(1, int(min(base, remaining_window)))

def get_or_create_attempt(test_id: str, session_id: str, student_id: str) -> dict:
    attempt_ref = db.reference(f"/attempts/{test_id}/{session_id}/{student_id}")
    attempt = attempt_ref.get() or {}
    started_at = attempt.get("started_at")
    if not started_at:
        started_at = utcnow_iso()
        attempt = {"started_at": started_at}
        attempt_ref.set(attempt)
    return attempt

def is_attempt_expired(attempt: dict, duration_seconds: int) -> bool:
    started = parse_iso_ts(attempt.get("started_at"))
    if not started:
        return False
    now = datetime.now(timezone.utc)
    return (now - started).total_seconds() > duration_seconds

def is_attempt_forfeited(attempt: dict) -> bool:
    return bool(attempt.get("forfeited"))

def format_test(test_id: str, test: dict) -> dict:
    ensure_session_id(test_id, test)
    return {
        "id": test_id,
        "title": test.get("title"),
        "description": test.get("description"),
        "teacher_id": test.get("teacher_id"),
        "duration_minutes": test.get("duration_minutes", 60),
        "is_active": test.get("is_active", True),
        "allowed_languages": parse_languages(test.get("allowed_languages", "python")),
        "start_date": test.get("start_date"),
        "end_date": test.get("end_date"),
        "test_type": test.get("test_type", "invite_only"),
        "tags": [t.strip() for t in (test.get("tags") or "").split(",") if t.strip()],
        "assessment_id": test.get("assessment_id", ""),
        "created_at": test.get("created_at"),
        "anti_paste_enabled": test.get("anti_paste_enabled", True),
        "tab_switch_enabled": test.get("tab_switch_enabled", True),
        "tab_switch_limit": test.get("tab_switch_limit", 3),
        "auto_end_at_end_date": test.get("auto_end_at_end_date", True),
        "current_session_id": test.get("current_session_id"),
        "session_history": test.get("session_history", []),
    }


# ─── Teacher Routes ───────────────────────────────────────────────────────────

@router.get("/tests")
def get_all_tests(current_user: dict = Depends(require_teacher)):
    all_tests = db.reference("/tests").get() or {}
    now = datetime.now(timezone.utc)
    return [
        format_test(tid, ensure_test_closed_if_expired(tid, t, now=now))
        for tid, t in all_tests.items()
        if t.get("teacher_id") == current_user["id"]
    ]

@router.get("/tests/{test_id}/live-status")
def get_test_live_status(test_id: str, current_user: dict = Depends(require_teacher)):
    test_ref = db.reference(f"/tests/{test_id}")
    test = test_ref.get()
    if not test or test.get("teacher_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Test not found")
    now = datetime.now(timezone.utc)
    test = ensure_test_closed_if_expired(test_id, test, now=now)
    return compute_live_status(test_id, test, now=now)


@router.post("/tests")
def create_test(test: TestCreate, current_user: dict = Depends(require_teacher)):
    test_id = str(uuid.uuid4())
    session_id = str(uuid.uuid4())
    tab_switch_limit = int(test.tab_switch_limit or 3)
    if tab_switch_limit < 1:
        tab_switch_limit = 1
    test_data = {
        "title": test.title,
        "description": test.description,
        "teacher_id": current_user["id"],
        "duration_minutes": test.duration_minutes,
        "is_active": test.is_active,
        "allowed_languages": format_languages(test.allowed_languages),
        "start_date": parse_date(test.start_date),
        "end_date": parse_date(test.end_date),
        "test_type": test.test_type or "invite_only",
        "tags": test.tags or "",
        "assessment_id": generate_assessment_id(),
        "created_at": datetime.utcnow().isoformat(),
        "anti_paste_enabled": bool(test.anti_paste_enabled) if test.anti_paste_enabled is not None else True,
        "tab_switch_enabled": bool(test.tab_switch_enabled) if test.tab_switch_enabled is not None else True,
        "tab_switch_limit": tab_switch_limit,
        "auto_end_at_end_date": bool(test.auto_end_at_end_date) if test.auto_end_at_end_date is not None else True,
        "current_session_id": session_id,
        "session_history": [],
    }
    db.reference(f"/tests/{test_id}").set(test_data)
    return format_test(test_id, test_data)


@router.patch("/tests/{test_id}")
def update_test(test_id: str, data: TestUpdate, current_user: dict = Depends(require_teacher)):
    test_ref = db.reference(f"/tests/{test_id}")
    test = test_ref.get()
    if not test or test.get("teacher_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Test not found")
    updates = {}
    if data.is_active is not None: updates["is_active"] = data.is_active
    if data.start_date is not None: updates["start_date"] = parse_date(data.start_date)
    if data.end_date is not None: updates["end_date"] = parse_date(data.end_date)
    if data.test_type is not None: updates["test_type"] = data.test_type
    if data.tags is not None: updates["tags"] = data.tags
    if data.title is not None: updates["title"] = data.title
    if data.description is not None: updates["description"] = data.description
    if data.duration_minutes is not None: updates["duration_minutes"] = data.duration_minutes
    if data.anti_paste_enabled is not None: updates["anti_paste_enabled"] = data.anti_paste_enabled
    if data.tab_switch_enabled is not None: updates["tab_switch_enabled"] = data.tab_switch_enabled
    if data.tab_switch_limit is not None:
        limit = int(data.tab_switch_limit)
        updates["tab_switch_limit"] = max(1, limit)
    if data.auto_end_at_end_date is not None:
        updates["auto_end_at_end_date"] = bool(data.auto_end_at_end_date)
    test_ref.update(updates)
    updated = test_ref.get()
    return format_test(test_id, updated)

@router.post("/tests/{test_id}/start-now")
def start_test_now(test_id: str, current_user: dict = Depends(require_teacher)):
    test_ref = db.reference(f"/tests/{test_id}")
    test = test_ref.get()
    if not test or test.get("teacher_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Test not found")
    now = utcnow_iso()
    test_ref.update({"start_date": now, "is_active": True})
    updated = test_ref.get()
    return format_test(test_id, updated)

@router.post("/tests/{test_id}/end-now")
def end_test_now(test_id: str, current_user: dict = Depends(require_teacher)):
    test_ref = db.reference(f"/tests/{test_id}")
    test = test_ref.get()
    if not test or test.get("teacher_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Test not found")
    now = utcnow_iso()
    test_ref.update({"end_date": now, "is_active": False})
    updated = test_ref.get()
    return format_test(test_id, updated)

@router.post("/tests/{test_id}/restart-session")
def restart_test_session(test_id: str, current_user: dict = Depends(require_teacher)):
    test_ref = db.reference(f"/tests/{test_id}")
    test = test_ref.get()
    if not test or test.get("teacher_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Test not found")
    now = datetime.now(timezone.utc)
    new_session_id = str(uuid.uuid4())
    prior_session_id = test.get("current_session_id")
    history = list(test.get("session_history") or [])
    if prior_session_id:
        history.append(prior_session_id)
    updates = {
        "current_session_id": new_session_id,
        "start_date": utcnow_iso(),
        "is_active": True,
        "session_history": history,
    }
    end_dt = parse_iso_ts(test.get("end_date"))
    if end_dt and end_dt <= now:
        updates["end_date"] = None
    test_ref.update(updates)
    updated = test_ref.get()
    return format_test(test_id, updated)


@router.delete("/tests/{test_id}")
def delete_test(test_id: str, current_user: dict = Depends(require_teacher)):
    test_ref = db.reference(f"/tests/{test_id}")
    test = test_ref.get()
    if not test or test.get("teacher_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Test not found")

    # Delete related questions
    all_questions = db.reference("/questions").get() or {}
    qids = [qid for qid, q in all_questions.items() if q.get("test_id") == test_id]
    for qid in qids:
        db.reference(f"/questions/{qid}").delete()

    # Delete related test cases
    all_tcs = db.reference("/test_cases").get() or {}
    for tcid, tc in all_tcs.items():
        if tc.get("question_id") in qids:
            db.reference(f"/test_cases/{tcid}").delete()

    # Delete related submissions
    all_subs = db.reference("/submissions").get() or {}
    for sid, sub in all_subs.items():
        if sub.get("test_id") == test_id:
            db.reference(f"/submissions/{sid}").delete()

    test_ref.delete()
    return {"message": "Test deleted"}

@router.get("/test/{test_id}/questions")
def get_test_questions(test_id: str):
    all_questions = db.reference("/questions").get() or {}
    result = []
    for qid, q in all_questions.items():
        if q.get("test_id") == test_id:
            all_tcs = db.reference("/test_cases").get() or {}
            test_cases = [
                {"id": tcid, "input": tc.get("input"), "expected_output": tc.get("expected_output"),
                 "is_hidden": tc.get("is_hidden", False), "points": tc.get("points", 1)}
                for tcid, tc in all_tcs.items() if tc.get("question_id") == qid
            ]
            result.append({
                "id": qid, "title": q.get("title"), "description": q.get("description"),
                "difficulty": q.get("difficulty"), "topic": q.get("topic"),
                "points": q.get("points", 10), "time_limit_ms": q.get("time_limit_ms", 2000),
                "test_cases_count": len(test_cases), "test_cases": test_cases
            })
    return result


@router.post("/questions")
def create_question(question: QuestionCreate):
    qid = str(uuid.uuid4())
    q_data = {
        "test_id": question.test_id,
        "title": question.title,
        "description": question.description,
        "difficulty": question.difficulty.upper(),
        "topic": question.topic.upper(),
        "points": question.points,
        "time_limit_ms": question.time_limit_ms,
        "created_at": datetime.utcnow().isoformat(),
    }
    db.reference(f"/questions/{qid}").set(q_data)
    q_data["id"] = qid
    return q_data


@router.put("/questions/{question_id}")
def update_question(question_id: str, question_data: QuestionUpdate):
    q_ref = db.reference(f"/questions/{question_id}")
    q = q_ref.get()
    if not q:
        raise HTTPException(status_code=404, detail=f"Question {question_id} not found")
    updates = {}
    if question_data.title is not None: updates["title"] = question_data.title
    if question_data.description is not None: updates["description"] = question_data.description
    if question_data.difficulty is not None: updates["difficulty"] = question_data.difficulty.upper()
    if question_data.topic is not None: updates["topic"] = question_data.topic.upper()
    if question_data.points is not None: updates["points"] = question_data.points
    if question_data.time_limit_ms is not None: updates["time_limit_ms"] = question_data.time_limit_ms
    q_ref.update(updates)
    updated = q_ref.get()
    all_tcs = db.reference("/test_cases").get() or {}
    test_cases = [
        {"id": tcid, "input": tc.get("input"), "expected_output": tc.get("expected_output"),
         "is_hidden": tc.get("is_hidden", False), "points": tc.get("points", 1)}
        for tcid, tc in all_tcs.items() if tc.get("question_id") == question_id
    ]
    updated["id"] = question_id
    updated["test_cases"] = test_cases
    return updated


@router.delete("/questions/{question_id}")
def delete_question(question_id: str):
    if not db.reference(f"/questions/{question_id}").get():
        raise HTTPException(status_code=404, detail=f"Question {question_id} not found")
    db.reference(f"/questions/{question_id}").delete()
    # Delete related test cases and submissions
    all_tcs = db.reference("/test_cases").get() or {}
    for tcid, tc in all_tcs.items():
        if tc.get("question_id") == question_id:
            db.reference(f"/test_cases/{tcid}").delete()
    all_subs = db.reference("/submissions").get() or {}
    for sid, s in all_subs.items():
        if s.get("question_id") == question_id:
            db.reference(f"/submissions/{sid}").delete()
    return {"message": f"Question {question_id} deleted successfully"}


@router.post("/test-cases")
def create_test_case(test_case: TestCaseCreate):
    tcid = str(uuid.uuid4())
    tc_data = {
        "question_id": test_case.question_id,
        "input": test_case.input,
        "expected_output": test_case.expected_output,
        "is_hidden": test_case.is_hidden,
        "points": test_case.points,
    }
    db.reference(f"/test_cases/{tcid}").set(tc_data)
    tc_data["id"] = tcid
    return tc_data


@router.put("/test-cases/{test_case_id}")
def update_test_case(test_case_id: str, data: TestCaseUpdate):
    tc_ref = db.reference(f"/test_cases/{test_case_id}")
    tc = tc_ref.get()
    if not tc:
        raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
    updates = {}
    if data.input is not None: updates["input"] = data.input
    if data.expected_output is not None: updates["expected_output"] = data.expected_output
    if data.is_hidden is not None: updates["is_hidden"] = data.is_hidden
    if data.points is not None: updates["points"] = data.points
    tc_ref.update(updates)
    updated = tc_ref.get()
    updated["id"] = test_case_id
    return updated


@router.delete("/test-cases/{test_case_id}")
def delete_test_case(test_case_id: str):
    if not db.reference(f"/test_cases/{test_case_id}").get():
        raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
    db.reference(f"/test_cases/{test_case_id}").delete()
    return {"message": f"Test case {test_case_id} deleted successfully"}


@router.get("/submissions")
def get_all_submissions(limit: int = 50):
    all_subs = db.reference("/submissions").get() or {}
    all_users = db.reference("/users").get() or {}
    all_questions = db.reference("/questions").get() or {}
    subs = sorted(all_subs.values(), key=lambda x: x.get("submitted_at", ""), reverse=True)
    enriched = []
    for sub in subs[:limit]:
        student_id = sub.get("student_id")
        question_id = sub.get("question_id")
        user = all_users.get(student_id, {}) if student_id else {}
        question = all_questions.get(question_id, {}) if question_id else {}
        enriched.append({
            **sub,
            "student_name": user.get("name") or user.get("full_name") or "Unknown",
            "student_email": user.get("email") or "Unknown",
            "question_title": question.get("title") or "Unknown",
        })
    return enriched


@router.get("/analytics/test/{test_id}")
def get_test_analytics(test_id: str):
    all_questions = db.reference("/questions").get() or {}
    questions = {qid: q for qid, q in all_questions.items() if q.get("test_id") == test_id}
    all_subs = db.reference("/submissions").get() or {}
    test = db.reference(f"/tests/{test_id}").get() or {}
    session_id = ensure_session_id(test_id, test)
    analytics = {"test_id": test_id, "total_questions": len(questions), "questions": []}
    for qid, q in questions.items():
        subs = [
            s for s in all_subs.values()
            if s.get("question_id") == qid and s.get("session_id") == session_id
        ]
        total = len(subs)
        passed = sum(1 for s in subs if s.get("score") == 100)
        avg = sum(s.get("score", 0) for s in subs) / total if total > 0 else 0
        analytics["questions"].append({
            "question_id": qid, "title": q.get("title"),
            "total_submissions": total, "passed": passed, "failed": total - passed,
            "pass_rate": (passed / total * 100) if total > 0 else 0,
            "average_score": round(avg, 2)
        })
    return analytics


@router.get("/analytics/test/{test_id}/detailed")
def get_test_analytics_detailed(test_id: str, current_user: dict = Depends(require_teacher)):
    test = db.reference(f"/tests/{test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    session_id = ensure_session_id(test_id, test)

    all_questions = db.reference("/questions").get() or {}
    questions = {qid: q for qid, q in all_questions.items() if q.get("test_id") == test_id}
    question_list = [
        {"id": qid, "title": q.get("title"), "points": q.get("points", 10)}
        for qid, q in questions.items()
    ]

    all_subs = db.reference("/submissions").get() or {}
    all_users = db.reference("/users").get() or {}
    attempts = db.reference(f"/attempts/{test_id}/{session_id}").get() or {}

    duration_seconds = get_test_duration_seconds(test)

    # Aggregate per-question stats
    q_stats = {
        qid: {
            "count": 0,
            "score_sum": 0.0,
            "exec_sum": 0,
            "exec_count": 0,
            "comp_sum": 0,
            "comp_count": 0,
        }
        for qid in questions.keys()
    }

    # Build per-student aggregation
    student_rows = {}
    for sub in all_subs.values():
        if sub.get("test_id") != test_id or sub.get("session_id") != session_id:
            continue
        student_id = sub.get("student_id")
        if not student_id:
            continue
        if student_id not in student_rows:
            user = all_users.get(student_id, {})
            attempt = attempts.get(student_id, {})
            started_at = attempt.get("started_at")
            student_rows[student_id] = {
                "student_id": student_id,
                "student_name": user.get("name") or user.get("full_name") or "Unknown",
                "student_email": user.get("email") or "Unknown",
                "started_at": started_at,
                "first_submitted_at": None,
                "deadline_at": None,
                "overall_score": 0,
                "overall_submission_time_seconds": None,
                "overall_submitted_at": None,
                "tab_switches": attempt.get("tab_switches", 0),
                "paste_count": attempt.get("paste_count", 0),
                "questions": {},
            }
            if started_at:
                started_dt = parse_iso_ts(started_at)
                if started_dt:
                    effective_duration = get_effective_duration_seconds(test, started_at=started_at)
                    student_rows[student_id]["deadline_at"] = (
                        started_dt + timedelta(seconds=effective_duration)
                    ).replace(microsecond=0).isoformat().replace("+00:00", "Z")

        row = student_rows[student_id]
        qid = sub.get("question_id")
        if qid:
            row["questions"][qid] = {
                "question_id": qid,
                "submitted_at": sub.get("submitted_at"),
                "score": sub.get("score", 0),
                "language": sub.get("language"),
                "auto_submit": bool(sub.get("auto_submit", False)),
                "execution_time_ms": sub.get("execution_time_ms"),
                "compilation_time_ms": sub.get("compilation_time_ms"),
            }

        # Per-question aggregates
        if qid in q_stats:
            qs = q_stats[qid]
            qs["count"] += 1
            qs["score_sum"] += float(sub.get("score", 0) or 0)
            exec_ms = sub.get("execution_time_ms")
            if exec_ms is not None:
                qs["exec_sum"] += int(exec_ms)
                qs["exec_count"] += 1
            comp_ms = sub.get("compilation_time_ms")
            if comp_ms is not None:
                qs["comp_sum"] += int(comp_ms)
                qs["comp_count"] += 1

        submitted_at = sub.get("submitted_at")
        if submitted_at:
            if (row["first_submitted_at"] is None) or (submitted_at < row["first_submitted_at"]):
                row["first_submitted_at"] = submitted_at
            if (row["overall_submitted_at"] is None) or (submitted_at > row["overall_submitted_at"]):
                row["overall_submitted_at"] = submitted_at

    # Fill missing students with attempts but no submissions
    for student_id, attempt in attempts.items():
        if student_id in student_rows:
            continue
        user = all_users.get(student_id, {})
        started_at = attempt.get("started_at")
        student_rows[student_id] = {
            "student_id": student_id,
            "student_name": user.get("name") or user.get("full_name") or "Unknown",
            "student_email": user.get("email") or "Unknown",
            "started_at": started_at,
            "first_submitted_at": None,
            "deadline_at": None,
            "overall_score": 0,
            "overall_submission_time_seconds": None,
            "overall_submitted_at": None,
            "tab_switches": attempt.get("tab_switches", 0),
            "paste_count": attempt.get("paste_count", 0),
            "questions": {},
        }
        if started_at:
            started_dt = parse_iso_ts(started_at)
            if started_dt:
                effective_duration = get_effective_duration_seconds(test, started_at=started_at)
                student_rows[student_id]["deadline_at"] = (
                    started_dt + timedelta(seconds=effective_duration)
                ).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    # Compute overall score and submission time per student
    total_points = sum(int(q.get("points", 0) or 0) for q in question_list)
    for row in student_rows.values():
        if total_points > 0:
            earned_points = 0.0
            for q in question_list:
                qid = q["id"]
                q_points = float(q.get("points", 0) or 0)
                q_sub = row["questions"].get(qid)
                q_score = float(q_sub.get("score", 0)) if q_sub else 0.0
                earned_points += (q_score / 100.0) * q_points
            row["overall_score"] = round((earned_points / total_points) * 100.0, 2)
        if row["overall_submitted_at"]:
            started_source = row["started_at"] or row.get("first_submitted_at")
            started_dt = parse_iso_ts(started_source)
            submitted_dt = parse_iso_ts(row["overall_submitted_at"])
            if started_dt and submitted_dt:
                row["overall_submission_time_seconds"] = max(0, int((submitted_dt - started_dt).total_seconds()))

        # Aggregate execution/compilation time across submissions
        total_exec = 0
        total_comp = 0
        has_exec = False
        has_comp = False
        for qid, qsub in row["questions"].items():
            exec_ms = qsub.get("execution_time_ms")
            comp_ms = qsub.get("compilation_time_ms")
            if exec_ms is not None:
                total_exec += int(exec_ms)
                has_exec = True
            if comp_ms is not None:
                total_comp += int(comp_ms)
                has_comp = True
        row["total_execution_time_ms"] = total_exec if has_exec else None
        row["total_compilation_time_ms"] = total_comp if has_comp else None

    # Sort by overall_submitted_at desc, then name
    sorted_rows = sorted(
        student_rows.values(),
        key=lambda r: (r.get("overall_submitted_at") or "", r.get("student_name") or ""),
        reverse=True,
    )

    # Attach per-question averages
    enriched_questions = []
    for q in question_list:
        qid = q["id"]
        stats = q_stats.get(qid)
        if stats and stats["count"] > 0:
            avg_score = round(stats["score_sum"] / stats["count"], 2)
        else:
            avg_score = 0
        avg_exec = (
            int(stats["exec_sum"] / stats["exec_count"])
            if stats and stats["exec_count"] > 0
            else None
        )
        avg_comp = (
            int(stats["comp_sum"] / stats["comp_count"])
            if stats and stats["comp_count"] > 0
            else None
        )
        enriched_questions.append({
            **q,
            "average_score": avg_score,
            "avg_execution_time_ms": avg_exec,
            "avg_compilation_time_ms": avg_comp,
        })

    return {
        "test_id": test_id,
        "test_title": test.get("title"),
        "duration_minutes": test.get("duration_minutes", 60),
        "questions": enriched_questions,
        "students": sorted_rows,
    }


# ─── Student Routes ───────────────────────────────────────────────────────────

@router.get("/student/tests", tags=["student"])
def get_available_tests():
    all_tests = db.reference("/tests").get() or {}
    all_questions = db.reference("/questions").get() or {}
    result = []
    now = datetime.now(timezone.utc)
    for tid, t in all_tests.items():
        t = ensure_test_closed_if_expired(tid, t, now=now)
        start_dt = parse_iso_ts(t.get("start_date"))
        end_dt = parse_iso_ts(t.get("end_date"))
        if t.get("is_active") and (not start_dt or now >= start_dt) and (not end_dt or now < end_dt):
            q_count = sum(1 for q in all_questions.values() if q.get("test_id") == tid)
            result.append({
                "id": tid,
                "title": t.get("title"),
                "description": t.get("description"),
                "duration_minutes": t.get("duration_minutes", 60),
                "question_count": q_count,
                "allowed_languages": parse_languages(t.get("allowed_languages", "python")),
                "assessment_id": t.get("assessment_id", ""),  # ← ADD THIS
                "created_at": t.get("created_at"),
                "anti_paste_enabled": t.get("anti_paste_enabled", True),
                "tab_switch_enabled": t.get("tab_switch_enabled", True),
                "tab_switch_limit": t.get("tab_switch_limit", 3),
            })
    return result


@router.get("/student/test/{test_id}/questions", tags=["student"])
def get_test_questions_for_student(test_id: str):
    test = db.reference(f"/tests/{test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    all_questions = db.reference("/questions").get() or {}
    all_tcs = db.reference("/test_cases").get() or {}

    result = []
    for qid, q in all_questions.items():
        if q.get("test_id") == test_id:
            test_cases = [
                {
                    "id": tcid,
                    "input": tc.get("input"),
                    "expected_output": tc.get("expected_output"),
                    "is_hidden": tc.get("is_hidden", False),
                    "points": tc.get("points", 1),
                }
                for tcid, tc in all_tcs.items()
                if tc.get("question_id") == qid
            ]
            result.append({
                "id": qid,
                "title": q.get("title"),
                "description": q.get("description"),
                "difficulty": q.get("difficulty"),
                "topic": q.get("topic"),
                "points": q.get("points", 10),
                "time_limit_ms": q.get("time_limit_ms", 2000),
                "allowed_languages": parse_languages(test.get("allowed_languages", "python")),
                "test_cases": test_cases,
            })

    return result


@router.get("/student/test/lookup/{code}", tags=["student"])
def lookup_test(code: str):
    all_tests = db.reference("/tests").get() or {}
    all_questions = db.reference("/questions").get() or {}
    now = datetime.now(timezone.utc)
    for tid, t in all_tests.items():
        if tid == code or t.get("assessment_id") == code:
            t = ensure_test_closed_if_expired(tid, t, now=now)
            q_count = sum(1 for q in all_questions.values() if q.get("test_id") == tid)
            return {
                "id": tid,
                "title": t.get("title"),
                "description": t.get("description"),
                "duration_minutes": t.get("duration_minutes", 60),
                "question_count": q_count,
                "allowed_languages": parse_languages(t.get("allowed_languages", "python")),
                "assessment_id": t.get("assessment_id", ""),
                "created_at": t.get("created_at"),
                "anti_paste_enabled": t.get("anti_paste_enabled", True),
                "tab_switch_enabled": t.get("tab_switch_enabled", True),
                "tab_switch_limit": t.get("tab_switch_limit", 3),
            }
    raise HTTPException(status_code=404, detail="Test not found")


@router.get("/student/test/{test_id}/submissions", tags=["student"])
def get_student_test_submissions(test_id: str, current_user: dict = Depends(get_current_user)):
    student_id = current_user["id"]
    test = db.reference(f"/tests/{test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    session_id = ensure_session_id(test_id, test)
    all_subs = db.reference("/submissions").get() or {}
    result = []
    for sub_id, sub in all_subs.items():
        if sub.get("student_id") != student_id:
            continue
        if sub.get("test_id") != test_id:
            continue
        if sub.get("session_id") != session_id:
            continue
        result.append({
            "submission_id": sub_id,
            "question_id": sub.get("question_id"),
            "test_id": sub.get("test_id"),
            "session_id": sub.get("session_id"),
            "language": sub.get("language"),
            "code": sub.get("code"),
            "score": sub.get("score", 0),
            "passed": sub.get("passed", 0),
            "total": sub.get("total", 0),
            "submitted_at": sub.get("submitted_at"),
        })
    result.sort(key=lambda x: x.get("submitted_at") or "", reverse=True)
    return result


@router.post("/student/test/{test_id}/start", tags=["student"])
def start_test_attempt(test_id: str, current_user: dict = Depends(get_current_user)):
    test = db.reference(f"/tests/{test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    now = datetime.now(timezone.utc)
    test = ensure_test_closed_if_expired(test_id, test, now=now)
    session_id = ensure_session_id(test_id, test)
    start_dt = parse_iso_ts(test.get("start_date"))
    end_dt = parse_iso_ts(test.get("end_date"))

    if start_dt and now < start_dt:
        raise HTTPException(
            status_code=403,
            detail=f"Test entry opens at {start_dt.isoformat().replace('+00:00','Z')}"
        )

    attempt_ref = db.reference(f"/attempts/{test_id}/{session_id}/{current_user['id']}")
    attempt = attempt_ref.get() or {}
    started_at = attempt.get("started_at")

    if end_dt and now > end_dt and not started_at:
        raise HTTPException(status_code=403, detail="Test entry window has closed.")

    if not started_at:
        # New attempt starts now, but duration may be reduced by end_date
        duration_seconds = get_effective_duration_seconds(test, started_at=None, now=now)
        if end_dt and (end_dt - now).total_seconds() <= 0:
            raise HTTPException(status_code=403, detail="Test entry window has closed.")
        attempt = {"started_at": utcnow_iso()}
        attempt_ref.set(attempt)
        started_at = attempt.get("started_at")
        elapsed = 0
    else:
        duration_seconds = get_effective_duration_seconds(test, started_at=started_at, now=now)
        started = parse_iso_ts(started_at)
        elapsed = (now - started).total_seconds() if started else 0

    remaining = max(0, int(duration_seconds - elapsed))
    return {
        "test_id": test_id,
        "started_at": started_at,
        "duration_seconds": duration_seconds,
        "remaining_seconds": remaining,
        "expired": remaining <= 0,
        "forfeited": is_attempt_forfeited(attempt),
    }


@router.post("/student/test/{test_id}/tab-switch", tags=["student"])
def log_tab_switch(
    test_id: str,
    data: TabSwitchLogRequest,
    current_user: dict = Depends(get_current_user),
):
    test = db.reference(f"/tests/{test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    session_id = ensure_session_id(test_id, test)

    attempt_ref = db.reference(f"/attempts/{test_id}/{session_id}/{current_user['id']}")
    attempt = attempt_ref.get() or {}
    if attempt.get("forfeited"):
        raise HTTPException(status_code=403, detail="Test forfeited.")

    ts = data.timestamp or utcnow_iso()
    event = {"count": data.count, "timestamp": ts}
    db.reference(f"/attempts/{test_id}/{session_id}/{current_user['id']}/tab_switch_events").push(event)
    attempt_ref.update({"tab_switches": data.count, "last_tab_switch_at": ts})
    return {"logged": True, "count": data.count, "timestamp": ts}


@router.post("/student/test/{test_id}/paste", tags=["student"])
def log_paste(
    test_id: str,
    data: PasteLogRequest,
    current_user: dict = Depends(get_current_user),
):
    test = db.reference(f"/tests/{test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    session_id = ensure_session_id(test_id, test)

    attempt_ref = db.reference(f"/attempts/{test_id}/{session_id}/{current_user['id']}")
    attempt = attempt_ref.get() or {}
    if attempt.get("forfeited"):
        raise HTTPException(status_code=403, detail="Test forfeited.")

    ts = data.timestamp or utcnow_iso()
    event = {"count": data.count, "timestamp": ts}
    db.reference(f"/attempts/{test_id}/{session_id}/{current_user['id']}/paste_events").push(event)
    attempt_ref.update({"paste_count": data.count, "last_paste_at": ts})
    return {"logged": True, "count": data.count, "timestamp": ts}


@router.post("/student/test/{test_id}/forfeit", tags=["student"])
def forfeit_test_attempt(
    test_id: str,
    data: ForfeitRequest,
    current_user: dict = Depends(get_current_user),
):
    test = db.reference(f"/tests/{test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    session_id = ensure_session_id(test_id, test)

    attempt_ref = db.reference(f"/attempts/{test_id}/{session_id}/{current_user['id']}")
    attempt = attempt_ref.get() or {}
    if attempt.get("forfeited"):
        return {
            "message": "Test already forfeited.",
            "forfeited": True,
            "forfeited_at": attempt.get("forfeited_at"),
            "tab_switches": attempt.get("tab_switches"),
        }

    updates = {
        "forfeited": True,
        "forfeited_at": utcnow_iso(),
    }
    if data.tab_switches is not None:
        updates["tab_switches"] = data.tab_switches

    attempt_ref.update(updates)
    return {
        "message": "Test forfeited.",
        "forfeited": True,
        "forfeited_at": updates["forfeited_at"],
        "tab_switches": updates.get("tab_switches"),
    }


@router.post("/student/submit", tags=["student"])
def submit_solution(data: SubmitRequest, current_user: dict = Depends(get_current_user)):
    question = db.reference(f"/questions/{data.question_id}").get()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    if question.get("test_id") != data.test_id:
        raise HTTPException(status_code=400, detail="Question does not belong to this test")

    test = db.reference(f"/tests/{data.test_id}").get()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    session_id = ensure_session_id(data.test_id, test)

    # Enforce one submission per question per student
    all_subs = db.reference("/submissions").get() or {}
    for sub in all_subs.values():
        if (
            sub.get("student_id") == current_user["id"]
            and sub.get("question_id") == data.question_id
            and sub.get("test_id") == data.test_id
            and sub.get("session_id") == session_id
        ):
            raise HTTPException(status_code=409, detail="Already submitted for this question")

    # Enforce global test timer (allow small grace for auto-submit)
    attempt = get_or_create_attempt(data.test_id, session_id, current_user["id"])
    if is_attempt_forfeited(attempt):
        raise HTTPException(status_code=403, detail="Test forfeited due to excessive tab switching.")
    duration_seconds = get_effective_duration_seconds(test, started_at=attempt.get("started_at"))
    if is_attempt_expired(attempt, duration_seconds):
        if not data.auto_submit:
            raise HTTPException(status_code=403, detail="Test time is over")
        # Allow auto-submit within a small grace window after expiry
        started = parse_iso_ts(attempt.get("started_at"))
        if not started:
            raise HTTPException(status_code=403, detail="Test time is over")
        now = datetime.now(timezone.utc)
        end_time = started + timedelta(seconds=duration_seconds)
        if (now - end_time).total_seconds() > 5:
            raise HTTPException(status_code=403, detail="Test time is over")

    sub_id = str(uuid.uuid4())
    submission = {
        "student_id": current_user["id"],
        "question_id": data.question_id,
        "test_id": data.test_id,
        "session_id": session_id,
        "language": data.language,
        "code": data.code,
        "score": data.score,
        "passed": data.passed,
        "total": data.total,
        "auto_submit": bool(data.auto_submit),
        "execution_time_ms": data.execution_time_ms,
        "compilation_time_ms": data.compilation_time_ms,
        "submitted_at": utcnow_iso(),
    }
    db.reference(f"/submissions/{sub_id}").set(submission)
    return {"message": "Submitted successfully", "submission_id": sub_id, "score": data.score} 
