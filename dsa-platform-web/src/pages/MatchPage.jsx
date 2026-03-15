import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import TestAttempt from "../components/TestAttempt";
import api from "../services/api";

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

  if (testFromState) {
    return <TestAttempt test={testFromState} onBack={() => navigate("/")} />;
  }

  if (linkedTest) {
    return <TestAttempt test={linkedTest} onBack={() => navigate("/")} />;
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
