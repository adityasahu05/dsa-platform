// // src/pages/PracticeProblems.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { API_BASE } from "../config";
// import { auth, db } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";

// const LANG_META = {
//   python: { label: "Python Practice", color: "#facc15" },
//   java:   { label: "Java Practice",   color: "#f97316" },
//   c:      { label: "C Practice",      color: "#60a5fa" },
//   cpp:    { label: "C++ Practice",    color: "#a78bfa" },
// };

// const DIFFICULTY_ORDER = ["Very Easy", "Easy", "Medium", "Hard"];

// export default function PracticeProblems() {
//   const { language } = useParams();
//   const navigate = useNavigate();

//   const [problems, setProblems] = useState([]);
//   const [completedProblems, setCompletedProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   // openState: { [topic]: { open: bool, [difficulty]: bool } }
//   const [openState, setOpenState] = useState({});

//   const meta = LANG_META[language] || { label: `${language} Practice`, color: "#fff" };

//   useEffect(() => {
//     setLoading(true);
//     fetch(`${API_BASE}/api/practice/problems/${language}`)
//       .then((r) => r.json())
//       .then((list) => {
//         if (Array.isArray(list)) setProblems(list);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [language]);

//   useEffect(() => {
//     if (!auth.currentUser) return;
//     const ref = doc(db, "users", auth.currentUser.uid);
//     getDoc(ref).then((snap) => {
//       if (snap.exists()) {
//         setCompletedProblems(snap.data().practiceCompleted || []);
//       }
//     });
//   }, []);

//   // Group problems: { [topic]: { [difficulty]: [problem, ...] } }
//   const grouped = problems.reduce((acc, p) => {
//     const topic = p.topic || "General";
//     const diff  = p.difficulty || "Easy";
//     if (!acc[topic]) acc[topic] = {};
//     if (!acc[topic][diff]) acc[topic][diff] = [];
//     acc[topic][diff].push(p);
//     return acc;
//   }, {});

//   const toggleTopic = (topic) => {
//     setOpenState((prev) => ({
//       ...prev,
//       [topic]: { ...prev[topic], open: !prev[topic]?.open },
//     }));
//   };

//   const toggleDifficulty = (topic, diff) => {
//     setOpenState((prev) => ({
//       ...prev,
//       [topic]: {
//         ...prev[topic],
//         [diff]: !prev[topic]?.[diff],
//       },
//     }));
//   };

//   const filteredTopics = Object.keys(grouped).filter((topic) => {
//     if (!search) return true;
//     return (
//       topic.toLowerCase().includes(search.toLowerCase()) ||
//       Object.values(grouped[topic])
//         .flat()
//         .some((p) => p.title.toLowerCase().includes(search.toLowerCase()))
//     );
//   });

//   return (
//     <div className="min-h-screen bg-[#0b0f19] text-white">
//       {/* Header */}
//       <div className="max-w-4xl mx-auto px-6 py-10">
//         <button
//           onClick={() => navigate("/")}
//           className="text-white/40 hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors"
//         >
//           ← Back to Dashboard
//         </button>

//         <h1 className="text-3xl font-bold mb-1" style={{ color: meta.color }}>
//           {meta.label}
//         </h1>
//         <p className="text-white/40 text-sm mb-6">Structured roadmap by topic and difficulty</p>

//         {/* Search */}
//         <div className="relative mb-8">
//           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search problems..."
//             className="w-full bg-[#111827] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
//           />
//         </div>

//         {loading ? (
//           <div className="text-center text-white/40 py-20">Loading problems...</div>
//         ) : (
//           <div className="space-y-3">
//             {filteredTopics.map((topic) => {
//               const isTopicOpen = openState[topic]?.open ?? false;
//               const topicProblems = Object.values(grouped[topic]).flat();
//               const solvedCount = topicProblems.filter((p) =>
//                 completedProblems.includes(p.id)
//               ).length;

//               return (
//                 <div
//                   key={topic}
//                   className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden"
//                 >
//                   {/* Topic header */}
//                   <button
//                     onClick={() => toggleTopic(topic)}
//                     className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors text-left"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="font-semibold text-base">{topic}</span>
//                       {solvedCount > 0 && (
//                         <span className="text-xs bg-green-900/40 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
//                           {solvedCount}/{topicProblems.length} solved
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-white/40 text-lg">{isTopicOpen ? "∨" : "›"}</span>
//                   </button>

//                   {/* Difficulties */}
//                   {isTopicOpen && (
//                     <div className="border-t border-white/5">
//                       {DIFFICULTY_ORDER.filter((d) => grouped[topic][d]).map((diff) => {
//                         const isDiffOpen = openState[topic]?.[diff] ?? false;
//                         const diffProblems = grouped[topic][diff] || [];
//                         const diffSolved = diffProblems.filter((p) =>
//                           completedProblems.includes(p.id)
//                         ).length;

//                         const diffColor =
//                           diff === "Very Easy" ? "#4ade80"
//                           : diff === "Easy"     ? "#86efac"
//                           : diff === "Medium"   ? "#facc15"
//                           : "#f87171";

//                         return (
//                           <div key={diff}>
//                             <button
//                               onClick={() => toggleDifficulty(topic, diff)}
//                               className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors text-left"
//                             >
//                               <span className="text-sm font-medium" style={{ color: diffColor }}>
//                                 {diff}
//                                 <span className="text-white/30 ml-2 font-normal">
//                                   ({diffSolved}/{diffProblems.length})
//                                 </span>
//                               </span>
//                               <span className="text-white/30 text-sm">
//                                 {isDiffOpen ? "∨" : "›"}
//                               </span>
//                             </button>

//                             {isDiffOpen && (
//                               <div className="border-t border-white/5">
//                                 {diffProblems.map((problem) => {
//                                   const solved = completedProblems.includes(problem.id);
//                                   return (
//                                     <div
//                                       key={problem.id}
//                                       className="flex items-center justify-between px-6 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
//                                     >
//                                       <div className="flex items-center gap-3">
//                                         {solved ? (
//                                           <span className="text-green-400 text-sm">✔</span>
//                                         ) : (
//                                           <span className="w-4 h-4 rounded-full border border-white/20 inline-block" />
//                                         )}
//                                         <span className={`text-sm ${solved ? "text-white/40 line-through" : "text-white/80"}`}>
//                                           {problem.title}
//                                         </span>
//                                       </div>
//                                       <button
//                                         onClick={() =>
//                                           navigate(`/practice/${language}/${problem.id}`, {
//                                             state: problem,
//                                           })
//                                         }
//                                         className="text-xs px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
//                                         style={{
//                                           background: `${diffColor}20`,
//                                           color: diffColor,
//                                           border: `1px solid ${diffColor}30`,
//                                         }}
//                                       >
//                                         {solved ? "Review" : "Start →"}
//                                       </button>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const LANG_META = {
  python: { label: "Python Practice", color: "#facc15" },
  java: { label: "Java Practice", color: "#f97316" },
  c: { label: "C Practice", color: "#60a5fa" },
  cpp: { label: "C++ Practice", color: "#a78bfa" },
};

const DIFFICULTY_ORDER = ["Very Easy", "Easy", "Medium", "Hard"];

export default function PracticeProblems() {
  const { language } = useParams();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [completedProblems, setCompletedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openState, setOpenState] = useState({});

  const meta = LANG_META[language] || { label: `${language} Practice`, color: "#fff" };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/practice/problems/${language}`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setProblems(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const ref = doc(db, "users", auth.currentUser.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setCompletedProblems(snap.data().practiceCompleted || []);
      }
    });
  }, []);

  const grouped = problems.reduce((acc, p) => {
    const topic = p.topic || "General";
    const diff = p.difficulty || "Easy";
    if (!acc[topic]) acc[topic] = {};
    if (!acc[topic][diff]) acc[topic][diff] = [];
    acc[topic][diff].push(p);
    return acc;
  }, {});

  const toggleTopic = (topic) => {
    setOpenState((prev) => ({
      ...prev,
      [topic]: { ...prev[topic], open: !prev[topic]?.open },
    }));
  };

  const toggleDifficulty = (topic, diff) => {
    setOpenState((prev) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [diff]: !prev[topic]?.[diff],
      },
    }));
  };

  const filteredTopics = Object.keys(grouped).filter((topic) => {
    if (!search) return true;
    return (
      topic.toLowerCase().includes(search.toLowerCase()) ||
      Object.values(grouped[topic])
        .flat()
        .some((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="pp-root">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap");
        .pp-root {
          min-height: 100vh;
          background: #0b0f19;
          color: #e5e7eb;
          font-family: "Sora", "Segoe UI", sans-serif;
        }
        .pp-container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 36px 24px 60px;
        }
        .pp-back {
          background: transparent;
          color: rgba(226,232,240,0.7);
          border: none;
          font-size: 13px;
          margin-bottom: 16px;
          cursor: pointer;
        }
        .pp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }
        .pp-title {
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .pp-subtitle {
          color: rgba(226,232,240,0.6);
          font-size: 14px;
        }
        .pp-search {
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(148,163,184,0.2);
          border-radius: 12px;
          padding: 12px 14px;
          width: 100%;
          color: #e2e8f0;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .pp-topic {
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(148,163,184,0.2);
          border-radius: 16px;
          margin-bottom: 14px;
          overflow: hidden;
        }
        .pp-topic-btn {
          width: 100%;
          background: transparent;
          border: none;
          color: #e2e8f0;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .pp-topic-name {
          font-size: 16px;
          font-weight: 600;
        }
        .pp-chip {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.25);
          color: rgba(226,232,240,0.8);
        }
        .pp-diff-btn {
          width: 100%;
          background: rgba(15,23,42,0.6);
          border: none;
          color: #cbd5f5;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .pp-problem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-top: 1px solid rgba(148,163,184,0.1);
          background: rgba(15,23,42,0.75);
        }
        .pp-problem-title {
          font-size: 14px;
          color: rgba(226,232,240,0.85);
        }
        .pp-solved {
          color: #22c55e;
          font-size: 12px;
          font-weight: 600;
        }
        .pp-action {
          padding: 6px 12px;
          border-radius: 10px;
          border: 1px solid rgba(148,163,184,0.3);
          background: transparent;
          color: #e2e8f0;
          font-size: 12px;
          cursor: pointer;
        }
      `}</style>

      <div className="pp-container">
        <button className="pp-back" onClick={() => navigate("/")}>Back to Dashboard</button>

        <div className="pp-header">
          <div>
            <div className="pp-title" style={{ color: meta.color }}>{meta.label}</div>
            <div className="pp-subtitle">Structured roadmap by topic and difficulty</div>
          </div>
        </div>

        <input
          className="pp-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems by title or topic"
        />

        {loading ? (
          <div style={{ color: "rgba(226,232,240,0.6)", textAlign: "center", padding: "40px" }}>
            Loading problems...
          </div>
        ) : (
          <div>
            {filteredTopics.map((topic) => {
              const isTopicOpen = openState[topic]?.open ?? false;
              const topicProblems = Object.values(grouped[topic]).flat();
              const solvedCount = topicProblems.filter((p) =>
                completedProblems.includes(p.id)
              ).length;

              return (
                <div key={topic} className="pp-topic">
                  <button className="pp-topic-btn" onClick={() => toggleTopic(topic)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="pp-topic-name">{topic}</span>
                      {solvedCount > 0 && (
                        <span className="pp-chip">{solvedCount}/{topicProblems.length} solved</span>
                      )}
                    </div>
                    <span style={{ color: "rgba(226,232,240,0.5)" }}>{isTopicOpen ? "v" : ">"}</span>
                  </button>

                  {isTopicOpen && (
                    <div>
                      {DIFFICULTY_ORDER.filter((d) => grouped[topic][d]).map((diff) => {
                        const isDiffOpen = openState[topic]?.[diff] ?? false;
                        const diffProblems = grouped[topic][diff] || [];
                        const diffSolved = diffProblems.filter((p) =>
                          completedProblems.includes(p.id)
                        ).length;

                        return (
                          <div key={diff}>
                            <button className="pp-diff-btn" onClick={() => toggleDifficulty(topic, diff)}>
                              <span>{diff} ({diffSolved}/{diffProblems.length})</span>
                              <span>{isDiffOpen ? "v" : ">"}</span>
                            </button>

                            {isDiffOpen && (
                              <div>
                                {diffProblems.map((problem) => {
                                  const solved = completedProblems.includes(problem.id);
                                  return (
                                    <div key={problem.id} className="pp-problem">
                                      <div>
                                        <div className="pp-problem-title" style={{ textDecoration: solved ? "line-through" : "none", opacity: solved ? 0.6 : 1 }}>
                                          {problem.title}
                                        </div>
                                        {solved && <div className="pp-solved">Solved</div>}
                                      </div>
                                      <button
                                        className="pp-action"
                                        onClick={() =>
                                          navigate(`/practice/${language}/${problem.id}`, { state: problem })
                                        }
                                      >
                                        {solved ? "Review" : "Start"}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
