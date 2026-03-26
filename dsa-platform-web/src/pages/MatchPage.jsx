import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import TestAttempt from "../components/TestAttempt";
import api from "../services/api";

const INSTRUCTION_SECONDS = 60;

function formatCountdown(sec) {
  const total = Math.max(0, Number(sec) || 0);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function TestInstructionsGate({ test, onBegin, onBack }) {
  const [secondsLeft, setSecondsLeft] = useState(INSTRUCTION_SECONDS);
  const [startedAtMs, setStartedAtMs] = useState(null);
  const [agree, setAgree] = useState(false);

  const storageKey = test?.id ? `pretest_instruction_${test.id}` : null;

  useEffect(() => {
    if (!test?.id || !storageKey) return;
    const storedRaw = sessionStorage.getItem(storageKey);
    const stored = storedRaw ? Number(storedRaw) : NaN;
    const now = Date.now();
    const startMs = Number.isFinite(stored) ? stored : now;
    setStartedAtMs(startMs);
    if (!Number.isFinite(stored)) sessionStorage.setItem(storageKey, String(startMs));
  }, [test?.id, storageKey]);

  useEffect(() => {
    if (!startedAtMs) return;
    const update = () => {
      const elapsedSec = Math.floor((Date.now() - startedAtMs) / 1000);
      const remaining = Math.max(0, INSTRUCTION_SECONDS - elapsedSec);
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        if (storageKey) sessionStorage.removeItem(storageKey);
        onBegin();
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startedAtMs, onBegin, storageKey]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "radial-gradient(circle at top, rgba(37,99,235,0.15), transparent 55%), #0b0f19",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        overflowY: "auto",
        fontFamily: "\"Sora\", \"Segoe UI\", sans-serif",
      }}
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap");
        .intro-card {
          width: 100%;
          max-width: 760px;
          background: rgba(15,23,42,0.96);
          border: 1px solid rgba(148,163,184,0.2);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 24px 60px rgba(15,23,42,0.5);
          color: #e2e8f0;
        }
        .intro-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .intro-timer {
          min-width: 92px;
          text-align: center;
          background: rgba(37,99,235,0.14);
          border: 1px solid rgba(96,165,250,0.45);
          border-radius: 12px;
          padding: 8px 10px;
        }
        .intro-list {
          margin: 0;
          margin-top: 10px;
          padding-left: 18px;
          color: rgba(226,232,240,0.88);
          font-size: 13px;
          line-height: 1.65;
        }
        .intro-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin: 14px 0;
        }
        .intro-box {
          border: 1px solid rgba(148,163,184,0.22);
          border-radius: 10px;
          padding: 10px 12px;
          background: rgba(30,41,59,0.7);
        }
        .intro-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .intro-btn {
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        @media (max-width: 760px) {
          .intro-meta { grid-template-columns: 1fr; }
          .intro-head { flex-direction: column; }
          .intro-timer { width: 100%; }
          .intro-card {
            margin: auto 0;
          }
        }
      `}</style>

      <div className="intro-card">
        <div className="intro-head">
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.4px", color: "rgba(148,163,184,0.95)" }}>
              Pre-Test Instructions
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{test.title}</div>
            <div style={{ marginTop: 4, color: "rgba(148,163,184,0.95)", fontSize: 13 }}>
              Read instructions carefully. Test starts automatically after countdown.
            </div>
          </div>
          <div className="intro-timer">
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", color: "#93c5fd" }}>Starts In</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#dbeafe", lineHeight: 1.1 }}>{formatCountdown(secondsLeft)}</div>
          </div>
        </div>

        <div className="intro-meta">
          <div className="intro-box">
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Duration</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{test.duration_minutes || 60} min</div>
          </div>
          <div className="intro-box">
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Languages</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {(test.allowed_languages || []).map((l) => (l === "cpp" ? "C++" : l.toUpperCase())).join(", ") || "Python"}
            </div>
          </div>
          <div className="intro-box">
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Mode</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{test.test_type === "public" ? "Public" : "Invite Only"}</div>
          </div>
        </div>

        <div style={{ border: "1px solid rgba(148,163,184,0.22)", borderRadius: 10, padding: "12px 14px", background: "rgba(15,23,42,0.55)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Important Rules</div>
          <ul className="intro-list">
            <li>Do not switch tabs/windows during the test.</li>
            <li>Copy/paste can be restricted based on teacher settings.</li>
            <li>Each question can be submitted only once.</li>
            <li>Timer starts when the test opens and cannot be paused.</li>
            <li>Stable internet connection is strongly recommended.</li>
          </ul>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13, color: "rgba(226,232,240,0.95)" }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          I have read and understood the instructions.
        </label>

        <div className="intro-actions">
          <button className="intro-btn" onClick={onBack} style={{ background: "transparent", color: "#cbd5e1", border: "1px solid rgba(148,163,184,0.35)" }}>
            Back
          </button>
          <button
            className="intro-btn"
            onClick={() => {
              if (storageKey) sessionStorage.removeItem(storageKey);
              onBegin();
            }}
            disabled={!agree}
            style={{
              background: !agree ? "rgba(37,99,235,0.45)" : "linear-gradient(120deg, #2563eb, #1d4ed8)",
              color: "#fff",
              opacity: !agree ? 0.6 : 1,
              cursor: !agree ? "not-allowed" : "pointer",
            }}
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const testFromState = location.state?.test;
  const codeFromQuery =
    searchParams.get("code") || searchParams.get("test") || searchParams.get("uid");
  const lookupCode = params.code || codeFromQuery;

  const [linkedTest, setLinkedTest] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [canBegin, setCanBegin] = useState(false);

  useEffect(() => {
    let ignore = false;
    const runLookup = async () => {
      if (!lookupCode || testFromState) return;
      setLinkLoading(true);
      setLinkError("");
      try {
        const found = await api.getTestByCode(lookupCode);
        if (!ignore) setLinkedTest(found);
      } catch (err) {
        if (!ignore) {
          setLinkError(
            err?.response?.status === 404
              ? "No test found for that link or code."
              : "Could not load the test. Please try again."
          );
        }
      } finally {
        if (!ignore) setLinkLoading(false);
      }
    };
    runLookup();
    return () => {
      ignore = true;
    };
  }, [lookupCode, testFromState]);

  const handleManualLookup = async () => {
    const code = manualCode.trim();
    if (!code) return;
    setLinkLoading(true);
    setLinkError("");
    try {
      const found = await api.getTestByCode(code);
      setLinkedTest(found);
    } catch (err) {
      setLinkError(
        err?.response?.status === 404
          ? "No test found for that link or code."
          : "Could not load the test. Please try again."
      );
    } finally {
      setLinkLoading(false);
    }
  };

  const resolvedTest = testFromState || linkedTest;
  useEffect(() => {
    if (!resolvedTest?.id) {
      setCanBegin(false);
      return;
    }
    const startedKey = `pretest_started_${resolvedTest.id}`;
    setCanBegin(sessionStorage.getItem(startedKey) === "1");
  }, [resolvedTest?.id]);

  if (resolvedTest && canBegin) {
    return <TestAttempt test={resolvedTest} onBack={() => navigate("/")} />;
  }
  if (resolvedTest && !canBegin) {
    return (
      <TestInstructionsGate
        test={resolvedTest}
        onBegin={() => {
          sessionStorage.setItem(`pretest_started_${resolvedTest.id}`, "1");
          setCanBegin(true);
        }}
        onBack={() => {
          sessionStorage.removeItem(`pretest_instruction_${resolvedTest.id}`);
          sessionStorage.removeItem(`pretest_started_${resolvedTest.id}`);
          navigate("/");
        }}
      />
    );
  }

  return (
    <div className="match-landing">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap");
        .match-landing {
          min-height: 100vh;
          background: radial-gradient(circle at top, rgba(37,99,235,0.15), transparent 55%), #0b0f19;
          color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Sora", "Segoe UI", sans-serif;
          padding: 24px;
        }
        .match-card {
          width: 100%;
          max-width: 560px;
          background: rgba(15,23,42,0.95);
          border: 1px solid rgba(148,163,184,0.2);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 24px 60px rgba(15,23,42,0.45);
        }
        .match-title {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .match-subtitle {
          color: rgba(226,232,240,0.7);
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .match-input {
          width: 100%;
          background: rgba(30,41,59,0.9);
          border: 1px solid rgba(148,163,184,0.3);
          border-radius: 12px;
          padding: 12px 14px;
          color: #e2e8f0;
          font-size: 14px;
        }
        .match-actions {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .match-button {
          flex: 1;
          padding: 10px 14px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        .match-button.primary {
          background: linear-gradient(120deg, #2563eb, #1d4ed8);
          color: #fff;
        }
        .match-button.ghost {
          background: transparent;
          color: #e2e8f0;
          border: 1px solid rgba(148,163,184,0.3);
        }
        .match-status {
          margin-top: 12px;
          font-size: 13px;
          color: #fca5a5;
        }
        .match-note {
          margin-top: 16px;
          font-size: 12px;
          color: rgba(226,232,240,0.6);
        }
      `}</style>

      <div className="match-card">
        <div className="match-title">Assignment Match</div>
        <div className="match-subtitle">
          Enter the test code or paste the shared link code to start solving. This page
          always loads the official test created by the teacher.
        </div>

        <input
          className="match-input"
          placeholder="Enter test code or UID"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
        />

        <div className="match-actions">
          <button className="match-button primary" onClick={handleManualLookup} disabled={linkLoading}>
            {linkLoading ? "Loading..." : "Start Test"}
          </button>
          <button className="match-button ghost" onClick={() => navigate("/")}>Back</button>
        </div>

        {linkError && <div className="match-status">{linkError}</div>}
        <div className="match-note">Supports codes from teacher-created tests.</div>
      </div>
    </div>
  );
}
