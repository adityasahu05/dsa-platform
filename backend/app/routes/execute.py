from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Union, List
import requests
import time
import os

router = APIRouter()

# ── Config ────────────────────────────────────────────────────────────────────
JUDGE0_URL = os.getenv("JUDGE0_URL", "https://judge0-production-8e51.up.railway.app")
JUDGE0_AUTH_TOKEN = os.getenv("JUDGE0_AUTHN_TOKEN", "mysecrettoken123")

HEADERS = {
    "Content-Type": "application/json",
    "X-Auth-Token": JUDGE0_AUTH_TOKEN,
}

# ── Judge0 Language IDs ───────────────────────────────────────────────────────
# Full list at: https://judge0-production-8e51.up.railway.app/languages
LANGUAGE_IDS = {
    "python":   71,   # Python 3.8.1  (use 92 for Python 3.11 if available)
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

class TestResult(BaseModel):
    id: Union[str, int]
    passed: bool
    actual_output: str
    expected_output: str
    is_hidden: Optional[bool] = False
    points_earned: int
    error: Optional[str] = None
    time_ms: Optional[float] = None
    memory_kb: Optional[float] = None
    status: Optional[str] = None

class ExecuteRequest(BaseModel):
    code: str
    language: str                                   # "python" | "c" | "cpp" | "java"
    test_cases: List[TestCase]
    question_id: Optional[Union[str, int]] = None
    time_limit: Optional[float] = 5.0              # seconds (per test case)
    memory_limit: Optional[int] = 256000           # KB

class ExecuteResponse(BaseModel):
    results: List[TestResult]
    total_passed: int
    total_cases: int
    total_score: float
    max_score: float
    success: bool

# ── Helpers ───────────────────────────────────────────────────────────────────
def normalize(text: str) -> str:
    """Strip trailing whitespace/newlines for comparison."""
    return text.strip()

def get_language_id(language: str) -> int:
    lang = language.lower().strip()
    if lang not in LANGUAGE_IDS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language '{language}'. Supported: {list(LANGUAGE_IDS.keys())}"
        )
    return LANGUAGE_IDS[lang]

def submit_to_judge0(code: str, language_id: int, stdin: str,
                     time_limit: float, memory_limit: int) -> dict:
    """
    Submit a single test case to Judge0 and poll until it finishes.
    Returns the Judge0 result dict.
    """
    payload = {
        "source_code": code,
        "language_id": language_id,
        "stdin": stdin,
        "cpu_time_limit": time_limit,
        "memory_limit": memory_limit,
        "enable_per_process_and_thread_time_limit": False,
    }

    # Submit
    resp = requests.post(
        f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=false",
        json=payload,
        headers=HEADERS,
        timeout=30,
    )

    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Judge0 submission failed: {resp.status_code} {resp.text}"
        )

    token = resp.json().get("token")
    if not token:
        raise HTTPException(status_code=502, detail="Judge0 did not return a submission token")

    # Poll for result (max 30 seconds)
    for _ in range(30):
        time.sleep(1)
        result_resp = requests.get(
            f"{JUDGE0_URL}/submissions/{token}?base64_encoded=false",
            headers=HEADERS,
            timeout=10,
        )
        if result_resp.status_code != 200:
            continue
        result = result_resp.json()
        status_id = result.get("status", {}).get("id", 0)
        # Status IDs 1 (In Queue) and 2 (Processing) mean still running
        if status_id not in (1, 2):
            return result

    raise HTTPException(status_code=504, detail="Judge0 execution timed out (polling)")

def parse_result(judge0_result: dict, test_case: TestCase) -> TestResult:
    """Convert a Judge0 result into our TestResult model."""
    status = judge0_result.get("status", {})
    status_id = status.get("id", 0)
    status_desc = status.get("description", "Unknown")

    stdout = judge0_result.get("stdout") or ""
    stderr = judge0_result.get("stderr") or ""
    compile_output = judge0_result.get("compile_output") or ""
    time_ms = float(judge0_result.get("time") or 0) * 1000   # seconds → ms
    memory_kb = float(judge0_result.get("memory") or 0)

    # Build error message if any
    error = None
    if status_id == 6:   # Compilation Error
        error = compile_output or "Compilation error"
    elif status_id == 5:  # Time Limit Exceeded
        error = "Time Limit Exceeded"
    elif status_id == 11: # Memory Limit Exceeded
        error = "Memory Limit Exceeded"
    elif status_id == 12: # Runtime Error (SIGSEGV)
        error = f"Runtime Error: {stderr or status_desc}"
    elif status_id not in (3,):  # 3 = Accepted
        error = stderr or compile_output or status_desc

    # Compare output
    actual = normalize(stdout)
    expected = normalize(test_case.expected_output)
    passed = (status_id == 3) and (actual == expected)

    return TestResult(
        id=test_case.id,
        passed=passed,
        actual_output=actual,
        expected_output=expected,
        is_hidden=test_case.is_hidden,
        points_earned=test_case.points if passed else 0,
        error=error,
        time_ms=round(time_ms, 2),
        memory_kb=round(memory_kb, 2),
        status=status_desc,
    )

# ── Route ─────────────────────────────────────────────────────────────────────
@router.post("/api/execute", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest):
    """
    Execute code against all test cases using Judge0 CE.
    Replaces the old Godbolt-based executor.
    """
    if not request.test_cases:
        raise HTTPException(status_code=400, detail="No test cases provided")

    language_id = get_language_id(request.language)
    results: List[TestResult] = []
    total_passed = 0
    total_score = 0.0
    max_score = sum(tc.points for tc in request.test_cases)

    for tc in request.test_cases:
        try:
            judge0_result = submit_to_judge0(
                code=request.code,
                language_id=language_id,
                stdin=tc.input,
                time_limit=request.time_limit,
                memory_limit=request.memory_limit,
            )
            result = parse_result(judge0_result, tc)
        except HTTPException:
            raise
        except Exception as e:
            # Don't crash the whole request if one test case fails to run
            result = TestResult(
                id=tc.id,
                passed=False,
                actual_output="",
                expected_output=normalize(tc.expected_output),
                is_hidden=tc.is_hidden,
                points_earned=0,
                error=f"Execution error: {str(e)}",
                status="Internal Error",
            )

        results.append(result)
        if result.passed:
            total_passed += 1
            total_score += result.points_earned

    return ExecuteResponse(
        results=results,
        total_passed=total_passed,
        total_cases=len(request.test_cases),
        total_score=total_score,
        max_score=max_score,
        success=total_passed == len(request.test_cases),
    )


# ── Health check ──────────────────────────────────────────────────────────────
@router.get("/api/execute/health")
async def execution_health():
    """Check if Judge0 is reachable."""
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