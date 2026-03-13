# routers/practice.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import httpx
import asyncio
from routes.practice import router as practice_router
app.include_router(practice_router)

router = APIRouter()

# ── Paste your full PRACTICE_PROBLEMS dict here ──────────────────────────────
# (import from practice_problems.py if you keep it in a separate file)
from practice_problems import PRACTICE_PROBLEMS

# ─────────────────────────────────────────────────────────────────────────────

# Judge0 config — update this with your Judge0 URL
JUDGE0_URL = "https://your-judge0-instance.com"  # ← replace with your Judge0 URL

LANGUAGE_IDS = {
    "python": 71,
    "java":   62,
    "c":      50,
    "cpp":    54,
}


# ── Helper: flatten problems for a language into a list ──────────────────────

def get_flat_problems(language: str) -> list:
    lang_data = PRACTICE_PROBLEMS.get(language, {})
    flat = []
    for topic, difficulties in lang_data.items():
        for difficulty, problems in difficulties.items():
            for p in problems:
                flat.append({
                    "id":            p["id"],
                    "title":         p["title"],
                    "topic":         topic,
                    "difficulty":    difficulty,
                    "task":          p["task"],
                    "input_format":  p.get("input_format", ""),
                    "output_format": p.get("output_format", ""),
                    "sample_input":  p.get("sample_input", ""),
                    "sample_output": p.get("sample_output", ""),
                    "constraints":   p.get("constraints", ""),
                    # tests are NOT sent to frontend (used only for submit)
                })
    return flat


def get_problem_by_id(language: str, pid: str) -> Optional[dict]:
    lang_data = PRACTICE_PROBLEMS.get(language, {})
    for topic, difficulties in lang_data.items():
        for difficulty, problems in difficulties.items():
            for p in problems:
                if p["id"] == pid:
                    return p
    return None


# ── Judge0 helper ─────────────────────────────────────────────────────────────

async def run_on_judge0(language: str, code: str, stdin: str) -> dict:
    lang_id = LANGUAGE_IDS.get(language)
    if not lang_id:
        return {"stdout": "", "error": f"Unsupported language: {language}"}

    payload = {
        "source_code": code,
        "language_id": lang_id,
        "stdin":        stdin,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        # Submit
        sub = await client.post(
            f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=false",
            json=payload,
        )
        token = sub.json().get("token")
        if not token:
            return {"stdout": "", "error": "Submission failed — no token"}

        # Poll for result
        for _ in range(20):
            await asyncio.sleep(1)
            res = await client.get(
                f"{JUDGE0_URL}/submissions/{token}?base64_encoded=false"
            )
            data = res.json()
            status_id = data.get("status", {}).get("id", 0)
            if status_id >= 3:  # finished
                stdout = data.get("stdout") or ""
                stderr = data.get("stderr") or ""
                compile_output = data.get("compile_output") or ""
                error = stderr or compile_output or ""
                return {"stdout": stdout.strip(), "error": error.strip()}

        return {"stdout": "", "error": "Timeout: Judge0 took too long"}


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/api/practice/problems/{language}")
async def get_problems(language: str):
    """Return flat list of all problems for a language."""
    return get_flat_problems(language.lower())


@router.get("/api/practice/problem/{language}/{pid}")
async def get_problem(language: str, pid: str):
    """Return a single problem (without tests)."""
    p = get_problem_by_id(language.lower(), pid)
    if not p:
        return {"error": "Problem not found"}
    return {
        "id":            p["id"],
        "title":         p["title"],
        "difficulty":    p.get("difficulty", ""),
        "task":          p["task"],
        "input_format":  p.get("input_format", ""),
        "output_format": p.get("output_format", ""),
        "sample_input":  p.get("sample_input", ""),
        "sample_output": p.get("sample_output", ""),
        "constraints":   p.get("constraints", ""),
    }


class RunRequest(BaseModel):
    language: str
    code: str
    stdin: str = ""

@router.post("/api/practice/run")
async def run_code(req: RunRequest):
    """Run code against sample input."""
    result = await run_on_judge0(req.language, req.code, req.stdin)
    return result


class SubmitRequest(BaseModel):
    uid: str
    pid: str
    language: str
    code: str

@router.post("/api/practice/submit")
async def submit_code(req: SubmitRequest):
    """Run code against all test cases and save progress."""
    from firebase_admin import firestore
    import firebase_admin

    p = get_problem_by_id(req.language, req.pid)
    if not p:
        return {"error": "Problem not found"}

    tests = p.get("tests", [])
    results = []
    passed = 0

    for i, test in enumerate(tests):
        result = await run_on_judge0(req.language, req.code, test.get("input", ""))
        expected = test.get("output", "").strip()
        got = result.get("stdout", "").strip()
        ok = (got == expected)
        if ok:
            passed += 1
        results.append({
            "index":    i + 1,
            "passed":   ok,
            "expected": expected,
            "got":      got,
        })

    completed = (passed == len(tests))
    already_solved = False
    xp_gain = 0

    # Save to Firestore if all tests pass
    if completed:
        try:
            db = firestore.client()
            user_ref = db.collection("users").document(req.uid)
            user_doc = user_ref.get()
            practice_completed = []
            if user_doc.exists:
                practice_completed = user_doc.to_dict().get("practiceCompleted", [])

            if req.pid in practice_completed:
                already_solved = True
            else:
                # XP by difficulty
                difficulty = p.get("difficulty", "Easy")
                xp_map = {"Very Easy": 5, "Easy": 10, "Medium": 20, "Hard": 35, "Very Hard": 50}
                xp_gain = xp_map.get(difficulty, 10)

                practice_completed.append(req.pid)
                user_ref.set({
                    "practiceCompleted": practice_completed,
                    "xp": firestore.Increment(xp_gain),
                }, merge=True)
        except Exception as e:
            print(f"Firestore error: {e}")

    return {
        "passed":        passed,
        "total":         len(tests),
        "completed":     completed,
        "already_solved": already_solved,
        "xp_gain":       xp_gain,
        "results":       results,
    }