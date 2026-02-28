from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Union, List
import requests
import time
import os
import concurrent.futures

router = APIRouter()

# ── Config ────────────────────────────────────────────────────────────────────
JUDGE0_URL = os.getenv("JUDGE0_URL", "https://judge0-production-8e51.up.railway.app")
JUDGE0_AUTH_TOKEN = os.getenv("JUDGE0_AUTHN_TOKEN", "mysecrettoken123")

HEADERS = {
    "Content-Type": "application/json",
    "X-Auth-Token": JUDGE0_AUTH_TOKEN,
}

# ── Judge0 Language IDs ───────────────────────────────────────────────────────
LANGUAGE_IDS = {
    "python":   71,   # Python 3.8.1
    "c":        50,   # C (GCC 9.2.0)
    "cpp":      54,   # C++ (GCC 9.2.0)
    "java":     62,   # Java (OpenJDK 13.0.1)
}

# ── Models ────────────────────────────────────────────────────────────────────
class TestCase(BaseModel):
    id: Union[str, int]
    input: str
    expected_output: str
    is_hidden: Optional[bool] = False
    points: Optional[int] = 1

class ExecuteRequest(BaseModel):
    code: str
    language: str
    test_cases: List[TestCase]
    question_id: Optional[Union[str, int]] = None
    time_limit: Optional[float] = 5.0              # seconds
    memory_limit: Optional[int] = 256000           # KB

# ── Helpers ───────────────────────────────────────────────────────────────────
def normalize(text: str) -> str:
    return text.strip()

def get_language_id(language: str) -> int:
    lang = language.lower().strip()
    if lang not in LANGUAGE_IDS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language '{language}'. Supported: {list(LANGUAGE_IDS.keys())}"
        )
    return LANGUAGE_IDS[lang]

def submit_token(code: str, language_id: int, stdin: str,
                 time_limit: float, memory_limit: int) -> str:
    """Submit a single test case to Judge0 and return the token. Does NOT poll."""
    payload = {
        "source_code": code,
        "language_id": language_id,
        "stdin": stdin,
        "cpu_time_limit": time_limit,
        "memory_limit": memory_limit,
        "enable_per_process_and_thread_time_limit": False,
    }
    resp = requests.post(
        f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=false",
        json=payload,
        headers=HEADERS,
        timeout=15,
    )
    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Judge0 submission failed: {resp.status_code} {resp.text}"
        )
    token = resp.json().get("token")
    if not token:
        raise HTTPException(status_code=502, detail="Judge0 did not return a submission token")
    return token

def poll_token(token: str, max_wait: int = 30) -> dict:
    """Poll a single Judge0 token until it finishes. Returns the result dict."""
    for _ in range(max_wait):
        time.sleep(1)
        try:
            resp = requests.get(
                f"{JUDGE0_URL}/submissions/{token}?base64_encoded=false",
                headers=HEADERS,
                timeout=10,
            )
        except Exception:
            continue
        if resp.status_code != 200:
            continue
        result = resp.json()
        status_id = result.get("status", {}).get("id", 0)
        if status_id not in (1, 2):  # 1=In Queue, 2=Processing
            return result
    raise HTTPException(status_code=504, detail="Judge0 execution timed out (polling)")

def parse_result(judge0_result: dict, test_case: TestCase) -> dict:
    status = judge0_result.get("status", {})
    status_id = status.get("id", 0)
    status_desc = status.get("description", "Unknown")

    stdout = judge0_result.get("stdout") or ""
    stderr = judge0_result.get("stderr") or ""
    compile_output = judge0_result.get("compile_output") or ""
    time_ms = float(judge0_result.get("time") or 0) * 1000
    memory_kb = float(judge0_result.get("memory") or 0)

    error = None
    if status_id == 6:
        error = compile_output or "Compilation error"
    elif status_id == 5:
        error = "Time Limit Exceeded"
    elif status_id == 11:
        error = "Memory Limit Exceeded"
    elif status_id in (12, 13, 14, 15):
        error = f"Runtime Error: {stderr or status_desc}"
    elif status_id not in (3,):
        error = stderr or compile_output or status_desc

    actual = normalize(stdout)
    expected = normalize(test_case.expected_output)
    passed = (status_id == 3) and (actual == expected)

    if status_id == 5:
        verdict = "TIME_LIMIT_EXCEEDED"
    elif passed:
        verdict = "PASS"
    else:
        verdict = "FAIL"

    return {
        "id": test_case.id,
        "verdict": verdict,
        "passed": passed,
        "actual_output": actual,
        "expected_output": expected,
        "is_hidden": test_case.is_hidden,
        "points_earned": test_case.points if passed else 0,
        "error": error,
        "stdout": actual,
        "stderr": stderr or compile_output or None,
        "time_ms": round(time_ms, 2),
        "memory_kb": round(memory_kb, 2),
        "status": status_desc,
    }

# ── Route ─────────────────────────────────────────────────────────────────────
@router.post("/api/execute")
async def execute_code(request: ExecuteRequest):
    if not request.test_cases:
        raise HTTPException(status_code=400, detail="No test cases provided")

    language_id = get_language_id(request.language)

    # ── Step 1: Submit ALL test cases in parallel ──────────────────────────────
    # This fires off all submissions at once instead of one-by-one.
    tokens = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(
                submit_token,
                request.code,
                language_id,
                tc.input,
                request.time_limit,
                request.memory_limit,
            )
            for tc in request.test_cases
        ]
        for future in futures:
            tokens.append(future.result())  # raises HTTPException on failure

    # ── Step 2: Brief warmup sleep (once, not per test case) ───────────────────
    time.sleep(2)

    # ── Step 3: Poll ALL tokens in parallel ────────────────────────────────────
    judge0_results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        poll_futures = [executor.submit(poll_token, token, 30) for token in tokens]
        for future in poll_futures:
            judge0_results.append(future.result())  # raises HTTPException on timeout

    # ── Step 4: Parse results ──────────────────────────────────────────────────
    results = []
    total_passed = 0
    total_score = 0.0
    max_score = sum(tc.points for tc in request.test_cases)
    compilation_error = None

    for tc, judge0_result in zip(request.test_cases, judge0_results):
        try:
            result = parse_result(judge0_result, tc)
            if result.get("status") == "Compilation Error" and not compilation_error:
                compilation_error = result.get("stderr") or result.get("error")
        except Exception as e:
            result = {
                "id": tc.id,
                "verdict": "FAIL",
                "passed": False,
                "actual_output": "",
                "expected_output": normalize(tc.expected_output),
                "is_hidden": tc.is_hidden,
                "points_earned": 0,
                "error": f"Parse error: {str(e)}",
                "stdout": None,
                "stderr": str(e),
                "time_ms": None,
                "memory_kb": None,
                "status": "Internal Error",
            }

        results.append(result)
        if result["passed"]:
            total_passed += 1
            total_score += result["points_earned"]

    score = round((total_score / max_score * 100) if max_score > 0 else 0, 1)

    return {
        "results": results,
        "total_passed": total_passed,
        "total_cases": len(request.test_cases),
        "total_score": total_score,
        "max_score": max_score,
        "success": total_passed == len(request.test_cases),
        "compilation_error": compilation_error,
        "summary": {
            "score": score,
            "passed": total_passed,
            "total": len(request.test_cases),
        }
    }


# ── Health check ──────────────────────────────────────────────────────────────
@router.get("/api/execute/health")
async def execution_health():
    try:
        resp = requests.get(
            f"{JUDGE0_URL}/system_info",
            headers=HEADERS,
            timeout=5
        )
        if resp.status_code == 200:
            return {"status": "ok", "judge0": "reachable", "url": JUDGE0_URL}
        return {"status": "degraded", "judge0": f"HTTP {resp.status_code}"}
    except Exception as e:
        return {"status": "error", "judge0": str(e)}