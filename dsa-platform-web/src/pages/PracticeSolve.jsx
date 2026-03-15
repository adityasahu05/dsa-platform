// // src/pages/PracticeSolve.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { API_BASE } from "../config";
// import { auth, db } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { motion, AnimatePresence } from "framer-motion";

// // ── Inline starter templates ──────────────────────────────────────────────────
// function getStarterTemplate(language) {
//   switch (language) {
//     case "python":
//       return `# Write your Python solution here\n`;
//     case "java":
//       return `public class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n`;
//     case "c":
//       return `#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n`;
//     case "cpp":
//       return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n`;
//     default:
//       return "";
//   }
// }

// // ── Inline Section component ──────────────────────────────────────────────────
// function Section({ title, children }) {
//   return (
//     <div className="mb-4">
//       <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
//         {title}
//       </div>
//       <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
//         {children}
//       </div>
//     </div>
//   );
// }

// // ── Inline CodeBlock component ────────────────────────────────────────────────
// function CodeBlock({ text }) {
//   return (
//     <pre className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/80 font-mono whitespace-pre-wrap">
//       {text || "—"}
//     </pre>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function PracticeSolve() {
//   const { pid, language: urlLang } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const resultRef = useRef(null);

//   const [problem, setProblem] = useState(location.state || null);
//   const [problemList, setProblemList] = useState([]);
//   const [completedProblems, setCompletedProblems] = useState([]);

//   const [language, setLanguage] = useState(urlLang || "python");
//   const [code, setCode] = useState("");
//   const [editorTheme] = useState("vs-dark");

//   const [runOutput, setRunOutput] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);

//   const [running, setRunning] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [execTime, setExecTime] = useState(null);

//   const [justSolved, setJustSolved] = useState(false);

//   useEffect(() => {
//     if (urlLang) setLanguage(urlLang.toLowerCase());
//   }, [urlLang]);

//   useEffect(() => {
//     setCode(getStarterTemplate(language));
//   }, [language]);

//   useEffect(() => {
//     setRunOutput(null);
//     setSubmitResult(null);
//     setExecTime(null);
//     setJustSolved(false);
//     setCode(getStarterTemplate(language));
//   }, [pid, language]);

//   useEffect(() => {
//     if (!auth.currentUser) return;
//     const ref = doc(db, "users", auth.currentUser.uid);
//     getDoc(ref).then((snap) => {
//       if (snap.exists()) {
//         setCompletedProblems(snap.data().practiceCompleted || []);
//       }
//     });
//   }, []);

//   const isCompleted = completedProblems.includes(pid) || justSolved;

//   useEffect(() => {
//     if (!pid || !urlLang) return;
//     fetch(`${API_BASE}/api/practice/problems/${urlLang}`)
//       .then((r) => r.json())
//       .then((list) => {
//         if (Array.isArray(list)) {
//           setProblemList(list);
//           const found = list.find((p) => p.id === pid);
//           setProblem(found || null);
//         }
//       });
//   }, [pid, urlLang]);

//   const currentIndex = problemList.findIndex((p) => p.id === pid);
//   const previousProblem = problemList[currentIndex - 1];

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       resultRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   const handleRun = async () => {
//     if (!problem) return;
//     setRunning(true);
//     setRunOutput(null);
//     setExecTime(null);
//     const start = performance.now();
//     try {
//       const res = await fetch(`${API_BASE}/api/practice/run`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ language, code, stdin: problem.sample_input || "" }),
//       });
//       const data = await res.json();
//       setExecTime(((performance.now() - start) / 1000).toFixed(3));
//       setRunOutput(data.stdout || data.error || "No output");
//       scrollToBottom();
//     } catch {
//       setRunOutput("Error running code.");
//       scrollToBottom();
//     }
//     setRunning(false);
//   };

//   const handleSubmit = async () => {
//     if (!auth.currentUser) return alert("Login required");
//     if (isCompleted) return;
//     setSubmitting(true);
//     setSubmitResult(null);
//     setExecTime(null);
//     const start = performance.now();
//     try {
//       const res = await fetch(`${API_BASE}/api/practice/submit`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ uid: auth.currentUser.uid, pid, language, code }),
//       });
//       const data = await res.json();
//       setExecTime(((performance.now() - start) / 1000).toFixed(3));
//       setSubmitResult(data);
//       if (data.completed && !data.already_solved) {
//         setJustSolved(true);
//         setCompletedProblems((prev) => [...prev, pid]);
//       }
//       scrollToBottom();
//     } catch {
//       alert("Submission failed.");
//       scrollToBottom();
//     }
//     setSubmitting(false);
//   };

//   const goToNextQuestion = () => {
//     const next = problemList[currentIndex + 1];
//     if (next) navigate(`/practice/${urlLang}/${next.id}`);
//   };

//   const goToPreviousQuestion = () => {
//     if (previousProblem) navigate(`/practice/${urlLang}/${previousProblem.id}`);
//   };

//   if (!problem) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#0b0f19] text-white">
//         Loading problem...
//       </div>
//     );
//   }

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={pid}
//         initial={{ opacity: 0, x: 40 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: -40 }}
//         transition={{ duration: 0.25 }}
//         className="min-h-screen flex flex-col lg:flex-row bg-[#0b0f19] text-white"
//       >
//         {/* ── LEFT PANEL ── */}
//         <div className="w-full lg:w-[420px] border-r border-white/10 bg-[#121826] p-6 overflow-y-auto">
//           <div className="flex justify-between mb-4">
//             <button
//               onClick={goToPreviousQuestion}
//               disabled={!previousProblem}
//               className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
//             >
//               ← Previous
//             </button>
//             <button
//               onClick={goToNextQuestion}
//               disabled={!problemList[currentIndex + 1]}
//               className="px-3 py-1 bg-green-600 rounded hover:brightness-110 disabled:opacity-40"
//             >
//               Next →
//             </button>
//           </div>

//           <button
//             onClick={() => navigate(`/practice/${urlLang}`)}
//             className="mb-4 px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-sm"
//           >
//             ← Back to Problems
//           </button>

//           <h1 className="text-2xl font-bold">{problem.title}</h1>
//           <div className="text-sm text-white/60 mb-2">{problem.difficulty}</div>

//           {isCompleted && (
//             <div className="bg-green-600 text-xs px-3 py-1 rounded-full inline-block mb-4">
//               ✔ Solved
//             </div>
//           )}

//           <Section title="Task">{problem.task}</Section>
//           <Section title="Input Format">{problem.input_format}</Section>
//           <Section title="Output Format">{problem.output_format}</Section>
//           <Section title="Sample Input">
//             <CodeBlock text={problem.sample_input} />
//           </Section>
//           <Section title="Sample Output">
//             <CodeBlock text={problem.sample_output} />
//           </Section>
//         </div>

//         {/* ── RIGHT PANEL ── */}
//         <div className="flex-1 flex flex-col">
//           <div className="flex gap-3 p-4 border-b border-white/10 bg-[#111827]">
//             <button
//               onClick={handleRun}
//               disabled={running}
//               className="px-4 py-2 bg-[#ff4655] rounded hover:brightness-110 disabled:opacity-60"
//             >
//               {running ? "Running..." : "▶ Run"}
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={submitting || isCompleted}
//               className={`px-4 py-2 rounded ${
//                 isCompleted ? "bg-gray-600 cursor-not-allowed" : "bg-[#2b7cff] hover:brightness-110"
//               }`}
//             >
//               {isCompleted ? "Already Solved" : submitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>

//           <div className="flex-1" style={{ minHeight: 0 }}>
//             <Editor
//               height="100%"
//               language={language === "cpp" ? "cpp" : language}
//               value={code}
//               onChange={(v) => setCode(v || "")}
//               theme={editorTheme}
//               options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
//             />
//           </div>

//           {(runOutput || submitResult) && (
//             <div
//               ref={resultRef}
//               className="border-t border-white/10 p-4 bg-[#111827] max-h-[320px] overflow-y-auto"
//             >
//               {execTime && (
//                 <div className="text-sm text-white/60 mb-2">⏱ Execution Time: {execTime}s</div>
//               )}

//               {runOutput && (
//                 <div className="mb-4">
//                   <div className="font-semibold mb-1">Run Output</div>
//                   <pre className="bg-black/40 p-3 rounded text-sm">{runOutput}</pre>
//                 </div>
//               )}

//               {submitResult && (
//                 <>
//                   <div className="font-semibold mb-3 text-lg">
//                     Passed {submitResult.passed} / {submitResult.total}
//                   </div>

//                   {submitResult.completed && !submitResult.already_solved && (
//                     <div className="mb-3 text-green-400 font-semibold">
//                       🎉 +{submitResult.xp_gain} XP Awarded
//                     </div>
//                   )}
//                   {submitResult.completed && submitResult.already_solved && (
//                     <div className="mb-3 text-yellow-400 font-semibold">
//                       ✔ Already Solved — No XP
//                     </div>
//                   )}

//                   {submitResult.results?.map((t, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded mb-2 border ${
//                         t.passed
//                           ? "bg-green-900/30 border-green-400"
//                           : "bg-red-900/30 border-red-400"
//                       }`}
//                     >
//                       <div className="font-bold">
//                         Test Case {t.index} — {t.passed ? "PASSED ✅" : "FAILED ❌"}
//                       </div>
//                       {!t.passed && (
//                         <div className="text-sm mt-2">
//                           <div><strong>Expected:</strong> {t.expected}</div>
//                           <div><strong>Got:</strong> {t.got}</div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }



import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { API_BASE } from "../config";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

function getStarterTemplate(language) {
  switch (language) {
    case "python":
      return "# Write your Python solution here\n";
    case "java":
      return "public class Main {\n  public static void main(String[] args) {\n    // Write your Java solution here\n  }\n}\n";
    case "c":
      return "#include <stdio.h>\n\nint main() {\n  // Write your C solution here\n  return 0;\n}\n";
    case "cpp":
      return "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your C++ solution here\n  return 0;\n}\n";
    default:
      return "";
  }
}

function Section({ title, children }) {
  return (
    <div className="ps-section">
      <div className="ps-section-title">{title}</div>
      <div className="ps-section-body">{children}</div>
    </div>
  );
}

function CodeBlock({ text }) {
  return <pre className="ps-code">{text || "-"}</pre>;
}

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
      <div className="ps-loading">Loading problem...</div>
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
        className="ps-root"
      >
        <style>{`
          @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap");
          .ps-root {
            min-height: 100vh;
            background: #0b0f19;
            color: #e5e7eb;
            font-family: "Sora", "Segoe UI", sans-serif;
            display: flex;
            flex-direction: column;
          }
          .ps-layout {
            display: grid;
            grid-template-columns: 380px minmax(0, 1fr);
            gap: 0;
            flex: 1;
          }
          .ps-sidebar {
            border-right: 1px solid rgba(148,163,184,0.2);
            background: rgba(15,23,42,0.95);
            padding: 20px;
            overflow-y: auto;
          }
          .ps-main {
            display: flex;
            flex-direction: column;
          }
          .ps-toolbar {
            display: flex;
            gap: 10px;
            align-items: center;
            padding: 14px 18px;
            border-bottom: 1px solid rgba(148,163,184,0.2);
            background: rgba(9,12,24,0.95);
          }
          .ps-btn {
            padding: 8px 14px;
            border-radius: 10px;
            border: 1px solid rgba(148,163,184,0.2);
            background: transparent;
            color: #e2e8f0;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
          }
          .ps-btn.primary {
            background: linear-gradient(120deg, #2563eb, #1d4ed8);
            border: none;
            color: #fff;
          }
          .ps-section {
            margin-bottom: 16px;
          }
          .ps-section-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: rgba(148,163,184,0.7);
            margin-bottom: 6px;
          }
          .ps-section-body {
            font-size: 14px;
            color: rgba(226,232,240,0.85);
            line-height: 1.6;
            white-space: pre-wrap;
          }
          .ps-code {
            background: rgba(2,6,23,0.8);
            border: 1px solid rgba(148,163,184,0.2);
            border-radius: 12px;
            padding: 12px;
            font-size: 12px;
            color: #e2e8f0;
            white-space: pre-wrap;
          }
          .ps-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .ps-meta {
            font-size: 12px;
            color: rgba(226,232,240,0.6);
            margin-bottom: 10px;
          }
          .ps-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            background: rgba(34,197,94,0.15);
            color: #22c55e;
            margin-bottom: 12px;
          }
          .ps-output {
            border-top: 1px solid rgba(148,163,184,0.2);
            background: rgba(9,12,24,0.95);
            padding: 16px;
            max-height: 300px;
            overflow-y: auto;
          }
          .ps-output pre {
            white-space: pre-wrap;
          }
          .ps-loading {
            min-height: 100vh;
            background: #0b0f19;
            color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Sora", "Segoe UI", sans-serif;
          }
          @media (max-width: 960px) {
            .ps-layout {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="ps-layout">
          <div className="ps-sidebar">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <button className="ps-btn" onClick={goToPreviousQuestion} disabled={!previousProblem}>
                Prev
              </button>
              <button className="ps-btn" onClick={goToNextQuestion} disabled={!problemList[currentIndex + 1]}>
                Next
              </button>
            </div>

            <button className="ps-btn" onClick={() => navigate(`/practice/${urlLang}`)} style={{ marginBottom: 12 }}>
              Back to Problems
            </button>

            <div className="ps-title">{problem.title}</div>
            <div className="ps-meta">{problem.difficulty}</div>
            {isCompleted && <div className="ps-badge">Solved</div>}

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

          <div className="ps-main">
            <div className="ps-toolbar">
              <button className="ps-btn primary" onClick={handleRun} disabled={running}>
                {running ? "Running..." : "Run"}
              </button>
              <button className="ps-btn" onClick={handleSubmit} disabled={submitting || isCompleted}>
                {isCompleted ? "Already Solved" : submitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
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
              <div ref={resultRef} className="ps-output">
                {execTime && (
                  <div style={{ fontSize: 12, color: "rgba(226,232,240,0.6)", marginBottom: 8 }}>
                    Execution Time: {execTime}s
                  </div>
                )}

                {runOutput && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Run Output</div>
                    <pre className="ps-code">{runOutput}</pre>
                  </div>
                )}

                {submitResult && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
                      Passed {submitResult.passed} / {submitResult.total}
                    </div>

                    {submitResult.completed && !submitResult.already_solved && (
                      <div style={{ color: "#22c55e", fontWeight: 600, marginBottom: 10 }}>
                        XP Awarded: {submitResult.xp_gain}
                      </div>
                    )}
                    {submitResult.completed && submitResult.already_solved && (
                      <div style={{ color: "#facc15", fontWeight: 600, marginBottom: 10 }}>
                        Already Solved - No XP
                      </div>
                    )}

                    {submitResult.results?.map((t, i) => (
                      <div
                        key={i}
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: `1px solid ${t.passed ? "rgba(34,197,94,0.5)" : "rgba(248,113,113,0.5)"}`,
                          background: t.passed ? "rgba(22,163,74,0.12)" : "rgba(127,29,29,0.2)",
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>
                          Test Case {t.index} - {t.passed ? "PASSED" : "FAILED"}
                        </div>
                        {!t.passed && (
                          <div style={{ fontSize: 12 }}>
                            <div>Expected: {t.expected}</div>
                            <div>Got: {t.got}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
