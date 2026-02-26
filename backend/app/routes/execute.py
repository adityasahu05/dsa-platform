




# import re
# import requests
# import urllib3
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from typing import List, Optional

# urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# router = APIRouter()

# GODBOLT_URL = "https://godbolt.org/api/compiler/{compiler_id}/compile"
# HEADERS = {
#     "Content-Type": "application/json",
#     "Accept": "application/json",
# }

# # Godbolt compiler IDs
# LANGUAGE_MAP = {
#     "python": "python312",
#     "c":      "cg142",
#     "cpp":    "g142",
#     "java":   "java2100",
# }

# LANG_ID_MAP = {
#     "python": "python",
#     "c":      "c",
#     "cpp":    "c++",
#     "java":   "java",
# }


# # ─── Models ───────────────────────────────────────────────────────────────────

# class TestCase(BaseModel):
#     id: int
#     input: Optional[str] = ""
#     expected_output: str
#     is_hidden: bool = False
#     points: Optional[int] = 10

# class ExecuteRequest(BaseModel):
#     language: str
#     code: str
#     question_id: Optional[int] = None
#     tests: List[TestCase] = []
#     time_limit_ms: Optional[int] = 2000

# class TestResult(BaseModel):
#     id: int
#     verdict: str
#     stdout: Optional[str] = None
#     stderr: Optional[str] = None
#     time_ms: Optional[float] = None
#     passed: bool

# class Summary(BaseModel):
#     score: float
#     passed: int
#     total: int

# class ExecuteResponse(BaseModel):
#     results: List[TestResult]
#     summary: Summary
#     compilation_error: Optional[str] = None


# # ─── Helpers ──────────────────────────────────────────────────────────────────

# def normalize_output(s: str) -> str:
#     lines = s.strip().splitlines()
#     return "\n".join(line.rstrip() for line in lines)

# ANSI_ESCAPE = re.compile(r"\x1b\[[0-9;]*[mGKHF]|\x1b\(B")

# def extract_text(lines: list) -> str:
#     """Godbolt returns stdout/stderr as list of {text: ...} dicts. Strip ANSI codes."""
#     raw = "\n".join(item.get("text", "") for item in lines).strip()
#     return ANSI_ESCAPE.sub("", raw)


# def run_one(compiler_id: str, lang_id: str, code: str, stdin: str) -> dict:
#     payload = {
#         "source": code,
#         "lang": lang_id,
#         "allowStoreCodeDebug": True,
#         "options": {
#             "userArguments": "",
#             "executeParameters": {
#                 "args": "",
#                 "stdin": stdin or "",
#             },
#             "compilerOptions": {
#                 "executorRequest": True,
#             },
#         },
#     }
#     url = GODBOLT_URL.format(compiler_id=compiler_id)
#     try:
#         resp = requests.post(url, json=payload, headers=HEADERS, timeout=60)
#     except requests.exceptions.ConnectionError:
#         raise HTTPException(status_code=503, detail="Cannot reach godbolt.org — check your internet connection.")
#     except requests.exceptions.Timeout:
#         raise HTTPException(status_code=504, detail="Godbolt API timed out.")

#     if resp.status_code not in (200, 201):
#         raise HTTPException(status_code=502, detail=f"Godbolt error {resp.status_code}: {resp.text}")

#     return resp.json()


# def process(data: dict, tc_id: int, expected: str, is_hidden: bool):
#     timed_out   = data.get("timedOut", False)
#     did_execute = data.get("didExecute", False)
#     exit_code   = data.get("code", 0)
#     stdout      = extract_text(data.get("stdout", []))
#     stderr      = extract_text(data.get("stderr", []))
#     build       = data.get("buildResult", {})
#     build_stderr= extract_text(build.get("stderr", []))
#     build_code  = build.get("code", 0)
#     exec_time   = data.get("execTime")
#     time_ms     = float(exec_time) if exec_time else None
#     compile_err = None

#     if not did_execute and build_code != 0:
#         compile_err = build_stderr or stderr
#         return TestResult(
#             id=tc_id,
#             verdict="COMPILATION_ERROR",
#             stdout=None,
#             stderr=compile_err,
#             time_ms=None,
#             passed=False,
#         ), False, compile_err

#     if timed_out:
#         verdict, passed = "TIME_LIMIT_EXCEEDED", False
#     elif exit_code != 0:
#         verdict, passed = "RUNTIME_ERROR", False
#     else:
#         passed  = normalize_output(stdout) == normalize_output(expected)
#         verdict = "PASS" if passed else "FAIL"

#     return TestResult(
#         id=tc_id,
#         verdict=verdict,
#         stdout=stdout if not is_hidden else None,
#         stderr=stderr if stderr else None,
#         time_ms=time_ms,
#         passed=passed,
#     ), passed, None


# # ─── Endpoint ─────────────────────────────────────────────────────────────────

# @router.post("/execute", response_model=ExecuteResponse)
# def execute_code(request: ExecuteRequest):
#     language = request.language.lower()

#     if language not in LANGUAGE_MAP:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Unsupported language '{language}'. Supported: {list(LANGUAGE_MAP.keys())}",
#         )

#     compiler_id = LANGUAGE_MAP[language]
#     lang_id     = LANG_ID_MAP[language]

#     # No test cases — run once with empty stdin
#     if not request.tests:
#         data        = run_one(compiler_id, lang_id, request.code, "")
#         timed_out   = data.get("timedOut", False)
#         did_execute = data.get("didExecute", False)
#         exit_code   = data.get("code", 0)
#         stdout      = extract_text(data.get("stdout", []))
#         stderr      = extract_text(data.get("stderr", []))
#         build       = data.get("buildResult", {})
#         build_code  = build.get("code", 0)
#         build_stderr= extract_text(build.get("stderr", []))
#         exec_time   = data.get("execTime")
#         time_ms     = float(exec_time) if exec_time else None

#         if not did_execute and build_code != 0:
#             compile_err = build_stderr or stderr
#             return ExecuteResponse(
#                 results=[TestResult(id=0, verdict="COMPILATION_ERROR", stdout=None,
#                                     stderr=compile_err, time_ms=None, passed=False)],
#                 summary=Summary(score=0.0, passed=0, total=1),
#                 compilation_error=compile_err,
#             )

#         if timed_out:
#             verdict, passed = "TIME_LIMIT_EXCEEDED", False
#         elif exit_code != 0:
#             verdict, passed = "RUNTIME_ERROR", False
#         else:
#             verdict, passed = "PASS", True

#         return ExecuteResponse(
#             results=[TestResult(id=0, verdict=verdict, stdout=stdout,
#                                 stderr=stderr or None, time_ms=time_ms, passed=passed)],
#             summary=Summary(score=100.0 if passed else 0.0, passed=1 if passed else 0, total=1),
#             compilation_error=None,
#         )

#     # Run test cases sequentially
#     results: List[TestResult] = []
#     compilation_error: Optional[str] = None
#     passed_count = 0

#     for tc in request.tests:
#         data = run_one(compiler_id, lang_id, request.code, tc.input or "")
#         result, passed, comp_err = process(data, tc.id, tc.expected_output, tc.is_hidden)

#         if comp_err and not compilation_error:
#             compilation_error = comp_err
#             results.append(result)
#             remaining = request.tests[request.tests.index(tc) + 1:]
#             for r in remaining:
#                 results.append(TestResult(id=r.id, verdict="COMPILATION_ERROR",
#                                           stdout=None, stderr=None, time_ms=None, passed=False))
#             break

#         if passed:
#             passed_count += 1
#         results.append(result)

#     total = len(request.tests)
#     score = round((passed_count / total) * 100, 1) if total > 0 else 0.0

#     return ExecuteResponse(
#         results=results,
#         summary=Summary(score=score, passed=passed_count, total=total),
#         compilation_error=compilation_error,
#     )

import re
import requests
import urllib3
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

router = APIRouter()

GODBOLT_URL = "https://godbolt.org/api/compiler/{compiler_id}/compile"
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

# Godbolt compiler IDs
LANGUAGE_MAP = {
    "python": "python312",
    "c":      "cg142",
    "cpp":    "g142",
    "java":   "java2100",
}

LANG_ID_MAP = {
    "python": "python",
    "c":      "c",
    "cpp":    "c++",
    "java":   "java",
}


# ─── Models ───────────────────────────────────────────────────────────────────

class TestCase(BaseModel):
    id: Union[str, int]          # ✅ Accept both UUID strings and legacy ints
    input: Optional[str] = ""
    expected_output: str
    is_hidden: bool = False
    points: Optional[int] = 10

class ExecuteRequest(BaseModel):
    language: str
    code: str
    question_id: Optional[Union[str, int]] = None   # ✅ Accept both
    tests: List[TestCase] = []
    time_limit_ms: Optional[int] = 2000

class TestResult(BaseModel):
    id: Union[str, int]          # ✅ Accept both UUID strings and legacy ints
    verdict: str
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    time_ms: Optional[float] = None
    passed: bool

class Summary(BaseModel):
    score: float
    passed: int
    total: int

class ExecuteResponse(BaseModel):
    results: List[TestResult]
    summary: Summary
    compilation_error: Optional[str] = None


# ─── Helpers ──────────────────────────────────────────────────────────────────

def normalize_output(s: str) -> str:
    lines = s.strip().splitlines()
    return "\n".join(line.rstrip() for line in lines)

ANSI_ESCAPE = re.compile(r"\x1b\[[0-9;]*[mGKHF]|\x1b\(B")

def extract_text(lines: list) -> str:
    """Godbolt returns stdout/stderr as list of {text: ...} dicts. Strip ANSI codes."""
    raw = "\n".join(item.get("text", "") for item in lines).strip()
    return ANSI_ESCAPE.sub("", raw)


def run_one(compiler_id: str, lang_id: str, code: str, stdin: str) -> dict:
    payload = {
        "source": code,
        "lang": lang_id,
        "allowStoreCodeDebug": True,
        "options": {
            "userArguments": "",
            "executeParameters": {
                "args": "",
                "stdin": stdin or "",
            },
            "compilerOptions": {
                "executorRequest": True,
            },
        },
    }
    url = GODBOLT_URL.format(compiler_id=compiler_id)
    try:
        resp = requests.post(url, json=payload, headers=HEADERS, timeout=60)
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Cannot reach godbolt.org — check your internet connection.")
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Godbolt API timed out.")

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"Godbolt error {resp.status_code}: {resp.text}")

    return resp.json()


def process(data: dict, tc_id: Union[str, int], expected: str, is_hidden: bool):
    timed_out   = data.get("timedOut", False)
    did_execute = data.get("didExecute", False)
    exit_code   = data.get("code", 0)
    stdout      = extract_text(data.get("stdout", []))
    stderr      = extract_text(data.get("stderr", []))
    build       = data.get("buildResult", {})
    build_stderr= extract_text(build.get("stderr", []))
    build_code  = build.get("code", 0)
    exec_time   = data.get("execTime")
    time_ms     = float(exec_time) if exec_time else None
    compile_err = None

    if not did_execute and build_code != 0:
        compile_err = build_stderr or stderr
        return TestResult(
            id=tc_id,
            verdict="COMPILATION_ERROR",
            stdout=None,
            stderr=compile_err,
            time_ms=None,
            passed=False,
        ), False, compile_err

    if timed_out:
        verdict, passed = "TIME_LIMIT_EXCEEDED", False
    elif exit_code != 0:
        verdict, passed = "RUNTIME_ERROR", False
    else:
        passed  = normalize_output(stdout) == normalize_output(expected)
        verdict = "PASS" if passed else "FAIL"

    return TestResult(
        id=tc_id,
        verdict=verdict,
        stdout=stdout if not is_hidden else None,
        stderr=stderr if stderr else None,
        time_ms=time_ms,
        passed=passed,
    ), passed, None


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post("/execute", response_model=ExecuteResponse)
def execute_code(request: ExecuteRequest):
    language = request.language.lower()

    if language not in LANGUAGE_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language '{language}'. Supported: {list(LANGUAGE_MAP.keys())}",
        )

    compiler_id = LANGUAGE_MAP[language]
    lang_id     = LANG_ID_MAP[language]

    # No test cases — run once with empty stdin
    if not request.tests:
        data        = run_one(compiler_id, lang_id, request.code, "")
        timed_out   = data.get("timedOut", False)
        did_execute = data.get("didExecute", False)
        exit_code   = data.get("code", 0)
        stdout      = extract_text(data.get("stdout", []))
        stderr      = extract_text(data.get("stderr", []))
        build       = data.get("buildResult", {})
        build_code  = build.get("code", 0)
        build_stderr= extract_text(build.get("stderr", []))
        exec_time   = data.get("execTime")
        time_ms     = float(exec_time) if exec_time else None

        if not did_execute and build_code != 0:
            compile_err = build_stderr or stderr
            return ExecuteResponse(
                results=[TestResult(id="0", verdict="COMPILATION_ERROR", stdout=None,
                                    stderr=compile_err, time_ms=None, passed=False)],
                summary=Summary(score=0.0, passed=0, total=1),
                compilation_error=compile_err,
            )

        if timed_out:
            verdict, passed = "TIME_LIMIT_EXCEEDED", False
        elif exit_code != 0:
            verdict, passed = "RUNTIME_ERROR", False
        else:
            verdict, passed = "PASS", True

        return ExecuteResponse(
            results=[TestResult(id="0", verdict=verdict, stdout=stdout,
                                stderr=stderr or None, time_ms=time_ms, passed=passed)],
            summary=Summary(score=100.0 if passed else 0.0, passed=1 if passed else 0, total=1),
            compilation_error=None,
        )

    # Run test cases sequentially
    results: List[TestResult] = []
    compilation_error: Optional[str] = None
    passed_count = 0

    for tc in request.tests:
        data = run_one(compiler_id, lang_id, request.code, tc.input or "")
        result, passed, comp_err = process(data, tc.id, tc.expected_output, tc.is_hidden)

        if comp_err and not compilation_error:
            compilation_error = comp_err
            results.append(result)
            remaining = request.tests[request.tests.index(tc) + 1:]
            for r in remaining:
                results.append(TestResult(id=r.id, verdict="COMPILATION_ERROR",
                                          stdout=None, stderr=None, time_ms=None, passed=False))
            break

        if passed:
            passed_count += 1
        results.append(result)

    total = len(request.tests)
    score = round((passed_count / total) * 100, 1) if total > 0 else 0.0

    return ExecuteResponse(
        results=results,
        summary=Summary(score=score, passed=passed_count, total=total),
        compilation_error=compilation_error,
    )