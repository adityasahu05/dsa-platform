// src/pages/StudentDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const LANGUAGES = [
  {
    id: "java",
    label: "Java",
    desc: "Solve curated Java problems and master the fundamentals.",
    color: "#f97316",
    bg: "#1a0a00",
    iconBg: "#f97316",
    icon: (
      <svg viewBox="0 0 128 128" width="32" height="32" fill="white">
        <path d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zM44.629 84.455s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
        <path d="M76.491 50.974s6.051 6.169-5.747 15.653c-9.489 7.422-2.165 11.653 0 16.478-5.479-4.947-9.496-9.313-6.806-13.37 3.959-6.288 14.923-9.342 12.553-18.761z"/>
        <path d="M82.441 113.148s3.529 2.91-3.888 5.159c-14.112 4.278-58.756 5.567-71.141.171-4.455-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.943-9.468z"/>
        <path d="M49.921 71.696s-22.667 5.396-8.032 7.35c6.188.828 18.518.638 30.01-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.556 3.238-54.731-2.958 10.832-5.239 19.644-4.645 19.644-4.645z"/>
        <path d="M85.28 36.452s12.94 12.951-12.275 32.866c-20.274 16.01-4.629 25.143-.006 35.564-11.834-10.677-20.508-20.092-14.685-28.839 8.544-12.822 32.19-19.03 26.966-39.591z"/>
      </svg>
    ),
  },
  {
    id: "python",
    label: "Python",
    desc: "Solve curated Python problems and master the fundamentals.",
    color: "#facc15",
    bg: "#1a1000",
    iconBg: "#facc15",
    icon: (
      <svg viewBox="0 0 128 128" width="32" height="32">
        <path d="M49.33 62h29.159C86.606 62 93 55.748 93 47.66V19.831C93 11.985 86.401 6.2 78.489 5.016 73.296 4.228 67.933 3.83 62.5 3.83c-5.465 0-10.861.398-16.087 1.191C38.369 6.237 35 11.162 35 19.831V62h14.33z" fill="white"/>
        <path d="M93 62v16.169C93 86.005 86.401 92.563 78.489 93.747 73.296 94.535 67.933 94.933 62.5 94.933c-5.465 0-10.861-.398-16.087-1.191C38.369 92.536 35 86.837 35 78.169V62H93z" fill="white" opacity="0.7"/>
        <circle cx="62.5" cy="34.417" r="6.25" fill="#facc15"/>
        <circle cx="62.5" cy="81.083" r="6.25" fill="#facc15"/>
      </svg>
    ),
  },
  {
    id: "c",
    label: "C",
    desc: "Solve curated C problems and master the fundamentals.",
    color: "#60a5fa",
    bg: "#001020",
    iconBg: "#3b82f6",
    icon: (
      <svg viewBox="0 0 128 128" width="32" height="32" fill="white">
        <path d="M64 4C33.07 4 8 29.07 8 60s25.07 56 56 56 56-25.07 56-56S94.93 4 64 4zm23.81 85.9C83.48 92.7 77.28 95 70.5 95c-8.4 0-15.5-2.92-21.3-8.75C43.4 80.42 40.5 73.33 40.5 65c0-8.54 2.9-15.73 8.71-21.58C55.01 37.57 62.11 34.7 70.5 34.7c6.59 0 12.62 2.19 18.1 6.58l-5.41 6.38C79.26 44.37 75.07 42.7 70.5 42.7c-5.83 0-10.64 2-14.41 6.02-3.77 4.01-5.59 8.73-5.59 14.78 0 6.05 1.82 11.06 5.45 15.04 3.63 3.98 8.44 5.96 14.41 5.96 4.93 0 9.2-1.71 12.82-5.13l5.64 6.68z"/>
      </svg>
    ),
  },
  {
    id: "cpp",
    label: "C++",
    desc: "Solve curated C++ problems and master the fundamentals.",
    color: "#a78bfa",
    bg: "#0d0020",
    iconBg: "#7c3aed",
    icon: (
      <svg viewBox="0 0 128 128" width="32" height="32" fill="white">
        <path d="M64 4C33.07 4 8 29.07 8 60s25.07 56 56 56 56-25.07 56-56S94.93 4 64 4zM56.5 85c-10.76-.13-18.5-9.33-18.5-20s7.74-19.87 18.5-20v10c-5 .37-8.5 4.72-8.5 10s3.5 9.63 8.5 10v10zm15-2v-8h-4v-6h4v-8h6v8h4v6h-4v8h-6zm14 0v-8h-4v-6h4v-8h6v8h4v6h-4v8h-6z"/>
      </svg>
    ),
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [testCode, setTestCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testPreview, setTestPreview] = useState(null);

  const handleFindTest = async () => {
    const code = testCode.trim();
    if (!code) return;
    setLoading(true);
    setError("");
    setTestPreview(null);
    try {
      const res = await fetch(`${API_BASE}/api/teacher/student/tests`);
      const tests = await res.json();
      const found = Array.isArray(tests)
        ? tests.find((t) => t.test_id === code || t.id === code)
        : null;
      if (found) {
        setTestPreview(found);
      } else {
        setError("No test found with that code. Please check and try again.");
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    }
    setLoading(false);
  };

  const handleBeginTest = () => {
    if (!testPreview) return;
    navigate("/test", { state: { test: testPreview } });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "white", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1f2937", padding: "16px 32px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 28, height: 28, background: "#ef4444", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>
          /
        </div>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          SlashCoder
        </span>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", minHeight: "calc(100vh - 61px)" }}>

        {/* ── LEFT: Practice ── */}
        <div style={{ padding: "48px 48px", borderRight: "1px solid #1f2937" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Practice Programming</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 36 }}>
            Choose your language and start solving structured problems
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => navigate(`/practice/${lang.id}`)}
                style={{
                  background: "#161b27",
                  border: "1px solid #1f2937",
                  borderRadius: 14,
                  padding: "24px 20px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "white",
                  transition: "border-color 0.2s, background 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = lang.color + "60";
                  e.currentTarget.style.background = "#1a2030";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1f2937";
                  e.currentTarget.style.background = "#161b27";
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: lang.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {lang.icon}
                </div>

                {/* Text */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{lang.label}</div>
                  <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
                    {lang.desc}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280", fontSize: 12 }}>Beginner Path</span>
                    <span style={{ color: lang.color, fontSize: 13, fontWeight: 600 }}>Start →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Test Entry ── */}
        <div style={{ padding: "48px 28px", background: "#0d1117" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Attempt a Test</h2>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>
            Enter the test ID shared by your teacher
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              value={testCode}
              onChange={(e) => { setTestCode(e.target.value); setError(""); setTestPreview(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleFindTest()}
              placeholder="e.g. test_abc123"
              style={{
                flex: 1, background: "#161b27", border: "1px solid #1f2937",
                borderRadius: 8, padding: "10px 14px", fontSize: 13,
                color: "white", outline: "none",
              }}
            />
            <button
              onClick={handleFindTest}
              disabled={loading || !testCode.trim()}
              style={{
                padding: "10px 18px", background: "#2563eb", border: "none",
                borderRadius: 8, color: "white", fontSize: 13, fontWeight: 600,
                cursor: loading || !testCode.trim() ? "not-allowed" : "pointer",
                opacity: loading || !testCode.trim() ? 0.5 : 1,
              }}
            >
              {loading ? "..." : "Find"}
            </button>
          </div>

          {error && (
            <div style={{
              color: "#f87171", fontSize: 13, background: "#1c0a0a",
              border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {testPreview && (
            <div style={{
              background: "#161b27", border: "1px solid #2563eb40",
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{testPreview.title}</div>
                  {testPreview.description && (
                    <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>{testPreview.description}</div>
                  )}
                </div>
                <span style={{
                  fontSize: 11, background: "#1e3a5f", color: "#60a5fa",
                  border: "1px solid #3b82f640", padding: "3px 10px", borderRadius: 20,
                }}>
                  Found ✓
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                {testPreview.duration && (
                  <div style={{ background: "#0d1117", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{testPreview.duration}</div>
                    <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>Minutes</div>
                  </div>
                )}
                {testPreview.questions && (
                  <div style={{ background: "#0d1117", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      {Array.isArray(testPreview.questions) ? testPreview.questions.length : testPreview.questions}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>Questions</div>
                  </div>
                )}
                {testPreview.language && (
                  <div style={{ background: "#0d1117", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, textTransform: "capitalize" }}>{testPreview.language}</div>
                    <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>Language</div>
                  </div>
                )}
              </div>

              <button
                onClick={handleBeginTest}
                style={{
                  width: "100%", padding: "12px", background: "#ef4444",
                  border: "none", borderRadius: 8, color: "white",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}
              >
                Begin Test →
              </button>
            </div>
          )}

          {!testPreview && !error && (
            <div style={{
              border: "1px dashed #1f2937", borderRadius: 12, padding: "40px 20px",
              textAlign: "center", color: "#374151", fontSize: 13,
            }}>
              Enter a test ID above to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
}