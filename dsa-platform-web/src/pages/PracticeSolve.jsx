// src/pages/PracticeSolve.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { API_BASE } from "../config";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// ── Inline starter templates ──────────────────────────────────────────────────
function getStarterTemplate(language) {
  switch (language) {
    case "python":
      return `# Write your Python solution here\n`;
    case "java":
      return `public class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n`;
    case "c":
      return `#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n`;
    case "cpp":
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n`;
    default:
      return "";
  }
}

// ── Inline Section component ──────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
        {title}
      </div>
      <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

// ── Inline CodeBlock component ────────────────────────────────────────────────
function CodeBlock({ text }) {
  return (
    <pre className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/80 font-mono whitespace-pre-wrap">
      {text || "—"}
    </pre>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PracticeSolve() {
  const { pid, language: urlLang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const resultRef = useRef(null);

  const [problem, setProblem] = useState(location.state || null);
  const [problemList, setProblemList] = useState([]);
  const [completedProblems, setCompletedProblems] = useState([]);

  const [language, setLanguage] = useState(urlLang || "python");
  const [code, setCode] = useState("");
  const [editorTheme] = useState("vs-dark");

  const [runOutput, setRunOutput] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [execTime, setExecTime] = useState(null);

  const [justSolved, setJustSolved] = useState(false);

  useEffect(() => {
    if (urlLang) setLanguage(urlLang.toLowerCase());
  }, [urlLang]);

  useEffect(() => {
    setCode(getStarterTemplate(language));
  }, [language]);

  useEffect(() => {
    setRunOutput(null);
    setSubmitResult(null);
    setExecTime(null);
    setJustSolved(false);
    setCode(getStarterTemplate(language));
  }, [pid, language]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const ref = doc(db, "users", auth.currentUser.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setCompletedProblems(snap.data().practiceCompleted || []);
      }
    });
  }, []);

  const isCompleted = completedProblems.includes(pid) || justSolved;

  useEffect(() => {
    if (!pid || !urlLang) return;
    fetch(`${API_BASE}/api/practice/problems/${urlLang}`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) {
          setProblemList(list);
          const found = list.find((p) => p.id === pid);
          setProblem(found || null);
        }
      });
  }, [pid, urlLang]);

  const currentIndex = problemList.findIndex((p) => p.id === pid);
  const previousProblem = problemList[currentIndex - 1];

  const scrollToBottom = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleRun = async () => {
    if (!problem) return;
    setRunning(true);
    setRunOutput(null);
    setExecTime(null);
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/practice/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, stdin: problem.sample_input || "" }),
      });
      const data = await res.json();
      setExecTime(((performance.now() - start) / 1000).toFixed(3));
      setRunOutput(data.stdout || data.error || "No output");
      scrollToBottom();
    } catch {
      setRunOutput("Error running code.");
      scrollToBottom();
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return alert("Login required");
    if (isCompleted) return;
    setSubmitting(true);
    setSubmitResult(null);
    setExecTime(null);
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/practice/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: auth.currentUser.uid, pid, language, code }),
      });
      const data = await res.json();
      setExecTime(((performance.now() - start) / 1000).toFixed(3));
      setSubmitResult(data);
      if (data.completed && !data.already_solved) {
        setJustSolved(true);
        setCompletedProblems((prev) => [...prev, pid]);
      }
      scrollToBottom();
    } catch {
      alert("Submission failed.");
      scrollToBottom();
    }
    setSubmitting(false);
  };

  const goToNextQuestion = () => {
    const next = problemList[currentIndex + 1];
    if (next) navigate(`/practice/${urlLang}/${next.id}`);
  };

  const goToPreviousQuestion = () => {
    if (previousProblem) navigate(`/practice/${urlLang}/${previousProblem.id}`);
  };

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0f19] text-white">
        Loading problem...
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pid}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen flex flex-col lg:flex-row bg-[#0b0f19] text-white"
      >
        {/* ── LEFT PANEL ── */}
        <div className="w-full lg:w-[420px] border-r border-white/10 bg-[#121826] p-6 overflow-y-auto">
          <div className="flex justify-between mb-4">
            <button
              onClick={goToPreviousQuestion}
              disabled={!previousProblem}
              className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={goToNextQuestion}
              disabled={!problemList[currentIndex + 1]}
              className="px-3 py-1 bg-green-600 rounded hover:brightness-110 disabled:opacity-40"
            >
              Next →
            </button>
          </div>

          <button
            onClick={() => navigate(`/practice/${urlLang}`)}
            className="mb-4 px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-sm"
          >
            ← Back to Problems
          </button>

          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="text-sm text-white/60 mb-2">{problem.difficulty}</div>

          {isCompleted && (
            <div className="bg-green-600 text-xs px-3 py-1 rounded-full inline-block mb-4">
              ✔ Solved
            </div>
          )}

          <Section title="Task">{problem.task}</Section>
          <Section title="Input Format">{problem.input_format}</Section>
          <Section title="Output Format">{problem.output_format}</Section>
          <Section title="Sample Input">
            <CodeBlock text={problem.sample_input} />
          </Section>
          <Section title="Sample Output">
            <CodeBlock text={problem.sample_output} />
          </Section>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col">
          <div className="flex gap-3 p-4 border-b border-white/10 bg-[#111827]">
            <button
              onClick={handleRun}
              disabled={running}
              className="px-4 py-2 bg-[#ff4655] rounded hover:brightness-110 disabled:opacity-60"
            >
              {running ? "Running..." : "▶ Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || isCompleted}
              className={`px-4 py-2 rounded ${
                isCompleted ? "bg-gray-600 cursor-not-allowed" : "bg-[#2b7cff] hover:brightness-110"
              }`}
            >
              {isCompleted ? "Already Solved" : submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          <div className="flex-1" style={{ minHeight: 0 }}>
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme={editorTheme}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
            />
          </div>

          {(runOutput || submitResult) && (
            <div
              ref={resultRef}
              className="border-t border-white/10 p-4 bg-[#111827] max-h-[320px] overflow-y-auto"
            >
              {execTime && (
                <div className="text-sm text-white/60 mb-2">⏱ Execution Time: {execTime}s</div>
              )}

              {runOutput && (
                <div className="mb-4">
                  <div className="font-semibold mb-1">Run Output</div>
                  <pre className="bg-black/40 p-3 rounded text-sm">{runOutput}</pre>
                </div>
              )}

              {submitResult && (
                <>
                  <div className="font-semibold mb-3 text-lg">
                    Passed {submitResult.passed} / {submitResult.total}
                  </div>

                  {submitResult.completed && !submitResult.already_solved && (
                    <div className="mb-3 text-green-400 font-semibold">
                      🎉 +{submitResult.xp_gain} XP Awarded
                    </div>
                  )}
                  {submitResult.completed && submitResult.already_solved && (
                    <div className="mb-3 text-yellow-400 font-semibold">
                      ✔ Already Solved — No XP
                    </div>
                  )}

                  {submitResult.results?.map((t, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded mb-2 border ${
                        t.passed
                          ? "bg-green-900/30 border-green-400"
                          : "bg-red-900/30 border-red-400"
                      }`}
                    >
                      <div className="font-bold">
                        Test Case {t.index} — {t.passed ? "PASSED ✅" : "FAILED ❌"}
                      </div>
                      {!t.passed && (
                        <div className="text-sm mt-2">
                          <div><strong>Expected:</strong> {t.expected}</div>
                          <div><strong>Got:</strong> {t.got}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}