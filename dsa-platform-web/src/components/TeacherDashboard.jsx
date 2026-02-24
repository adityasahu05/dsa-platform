


// // // // import { useState, useEffect } from 'react';
// // // // import { Plus, Eye, BarChart2, FileText, Clock, Users, Zap, ChevronRight, X, Trash2, BookOpen } from 'lucide-react';
// // // // import api from '../services/api';
// // // // import QuestionsModal from './QuestionsModal';

// // // // // Slashcoder color palette
// // // // const sc = {
// // // //   bg: '#0d1117',
// // // //   panel: '#161b22',
// // // //   card: '#1a2233',
// // // //   cardHover: '#1f2a3d',
// // // //   border: '#2a3444',
// // // //   accent: '#ef4444',
// // // //   accentHover: '#dc2626',
// // // //   blue: '#3b82f6',
// // // //   textPrimary: '#f0f6fc',
// // // //   textSecondary: '#8b949e',
// // // //   textMuted: '#6e7681',
// // // //   green: '#3fb950',
// // // //   greenBg: 'rgba(63,185,80,0.1)',
// // // //   red: '#f85149',
// // // //   redBg: 'rgba(248,81,73,0.1)',
// // // //   yellow: '#d29922',
// // // //   yellowBg: 'rgba(210,153,34,0.1)',
// // // // };

// // // // const inputStyle = {
// // // //   width: '100%', background: sc.card, color: sc.textPrimary,
// // // //   border: `1px solid ${sc.border}`, borderRadius: '8px',
// // // //   padding: '0.6rem 0.9rem', fontSize: '0.875rem', outline: 'none',
// // // //   boxSizing: 'border-box', transition: 'border-color 0.15s',
// // // //   fontFamily: 'inherit',
// // // // };

// // // // const labelStyle = {
// // // //   display: 'block', color: sc.textSecondary,
// // // //   fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem',
// // // //   textTransform: 'uppercase', letterSpacing: '0.05em'
// // // // };

// // // // function TeacherDashboard() {
// // // //   const [activeTab, setActiveTab] = useState('tests');
// // // //   const [tests, setTests] = useState([]);
// // // //   const [submissions, setSubmissions] = useState([]);
// // // //   const [analytics, setAnalytics] = useState(null);
// // // //   const [selectedTest, setSelectedTest] = useState(null);
// // // //   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
// // // //   const [showCreateTest, setShowCreateTest] = useState(false);
// // // //   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
// // // //   const [selectedTestForQuestion, setSelectedTestForQuestion] = useState(null);

// // // //   const [newTest, setNewTest] = useState({ title: '', description: '', duration_minutes: 60 });
// // // //   const [newQuestion, setNewQuestion] = useState({
// // // //     title: '', description: '', difficulty: 'EASY', topic: 'ARRAYS',
// // // //     points: 10, time_limit_ms: 2000,
// // // //     test_cases: [{ input: '', expected_output: '', is_hidden: false, points: 1 }]
// // // //   });

// // // //   useEffect(() => { fetchTests(); }, []);
// // // //   useEffect(() => { if (activeTab === 'submissions') fetchSubmissions(); }, [activeTab]);

// // // //   const fetchTests = async () => {
// // // //     try { const data = await api.getTeacherTests(); setTests(data); } catch (e) { console.error(e); }
// // // //   };
// // // //   const fetchSubmissions = async () => {
// // // //     try { const data = await api.getSubmissions(); setSubmissions(data); } catch (e) { console.error(e); }
// // // //   };

// // // //   const handleCreateTest = async () => {
// // // //     try {
// // // //       await api.createTest({ ...newTest, teacher_id: 2 });
// // // //       setNewTest({ title: '', description: '', duration_minutes: 60 });
// // // //       setShowCreateTest(false);
// // // //       fetchTests();
// // // //     } catch (e) { console.error(e); }
// // // //   };

// // // //   const handleCreateQuestion = async () => {
// // // //     try {
// // // //       await api.createQuestion({
// // // //         ...newQuestion, test_id: selectedTestForQuestion.id,
// // // //         test_cases: newQuestion.test_cases.filter(tc => tc.input || tc.expected_output)
// // // //       });
// // // //       setShowCreateQuestion(false);
// // // //       fetchTests();
// // // //     } catch (e) { console.error(e); }
// // // //   };

// // // //   const addTestCase = () => {
// // // //     setNewQuestion(prev => ({
// // // //       ...prev,
// // // //       test_cases: [...prev.test_cases, { input: '', expected_output: '', is_hidden: false, points: 1 }]
// // // //     }));
// // // //   };

// // // //   const updateTestCase = (idx, field, value) => {
// // // //     setNewQuestion(prev => ({
// // // //       ...prev,
// // // //       test_cases: prev.test_cases.map((tc, i) => i === idx ? { ...tc, [field]: value } : tc)
// // // //     }));
// // // //   };

// // // //   const removeTestCase = (idx) => {
// // // //     setNewQuestion(prev => ({ ...prev, test_cases: prev.test_cases.filter((_, i) => i !== idx) }));
// // // //   };

// // // //   const totalSubmissions = submissions.length;
// // // //   const avgScore = submissions.length > 0
// // // //     ? Math.round(submissions.reduce((a, b) => a + (b.score || 0), 0) / submissions.length)
// // // //     : 0;

// // // //   const tabs = [
// // // //     { id: 'tests', label: 'Tests', icon: <BookOpen size={15} /> },
// // // //     { id: 'submissions', label: 'Submissions', icon: <FileText size={15} /> },
// // // //     { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
// // // //   ];

// // // //   return (
// // // //     <div style={{ minHeight: '100vh', background: sc.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

// // // //       {/* Header */}
// // // //       <div style={{ background: sc.panel, borderBottom: `1px solid ${sc.border}`, padding: '1rem 1.5rem' }}>
// // // //         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
// // // //             <div style={{
// // // //               width: '32px', height: '32px', borderRadius: '7px',
// // // //               background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
// // // //               display: 'flex', alignItems: 'center', justifyContent: 'center'
// // // //             }}>
// // // //               <Zap size={16} color={sc.accent} />
// // // //             </div>
// // // //             <div>
// // // //               <h1 style={{ color: sc.textPrimary, fontSize: '1rem', fontWeight: '700', margin: 0 }}>Teacher Dashboard</h1>
// // // //               <p style={{ color: sc.textMuted, fontSize: '0.75rem', margin: 0 }}>DSA Assessment Platform</p>
// // // //             </div>
// // // //           </div>

// // // //           <div style={{ display: 'flex', gap: '0.4rem' }}>
// // // //             {tabs.map(tab => (
// // // //               <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
// // // //                 background: activeTab === tab.id ? 'rgba(239,68,68,0.15)' : 'transparent',
// // // //                 color: activeTab === tab.id ? sc.accent : sc.textSecondary,
// // // //                 border: `1px solid ${activeTab === tab.id ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
// // // //                 borderRadius: '7px', padding: '0.4rem 0.9rem', fontSize: '0.825rem', fontWeight: '600',
// // // //                 cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s'
// // // //               }}>
// // // //                 {tab.icon} {tab.label}
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>

// // // //         {/* ===== TESTS TAB ===== */}
// // // //         {activeTab === 'tests' && (
// // // //           <div>
// // // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
// // // //               <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
// // // //                 Your Tests <span style={{ color: sc.textMuted, fontWeight: '400', fontSize: '0.875rem' }}>({tests.length})</span>
// // // //               </h2>
// // // //               <button onClick={() => setShowCreateTest(true)} style={{
// // // //                 background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px',
// // // //                 padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem',
// // // //                 cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
// // // //               }}>
// // // //                 <Plus size={15} /> Create Test
// // // //               </button>
// // // //             </div>

// // // //             {tests.length === 0 ? (
// // // //               <div style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
// // // //                 <BookOpen size={40} color={sc.textMuted} style={{ margin: '0 auto 1rem', display: 'block' }} />
// // // //                 <p style={{ color: sc.textSecondary }}>No tests yet. Create your first test!</p>
// // // //               </div>
// // // //             ) : (
// // // //               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.75rem' }}>
// // // //                 {tests.map(test => <TestCard key={test.id} test={test} sc={sc} onView={() => { setSelectedTest(test); setShowQuestionsModal(true); }} onAddQuestion={() => { setSelectedTestForQuestion(test); setShowCreateQuestion(true); }} />)}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ===== SUBMISSIONS TAB ===== */}
// // // //         {activeTab === 'submissions' && (
// // // //           <div>
// // // //             <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>
// // // //               Submissions <span style={{ color: sc.textMuted, fontWeight: '400', fontSize: '0.875rem' }}>({submissions.length})</span>
// // // //             </h2>
// // // //             <div style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', overflow: 'hidden' }}>
// // // //               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
// // // //                 <thead>
// // // //                   <tr style={{ borderBottom: `1px solid ${sc.border}` }}>
// // // //                     {['Student', 'Question', 'Language', 'Score', 'Verdict', 'Time', 'Submitted'].map(h => (
// // // //                       <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: sc.textMuted, fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
// // // //                     ))}
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {submissions.map((sub, i) => (
// // // //                     <tr key={sub.id} style={{ borderBottom: i < submissions.length - 1 ? `1px solid ${sc.border}` : 'none', transition: 'background 0.1s' }}
// // // //                       onMouseEnter={e => e.currentTarget.style.background = sc.panel}
// // // //                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
// // // //                     >
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textPrimary, fontSize: '0.85rem' }}>#{sub.student_id}</td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textSecondary, fontSize: '0.85rem' }}>#{sub.question_id}</td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ background: 'rgba(59,130,246,0.1)', color: sc.blue, border: '1px solid rgba(59,130,246,0.2)', borderRadius: '5px', padding: '1px 8px', fontSize: '0.775rem', fontWeight: '600' }}>
// // // //                           {sub.language}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ color: sub.score >= 80 ? sc.green : sub.score >= 40 ? sc.yellow : sc.red, fontWeight: '700', fontSize: '0.875rem' }}>
// // // //                           {sub.score}%
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ fontSize: '0.775rem', fontWeight: '600', padding: '2px 8px', borderRadius: '5px', background: sub.verdict === 'PASS' ? sc.greenBg : sc.redBg, color: sub.verdict === 'PASS' ? sc.green : sc.red }}>
// // // //                           {sub.verdict}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textMuted, fontSize: '0.825rem' }}>{sub.execution_time_ms}ms</td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textMuted, fontSize: '0.775rem' }}>{new Date(sub.submitted_at).toLocaleDateString()}</td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               {submissions.length === 0 && (
// // // //                 <div style={{ padding: '3rem', textAlign: 'center', color: sc.textMuted }}>No submissions yet.</div>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* ===== ANALYTICS TAB ===== */}
// // // //         {activeTab === 'analytics' && (
// // // //           <div>
// // // //             <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Analytics</h2>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
// // // //               {[
// // // //                 { label: 'Total Tests', value: tests.length, icon: <BookOpen size={20} color={sc.accent} />, color: sc.accent, bg: 'rgba(239,68,68,0.1)' },
// // // //                 { label: 'Total Submissions', value: totalSubmissions, icon: <FileText size={20} color={sc.blue} />, color: sc.blue, bg: 'rgba(59,130,246,0.1)' },
// // // //                 { label: 'Average Score', value: `${avgScore}%`, icon: <BarChart2 size={20} color={sc.green} />, color: sc.green, bg: sc.greenBg },
// // // //               ].map(stat => (
// // // //                 <div key={stat.label} style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', padding: '1.5rem' }}>
// // // //                   <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
// // // //                     {stat.icon}
// // // //                   </div>
// // // //                   <div style={{ color: stat.color, fontSize: '2rem', fontWeight: '700', lineHeight: 1, marginBottom: '0.35rem' }}>{stat.value}</div>
// // // //                   <div style={{ color: sc.textMuted, fontSize: '0.825rem' }}>{stat.label}</div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Questions Modal */}
// // // //       {showQuestionsModal && selectedTest && (
// // // //         <QuestionsModal test={selectedTest} onClose={() => setShowQuestionsModal(false)} />
// // // //       )}

// // // //       {/* Create Test Modal */}
// // // //       {showCreateTest && (
// // // //         <Modal title="Create New Test" onClose={() => setShowCreateTest(false)} sc={sc}>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// // // //             <div>
// // // //               <label style={labelStyle}>Title</label>
// // // //               <input style={inputStyle} placeholder="e.g. Arrays and Strings Test" value={newTest.title} onChange={e => setNewTest(p => ({ ...p, title: e.target.value }))} />
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Description</label>
// // // //               <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} placeholder="Describe the test..." value={newTest.description} onChange={e => setNewTest(p => ({ ...p, description: e.target.value }))} />
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Duration (minutes)</label>
// // // //               <input type="number" style={inputStyle} value={newTest.duration_minutes} onChange={e => setNewTest(p => ({ ...p, duration_minutes: parseInt(e.target.value) }))} />
// // // //             </div>
// // // //             <button onClick={handleCreateTest} style={{ background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
// // // //               Create Test
// // // //             </button>
// // // //           </div>
// // // //         </Modal>
// // // //       )}

// // // //       {/* Create Question Modal */}
// // // //       {showCreateQuestion && selectedTestForQuestion && (
// // // //         <Modal title={`Add Question to "${selectedTestForQuestion.title}"`} onClose={() => setShowCreateQuestion(false)} sc={sc} wide>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
// // // //               <div>
// // // //                 <label style={labelStyle}>Title</label>
// // // //                 <input style={inputStyle} placeholder="Question title" value={newQuestion.title} onChange={e => setNewQuestion(p => ({ ...p, title: e.target.value }))} />
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Topic</label>
// // // //                 <select style={inputStyle} value={newQuestion.topic} onChange={e => setNewQuestion(p => ({ ...p, topic: e.target.value }))}>
// // // //                   {['ARRAYS', 'STRINGS', 'LINKED_LIST', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING', 'RECURSION', 'MISC'].map(t => <option key={t}>{t}</option>)}
// // // //                 </select>
// // // //               </div>
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Description</label>
// // // //               <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} placeholder="Describe the problem..." value={newQuestion.description} onChange={e => setNewQuestion(p => ({ ...p, description: e.target.value }))} />
// // // //             </div>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
// // // //               <div>
// // // //                 <label style={labelStyle}>Difficulty</label>
// // // //                 <select style={inputStyle} value={newQuestion.difficulty} onChange={e => setNewQuestion(p => ({ ...p, difficulty: e.target.value }))}>
// // // //                   <option>EASY</option><option>MEDIUM</option><option>HARD</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Points</label>
// // // //                 <input type="number" style={inputStyle} value={newQuestion.points} onChange={e => setNewQuestion(p => ({ ...p, points: parseInt(e.target.value) }))} />
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Time Limit (ms)</label>
// // // //                 <input type="number" style={inputStyle} value={newQuestion.time_limit_ms} onChange={e => setNewQuestion(p => ({ ...p, time_limit_ms: parseInt(e.target.value) }))} />
// // // //               </div>
// // // //             </div>

// // // //             {/* Test Cases */}
// // // //             <div>
// // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
// // // //                 <label style={{ ...labelStyle, margin: 0 }}>Test Cases</label>
// // // //                 <button onClick={addTestCase} style={{ background: 'transparent', color: sc.accent, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //                   <Plus size={12} /> Add Case
// // // //                 </button>
// // // //               </div>
// // // //               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
// // // //                 {newQuestion.test_cases.map((tc, i) => (
// // // //                   <div key={i} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '8px', padding: '0.75rem' }}>
// // // //                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
// // // //                       <span style={{ color: sc.textMuted, fontSize: '0.775rem', fontWeight: '600' }}>Case {i + 1}</span>
// // // //                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
// // // //                         <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: sc.textSecondary, fontSize: '0.775rem' }}>
// // // //                           <input type="checkbox" checked={tc.is_hidden} onChange={e => updateTestCase(i, 'is_hidden', e.target.checked)} />
// // // //                           Hidden
// // // //                         </label>
// // // //                         {newQuestion.test_cases.length > 1 && (
// // // //                           <button onClick={() => removeTestCase(i)} style={{ background: 'transparent', border: 'none', color: sc.textMuted, cursor: 'pointer', padding: '0' }}>
// // // //                             <Trash2 size={14} />
// // // //                           </button>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
// // // //                       <div>
// // // //                         <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Input</label>
// // // //                         <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '50px', fontSize: '0.8rem', fontFamily: 'monospace' }} placeholder="stdin input" value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Expected Output</label>
// // // //                         <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '50px', fontSize: '0.8rem', fontFamily: 'monospace' }} placeholder="expected stdout" value={tc.expected_output} onChange={e => updateTestCase(i, 'expected_output', e.target.value)} />
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             </div>

// // // //             <button onClick={handleCreateQuestion} style={{ background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
// // // //               Create Question
// // // //             </button>
// // // //           </div>
// // // //         </Modal>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // function TestCard({ test, sc, onView, onAddQuestion }) {
// // // //   const [hovered, setHovered] = useState(false);
// // // //   return (
// // // //     <div
// // // //       onMouseEnter={() => setHovered(true)}
// // // //       onMouseLeave={() => setHovered(false)}
// // // //       style={{
// // // //         background: hovered ? sc.cardHover : sc.card,
// // // //         border: `1px solid ${hovered ? 'rgba(239,68,68,0.4)' : sc.border}`,
// // // //         borderRadius: '12px', padding: '1.25rem',
// // // //         transition: 'all 0.2s ease', borderLeft: `3px solid ${sc.accent}`
// // // //       }}
// // // //     >
// // // //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
// // // //         <h3 style={{ color: sc.textPrimary, fontSize: '0.975rem', fontWeight: '600', margin: 0, flex: 1, paddingRight: '0.5rem' }}>{test.title}</h3>
// // // //         <span style={{
// // // //           fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
// // // //           background: test.is_active ? sc.greenBg : sc.redBg,
// // // //           color: test.is_active ? sc.green : sc.red,
// // // //           border: `1px solid ${test.is_active ? 'rgba(63,185,80,0.25)' : 'rgba(248,81,73,0.25)'}`
// // // //         }}>
// // // //           {test.is_active ? 'Active' : 'Inactive'}
// // // //         </span>
// // // //       </div>
// // // //       <p style={{ color: sc.textMuted, fontSize: '0.825rem', margin: '0 0 1rem', lineHeight: '1.5' }}>{test.description}</p>
// // // //       <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
// // // //         <span style={{ color: sc.textMuted, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //           <Clock size={12} /> {test.duration_minutes}m
// // // //         </span>
// // // //         <span style={{ color: sc.textMuted, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //           <FileText size={12} /> {test.question_count || 0} questions
// // // //         </span>
// // // //       </div>
// // // //       <div style={{ display: 'flex', gap: '0.5rem' }}>
// // // //         <button onClick={onView} style={{ flex: 1, background: 'transparent', color: sc.textSecondary, border: `1px solid ${sc.border}`, borderRadius: '7px', padding: '0.45rem 0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
// // // //           <Eye size={13} /> View
// // // //         </button>
// // // //         <button onClick={onAddQuestion} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', color: sc.accent, border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px', padding: '0.45rem 0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
// // // //           <Plus size={13} /> Add Question
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function Modal({ title, onClose, children, sc, wide }) {
// // // //   return (
// // // //     <div style={{
// // // //       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
// // // //       display: 'flex', alignItems: 'center', justifyContent: 'center',
// // // //       zIndex: 1000, padding: '1rem'
// // // //     }}>
// // // //       <div style={{
// // // //         background: sc.panel, border: `1px solid ${sc.border}`,
// // // //         borderRadius: '14px', width: '100%',
// // // //         maxWidth: wide ? '700px' : '480px',
// // // //         maxHeight: '90vh', overflowY: 'auto',
// // // //         boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
// // // //       }}>
// // // //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: `1px solid ${sc.border}` }}>
// // // //           <h3 style={{ color: sc.textPrimary, fontWeight: '700', fontSize: '1rem', margin: 0 }}>{title}</h3>
// // // //           <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: sc.textMuted, cursor: 'pointer', padding: '0.25rem' }}>
// // // //             <X size={18} />
// // // //           </button>
// // // //         </div>
// // // //         <div style={{ padding: '1.5rem' }}>{children}</div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default TeacherDashboard;


// // // // import { useState, useEffect } from 'react';
// // // // import { Plus, Eye, BarChart2, FileText, Clock, Users, Zap, ChevronRight, X, Trash2, BookOpen } from 'lucide-react';
// // // // import api from '../services/api';
// // // // import QuestionsModal from './QuestionsModal';

// // // // // Slashcoder color palette
// // // // const sc = {
// // // //   bg: '#0d1117',
// // // //   panel: '#161b22',
// // // //   card: '#1a2233',
// // // //   cardHover: '#1f2a3d',
// // // //   border: '#2a3444',
// // // //   accent: '#ef4444',
// // // //   accentHover: '#dc2626',
// // // //   blue: '#3b82f6',
// // // //   textPrimary: '#f0f6fc',
// // // //   textSecondary: '#8b949e',
// // // //   textMuted: '#6e7681',
// // // //   green: '#3fb950',
// // // //   greenBg: 'rgba(63,185,80,0.1)',
// // // //   red: '#f85149',
// // // //   redBg: 'rgba(248,81,73,0.1)',
// // // //   yellow: '#d29922',
// // // //   yellowBg: 'rgba(210,153,34,0.1)',
// // // // };

// // // // const inputStyle = {
// // // //   width: '100%', background: sc.card, color: sc.textPrimary,
// // // //   border: `1px solid ${sc.border}`, borderRadius: '8px',
// // // //   padding: '0.6rem 0.9rem', fontSize: '0.875rem', outline: 'none',
// // // //   boxSizing: 'border-box', transition: 'border-color 0.15s',
// // // //   fontFamily: 'inherit',
// // // // };

// // // // const labelStyle = {
// // // //   display: 'block', color: sc.textSecondary,
// // // //   fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem',
// // // //   textTransform: 'uppercase', letterSpacing: '0.05em'
// // // // };

// // // // function TeacherDashboard() {
// // // //   const [activeTab, setActiveTab] = useState('tests');
// // // //   const [tests, setTests] = useState([]);
// // // //   const [submissions, setSubmissions] = useState([]);
// // // //   const [analytics, setAnalytics] = useState(null);
// // // //   const [selectedTest, setSelectedTest] = useState(null);
// // // //   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
// // // //   const [showCreateTest, setShowCreateTest] = useState(false);
// // // //   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
// // // //   const [selectedTestForQuestion, setSelectedTestForQuestion] = useState(null);

// // // //   const [newTest, setNewTest] = useState({ title: '', description: '', duration_minutes: 60 });
// // // //   const [newQuestion, setNewQuestion] = useState({
// // // //     title: '', description: '', difficulty: 'EASY', topic: 'ARRAYS',
// // // //     points: 10, time_limit_ms: 2000,
// // // //     test_cases: [{ input: '', expected_output: '', is_hidden: false, points: 1 }]
// // // //   });

// // // //   useEffect(() => { fetchTests(); }, []);
// // // //   useEffect(() => { if (activeTab === 'submissions') fetchSubmissions(); }, [activeTab]);

// // // //   const fetchTests = async () => {
// // // //     try { const data = await api.getTeacherTests(); setTests(data); } catch (e) { console.error(e); }
// // // //   };
// // // //   const fetchSubmissions = async () => {
// // // //     try { const data = await api.getSubmissions(); setSubmissions(data); } catch (e) { console.error(e); }
// // // //   };

// // // //   const handleCreateTest = async () => {
// // // //     try {
// // // //       await api.createTest({ ...newTest, teacher_id: 2 });
// // // //       setNewTest({ title: '', description: '', duration_minutes: 60 });
// // // //       setShowCreateTest(false);
// // // //       fetchTests();
// // // //     } catch (e) { console.error(e); }
// // // //   };

// // // //   const handleCreateQuestion = async () => {
// // // //     try {
// // // //       await api.createQuestion({
// // // //         ...newQuestion, test_id: selectedTestForQuestion.id,
// // // //         test_cases: newQuestion.test_cases.filter(tc => tc.input || tc.expected_output)
// // // //       });
// // // //       setShowCreateQuestion(false);
// // // //       fetchTests();
// // // //     } catch (e) { console.error(e); }
// // // //   };

// // // //   const addTestCase = () => {
// // // //     setNewQuestion(prev => ({
// // // //       ...prev,
// // // //       test_cases: [...prev.test_cases, { input: '', expected_output: '', is_hidden: false, points: 1 }]
// // // //     }));
// // // //   };

// // // //   const updateTestCase = (idx, field, value) => {
// // // //     setNewQuestion(prev => ({
// // // //       ...prev,
// // // //       test_cases: prev.test_cases.map((tc, i) => i === idx ? { ...tc, [field]: value } : tc)
// // // //     }));
// // // //   };

// // // //   const removeTestCase = (idx) => {
// // // //     setNewQuestion(prev => ({ ...prev, test_cases: prev.test_cases.filter((_, i) => i !== idx) }));
// // // //   };

// // // //   const totalSubmissions = submissions.length;
// // // //   const avgScore = submissions.length > 0
// // // //     ? Math.round(submissions.reduce((a, b) => a + (b.score || 0), 0) / submissions.length)
// // // //     : 0;

// // // //   const tabs = [
// // // //     { id: 'tests', label: 'Tests', icon: <BookOpen size={15} /> },
// // // //     { id: 'submissions', label: 'Submissions', icon: <FileText size={15} /> },
// // // //     { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
// // // //   ];

// // // //   return (
// // // //     <div style={{ minHeight: '100vh', background: sc.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

// // // //       {/* Header */}
// // // //       <div style={{ background: sc.panel, borderBottom: `1px solid ${sc.border}`, padding: '1rem 2rem' }}>
// // // //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
// // // //             <div style={{
// // // //               width: '32px', height: '32px', borderRadius: '7px',
// // // //               background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
// // // //               display: 'flex', alignItems: 'center', justifyContent: 'center'
// // // //             }}>
// // // //               <Zap size={16} color={sc.accent} />
// // // //             </div>
// // // //             <div>
// // // //               <h1 style={{ color: sc.textPrimary, fontSize: '1rem', fontWeight: '700', margin: 0 }}>Teacher Dashboard</h1>
// // // //               <p style={{ color: sc.textMuted, fontSize: '0.75rem', margin: 0 }}>DSA Assessment Platform</p>
// // // //             </div>
// // // //           </div>

// // // //           <div style={{ display: 'flex', gap: '0.4rem' }}>
// // // //             {tabs.map(tab => (
// // // //               <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
// // // //                 background: activeTab === tab.id ? 'rgba(239,68,68,0.15)' : 'transparent',
// // // //                 color: activeTab === tab.id ? sc.accent : sc.textSecondary,
// // // //                 border: `1px solid ${activeTab === tab.id ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
// // // //                 borderRadius: '7px', padding: '0.4rem 0.9rem', fontSize: '0.825rem', fontWeight: '600',
// // // //                 cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s'
// // // //               }}>
// // // //                 {tab.icon} {tab.label}
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div style={{ padding: '1.5rem 2rem' }}>

// // // //         {/* ===== TESTS TAB ===== */}
// // // //         {activeTab === 'tests' && (
// // // //           <div>
// // // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
// // // //               <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
// // // //                 Your Tests <span style={{ color: sc.textMuted, fontWeight: '400', fontSize: '0.875rem' }}>({tests.length})</span>
// // // //               </h2>
// // // //               <button onClick={() => setShowCreateTest(true)} style={{
// // // //                 background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px',
// // // //                 padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem',
// // // //                 cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
// // // //               }}>
// // // //                 <Plus size={15} /> Create Test
// // // //               </button>
// // // //             </div>

// // // //             {tests.length === 0 ? (
// // // //               <div style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
// // // //                 <BookOpen size={40} color={sc.textMuted} style={{ margin: '0 auto 1rem', display: 'block' }} />
// // // //                 <p style={{ color: sc.textSecondary }}>No tests yet. Create your first test!</p>
// // // //               </div>
// // // //             ) : (
// // // //               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
// // // //                 {tests.map(test => <TestCard key={test.id} test={test} sc={sc} onView={() => { setSelectedTest(test); setShowQuestionsModal(true); }} onAddQuestion={() => { setSelectedTestForQuestion(test); setShowCreateQuestion(true); }} />)}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ===== SUBMISSIONS TAB ===== */}
// // // //         {activeTab === 'submissions' && (
// // // //           <div>
// // // //             <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>
// // // //               Submissions <span style={{ color: sc.textMuted, fontWeight: '400', fontSize: '0.875rem' }}>({submissions.length})</span>
// // // //             </h2>
// // // //             <div style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', overflow: 'hidden' }}>
// // // //               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
// // // //                 <thead>
// // // //                   <tr style={{ borderBottom: `1px solid ${sc.border}` }}>
// // // //                     {['Student', 'Question', 'Language', 'Score', 'Verdict', 'Time', 'Submitted'].map(h => (
// // // //                       <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: sc.textMuted, fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
// // // //                     ))}
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {submissions.map((sub, i) => (
// // // //                     <tr key={sub.id} style={{ borderBottom: i < submissions.length - 1 ? `1px solid ${sc.border}` : 'none', transition: 'background 0.1s' }}
// // // //                       onMouseEnter={e => e.currentTarget.style.background = sc.panel}
// // // //                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
// // // //                     >
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textPrimary, fontSize: '0.85rem' }}>#{sub.student_id}</td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textSecondary, fontSize: '0.85rem' }}>#{sub.question_id}</td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ background: 'rgba(59,130,246,0.1)', color: sc.blue, border: '1px solid rgba(59,130,246,0.2)', borderRadius: '5px', padding: '1px 8px', fontSize: '0.775rem', fontWeight: '600' }}>
// // // //                           {sub.language}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ color: sub.score >= 80 ? sc.green : sub.score >= 40 ? sc.yellow : sc.red, fontWeight: '700', fontSize: '0.875rem' }}>
// // // //                           {sub.score}%
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ fontSize: '0.775rem', fontWeight: '600', padding: '2px 8px', borderRadius: '5px', background: sub.verdict === 'PASS' ? sc.greenBg : sc.redBg, color: sub.verdict === 'PASS' ? sc.green : sc.red }}>
// // // //                           {sub.verdict}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textMuted, fontSize: '0.825rem' }}>{sub.execution_time_ms}ms</td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textMuted, fontSize: '0.775rem' }}>{new Date(sub.submitted_at).toLocaleDateString()}</td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               {submissions.length === 0 && (
// // // //                 <div style={{ padding: '3rem', textAlign: 'center', color: sc.textMuted }}>No submissions yet.</div>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* ===== ANALYTICS TAB ===== */}
// // // //         {activeTab === 'analytics' && (
// // // //           <div>
// // // //             <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Analytics</h2>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
// // // //               {[
// // // //                 { label: 'Total Tests', value: tests.length, icon: <BookOpen size={20} color={sc.accent} />, color: sc.accent, bg: 'rgba(239,68,68,0.1)' },
// // // //                 { label: 'Total Submissions', value: totalSubmissions, icon: <FileText size={20} color={sc.blue} />, color: sc.blue, bg: 'rgba(59,130,246,0.1)' },
// // // //                 { label: 'Average Score', value: `${avgScore}%`, icon: <BarChart2 size={20} color={sc.green} />, color: sc.green, bg: sc.greenBg },
// // // //               ].map(stat => (
// // // //                 <div key={stat.label} style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', padding: '1.5rem' }}>
// // // //                   <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
// // // //                     {stat.icon}
// // // //                   </div>
// // // //                   <div style={{ color: stat.color, fontSize: '2rem', fontWeight: '700', lineHeight: 1, marginBottom: '0.35rem' }}>{stat.value}</div>
// // // //                   <div style={{ color: sc.textMuted, fontSize: '0.825rem' }}>{stat.label}</div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Questions Modal */}
// // // //       {showQuestionsModal && selectedTest && (
// // // //         <QuestionsModal test={selectedTest} onClose={() => setShowQuestionsModal(false)} />
// // // //       )}

// // // //       {/* Create Test Modal */}
// // // //       {showCreateTest && (
// // // //         <Modal title="Create New Test" onClose={() => setShowCreateTest(false)} sc={sc}>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// // // //             <div>
// // // //               <label style={labelStyle}>Title</label>
// // // //               <input style={inputStyle} placeholder="e.g. Arrays and Strings Test" value={newTest.title} onChange={e => setNewTest(p => ({ ...p, title: e.target.value }))} />
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Description</label>
// // // //               <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} placeholder="Describe the test..." value={newTest.description} onChange={e => setNewTest(p => ({ ...p, description: e.target.value }))} />
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Duration (minutes)</label>
// // // //               <input type="number" style={inputStyle} value={newTest.duration_minutes} onChange={e => setNewTest(p => ({ ...p, duration_minutes: parseInt(e.target.value) }))} />
// // // //             </div>
// // // //             <button onClick={handleCreateTest} style={{ background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
// // // //               Create Test
// // // //             </button>
// // // //           </div>
// // // //         </Modal>
// // // //       )}

// // // //       {/* Create Question Modal */}
// // // //       {showCreateQuestion && selectedTestForQuestion && (
// // // //         <Modal title={`Add Question to "${selectedTestForQuestion.title}"`} onClose={() => setShowCreateQuestion(false)} sc={sc} wide>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
// // // //               <div>
// // // //                 <label style={labelStyle}>Title</label>
// // // //                 <input style={inputStyle} placeholder="Question title" value={newQuestion.title} onChange={e => setNewQuestion(p => ({ ...p, title: e.target.value }))} />
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Topic</label>
// // // //                 <select style={inputStyle} value={newQuestion.topic} onChange={e => setNewQuestion(p => ({ ...p, topic: e.target.value }))}>
// // // //                   {['ARRAYS', 'STRINGS', 'LINKED_LIST', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING', 'RECURSION', 'MISC'].map(t => <option key={t}>{t}</option>)}
// // // //                 </select>
// // // //               </div>
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Description</label>
// // // //               <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} placeholder="Describe the problem..." value={newQuestion.description} onChange={e => setNewQuestion(p => ({ ...p, description: e.target.value }))} />
// // // //             </div>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
// // // //               <div>
// // // //                 <label style={labelStyle}>Difficulty</label>
// // // //                 <select style={inputStyle} value={newQuestion.difficulty} onChange={e => setNewQuestion(p => ({ ...p, difficulty: e.target.value }))}>
// // // //                   <option>EASY</option><option>MEDIUM</option><option>HARD</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Points</label>
// // // //                 <input type="number" style={inputStyle} value={newQuestion.points} onChange={e => setNewQuestion(p => ({ ...p, points: parseInt(e.target.value) }))} />
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Time Limit (ms)</label>
// // // //                 <input type="number" style={inputStyle} value={newQuestion.time_limit_ms} onChange={e => setNewQuestion(p => ({ ...p, time_limit_ms: parseInt(e.target.value) }))} />
// // // //               </div>
// // // //             </div>

// // // //             {/* Test Cases */}
// // // //             <div>
// // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
// // // //                 <label style={{ ...labelStyle, margin: 0 }}>Test Cases</label>
// // // //                 <button onClick={addTestCase} style={{ background: 'transparent', color: sc.accent, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //                   <Plus size={12} /> Add Case
// // // //                 </button>
// // // //               </div>
// // // //               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
// // // //                 {newQuestion.test_cases.map((tc, i) => (
// // // //                   <div key={i} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '8px', padding: '0.75rem' }}>
// // // //                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
// // // //                       <span style={{ color: sc.textMuted, fontSize: '0.775rem', fontWeight: '600' }}>Case {i + 1}</span>
// // // //                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
// // // //                         <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: sc.textSecondary, fontSize: '0.775rem' }}>
// // // //                           <input type="checkbox" checked={tc.is_hidden} onChange={e => updateTestCase(i, 'is_hidden', e.target.checked)} />
// // // //                           Hidden
// // // //                         </label>
// // // //                         {newQuestion.test_cases.length > 1 && (
// // // //                           <button onClick={() => removeTestCase(i)} style={{ background: 'transparent', border: 'none', color: sc.textMuted, cursor: 'pointer', padding: '0' }}>
// // // //                             <Trash2 size={14} />
// // // //                           </button>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
// // // //                       <div>
// // // //                         <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Input</label>
// // // //                         <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '50px', fontSize: '0.8rem', fontFamily: 'monospace' }} placeholder="stdin input" value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Expected Output</label>
// // // //                         <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '50px', fontSize: '0.8rem', fontFamily: 'monospace' }} placeholder="expected stdout" value={tc.expected_output} onChange={e => updateTestCase(i, 'expected_output', e.target.value)} />
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             </div>

// // // //             <button onClick={handleCreateQuestion} style={{ background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
// // // //               Create Question
// // // //             </button>
// // // //           </div>
// // // //         </Modal>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // function TestCard({ test, sc, onView, onAddQuestion }) {
// // // //   const [hovered, setHovered] = useState(false);
// // // //   return (
// // // //     <div
// // // //       onMouseEnter={() => setHovered(true)}
// // // //       onMouseLeave={() => setHovered(false)}
// // // //       style={{
// // // //         background: hovered ? sc.cardHover : sc.card,
// // // //         border: `1px solid ${hovered ? 'rgba(239,68,68,0.4)' : sc.border}`,
// // // //         borderRadius: '12px', padding: '1.25rem',
// // // //         transition: 'all 0.2s ease', borderLeft: `3px solid ${sc.accent}`
// // // //       }}
// // // //     >
// // // //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
// // // //         <h3 style={{ color: sc.textPrimary, fontSize: '0.975rem', fontWeight: '600', margin: 0, flex: 1, paddingRight: '0.5rem' }}>{test.title}</h3>
// // // //         <span style={{
// // // //           fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
// // // //           background: test.is_active ? sc.greenBg : sc.redBg,
// // // //           color: test.is_active ? sc.green : sc.red,
// // // //           border: `1px solid ${test.is_active ? 'rgba(63,185,80,0.25)' : 'rgba(248,81,73,0.25)'}`
// // // //         }}>
// // // //           {test.is_active ? 'Active' : 'Inactive'}
// // // //         </span>
// // // //       </div>
// // // //       <p style={{ color: sc.textMuted, fontSize: '0.825rem', margin: '0 0 1rem', lineHeight: '1.5' }}>{test.description}</p>
// // // //       <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
// // // //         <span style={{ color: sc.textMuted, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //           <Clock size={12} /> {test.duration_minutes}m
// // // //         </span>
// // // //         <span style={{ color: sc.textMuted, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //           <FileText size={12} /> {test.question_count || 0} questions
// // // //         </span>
// // // //       </div>
// // // //       <div style={{ display: 'flex', gap: '0.5rem' }}>
// // // //         <button onClick={onView} style={{ flex: 1, background: 'transparent', color: sc.textSecondary, border: `1px solid ${sc.border}`, borderRadius: '7px', padding: '0.45rem 0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
// // // //           <Eye size={13} /> View
// // // //         </button>
// // // //         <button onClick={onAddQuestion} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', color: sc.accent, border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px', padding: '0.45rem 0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
// // // //           <Plus size={13} /> Add Question
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function Modal({ title, onClose, children, sc, wide }) {
// // // //   return (
// // // //     <div style={{
// // // //       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
// // // //       display: 'flex', alignItems: 'center', justifyContent: 'center',
// // // //       zIndex: 1000, padding: '1rem'
// // // //     }}>
// // // //       <div style={{
// // // //         background: sc.panel, border: `1px solid ${sc.border}`,
// // // //         borderRadius: '14px', width: '100%',
// // // //         maxWidth: wide ? '700px' : '480px',
// // // //         maxHeight: '90vh', overflowY: 'auto',
// // // //         boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
// // // //       }}>
// // // //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: `1px solid ${sc.border}` }}>
// // // //           <h3 style={{ color: sc.textPrimary, fontWeight: '700', fontSize: '1rem', margin: 0 }}>{title}</h3>
// // // //           <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: sc.textMuted, cursor: 'pointer', padding: '0.25rem' }}>
// // // //             <X size={18} />
// // // //           </button>
// // // //         </div>
// // // //         <div style={{ padding: '1.5rem' }}>{children}</div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default TeacherDashboard;


// // // // import { useState, useEffect } from 'react';
// // // // import { Plus, Eye, BarChart2, FileText, Clock, Users, Zap, ChevronRight, X, Trash2, BookOpen } from 'lucide-react';
// // // // import api from '../services/api';
// // // // import QuestionsModal from './QuestionsModal';

// // // // // Slashcoder color palette
// // // // const sc = {
// // // //   bg: '#0d1117',
// // // //   panel: '#161b22',
// // // //   card: '#1a2233',
// // // //   cardHover: '#1f2a3d',
// // // //   border: '#2a3444',
// // // //   accent: '#ef4444',
// // // //   accentHover: '#dc2626',
// // // //   blue: '#3b82f6',
// // // //   textPrimary: '#f0f6fc',
// // // //   textSecondary: '#8b949e',
// // // //   textMuted: '#6e7681',
// // // //   green: '#3fb950',
// // // //   greenBg: 'rgba(63,185,80,0.1)',
// // // //   red: '#f85149',
// // // //   redBg: 'rgba(248,81,73,0.1)',
// // // //   yellow: '#d29922',
// // // //   yellowBg: 'rgba(210,153,34,0.1)',
// // // // };

// // // // const inputStyle = {
// // // //   width: '100%', background: sc.card, color: sc.textPrimary,
// // // //   border: `1px solid ${sc.border}`, borderRadius: '8px',
// // // //   padding: '0.6rem 0.9rem', fontSize: '0.875rem', outline: 'none',
// // // //   boxSizing: 'border-box', transition: 'border-color 0.15s',
// // // //   fontFamily: 'inherit',
// // // // };

// // // // const labelStyle = {
// // // //   display: 'block', color: sc.textSecondary,
// // // //   fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem',
// // // //   textTransform: 'uppercase', letterSpacing: '0.05em'
// // // // };

// // // // function TeacherDashboard({ onSwitchView }) {
// // // //   const [activeTab, setActiveTab] = useState('tests');
// // // //   const [tests, setTests] = useState([]);
// // // //   const [submissions, setSubmissions] = useState([]);
// // // //   const [analytics, setAnalytics] = useState(null);
// // // //   const [selectedTest, setSelectedTest] = useState(null);
// // // //   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
// // // //   const [showCreateTest, setShowCreateTest] = useState(false);
// // // //   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
// // // //   const [selectedTestForQuestion, setSelectedTestForQuestion] = useState(null);

// // // //   const [newTest, setNewTest] = useState({ title: '', description: '', duration_minutes: 60 });
// // // //   const [newQuestion, setNewQuestion] = useState({
// // // //     title: '', description: '', difficulty: 'EASY', topic: 'ARRAYS',
// // // //     points: 10, time_limit_ms: 2000,
// // // //     test_cases: [{ input: '', expected_output: '', is_hidden: false, points: 1 }]
// // // //   });

// // // //   useEffect(() => { fetchTests(); }, []);
// // // //   useEffect(() => { if (activeTab === 'submissions') fetchSubmissions(); }, [activeTab]);

// // // //   const fetchTests = async () => {
// // // //     try { const data = await api.getTeacherTests(); setTests(data); } catch (e) { console.error(e); }
// // // //   };
// // // //   const fetchSubmissions = async () => {
// // // //     try { const data = await api.getSubmissions(); setSubmissions(data); } catch (e) { console.error(e); }
// // // //   };

// // // //   const handleCreateTest = async () => {
// // // //     try {
// // // //       await api.createTest({ ...newTest, teacher_id: 2 });
// // // //       setNewTest({ title: '', description: '', duration_minutes: 60 });
// // // //       setShowCreateTest(false);
// // // //       fetchTests();
// // // //     } catch (e) { console.error(e); }
// // // //   };

// // // //   const handleCreateQuestion = async () => {
// // // //     try {
// // // //       await api.createQuestion({
// // // //         ...newQuestion, test_id: selectedTestForQuestion.id,
// // // //         test_cases: newQuestion.test_cases.filter(tc => tc.input || tc.expected_output)
// // // //       });
// // // //       setShowCreateQuestion(false);
// // // //       fetchTests();
// // // //     } catch (e) { console.error(e); }
// // // //   };

// // // //   const addTestCase = () => {
// // // //     setNewQuestion(prev => ({
// // // //       ...prev,
// // // //       test_cases: [...prev.test_cases, { input: '', expected_output: '', is_hidden: false, points: 1 }]
// // // //     }));
// // // //   };

// // // //   const updateTestCase = (idx, field, value) => {
// // // //     setNewQuestion(prev => ({
// // // //       ...prev,
// // // //       test_cases: prev.test_cases.map((tc, i) => i === idx ? { ...tc, [field]: value } : tc)
// // // //     }));
// // // //   };

// // // //   const removeTestCase = (idx) => {
// // // //     setNewQuestion(prev => ({ ...prev, test_cases: prev.test_cases.filter((_, i) => i !== idx) }));
// // // //   };

// // // //   const totalSubmissions = submissions.length;
// // // //   const avgScore = submissions.length > 0
// // // //     ? Math.round(submissions.reduce((a, b) => a + (b.score || 0), 0) / submissions.length)
// // // //     : 0;

// // // //   const tabs = [
// // // //     { id: 'tests', label: 'Tests', icon: <BookOpen size={15} /> },
// // // //     { id: 'submissions', label: 'Submissions', icon: <FileText size={15} /> },
// // // //     { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
// // // //   ];

// // // //   return (
// // // //     <div style={{ minHeight: '100vh', background: sc.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

// // // //       {/* Header */}
// // // //       <div style={{ background: sc.panel, borderBottom: `1px solid ${sc.border}`, padding: '1rem 2rem' }}>
// // // //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
// // // //             <div style={{
// // // //               width: '32px', height: '32px', borderRadius: '7px',
// // // //               background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
// // // //               display: 'flex', alignItems: 'center', justifyContent: 'center'
// // // //             }}>
// // // //               <Zap size={16} color={sc.accent} />
// // // //             </div>
// // // //             <div>
// // // //               <h1 style={{ color: sc.textPrimary, fontSize: '1rem', fontWeight: '700', margin: 0 }}>Teacher Dashboard</h1>
// // // //               <p style={{ color: sc.textMuted, fontSize: '0.75rem', margin: 0 }}>DSA Assessment Platform</p>
// // // //             </div>
// // // //           </div>

// // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
// // // //             <div style={{ display: 'flex', gap: '0.4rem' }}>
// // // //               {tabs.map(tab => (
// // // //                 <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
// // // //                   background: activeTab === tab.id ? 'rgba(239,68,68,0.15)' : 'transparent',
// // // //                   color: activeTab === tab.id ? sc.accent : sc.textSecondary,
// // // //                   border: `1px solid ${activeTab === tab.id ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
// // // //                   borderRadius: '7px', padding: '0.4rem 0.9rem', fontSize: '0.825rem', fontWeight: '600',
// // // //                   cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s'
// // // //                 }}>
// // // //                   {tab.icon} {tab.label}
// // // //                 </button>
// // // //               ))}
// // // //             </div>
// // // //             {onSwitchView && (
// // // //               <button onClick={onSwitchView} style={{
// // // //                 background: 'transparent', color: sc.textSecondary,
// // // //                 border: `1px solid ${sc.border}`, borderRadius: '7px',
// // // //                 padding: '0.4rem 0.9rem', fontSize: '0.825rem', fontWeight: '600',
// // // //                 cursor: 'pointer', transition: 'all 0.15s', marginLeft: '0.5rem'
// // // //               }}
// // // //                 onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444'; }}
// // // //                 onMouseLeave={e => { e.target.style.borderColor = sc.border; e.target.style.color = sc.textSecondary; }}
// // // //               >
// // // //                 Student View
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div style={{ padding: '1.5rem 2rem' }}>

// // // //         {/* ===== TESTS TAB ===== */}
// // // //         {activeTab === 'tests' && (
// // // //           <div>
// // // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
// // // //               <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
// // // //                 Your Tests <span style={{ color: sc.textMuted, fontWeight: '400', fontSize: '0.875rem' }}>({tests.length})</span>
// // // //               </h2>
// // // //               <button onClick={() => setShowCreateTest(true)} style={{
// // // //                 background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px',
// // // //                 padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem',
// // // //                 cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
// // // //               }}>
// // // //                 <Plus size={15} /> Create Test
// // // //               </button>
// // // //             </div>

// // // //             {tests.length === 0 ? (
// // // //               <div style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
// // // //                 <BookOpen size={40} color={sc.textMuted} style={{ margin: '0 auto 1rem', display: 'block' }} />
// // // //                 <p style={{ color: sc.textSecondary }}>No tests yet. Create your first test!</p>
// // // //               </div>
// // // //             ) : (
// // // //               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
// // // //                 {tests.map(test => <TestCard key={test.id} test={test} sc={sc} onView={() => { setSelectedTest(test); setShowQuestionsModal(true); }} onAddQuestion={() => { setSelectedTestForQuestion(test); setShowCreateQuestion(true); }} />)}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ===== SUBMISSIONS TAB ===== */}
// // // //         {activeTab === 'submissions' && (
// // // //           <div>
// // // //             <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>
// // // //               Submissions <span style={{ color: sc.textMuted, fontWeight: '400', fontSize: '0.875rem' }}>({submissions.length})</span>
// // // //             </h2>
// // // //             <div style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', overflow: 'hidden' }}>
// // // //               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
// // // //                 <thead>
// // // //                   <tr style={{ borderBottom: `1px solid ${sc.border}` }}>
// // // //                     {['Student', 'Question', 'Language', 'Score', 'Verdict', 'Time', 'Submitted'].map(h => (
// // // //                       <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: sc.textMuted, fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
// // // //                     ))}
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {submissions.map((sub, i) => (
// // // //                     <tr key={sub.id} style={{ borderBottom: i < submissions.length - 1 ? `1px solid ${sc.border}` : 'none', transition: 'background 0.1s' }}
// // // //                       onMouseEnter={e => e.currentTarget.style.background = sc.panel}
// // // //                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
// // // //                     >
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textPrimary, fontSize: '0.85rem' }}>#{sub.student_id}</td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textSecondary, fontSize: '0.85rem' }}>#{sub.question_id}</td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ background: 'rgba(59,130,246,0.1)', color: sc.blue, border: '1px solid rgba(59,130,246,0.2)', borderRadius: '5px', padding: '1px 8px', fontSize: '0.775rem', fontWeight: '600' }}>
// // // //                           {sub.language}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ color: sub.score >= 80 ? sc.green : sub.score >= 40 ? sc.yellow : sc.red, fontWeight: '700', fontSize: '0.875rem' }}>
// // // //                           {sub.score}%
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem' }}>
// // // //                         <span style={{ fontSize: '0.775rem', fontWeight: '600', padding: '2px 8px', borderRadius: '5px', background: sub.verdict === 'PASS' ? sc.greenBg : sc.redBg, color: sub.verdict === 'PASS' ? sc.green : sc.red }}>
// // // //                           {sub.verdict}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textMuted, fontSize: '0.825rem' }}>{sub.execution_time_ms}ms</td>
// // // //                       <td style={{ padding: '0.7rem 1rem', color: sc.textMuted, fontSize: '0.775rem' }}>{new Date(sub.submitted_at).toLocaleDateString()}</td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //               {submissions.length === 0 && (
// // // //                 <div style={{ padding: '3rem', textAlign: 'center', color: sc.textMuted }}>No submissions yet.</div>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* ===== ANALYTICS TAB ===== */}
// // // //         {activeTab === 'analytics' && (
// // // //           <div>
// // // //             <h2 style={{ color: sc.textPrimary, fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Analytics</h2>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
// // // //               {[
// // // //                 { label: 'Total Tests', value: tests.length, icon: <BookOpen size={20} color={sc.accent} />, color: sc.accent, bg: 'rgba(239,68,68,0.1)' },
// // // //                 { label: 'Total Submissions', value: totalSubmissions, icon: <FileText size={20} color={sc.blue} />, color: sc.blue, bg: 'rgba(59,130,246,0.1)' },
// // // //                 { label: 'Average Score', value: `${avgScore}%`, icon: <BarChart2 size={20} color={sc.green} />, color: sc.green, bg: sc.greenBg },
// // // //               ].map(stat => (
// // // //                 <div key={stat.label} style={{ background: sc.card, border: `1px solid ${sc.border}`, borderRadius: '12px', padding: '1.5rem' }}>
// // // //                   <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
// // // //                     {stat.icon}
// // // //                   </div>
// // // //                   <div style={{ color: stat.color, fontSize: '2rem', fontWeight: '700', lineHeight: 1, marginBottom: '0.35rem' }}>{stat.value}</div>
// // // //                   <div style={{ color: sc.textMuted, fontSize: '0.825rem' }}>{stat.label}</div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Questions Modal */}
// // // //       {showQuestionsModal && selectedTest && (
// // // //         <QuestionsModal test={selectedTest} onClose={() => setShowQuestionsModal(false)} />
// // // //       )}

// // // //       {/* Create Test Modal */}
// // // //       {showCreateTest && (
// // // //         <Modal title="Create New Test" onClose={() => setShowCreateTest(false)} sc={sc}>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// // // //             <div>
// // // //               <label style={labelStyle}>Title</label>
// // // //               <input style={inputStyle} placeholder="e.g. Arrays and Strings Test" value={newTest.title} onChange={e => setNewTest(p => ({ ...p, title: e.target.value }))} />
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Description</label>
// // // //               <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} placeholder="Describe the test..." value={newTest.description} onChange={e => setNewTest(p => ({ ...p, description: e.target.value }))} />
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Duration (minutes)</label>
// // // //               <input type="number" style={inputStyle} value={newTest.duration_minutes} onChange={e => setNewTest(p => ({ ...p, duration_minutes: parseInt(e.target.value) }))} />
// // // //             </div>
// // // //             <button onClick={handleCreateTest} style={{ background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
// // // //               Create Test
// // // //             </button>
// // // //           </div>
// // // //         </Modal>
// // // //       )}

// // // //       {/* Create Question Modal */}
// // // //       {showCreateQuestion && selectedTestForQuestion && (
// // // //         <Modal title={`Add Question to "${selectedTestForQuestion.title}"`} onClose={() => setShowCreateQuestion(false)} sc={sc} wide>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
// // // //               <div>
// // // //                 <label style={labelStyle}>Title</label>
// // // //                 <input style={inputStyle} placeholder="Question title" value={newQuestion.title} onChange={e => setNewQuestion(p => ({ ...p, title: e.target.value }))} />
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Topic</label>
// // // //                 <select style={inputStyle} value={newQuestion.topic} onChange={e => setNewQuestion(p => ({ ...p, topic: e.target.value }))}>
// // // //                   {['ARRAYS', 'STRINGS', 'LINKED_LIST', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING', 'RECURSION', 'MISC'].map(t => <option key={t}>{t}</option>)}
// // // //                 </select>
// // // //               </div>
// // // //             </div>
// // // //             <div>
// // // //               <label style={labelStyle}>Description</label>
// // // //               <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} placeholder="Describe the problem..." value={newQuestion.description} onChange={e => setNewQuestion(p => ({ ...p, description: e.target.value }))} />
// // // //             </div>
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
// // // //               <div>
// // // //                 <label style={labelStyle}>Difficulty</label>
// // // //                 <select style={inputStyle} value={newQuestion.difficulty} onChange={e => setNewQuestion(p => ({ ...p, difficulty: e.target.value }))}>
// // // //                   <option>EASY</option><option>MEDIUM</option><option>HARD</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Points</label>
// // // //                 <input type="number" style={inputStyle} value={newQuestion.points} onChange={e => setNewQuestion(p => ({ ...p, points: parseInt(e.target.value) }))} />
// // // //               </div>
// // // //               <div>
// // // //                 <label style={labelStyle}>Time Limit (ms)</label>
// // // //                 <input type="number" style={inputStyle} value={newQuestion.time_limit_ms} onChange={e => setNewQuestion(p => ({ ...p, time_limit_ms: parseInt(e.target.value) }))} />
// // // //               </div>
// // // //             </div>

// // // //             {/* Test Cases */}
// // // //             <div>
// // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
// // // //                 <label style={{ ...labelStyle, margin: 0 }}>Test Cases</label>
// // // //                 <button onClick={addTestCase} style={{ background: 'transparent', color: sc.accent, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //                   <Plus size={12} /> Add Case
// // // //                 </button>
// // // //               </div>
// // // //               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
// // // //                 {newQuestion.test_cases.map((tc, i) => (
// // // //                   <div key={i} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '8px', padding: '0.75rem' }}>
// // // //                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
// // // //                       <span style={{ color: sc.textMuted, fontSize: '0.775rem', fontWeight: '600' }}>Case {i + 1}</span>
// // // //                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
// // // //                         <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: sc.textSecondary, fontSize: '0.775rem' }}>
// // // //                           <input type="checkbox" checked={tc.is_hidden} onChange={e => updateTestCase(i, 'is_hidden', e.target.checked)} />
// // // //                           Hidden
// // // //                         </label>
// // // //                         {newQuestion.test_cases.length > 1 && (
// // // //                           <button onClick={() => removeTestCase(i)} style={{ background: 'transparent', border: 'none', color: sc.textMuted, cursor: 'pointer', padding: '0' }}>
// // // //                             <Trash2 size={14} />
// // // //                           </button>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
// // // //                       <div>
// // // //                         <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Input</label>
// // // //                         <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '50px', fontSize: '0.8rem', fontFamily: 'monospace' }} placeholder="stdin input" value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)} />
// // // //                       </div>
// // // //                       <div>
// // // //                         <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Expected Output</label>
// // // //                         <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '50px', fontSize: '0.8rem', fontFamily: 'monospace' }} placeholder="expected stdout" value={tc.expected_output} onChange={e => updateTestCase(i, 'expected_output', e.target.value)} />
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             </div>

// // // //             <button onClick={handleCreateQuestion} style={{ background: sc.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
// // // //               Create Question
// // // //             </button>
// // // //           </div>
// // // //         </Modal>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // function TestCard({ test, sc, onView, onAddQuestion }) {
// // // //   const [hovered, setHovered] = useState(false);
// // // //   return (
// // // //     <div
// // // //       onMouseEnter={() => setHovered(true)}
// // // //       onMouseLeave={() => setHovered(false)}
// // // //       style={{
// // // //         background: hovered ? sc.cardHover : sc.card,
// // // //         border: `1px solid ${hovered ? 'rgba(239,68,68,0.4)' : sc.border}`,
// // // //         borderRadius: '12px', padding: '1.25rem',
// // // //         transition: 'all 0.2s ease', borderLeft: `3px solid ${sc.accent}`
// // // //       }}
// // // //     >
// // // //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
// // // //         <h3 style={{ color: sc.textPrimary, fontSize: '0.975rem', fontWeight: '600', margin: 0, flex: 1, paddingRight: '0.5rem' }}>{test.title}</h3>
// // // //         <span style={{
// // // //           fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
// // // //           background: test.is_active ? sc.greenBg : sc.redBg,
// // // //           color: test.is_active ? sc.green : sc.red,
// // // //           border: `1px solid ${test.is_active ? 'rgba(63,185,80,0.25)' : 'rgba(248,81,73,0.25)'}`
// // // //         }}>
// // // //           {test.is_active ? 'Active' : 'Inactive'}
// // // //         </span>
// // // //       </div>
// // // //       <p style={{ color: sc.textMuted, fontSize: '0.825rem', margin: '0 0 1rem', lineHeight: '1.5' }}>{test.description}</p>
// // // //       <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
// // // //         <span style={{ color: sc.textMuted, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //           <Clock size={12} /> {test.duration_minutes}m
// // // //         </span>
// // // //         <span style={{ color: sc.textMuted, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// // // //           <FileText size={12} /> {test.question_count || 0} questions
// // // //         </span>
// // // //       </div>
// // // //       <div style={{ display: 'flex', gap: '0.5rem' }}>
// // // //         <button onClick={onView} style={{ flex: 1, background: 'transparent', color: sc.textSecondary, border: `1px solid ${sc.border}`, borderRadius: '7px', padding: '0.45rem 0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
// // // //           <Eye size={13} /> View
// // // //         </button>
// // // //         <button onClick={onAddQuestion} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', color: sc.accent, border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px', padding: '0.45rem 0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
// // // //           <Plus size={13} /> Add Question
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function Modal({ title, onClose, children, sc, wide }) {
// // // //   return (
// // // //     <div style={{
// // // //       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
// // // //       display: 'flex', alignItems: 'center', justifyContent: 'center',
// // // //       zIndex: 1000, padding: '1rem'
// // // //     }}>
// // // //       <div style={{
// // // //         background: sc.panel, border: `1px solid ${sc.border}`,
// // // //         borderRadius: '14px', width: '100%',
// // // //         maxWidth: wide ? '700px' : '480px',
// // // //         maxHeight: '90vh', overflowY: 'auto',
// // // //         boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
// // // //       }}>
// // // //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: `1px solid ${sc.border}` }}>
// // // //           <h3 style={{ color: sc.textPrimary, fontWeight: '700', fontSize: '1rem', margin: 0 }}>{title}</h3>
// // // //           <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: sc.textMuted, cursor: 'pointer', padding: '0.25rem' }}>
// // // //             <X size={18} />
// // // //           </button>
// // // //         </div>
// // // //         <div style={{ padding: '1.5rem' }}>{children}</div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default TeacherDashboard;



// // // // import { useState, useEffect } from 'react';
// // // // import { Plus, Book, Users, BarChart3, Search, Calendar, Clock, FileText, Eye, Edit2, Trash2 } from 'lucide-react';
// // // // import axios from 'axios';
// // // // import QuestionsModal from './QuestionsModal';

// // // // const API_URL = `https://dsa-platform-production-64f6.up.railway.app/api/teacher`;

// // // // function TeacherDashboard() {
// // // //   const [activeTab, setActiveTab] = useState('tests');
// // // //   const [tests, setTests] = useState([]);
// // // //   const [submissions, setSubmissions] = useState([]);
// // // //   const [showCreateTest, setShowCreateTest] = useState(false);
// // // //   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
// // // //   const [selectedTest, setSelectedTest] = useState(null);
// // // //   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
// // // //   const [selectedTestId, setSelectedTestId] = useState(null);
// // // //   const [selectedTestTitle, setSelectedTestTitle] = useState('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

// // // //   useEffect(() => {
// // // //     fetchTests();
// // // //     fetchSubmissions();
// // // //   }, []);

// // // //   const fetchTests = async () => {
// // // //     try {
// // // //       const response = await axios.get(`${API_URL}/tests`);
// // // //       setTests(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching tests:', error);
// // // //     }
// // // //   };

// // // //   const fetchSubmissions = async () => {
// // // //     try {
// // // //       const response = await axios.get(`${API_URL}/submissions`);
// // // //       setSubmissions(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching submissions:', error);
// // // //     }
// // // //   };

// // // //   // Filter tests based on search and status
// // // //   const filteredTests = tests.filter(test => {
// // // //     const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // //                          test.description.toLowerCase().includes(searchQuery.toLowerCase());
// // // //     const matchesStatus = statusFilter === 'all' || 
// // // //                          (statusFilter === 'active' && test.is_active) ||
// // // //                          (statusFilter === 'inactive' && !test.is_active);
// // // //     return matchesSearch && matchesStatus;
// // // //   });

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
// // // //       {/* Top Navigation Bar */}
// // // //       <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
// // // //         <div className="max-w-7xl mx-auto px-6 py-4">
// // // //           <div className="flex justify-between items-center">
// // // //             <div>
// // // //               <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
// // // //               <p className="text-sm text-gray-600 mt-1">Shri Shankaracharya Institute of Professional Management and Technology</p>
// // // //             </div>
// // // //             <div className="flex items-center gap-3">
// // // //               <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
// // // //                 AS
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="max-w-7xl mx-auto px-6 py-6">
// // // //         <div className="flex gap-6">
// // // //           {/* Sidebar */}
// // // //           <div className="w-64 flex-shrink-0">
// // // //             <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
// // // //               {/* Navigation Tabs */}
// // // //               <div className="space-y-1 mb-6">
// // // //                 <button
// // // //                   onClick={() => setActiveTab('tests')}
// // // //                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
// // // //                     activeTab === 'tests'
// // // //                       ? 'bg-blue-50 text-blue-700 font-medium'
// // // //                       : 'text-gray-700 hover:bg-gray-50'
// // // //                   }`}
// // // //                 >
// // // //                   <Book className="w-5 h-5" />
// // // //                   <span>Assessments</span>
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={() => setActiveTab('submissions')}
// // // //                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
// // // //                     activeTab === 'submissions'
// // // //                       ? 'bg-blue-50 text-blue-700 font-medium'
// // // //                       : 'text-gray-700 hover:bg-gray-50'
// // // //                   }`}
// // // //                 >
// // // //                   <Users className="w-5 h-5" />
// // // //                   <div className="flex justify-between items-center flex-1">
// // // //                     <span>Submissions</span>
// // // //                     <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{submissions.length}</span>
// // // //                   </div>
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={() => setActiveTab('analytics')}
// // // //                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
// // // //                     activeTab === 'analytics'
// // // //                       ? 'bg-blue-50 text-blue-700 font-medium'
// // // //                       : 'text-gray-700 hover:bg-gray-50'
// // // //                   }`}
// // // //                 >
// // // //                   <BarChart3 className="w-5 h-5" />
// // // //                   <span>Analytics</span>
// // // //                 </button>
// // // //               </div>

// // // //               {/* Filters (only show on tests tab) */}
// // // //               {activeTab === 'tests' && (
// // // //                 <>
// // // //                   <div className="border-t pt-4">
// // // //                     <h3 className="text-sm font-semibold text-gray-700 mb-3">Test status</h3>
// // // //                     <div className="space-y-2">
// // // //                       <label className="flex items-center gap-2 cursor-pointer">
// // // //                         <input
// // // //                           type="radio"
// // // //                           name="status"
// // // //                           checked={statusFilter === 'all'}
// // // //                           onChange={() => setStatusFilter('all')}
// // // //                           className="text-blue-600"
// // // //                         />
// // // //                         <span className="text-sm text-gray-700">All ({tests.length})</span>
// // // //                       </label>
// // // //                       <label className="flex items-center gap-2 cursor-pointer">
// // // //                         <input
// // // //                           type="radio"
// // // //                           name="status"
// // // //                           checked={statusFilter === 'active'}
// // // //                           onChange={() => setStatusFilter('active')}
// // // //                           className="text-blue-600"
// // // //                         />
// // // //                         <span className="text-sm text-gray-700">Active ({tests.filter(t => t.is_active).length})</span>
// // // //                       </label>
// // // //                       <label className="flex items-center gap-2 cursor-pointer">
// // // //                         <input
// // // //                           type="radio"
// // // //                           name="status"
// // // //                           checked={statusFilter === 'inactive'}
// // // //                           onChange={() => setStatusFilter('inactive')}
// // // //                           className="text-blue-600"
// // // //                         />
// // // //                         <span className="text-sm text-gray-700">Inactive ({tests.filter(t => !t.is_active).length})</span>
// // // //                       </label>
// // // //                     </div>
// // // //                   </div>
// // // //                 </>
// // // //               )}
// // // //             </div>
// // // //           </div>

// // // //           {/* Main Content */}
// // // //           <div className="flex-1">
// // // //             {/* Tests Tab */}
// // // //             {activeTab === 'tests' && (
// // // //               <div>
// // // //                 {/* Search and Create Button */}
// // // //                 <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
// // // //                   <div className="flex gap-3 items-center">
// // // //                     <div className="flex-1 relative">
// // // //                       <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // // //                       <input
// // // //                         type="text"
// // // //                         placeholder="Search by test names or tags"
// // // //                         value={searchQuery}
// // // //                         onChange={(e) => setSearchQuery(e.target.value)}
// // // //                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                       />
// // // //                     </div>
// // // //                     <button
// // // //                       onClick={() => setShowCreateTest(true)}
// // // //                       className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
// // // //                     >
// // // //                       <Plus className="w-5 h-5" />
// // // //                       Create new test
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Tests Grid */}
// // // //                 <div className="space-y-4">
// // // //                   {filteredTests.length === 0 ? (
// // // //                     <div className="bg-white rounded-lg shadow-sm p-12 text-center">
// // // //                       <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// // // //                       <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests found</h3>
// // // //                       <p className="text-gray-500 mb-4">
// // // //                         {searchQuery ? 'Try adjusting your search' : 'Create your first test to get started'}
// // // //                       </p>
// // // //                       {!searchQuery && (
// // // //                         <button
// // // //                           onClick={() => setShowCreateTest(true)}
// // // //                           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
// // // //                         >
// // // //                           <Plus className="w-5 h-5" />
// // // //                           Create new test
// // // //                         </button>
// // // //                       )}
// // // //                     </div>
// // // //                   ) : (
// // // //                     filteredTests.map((test) => (
// // // //                       <div
// // // //                         key={test.id}
// // // //                         className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
// // // //                       >
// // // //                         <div className="p-6">
// // // //                           <div className="flex justify-between items-start">
// // // //                             <div className="flex-1">
// // // //                               <div className="flex items-center gap-3 mb-2">
// // // //                                 <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
// // // //                                 {test.is_active ? (
// // // //                                   <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Active</span>
// // // //                                 ) : (
// // // //                                   <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">Inactive</span>
// // // //                                 )}
// // // //                               </div>
                              
// // // //                               <p className="text-gray-600 mb-4">{test.description || 'No description provided'}</p>
                              
// // // //                               <div className="flex items-center gap-6 text-sm text-gray-500">
// // // //                                 <div className="flex items-center gap-2">
// // // //                                   <Clock className="w-4 h-4" />
// // // //                                   <span>{test.duration_minutes} mins</span>
// // // //                                 </div>
// // // //                                 <div className="flex items-center gap-2">
// // // //                                   <Calendar className="w-4 h-4" />
// // // //                                   <span>{new Date(test.created_at).toLocaleDateString('en-IN', { 
// // // //                                     day: 'numeric', 
// // // //                                     month: 'short', 
// // // //                                     year: 'numeric' 
// // // //                                   })}</span>
// // // //                                 </div>
// // // //                                 <div className="text-xs text-gray-400">
// // // //                                   Created {Math.floor((Date.now() - new Date(test.created_at).getTime()) / (1000 * 60 * 60))} hours ago
// // // //                                 </div>
// // // //                               </div>
// // // //                             </div>

// // // //                             <div className="flex gap-2">
// // // //                               <button
// // // //                                 onClick={() => {
// // // //                                   setSelectedTestId(test.id);
// // // //                                   setSelectedTestTitle(test.title);
// // // //                                   setShowQuestionsModal(true);
// // // //                                 }}
// // // //                                 className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 font-medium transition-colors"
// // // //                               >
// // // //                                 <Eye className="w-4 h-4" />
// // // //                                 Preview test
// // // //                               </button>
// // // //                               <button
// // // //                                 onClick={() => {
// // // //                                   setSelectedTest(test);
// // // //                                   setShowCreateQuestion(true);
// // // //                                 }}
// // // //                                 className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 font-medium transition-colors"
// // // //                               >
// // // //                                 <Plus className="w-4 h-4" />
// // // //                                 Add Question
// // // //                               </button>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                     ))
// // // //                   )}
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             {/* Submissions Tab */}
// // // //             {activeTab === 'submissions' && (
// // // //               <div>
// // // //                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// // // //                   <div className="p-6 border-b">
// // // //                     <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
// // // //                     <p className="text-sm text-gray-600 mt-1">View and analyze student submissions</p>
// // // //                   </div>
// // // //                   <div className="overflow-x-auto">
// // // //                     <table className="min-w-full divide-y divide-gray-200">
// // // //                       <thead className="bg-gray-50">
// // // //                         <tr>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdict</th>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
// // // //                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
// // // //                         </tr>
// // // //                       </thead>
// // // //                       <tbody className="bg-white divide-y divide-gray-200">
// // // //                         {submissions.map((submission) => (
// // // //                           <tr key={submission.id} className="hover:bg-gray-50">
// // // //                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{submission.id}</td>
// // // //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Student {submission.student_id}</td>
// // // //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Q{submission.question_id}</td>
// // // //                             <td className="px-6 py-4 whitespace-nowrap">
// // // //                               <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">{submission.language}</span>
// // // //                             </td>
// // // //                             <td className="px-6 py-4 whitespace-nowrap">
// // // //                               <span className={`px-2 py-1 text-xs font-semibold rounded ${
// // // //                                 submission.score === 100 ? 'bg-green-100 text-green-800' :
// // // //                                 submission.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
// // // //                                 'bg-red-100 text-red-800'
// // // //                               }`}>
// // // //                                 {submission.score}%
// // // //                               </span>
// // // //                             </td>
// // // //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.verdict}</td>
// // // //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.execution_time_ms}ms</td>
// // // //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // // //                               {new Date(submission.submitted_at).toLocaleString('en-IN')}
// // // //                             </td>
// // // //                           </tr>
// // // //                         ))}
// // // //                       </tbody>
// // // //                     </table>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             {/* Analytics Tab */}
// // // //             {activeTab === 'analytics' && (
// // // //               <div>
// // // //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
// // // //                   <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
// // // //                     <div className="text-sm font-medium text-gray-600">Total Tests</div>
// // // //                     <div className="text-3xl font-bold text-gray-900 mt-2">{tests.length}</div>
// // // //                     <div className="text-xs text-gray-500 mt-1">{tests.filter(t => t.is_active).length} active</div>
// // // //                   </div>
// // // //                   <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
// // // //                     <div className="text-sm font-medium text-gray-600">Total Submissions</div>
// // // //                     <div className="text-3xl font-bold text-gray-900 mt-2">{submissions.length}</div>
// // // //                     <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
// // // //                   </div>
// // // //                   <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
// // // //                     <div className="text-sm font-medium text-gray-600">Average Score</div>
// // // //                     <div className="text-3xl font-bold text-gray-900 mt-2">
// // // //                       {submissions.length > 0
// // // //                         ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)
// // // //                         : 0}%
// // // //                     </div>
// // // //                     <div className="text-xs text-gray-500 mt-1">Across all tests</div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Modals */}
// // // //       {showCreateTest && (
// // // //         <CreateTestModal
// // // //           onClose={() => setShowCreateTest(false)}
// // // //           onSuccess={() => {
// // // //             setShowCreateTest(false);
// // // //             fetchTests();
// // // //           }}
// // // //         />
// // // //       )}

// // // //       {showCreateQuestion && selectedTest && (
// // // //         <CreateQuestionModal
// // // //           test={selectedTest}
// // // //           onClose={() => {
// // // //             setShowCreateQuestion(false);
// // // //             setSelectedTest(null);
// // // //           }}
// // // //           onSuccess={() => {
// // // //             setShowCreateQuestion(false);
// // // //             setSelectedTest(null);
// // // //           }}
// // // //         />
// // // //       )}

// // // //       <QuestionsModal
// // // //         testId={selectedTestId}
// // // //         testTitle={selectedTestTitle}
// // // //         isOpen={showQuestionsModal}
// // // //         onClose={() => {
// // // //           setShowQuestionsModal(false);
// // // //           setSelectedTestId(null);
// // // //           setSelectedTestTitle('');
// // // //         }}
// // // //       />
// // // //     </div>
// // // //   );
// // // // }

// // // // // Keep the same CreateTestModal and CreateQuestionModal components from before
// // // // // (I'll add them in the next message to keep this response manageable)

// // // // function CreateTestModal({ onClose, onSuccess }) {
// // // //   const [formData, setFormData] = useState({
// // // //     title: '',
// // // //     description: '',
// // // //     duration_minutes: 60,
// // // //     is_active: true
// // // //   });

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     try {
// // // //       await axios.post(`${API_URL}/tests`, formData);
// // // //       onSuccess();
// // // //     } catch (error) {
// // // //       console.error('Error creating test:', error);
// // // //       alert('Failed to create test');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // //       <div className="bg-white rounded-lg p-6 w-full max-w-md">
// // // //         <h3 className="text-xl font-semibold mb-4">Create New Test</h3>
// // // //         <form onSubmit={handleSubmit}>
// // // //           <div className="space-y-4">
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
// // // //               <input
// // // //                 type="text"
// // // //                 value={formData.title}
// // // //                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// // // //               <textarea
// // // //                 value={formData.description}
// // // //                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 rows="3"
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
// // // //               <input
// // // //                 type="number"
// // // //                 value={formData.duration_minutes}
// // // //                 onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 min="1"
// // // //               />
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex gap-3 mt-6">
// // // //             <button
// // // //               type="button"
// // // //               onClick={onClose}
// // // //               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
// // // //             >
// // // //               Cancel
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// // // //             >
// // // //               Create Test
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function CreateQuestionModal({ test, onClose, onSuccess }) {
// // // //   const [formData, setFormData] = useState({
// // // //     test_id: test.id,
// // // //     title: '',
// // // //     description: '',
// // // //     difficulty: 'EASY',
// // // //     topic: 'ARRAYS',
// // // //     points: 10,
// // // //     time_limit_ms: 2000
// // // //   });

// // // //   const [testCases, setTestCases] = useState([
// // // //     { input: '', expected_output: '', is_hidden: false, points: 1 }
// // // //   ]);

// // // //   const addTestCase = () => {
// // // //     setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false, points: 1 }]);
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     try {
// // // //       const questionResponse = await axios.post(`${API_URL}/questions`, formData);
// // // //       const questionId = questionResponse.data.id;

// // // //       for (const testCase of testCases) {
// // // //         await axios.post(`${API_URL}/test-cases`, {
// // // //           question_id: questionId,
// // // //           ...testCase
// // // //         });
// // // //       }

// // // //       alert('Question created successfully!');
// // // //       onSuccess();
// // // //     } catch (error) {
// // // //       console.error('Error creating question:', error);
// // // //       alert('Failed to create question');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
// // // //       <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
// // // //         <h3 className="text-xl font-semibold mb-4">Add Question to: {test.title}</h3>
// // // //         <form onSubmit={handleSubmit}>
// // // //           <div className="space-y-4">
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
// // // //               <input
// // // //                 type="text"
// // // //                 value={formData.title}
// // // //                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// // // //               <textarea
// // // //                 value={formData.description}
// // // //                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// // // //                 rows="4"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <div className="grid grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
// // // //                 <select
// // // //                   value={formData.difficulty}
// // // //                   onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
// // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// // // //                 >
// // // //                   <option value="EASY">Easy</option>
// // // //                   <option value="MEDIUM">Medium</option>
// // // //                   <option value="HARD">Hard</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
// // // //                 <select
// // // //                   value={formData.topic}
// // // //                   onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
// // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// // // //                 >
// // // //                   <option value="ARRAYS">Arrays</option>
// // // //                   <option value="STRINGS">Strings</option>
// // // //                   <option value="LINKED_LISTS">Linked Lists</option>
// // // //                   <option value="TREES">Trees</option>
// // // //                   <option value="GRAPHS">Graphs</option>
// // // //                   <option value="SORTING">Sorting</option>
// // // //                   <option value="SEARCHING">Searching</option>
// // // //                   <option value="DYNAMIC_PROGRAMMING">Dynamic Programming</option>
// // // //                 </select>
// // // //               </div>
// // // //             </div>

// // // //             <div className="border-t pt-4">
// // // //               <div className="flex justify-between items-center mb-3">
// // // //                 <h4 className="font-medium">Test Cases</h4>
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={addTestCase}
// // // //                   className="text-blue-600 hover:text-blue-700 text-sm font-medium"
// // // //                 >
// // // //                   + Add Test Case
// // // //                 </button>
// // // //               </div>
// // // //               {testCases.map((tc, index) => (
// // // //                 <div key={index} className="bg-gray-50 p-3 rounded-lg mb-3">
// // // //                   <div className="grid grid-cols-2 gap-3">
// // // //                     <div>
// // // //                       <label className="block text-xs font-medium text-gray-700 mb-1">Input</label>
// // // //                       <textarea
// // // //                         value={tc.input}
// // // //                         onChange={(e) => {
// // // //                           const updated = [...testCases];
// // // //                           updated[index].input = e.target.value;
// // // //                           setTestCases(updated);
// // // //                         }}
// // // //                         className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
// // // //                         rows="2"
// // // //                         required
// // // //                       />
// // // //                     </div>
// // // //                     <div>
// // // //                       <label className="block text-xs font-medium text-gray-700 mb-1">Expected Output</label>
// // // //                       <textarea
// // // //                         value={tc.expected_output}
// // // //                         onChange={(e) => {
// // // //                           const updated = [...testCases];
// // // //                           updated[index].expected_output = e.target.value;
// // // //                           setTestCases(updated);
// // // //                         }}
// // // //                         className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
// // // //                         rows="2"
// // // //                         required
// // // //                       />
// // // //                     </div>
// // // //                   </div>
// // // //                   <label className="flex items-center mt-2 text-sm">
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       checked={tc.is_hidden}
// // // //                       onChange={(e) => {
// // // //                         const updated = [...testCases];
// // // //                         updated[index].is_hidden = e.target.checked;
// // // //                         setTestCases(updated);
// // // //                       }}
// // // //                       className="mr-2"
// // // //                     />
// // // //                     Hidden Test Case
// // // //                   </label>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex gap-3 mt-6">
// // // //             <button
// // // //               type="button"
// // // //               onClick={onClose}
// // // //               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
// // // //             >
// // // //               Cancel
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// // // //             >
// // // //               Create Question
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default TeacherDashboard;










// // // // import { useState, useEffect } from 'react';
// // // // import { Plus, Search, Mail, Clock, Calendar, Eye } from 'lucide-react';
// // // // import axios from 'axios';
// // // // import TestDetailsPage from './TestDetailsPage';
// // // // import QuestionsModal from './QuestionsModal';

// // // // const API_URL = `https://dsa-platform-production-64f6.up.railway.app/api/teacher`;

// // // // function TeacherDashboard() {
// // // //   const [selectedTestForDetails, setSelectedTestForDetails] = useState(null);
// // // //   const [tests, setTests] = useState([]);
// // // //   const [submissions, setSubmissions] = useState([]);
// // // //   const [showCreateTest, setShowCreateTest] = useState(false);
// // // //   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
// // // //   const [selectedTest, setSelectedTest] = useState(null);
// // // //   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
// // // //   const [selectedTestId, setSelectedTestId] = useState(null);
// // // //   const [selectedTestTitle, setSelectedTestTitle] = useState('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [statusFilter, setStatusFilter] = useState('all');
// // // //   const [customTopic, setCustomTopic] = useState('');
// // // //   const [isCustomTopic, setIsCustomTopic] = useState(false);

// // // //   useEffect(() => {
// // // //     fetchTests();
// // // //     fetchSubmissions();
// // // //   }, []);

// // // //   const fetchTests = async () => {
// // // //     try {
// // // //       const response = await axios.get(`${API_URL}/tests`);
// // // //       setTests(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching tests:', error);
// // // //     }
// // // //   };

// // // //   const fetchSubmissions = async () => {
// // // //     try {
// // // //       const response = await axios.get(`${API_URL}/submissions`);
// // // //       setSubmissions(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching submissions:', error);
// // // //     }
// // // //   };

// // // //   const filteredTests = tests.filter(test => {
// // // //     const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
// // // //     const matchesStatus = statusFilter === 'all' || 
// // // //                          (statusFilter === 'drafts' && !test.is_active);
// // // //     return matchesSearch && matchesStatus;
// // // //   });

// // // //   return (
// // // //     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
// // // //       {/* Sidebar */}
// // // //       <div style={{ 
// // // //         width: '200px', 
// // // //         backgroundColor: '#fff', 
// // // //         borderRight: '1px solid #e0e0e0',
// // // //         padding: '20px',
// // // //         flexShrink: 0
// // // //       }}>
// // // //         <div style={{ marginBottom: '24px' }}>
// // // //           <div style={{ 
// // // //             fontSize: '13px', 
// // // //             color: '#666', 
// // // //             marginBottom: '12px',
// // // //             fontWeight: 600
// // // //           }}>
// // // //             Test status
// // // //           </div>
// // // //           <label style={{ 
// // // //             display: 'flex', 
// // // //             alignItems: 'center', 
// // // //             marginBottom: '8px',
// // // //             cursor: 'pointer',
// // // //             fontSize: '14px'
// // // //           }}>
// // // //             <input 
// // // //               type="radio" 
// // // //               name="status"
// // // //               checked={statusFilter === 'drafts'}
// // // //               onChange={() => setStatusFilter('drafts')}
// // // //               style={{ marginRight: '8px' }}
// // // //             />
// // // //             <span style={{ color: '#2196F3' }}>Drafts ({tests.filter(t => !t.is_active).length})</span>
// // // //           </label>
// // // //         </div>

// // // //         <div style={{ marginBottom: '24px' }}>
// // // //           <div style={{ 
// // // //             fontSize: '13px', 
// // // //             color: '#666', 
// // // //             marginBottom: '12px',
// // // //             fontWeight: 600
// // // //           }}>
// // // //             Created by
// // // //           </div>
// // // //           <select style={{ 
// // // //             width: '100%',
// // // //             padding: '6px 8px',
// // // //             border: '1px solid #ddd',
// // // //             borderRadius: '4px',
// // // //             fontSize: '14px',
// // // //             backgroundColor: '#fff'
// // // //           }}>
// // // //             <option>All</option>
// // // //           </select>
// // // //         </div>

// // // //         <div style={{ marginBottom: '24px' }}>
// // // //           <div style={{ 
// // // //             fontSize: '13px', 
// // // //             color: '#666', 
// // // //             marginBottom: '12px',
// // // //             fontWeight: 600
// // // //           }}>
// // // //             Creation date
// // // //           </div>
// // // //           <select style={{ 
// // // //             width: '100%',
// // // //             padding: '6px 8px',
// // // //             border: '1px solid #ddd',
// // // //             borderRadius: '4px',
// // // //             fontSize: '14px',
// // // //             backgroundColor: '#fff'
// // // //           }}>
// // // //             <option>Any time</option>
// // // //           </select>
// // // //         </div>

// // // //         <div>
// // // //           <div style={{ 
// // // //             fontSize: '13px', 
// // // //             color: '#666', 
// // // //             marginBottom: '12px',
// // // //             fontWeight: 600
// // // //           }}>
// // // //             Test type
// // // //           </div>
// // // //           <label style={{ 
// // // //             display: 'flex', 
// // // //             alignItems: 'center', 
// // // //             marginBottom: '8px',
// // // //             cursor: 'pointer',
// // // //             fontSize: '14px'
// // // //           }}>
// // // //             <input 
// // // //               type="checkbox" 
// // // //               defaultChecked
// // // //               style={{ marginRight: '8px' }}
// // // //             />
// // // //             Public
// // // //           </label>
// // // //           <label style={{ 
// // // //             display: 'flex', 
// // // //             alignItems: 'center',
// // // //             cursor: 'pointer',
// // // //             fontSize: '14px'
// // // //           }}>
// // // //             <input 
// // // //               type="checkbox" 
// // // //               defaultChecked
// // // //               style={{ marginRight: '8px' }}
// // // //             />
// // // //             Invite only
// // // //           </label>
// // // //         </div>
// // // //       </div>

// // // //       {/* Main Content */}
// // // //       <div style={{ flex: 1, padding: '24px 40px' }}>
// // // //         {/* Header */}
// // // //         <div style={{ 
// // // //           display: 'flex', 
// // // //           justifyContent: 'space-between', 
// // // //           alignItems: 'center',
// // // //           marginBottom: '24px'
// // // //         }}>
// // // //           <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '600px' }}>
// // // //             <input
// // // //               type="text"
// // // //               placeholder="Search by test names or tags"
// // // //               value={searchQuery}
// // // //               onChange={(e) => setSearchQuery(e.target.value)}
// // // //               style={{
// // // //                 flex: 1,
// // // //                 padding: '8px 12px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px 0 0 4px',
// // // //                 fontSize: '14px',
// // // //                 outline: 'none'
// // // //               }}
// // // //             />
// // // //             <button style={{
// // // //               padding: '8px 16px',
// // // //               backgroundColor: '#2196F3',
// // // //               color: 'white',
// // // //               border: 'none',
// // // //               borderRadius: '0 4px 4px 0',
// // // //               cursor: 'pointer',
// // // //               marginLeft: '-1px'
// // // //             }}>
// // // //               <Search size={16} />
// // // //             </button>
// // // //           </div>
          
// // // //           <button
// // // //             onClick={() => setShowCreateTest(true)}
// // // //             style={{
// // // //               padding: '10px 20px',
// // // //               backgroundColor: '#2196F3',
// // // //               color: 'white',
// // // //               border: 'none',
// // // //               borderRadius: '4px',
// // // //               cursor: 'pointer',
// // // //               fontSize: '14px',
// // // //               fontWeight: 500,
// // // //               display: 'flex',
// // // //               alignItems: 'center',
// // // //               gap: '8px'
// // // //             }}
// // // //           >
// // // //             <Plus size={18} />
// // // //             Create new test
// // // //           </button>
// // // //         </div>

// // // //         {/* Test Cards */}
// // // //         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
// // // //           {filteredTests.map((test) => (
// // // //             <div 
// // // //               key={test.id}
// // // //               style={{
// // // //                 backgroundColor: '#fff',
// // // //                 border: '1px solid #e0e0e0',
// // // //                 borderRadius: '4px',
// // // //                 padding: '20px 24px',
// // // //                 cursor: 'pointer'
// // // //               }}
// // // //               onClick={() => setSelectedTestForDetails(test)} 
// // // //             >
// // // //               <div style={{ marginBottom: '12px' }}>
// // // //                 <h3 style={{ 
// // // //                   fontSize: '16px', 
// // // //                   fontWeight: 600, 
// // // //                   color: '#333',
// // // //                   marginBottom: '8px'
// // // //                 }}>
// // // //                   {test.title}
// // // //                 </h3>
// // // //               </div>

// // // //               <div style={{ 
// // // //                 display: 'flex', 
// // // //                 gap: '20px', 
// // // //                 fontSize: '13px', 
// // // //                 color: '#666',
// // // //                 marginBottom: '12px'
// // // //               }}>
// // // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // //                   <Mail size={14} />
// // // //                   <span>Invite only</span>
// // // //                 </div>
// // // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // //                   <Clock size={14} />
// // // //                   <span>{test.duration_minutes} min</span>
// // // //                 </div>
// // // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // //                   <Calendar size={14} />
// // // //                   <span>{new Date(test.created_at).toLocaleDateString('en-US', { 
// // // //                     month: 'short', 
// // // //                     day: 'numeric', 
// // // //                     year: 'numeric' 
// // // //                   })} {new Date(test.created_at).toLocaleTimeString('en-US', { 
// // // //                     hour: '2-digit', 
// // // //                     minute: '2-digit',
// // // //                     hour12: true 
// // // //                   })} IST (Asia/Kolkata) - No end date specified</span>
// // // //                 </div>
// // // //               </div>

// // // //               <div style={{ 
// // // //                 display: 'flex', 
// // // //                 justifyContent: 'space-between',
// // // //                 alignItems: 'center'
// // // //               }}>
// // // //                 <div style={{ fontSize: '13px', color: '#999' }}>
// // // //                   Created {Math.floor((Date.now() - new Date(test.created_at)) / (1000 * 60 * 60))} hours ago
// // // //                   {' · '}
// // // //                   <button
// // // //                     onClick={() => {
// // // //                       setSelectedTestId(test.id);
// // // //                       setSelectedTestTitle(test.title);
// // // //                       setShowQuestionsModal(true);
// // // //                     }}
// // // //                     style={{
// // // //                       background: 'none',
// // // //                       border: 'none',
// // // //                       color: '#2196F3',
// // // //                       cursor: 'pointer',
// // // //                       padding: 0,
// // // //                       fontSize: '13px'
// // // //                     }}
// // // //                   >
// // // //                     Review questions
// // // //                   </button>
// // // //                 </div>

// // // //                 <div style={{ display: 'flex', gap: '12px' }}>
// // // //                   <button
// // // //                     onClick={() => {
// // // //                       setSelectedTestId(test.id);
// // // //                       setSelectedTestTitle(test.title);
// // // //                       setShowQuestionsModal(true);
// // // //                     }}
// // // //                     style={{
// // // //                       padding: '6px 16px',
// // // //                       backgroundColor: 'transparent',
// // // //                       color: '#2196F3',
// // // //                       border: '1px solid #2196F3',
// // // //                       borderRadius: '4px',
// // // //                       cursor: 'pointer',
// // // //                       fontSize: '13px',
// // // //                       fontWeight: 500,
// // // //                       display: 'flex',
// // // //                       alignItems: 'center',
// // // //                       gap: '6px'
// // // //                     }}
// // // //                   >
// // // //                     <Eye size={14} />
// // // //                     Preview test
// // // //                   </button>
                  
// // // //                   <button
// // // //                     onClick={() => {
// // // //                       setSelectedTest(test);
// // // //                       setShowCreateQuestion(true);
// // // //                     }}
// // // //                     style={{
// // // //                       padding: '6px 16px',
// // // //                       backgroundColor: 'transparent',
// // // //                       color: '#666',
// // // //                       border: '1px solid #ddd',
// // // //                       borderRadius: '4px',
// // // //                       cursor: 'pointer',
// // // //                       fontSize: '13px',
// // // //                       fontWeight: 500
// // // //                     }}
// // // //                   >
// // // //                     <Plus size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
// // // //                     Add Question
// // // //                   </button>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           ))}

// // // //           {filteredTests.length === 0 && (
// // // //             <div style={{ 
// // // //               textAlign: 'center', 
// // // //               padding: '60px 20px',
// // // //               backgroundColor: '#fff',
// // // //               borderRadius: '4px',
// // // //               border: '1px solid #e0e0e0'
// // // //             }}>
// // // //               <p style={{ color: '#999', fontSize: '14px' }}>No tests found</p>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Modals */}
// // // //       {showCreateTest && (
// // // //         <CreateTestModal
// // // //           onClose={() => setShowCreateTest(false)}
// // // //           onSuccess={() => {
// // // //             setShowCreateTest(false);
// // // //             fetchTests();
// // // //           }}
// // // //         />
// // // //       )}

// // // //       {showCreateQuestion && selectedTest && (
// // // //         <CreateQuestionModal
// // // //           test={selectedTest}
// // // //           onClose={() => {
// // // //             setShowCreateQuestion(false);
// // // //             setSelectedTest(null);
// // // //           }}
// // // //           onSuccess={() => {
// // // //             setShowCreateQuestion(false);
// // // //             setSelectedTest(null);
// // // //           }}
// // // //         />
// // // //       )}

// // // //       <QuestionsModal
// // // //         testId={selectedTestId}
// // // //         testTitle={selectedTestTitle}
// // // //         isOpen={showQuestionsModal}
// // // //         onClose={() => {
// // // //           setShowQuestionsModal(false);
// // // //           setSelectedTestId(null);
// // // //           setSelectedTestTitle('');
// // // //         }}
// // // //       />
// // // //     </div>
// // // //   );
// // // // }

// // // // function CreateTestModal({ onClose, onSuccess }) {
// // // //   const [formData, setFormData] = useState({
// // // //     title: '',
// // // //     description: '',
// // // //     duration_minutes: 60,
// // // //     is_active: true
// // // //   });

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     try {
// // // //       await axios.post(`${API_URL}/tests`, formData);
// // // //       onSuccess();
// // // //     } catch (error) {
// // // //       console.error('Error creating test:', error);
// // // //       alert('Failed to create test');
// // // //     }
// // // //   };

// // // //   if (selectedTestForDetails) {
// // // //   return (
// // // //     <TestDetailsPage
// // // //       test={selectedTestForDetails}
// // // //       onBack={() => setSelectedTestForDetails(null)}
// // // //       onAddQuestion={(test) => {
// // // //         setSelectedTest(test);
// // // //         setShowCreateQuestion(true);
// // // //       }}
// // // //     />
// // // //   );
// // // // }
// // // //   return (
// // // //     <div style={{
// // // //       position: 'fixed',
// // // //       top: 0,
// // // //       left: 0,
// // // //       right: 0,
// // // //       bottom: 0,
// // // //       backgroundColor: 'rgba(0,0,0,0.5)',
// // // //       display: 'flex',
// // // //       alignItems: 'center',
// // // //       justifyContent: 'center',
// // // //       zIndex: 1000
// // // //     }}>
// // // //       <div style={{
// // // //         backgroundColor: 'white',
// // // //         borderRadius: '8px',
// // // //         padding: '24px',
// // // //         width: '100%',
// // // //         maxWidth: '500px'
// // // //       }}>
// // // //         <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Create New Test</h3>
// // // //         <form onSubmit={handleSubmit}>
// // // //           <div style={{ marginBottom: '16px' }}>
// // // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // // //               Title
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               value={formData.title}
// // // //               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // // //               style={{
// // // //                 width: '100%',
// // // //                 padding: '8px 12px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px',
// // // //                 fontSize: '14px'
// // // //               }}
// // // //               required
// // // //             />
// // // //           </div>
// // // //           <div style={{ marginBottom: '16px' }}>
// // // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // // //               Description
// // // //             </label>
// // // //             <textarea
// // // //               value={formData.description}
// // // //               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // // //               style={{
// // // //                 width: '100%',
// // // //                 padding: '8px 12px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px',
// // // //                 fontSize: '14px',
// // // //                 minHeight: '80px'
// // // //               }}
// // // //             />
// // // //           </div>
// // // //           <div style={{ marginBottom: '24px' }}>
// // // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // // //               Duration (minutes)
// // // //             </label>
// // // //             <input
// // // //               type="number"
// // // //               value={formData.duration_minutes}
// // // //               onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
// // // //               style={{
// // // //                 width: '100%',
// // // //                 padding: '8px 12px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px',
// // // //                 fontSize: '14px'
// // // //               }}
// // // //               min="1"
// // // //             />
// // // //           </div>
// // // //           <div style={{ display: 'flex', gap: '12px' }}>
// // // //             <button
// // // //               type="button"
// // // //               onClick={onClose}
// // // //               style={{
// // // //                 flex: 1,
// // // //                 padding: '10px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px',
// // // //                 cursor: 'pointer',
// // // //                 fontSize: '14px',
// // // //                 fontWeight: 500,
// // // //                 backgroundColor: 'white'
// // // //               }}
// // // //             >
// // // //               Cancel
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               style={{
// // // //                 flex: 1,
// // // //                 padding: '10px',
// // // //                 backgroundColor: '#2196F3',
// // // //                 color: 'white',
// // // //                 border: 'none',
// // // //                 borderRadius: '4px',
// // // //                 cursor: 'pointer',
// // // //                 fontSize: '14px',
// // // //                 fontWeight: 500
// // // //               }}
// // // //             >
// // // //               Create Test
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function CreateQuestionModal({ test, onClose, onSuccess }) {
// // // //   const [formData, setFormData] = useState({
// // // //     test_id: test.id,
// // // //     title: '',
// // // //     description: '',
// // // //     difficulty: 'EASY',
// // // //     topic: 'ARRAYS',
// // // //     points: 10,
// // // //     time_limit_ms: 2000
// // // //   });

// // // //   const [testCases, setTestCases] = useState([
// // // //     { input: '', expected_output: '', is_hidden: false, points: 1 }
// // // //   ]);

// // // //   const addTestCase = () => {
// // // //     setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false, points: 1 }]);
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     try {
// // // //       const questionResponse = await axios.post(`${API_URL}/questions`, formData);
// // // //       const questionId = questionResponse.data.id;

// // // //       for (const testCase of testCases) {
// // // //         await axios.post(`${API_URL}/test-cases`, {
// // // //           question_id: questionId,
// // // //           ...testCase
// // // //         });
// // // //       }

// // // //       alert('Question created successfully!');
// // // //       onSuccess();
// // // //     } catch (error) {
// // // //       console.error('Error creating question:', error);
// // // //       alert('Failed to create question');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div style={{
// // // //       position: 'fixed',
// // // //       top: 0,
// // // //       left: 0,
// // // //       right: 0,
// // // //       bottom: 0,
// // // //       backgroundColor: 'rgba(0,0,0,0.5)',
// // // //       display: 'flex',
// // // //       alignItems: 'center',
// // // //       justifyContent: 'center',
// // // //       zIndex: 1000,
// // // //       overflowY: 'auto'
// // // //     }}>
// // // //       <div style={{
// // // //         backgroundColor: 'white',
// // // //         borderRadius: '8px',
// // // //         padding: '24px',
// // // //         width: '100%',
// // // //         maxWidth: '700px',
// // // //         margin: '20px'
// // // //       }}>
// // // //         <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
// // // //           Add Question to: {test.title}
// // // //         </h3>
// // // //         <form onSubmit={handleSubmit}>
// // // //           <div style={{ marginBottom: '16px' }}>
// // // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // // //               Question Title
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               value={formData.title}
// // // //               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // // //               style={{
// // // //                 width: '100%',
// // // //                 padding: '8px 12px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px',
// // // //                 fontSize: '14px'
// // // //               }}
// // // //               required
// // // //             />
// // // //           </div>
// // // //           <div style={{ marginBottom: '16px' }}>
// // // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // // //               Description
// // // //             </label>
// // // //             <textarea
// // // //               value={formData.description}
// // // //               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // // //               style={{
// // // //                 width: '100%',
// // // //                 padding: '8px 12px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px',
// // // //                 fontSize: '14px',
// // // //                 minHeight: '100px'
// // // //               }}
// // // //               required
// // // //             />
// // // //           </div>
// // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
// // // //             <div>
// // // //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // // //                 Difficulty
// // // //               </label>
// // // //               <select
// // // //                 value={formData.difficulty}
// // // //                 onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
// // // //                 style={{
// // // //                   width: '100%',
// // // //                   padding: '8px 12px',
// // // //                   border: '1px solid #ddd',
// // // //                   borderRadius: '4px',
// // // //                   fontSize: '14px'
// // // //                 }}
// // // //               >
// // // //                 <option value="EASY">Easy</option>
// // // //                 <option value="MEDIUM">Medium</option>
// // // //                 <option value="HARD">Hard</option>
// // // //               </select>
// // // //             </div>
// // // //             <div>
// // // //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // // //                 Topic
// // // //               </label>
// // // //               <select
// // // //                 value={formData.topic}
// // // //                 onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
// // // //                 style={{
// // // //                   width: '100%',
// // // //                   padding: '8px 12px',
// // // //                   border: '1px solid #ddd',
// // // //                   borderRadius: '4px',
// // // //                   fontSize: '14px'
// // // //                 }}
// // // //               >
// // // //                 <option value="ARRAYS">Arrays</option>
// // // //                 <option value="STRINGS">Strings</option>
// // // //                 <option value="LINKED_LISTS">Linked Lists</option>
// // // //                 <option value="TREES">Trees</option>
// // // //                 <option value="GRAPHS">Graphs</option>
// // // //                 <option value="SORTING">Sorting</option>
// // // //                 <option value="SEARCHING">Searching</option>
// // // //                 <option value="DYNAMIC_PROGRAMMING">Dynamic Programming</option>
// // // //               </select>
// // // //             </div>
// // // //           </div>

// // // //           <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '16px' }}>
// // // //             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
// // // //               <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Test Cases</h4>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addTestCase}
// // // //                 style={{
// // // //                   background: 'none',
// // // //                   border: 'none',
// // // //                   color: '#2196F3',
// // // //                   cursor: 'pointer',
// // // //                   fontSize: '14px',
// // // //                   fontWeight: 500
// // // //                 }}
// // // //               >
// // // //                 + Add Test Case
// // // //               </button>
// // // //             </div>
// // // //             {testCases.map((tc, index) => (
// // // //               <div key={index} style={{
// // // //                 backgroundColor: '#f9f9f9',
// // // //                 padding: '12px',
// // // //                 borderRadius: '4px',
// // // //                 marginBottom: '12px'
// // // //               }}>
// // // //                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
// // // //                   <div>
// // // //                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>
// // // //                       Input
// // // //                     </label>
// // // //                     <textarea
// // // //                       value={tc.input}
// // // //                       onChange={(e) => {
// // // //                         const updated = [...testCases];
// // // //                         updated[index].input = e.target.value;
// // // //                         setTestCases(updated);
// // // //                       }}
// // // //                       style={{
// // // //                         width: '100%',
// // // //                         padding: '6px 8px',
// // // //                         border: '1px solid #ddd',
// // // //                         borderRadius: '4px',
// // // //                         fontSize: '13px',
// // // //                         minHeight: '60px',
// // // //                         fontFamily: 'monospace'
// // // //                       }}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>
// // // //                       Expected Output
// // // //                     </label>
// // // //                     <textarea
// // // //                       value={tc.expected_output}
// // // //                       onChange={(e) => {
// // // //                         const updated = [...testCases];
// // // //                         updated[index].expected_output = e.target.value;
// // // //                         setTestCases(updated);
// // // //                       }}
// // // //                       style={{
// // // //                         width: '100%',
// // // //                         padding: '6px 8px',
// // // //                         border: '1px solid #ddd',
// // // //                         borderRadius: '4px',
// // // //                         fontSize: '13px',
// // // //                         minHeight: '60px',
// // // //                         fontFamily: 'monospace'
// // // //                       }}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //                 <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '13px' }}>
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={tc.is_hidden}
// // // //                     onChange={(e) => {
// // // //                       const updated = [...testCases];
// // // //                       updated[index].is_hidden = e.target.checked;
// // // //                       setTestCases(updated);
// // // //                     }}
// // // //                     style={{ marginRight: '6px' }}
// // // //                   />
// // // //                   Hidden Test Case
// // // //                 </label>
// // // //               </div>
// // // //             ))}
// // // //           </div>

// // // //           <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
// // // //             <button
// // // //               type="button"
// // // //               onClick={onClose}
// // // //               style={{
// // // //                 flex: 1,
// // // //                 padding: '10px',
// // // //                 border: '1px solid #ddd',
// // // //                 borderRadius: '4px',
// // // //                 cursor: 'pointer',
// // // //                 fontSize: '14px',
// // // //                 fontWeight: 500,
// // // //                 backgroundColor: 'white'
// // // //               }}
// // // //             >
// // // //               Cancel
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               style={{
// // // //                 flex: 1,
// // // //                 padding: '10px',
// // // //                 backgroundColor: '#2196F3',
// // // //                 color: 'white',
// // // //                 border: 'none',
// // // //                 borderRadius: '4px',
// // // //                 cursor: 'pointer',
// // // //                 fontSize: '14px',
// // // //                 fontWeight: 500
// // // //               }}
// // // //             >
// // // //               Create Question
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default TeacherDashboard;









// // // import { useState, useEffect } from 'react';
// // // import { Plus, Search, Mail, Clock, Calendar, Eye } from 'lucide-react';
// // // import axios from 'axios';
// // // import TestDetailsPage from './TestDetailsPage';
// // // import QuestionsModal from './QuestionsModal';

// // // const API_URL = `https://dsa-platform-production-64f6.up.railway.app/api/teacher`;

// // // function TeacherDashboard() {
// // //   const [selectedTestForDetails, setSelectedTestForDetails] = useState(null);
// // //   const [tests, setTests] = useState([]);
// // //   const [submissions, setSubmissions] = useState([]);
// // //   const [showCreateTest, setShowCreateTest] = useState(false);
// // //   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
// // //   const [selectedTest, setSelectedTest] = useState(null);
// // //   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
// // //   const [selectedTestId, setSelectedTestId] = useState(null);
// // //   const [selectedTestTitle, setSelectedTestTitle] = useState('');
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [statusFilter, setStatusFilter] = useState('all');

// // //   useEffect(() => {
// // //     fetchTests();
// // //     fetchSubmissions();
// // //   }, []);

// // //   const fetchTests = async () => {
// // //     try {
// // //       const response = await axios.get(`${API_URL}/tests`);
// // //       setTests(response.data);
// // //     } catch (error) {
// // //       console.error('Error fetching tests:', error);
// // //     }
// // //   };

// // //   const fetchSubmissions = async () => {
// // //     try {
// // //       const response = await axios.get(`${API_URL}/submissions`);
// // //       setSubmissions(response.data);
// // //     } catch (error) {
// // //       console.error('Error fetching submissions:', error);
// // //     }
// // //   };

// // //   const filteredTests = tests.filter(test => {
// // //     const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
// // //     const matchesStatus = statusFilter === 'all' || 
// // //                          (statusFilter === 'drafts' && !test.is_active);
// // //     return matchesSearch && matchesStatus;
// // //   });

// // //   // ✅ FIX: This must be INSIDE TeacherDashboard, not inside CreateTestModal
// // //   if (selectedTestForDetails) {
// // //     return (
// // //       <TestDetailsPage
// // //         test={selectedTestForDetails}
// // //         onBack={() => setSelectedTestForDetails(null)}
// // //         onAddQuestion={(test) => {
// // //           setSelectedTest(test);
// // //           setShowCreateQuestion(true);
// // //         }}
// // //       />
// // //     );
// // //   }

// // //   return (
// // //     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
// // //       {/* Sidebar */}
// // //       <div style={{ 
// // //         width: '200px', 
// // //         backgroundColor: '#fff', 
// // //         borderRight: '1px solid #e0e0e0',
// // //         padding: '20px',
// // //         flexShrink: 0
// // //       }}>
// // //         <div style={{ marginBottom: '24px' }}>
// // //           <div style={{ 
// // //             fontSize: '13px', 
// // //             color: '#666', 
// // //             marginBottom: '12px',
// // //             fontWeight: 600
// // //           }}>
// // //             Test status
// // //           </div>
// // //           <label style={{ 
// // //             display: 'flex', 
// // //             alignItems: 'center', 
// // //             marginBottom: '8px',
// // //             cursor: 'pointer',
// // //             fontSize: '14px'
// // //           }}>
// // //             <input 
// // //               type="radio" 
// // //               name="status"
// // //               checked={statusFilter === 'drafts'}
// // //               onChange={() => setStatusFilter('drafts')}
// // //               style={{ marginRight: '8px' }}
// // //             />
// // //             <span style={{ color: '#2196F3' }}>Drafts ({tests.filter(t => !t.is_active).length})</span>
// // //           </label>
// // //         </div>

// // //         <div style={{ marginBottom: '24px' }}>
// // //           <div style={{ 
// // //             fontSize: '13px', 
// // //             color: '#666', 
// // //             marginBottom: '12px',
// // //             fontWeight: 600
// // //           }}>
// // //             Created by
// // //           </div>
// // //           <select style={{ 
// // //             width: '100%',
// // //             padding: '6px 8px',
// // //             border: '1px solid #ddd',
// // //             borderRadius: '4px',
// // //             fontSize: '14px',
// // //             backgroundColor: '#fff'
// // //           }}>
// // //             <option>All</option>
// // //           </select>
// // //         </div>

// // //         <div style={{ marginBottom: '24px' }}>
// // //           <div style={{ 
// // //             fontSize: '13px', 
// // //             color: '#666', 
// // //             marginBottom: '12px',
// // //             fontWeight: 600
// // //           }}>
// // //             Creation date
// // //           </div>
// // //           <select style={{ 
// // //             width: '100%',
// // //             padding: '6px 8px',
// // //             border: '1px solid #ddd',
// // //             borderRadius: '4px',
// // //             fontSize: '14px',
// // //             backgroundColor: '#fff'
// // //           }}>
// // //             <option>Any time</option>
// // //           </select>
// // //         </div>

// // //         <div>
// // //           <div style={{ 
// // //             fontSize: '13px', 
// // //             color: '#666', 
// // //             marginBottom: '12px',
// // //             fontWeight: 600
// // //           }}>
// // //             Test type
// // //           </div>
// // //           <label style={{ 
// // //             display: 'flex', 
// // //             alignItems: 'center', 
// // //             marginBottom: '8px',
// // //             cursor: 'pointer',
// // //             fontSize: '14px'
// // //           }}>
// // //             <input 
// // //               type="checkbox" 
// // //               defaultChecked
// // //               style={{ marginRight: '8px' }}
// // //             />
// // //             Public
// // //           </label>
// // //           <label style={{ 
// // //             display: 'flex', 
// // //             alignItems: 'center',
// // //             cursor: 'pointer',
// // //             fontSize: '14px'
// // //           }}>
// // //             <input 
// // //               type="checkbox" 
// // //               defaultChecked
// // //               style={{ marginRight: '8px' }}
// // //             />
// // //             Invite only
// // //           </label>
// // //         </div>
// // //       </div>

// // //       {/* Main Content */}
// // //       <div style={{ flex: 1, padding: '24px 40px' }}>
// // //         {/* Header */}
// // //         <div style={{ 
// // //           display: 'flex', 
// // //           justifyContent: 'space-between', 
// // //           alignItems: 'center',
// // //           marginBottom: '24px'
// // //         }}>
// // //           <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '600px' }}>
// // //             <input
// // //               type="text"
// // //               placeholder="Search by test names or tags"
// // //               value={searchQuery}
// // //               onChange={(e) => setSearchQuery(e.target.value)}
// // //               style={{
// // //                 flex: 1,
// // //                 padding: '8px 12px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px 0 0 4px',
// // //                 fontSize: '14px',
// // //                 outline: 'none'
// // //               }}
// // //             />
// // //             <button style={{
// // //               padding: '8px 16px',
// // //               backgroundColor: '#2196F3',
// // //               color: 'white',
// // //               border: 'none',
// // //               borderRadius: '0 4px 4px 0',
// // //               cursor: 'pointer',
// // //               marginLeft: '-1px'
// // //             }}>
// // //               <Search size={16} />
// // //             </button>
// // //           </div>
          
// // //           <button
// // //             onClick={() => setShowCreateTest(true)}
// // //             style={{
// // //               padding: '10px 20px',
// // //               backgroundColor: '#2196F3',
// // //               color: 'white',
// // //               border: 'none',
// // //               borderRadius: '4px',
// // //               cursor: 'pointer',
// // //               fontSize: '14px',
// // //               fontWeight: 500,
// // //               display: 'flex',
// // //               alignItems: 'center',
// // //               gap: '8px'
// // //             }}
// // //           >
// // //             <Plus size={18} />
// // //             Create new test
// // //           </button>
// // //         </div>

// // //         {/* Test Cards */}
// // //         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
// // //           {filteredTests.map((test) => (
// // //             <div 
// // //               key={test.id}
// // //               style={{
// // //                 backgroundColor: '#fff',
// // //                 border: '1px solid #e0e0e0',
// // //                 borderRadius: '4px',
// // //                 padding: '20px 24px',
// // //                 cursor: 'pointer'
// // //               }}
// // //               onClick={() => setSelectedTestForDetails(test)} 
// // //             >
// // //               <div style={{ marginBottom: '12px' }}>
// // //                 <h3 style={{ 
// // //                   fontSize: '16px', 
// // //                   fontWeight: 600, 
// // //                   color: '#333',
// // //                   marginBottom: '8px'
// // //                 }}>
// // //                   {test.title}
// // //                 </h3>
// // //               </div>

// // //               <div style={{ 
// // //                 display: 'flex', 
// // //                 gap: '20px', 
// // //                 fontSize: '13px', 
// // //                 color: '#666',
// // //                 marginBottom: '12px'
// // //               }}>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <Mail size={14} />
// // //                   <span>Invite only</span>
// // //                 </div>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <Clock size={14} />
// // //                   <span>{test.duration_minutes} min</span>
// // //                 </div>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <Calendar size={14} />
// // //                   <span>{new Date(test.created_at).toLocaleDateString('en-US', { 
// // //                     month: 'short', 
// // //                     day: 'numeric', 
// // //                     year: 'numeric' 
// // //                   })} {new Date(test.created_at).toLocaleTimeString('en-US', { 
// // //                     hour: '2-digit', 
// // //                     minute: '2-digit',
// // //                     hour12: true 
// // //                   })} IST (Asia/Kolkata) - No end date specified</span>
// // //                 </div>
// // //               </div>

// // //               <div style={{ 
// // //                 display: 'flex', 
// // //                 justifyContent: 'space-between',
// // //                 alignItems: 'center'
// // //               }}>
// // //                 <div style={{ fontSize: '13px', color: '#999' }}>
// // //                   Created {Math.floor((Date.now() - new Date(test.created_at)) / (1000 * 60 * 60))} hours ago
// // //                   {' · '}
// // //                   <button
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       setSelectedTestId(test.id);
// // //                       setSelectedTestTitle(test.title);
// // //                       setShowQuestionsModal(true);
// // //                     }}
// // //                     style={{
// // //                       background: 'none',
// // //                       border: 'none',
// // //                       color: '#2196F3',
// // //                       cursor: 'pointer',
// // //                       padding: 0,
// // //                       fontSize: '13px'
// // //                     }}
// // //                   >
// // //                     Review questions
// // //                   </button>
// // //                 </div>

// // //                 <div style={{ display: 'flex', gap: '12px' }}>
// // //                   <button
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       setSelectedTestId(test.id);
// // //                       setSelectedTestTitle(test.title);
// // //                       setShowQuestionsModal(true);
// // //                     }}
// // //                     style={{
// // //                       padding: '6px 16px',
// // //                       backgroundColor: 'transparent',
// // //                       color: '#2196F3',
// // //                       border: '1px solid #2196F3',
// // //                       borderRadius: '4px',
// // //                       cursor: 'pointer',
// // //                       fontSize: '13px',
// // //                       fontWeight: 500,
// // //                       display: 'flex',
// // //                       alignItems: 'center',
// // //                       gap: '6px'
// // //                     }}
// // //                   >
// // //                     <Eye size={14} />
// // //                     Preview test
// // //                   </button>
                  
// // //                   <button
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       setSelectedTest(test);
// // //                       setShowCreateQuestion(true);
// // //                     }}
// // //                     style={{
// // //                       padding: '6px 16px',
// // //                       backgroundColor: 'transparent',
// // //                       color: '#666',
// // //                       border: '1px solid #ddd',
// // //                       borderRadius: '4px',
// // //                       cursor: 'pointer',
// // //                       fontSize: '13px',
// // //                       fontWeight: 500
// // //                     }}
// // //                   >
// // //                     <Plus size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
// // //                     Add Question
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ))}

// // //           {filteredTests.length === 0 && (
// // //             <div style={{ 
// // //               textAlign: 'center', 
// // //               padding: '60px 20px',
// // //               backgroundColor: '#fff',
// // //               borderRadius: '4px',
// // //               border: '1px solid #e0e0e0'
// // //             }}>
// // //               <p style={{ color: '#999', fontSize: '14px' }}>No tests found</p>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Modals */}
// // //       {showCreateTest && (
// // //         <CreateTestModal
// // //           onClose={() => setShowCreateTest(false)}
// // //           onSuccess={() => {
// // //             setShowCreateTest(false);
// // //             fetchTests();
// // //           }}
// // //         />
// // //       )}

// // //       {showCreateQuestion && selectedTest && (
// // //         <CreateQuestionModal
// // //           test={selectedTest}
// // //           onClose={() => {
// // //             setShowCreateQuestion(false);
// // //             setSelectedTest(null);
// // //           }}
// // //           onSuccess={() => {
// // //             setShowCreateQuestion(false);
// // //             setSelectedTest(null);
// // //           }}
// // //         />
// // //       )}

// // //       <QuestionsModal
// // //         testId={selectedTestId}
// // //         testTitle={selectedTestTitle}
// // //         isOpen={showQuestionsModal}
// // //         onClose={() => {
// // //           setShowQuestionsModal(false);
// // //           setSelectedTestId(null);
// // //           setSelectedTestTitle('');
// // //         }}
// // //       />
// // //     </div>
// // //   );
// // // }

// // // function CreateTestModal({ onClose, onSuccess }) {
// // //   const [formData, setFormData] = useState({
// // //     title: '',
// // //     description: '',
// // //     duration_minutes: 60,
// // //     is_active: true
// // //   });

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       await axios.post(`${API_URL}/tests`, formData);
// // //       onSuccess();
// // //     } catch (error) {
// // //       console.error('Error creating test:', error);
// // //       alert('Failed to create test');
// // //     }
// // //   };

// // //   return (
// // //     <div style={{
// // //       position: 'fixed',
// // //       top: 0,
// // //       left: 0,
// // //       right: 0,
// // //       bottom: 0,
// // //       backgroundColor: 'rgba(0,0,0,0.5)',
// // //       display: 'flex',
// // //       alignItems: 'center',
// // //       justifyContent: 'center',
// // //       zIndex: 1000
// // //     }}>
// // //       <div style={{
// // //         backgroundColor: 'white',
// // //         borderRadius: '8px',
// // //         padding: '24px',
// // //         width: '100%',
// // //         maxWidth: '500px'
// // //       }}>
// // //         <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Create New Test</h3>
// // //         <form onSubmit={handleSubmit}>
// // //           <div style={{ marginBottom: '16px' }}>
// // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //               Title
// // //             </label>
// // //             <input
// // //               type="text"
// // //               value={formData.title}
// // //               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // //               style={{
// // //                 width: '100%',
// // //                 padding: '8px 12px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px',
// // //                 fontSize: '14px'
// // //               }}
// // //               required
// // //             />
// // //           </div>
// // //           <div style={{ marginBottom: '16px' }}>
// // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //               Description
// // //             </label>
// // //             <textarea
// // //               value={formData.description}
// // //               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // //               style={{
// // //                 width: '100%',
// // //                 padding: '8px 12px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px',
// // //                 fontSize: '14px',
// // //                 minHeight: '80px'
// // //               }}
// // //             />
// // //           </div>
// // //           <div style={{ marginBottom: '24px' }}>
// // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //               Duration (minutes)
// // //             </label>
// // //             <input
// // //               type="number"
// // //               value={formData.duration_minutes}
// // //               onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
// // //               style={{
// // //                 width: '100%',
// // //                 padding: '8px 12px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px',
// // //                 fontSize: '14px'
// // //               }}
// // //               min="1"
// // //             />
// // //           </div>
// // //           <div style={{ display: 'flex', gap: '12px' }}>
// // //             <button
// // //               type="button"
// // //               onClick={onClose}
// // //               style={{
// // //                 flex: 1,
// // //                 padding: '10px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px',
// // //                 cursor: 'pointer',
// // //                 fontSize: '14px',
// // //                 fontWeight: 500,
// // //                 backgroundColor: 'white'
// // //               }}
// // //             >
// // //               Cancel
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               style={{
// // //                 flex: 1,
// // //                 padding: '10px',
// // //                 backgroundColor: '#2196F3',
// // //                 color: 'white',
// // //                 border: 'none',
// // //                 borderRadius: '4px',
// // //                 cursor: 'pointer',
// // //                 fontSize: '14px',
// // //                 fontWeight: 500
// // //               }}
// // //             >
// // //               Create Test
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function CreateQuestionModal({ test, onClose, onSuccess }) {
// // //   const [formData, setFormData] = useState({
// // //     test_id: test.id,
// // //     title: '',
// // //     description: '',
// // //     difficulty: 'EASY',
// // //     topic: 'ARRAYS',
// // //     points: 10,
// // //     time_limit_ms: 2000
// // //   });

// // //   // ✅ NEW: Custom topic state
// // //   const [customTopic, setCustomTopic] = useState('');
// // //   const [isCustomTopic, setIsCustomTopic] = useState(false);

// // //   const [testCases, setTestCases] = useState([
// // //     { input: '', expected_output: '', is_hidden: false, points: 1 }
// // //   ]);

// // //   const addTestCase = () => {
// // //     setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false, points: 1 }]);
// // //   };

// // //   const removeTestCase = (index) => {
// // //     if (testCases.length === 1) return; // keep at least one
// // //     setTestCases(testCases.filter((_, i) => i !== index));
// // //   };

// // //   // ✅ NEW: Handle topic dropdown change
// // //   const handleTopicChange = (e) => {
// // //     const value = e.target.value;
// // //     if (value === 'CUSTOM') {
// // //       setIsCustomTopic(true);
// // //       setFormData({ ...formData, topic: '' }); // clear until typed
// // //     } else {
// // //       setIsCustomTopic(false);
// // //       setCustomTopic('');
// // //       setFormData({ ...formData, topic: value });
// // //     }
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     // Validate custom topic is not empty
// // //     if (isCustomTopic && !customTopic.trim()) {
// // //       alert('Please enter a custom topic name.');
// // //       return;
// // //     }

// // //     try {
// // //       const questionResponse = await axios.post(`${API_URL}/questions`, formData);
// // //       const questionId = questionResponse.data.id;

// // //       for (const testCase of testCases) {
// // //         await axios.post(`${API_URL}/test-cases`, {
// // //           question_id: questionId,
// // //           ...testCase
// // //         });
// // //       }

// // //       alert('Question created successfully!');
// // //       onSuccess();
// // //     } catch (error) {
// // //       console.error('Error creating question:', error);
// // //       alert('Failed to create question');
// // //     }
// // //   };

// // //   return (
// // //     <div style={{
// // //       position: 'fixed',
// // //       top: 0,
// // //       left: 0,
// // //       right: 0,
// // //       bottom: 0,
// // //       backgroundColor: 'rgba(0,0,0,0.5)',
// // //       display: 'flex',
// // //       alignItems: 'center',
// // //       justifyContent: 'center',
// // //       zIndex: 1000,
// // //       overflowY: 'auto'
// // //     }}>
// // //       <div style={{
// // //         backgroundColor: 'white',
// // //         borderRadius: '8px',
// // //         padding: '24px',
// // //         width: '100%',
// // //         maxWidth: '700px',
// // //         margin: '20px'
// // //       }}>
// // //         <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
// // //           Add Question to: {test.title}
// // //         </h3>
// // //         <form onSubmit={handleSubmit}>
// // //           <div style={{ marginBottom: '16px' }}>
// // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //               Question Title
// // //             </label>
// // //             <input
// // //               type="text"
// // //               value={formData.title}
// // //               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // //               style={{
// // //                 width: '100%',
// // //                 padding: '8px 12px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px',
// // //                 fontSize: '14px'
// // //               }}
// // //               required
// // //             />
// // //           </div>
// // //           <div style={{ marginBottom: '16px' }}>
// // //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //               Description
// // //             </label>
// // //             <textarea
// // //               value={formData.description}
// // //               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // //               style={{
// // //                 width: '100%',
// // //                 padding: '8px 12px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px',
// // //                 fontSize: '14px',
// // //                 minHeight: '100px'
// // //               }}
// // //               required
// // //             />
// // //           </div>
// // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
// // //             <div>
// // //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //                 Difficulty
// // //               </label>
// // //               <select
// // //                 value={formData.difficulty}
// // //                 onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
// // //                 style={{
// // //                   width: '100%',
// // //                   padding: '8px 12px',
// // //                   border: '1px solid #ddd',
// // //                   borderRadius: '4px',
// // //                   fontSize: '14px'
// // //                 }}
// // //               >
// // //                 <option value="EASY">Easy</option>
// // //                 <option value="MEDIUM">Medium</option>
// // //                 <option value="HARD">Hard</option>
// // //               </select>
// // //             </div>
// // //             <div>
// // //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //                 Topic
// // //               </label>
// // //               {/* ✅ NEW: Topic dropdown with Custom option */}
// // //               <select
// // //                 value={isCustomTopic ? 'CUSTOM' : formData.topic}
// // //                 onChange={handleTopicChange}
// // //                 style={{
// // //                   width: '100%',
// // //                   padding: '8px 12px',
// // //                   border: '1px solid #ddd',
// // //                   borderRadius: '4px',
// // //                   fontSize: '14px'
// // //                 }}
// // //               >
// // //                 <option value="ARRAYS">Arrays</option>
// // //                 <option value="STRINGS">Strings</option>
// // //                 <option value="LINKED_LISTS">Linked Lists</option>
// // //                 <option value="TREES">Trees</option>
// // //                 <option value="GRAPHS">Graphs</option>
// // //                 <option value="SORTING">Sorting</option>
// // //                 <option value="SEARCHING">Searching</option>
// // //                 <option value="DYNAMIC_PROGRAMMING">Dynamic Programming</option>
// // //                 <option value="RECURSION">Recursion</option>
// // //                 <option value="BACKTRACKING">Backtracking</option>
// // //                 <option value="STACK_QUEUE">Stack & Queue</option>
// // //                 <option value="HEAP">Heap / Priority Queue</option>
// // //                 <option value="CUSTOM">✏️ Custom Topic...</option>
// // //               </select>

// // //               {/* ✅ NEW: Custom topic text input - shown only when CUSTOM selected */}
// // //               {isCustomTopic && (
// // //                 <input
// // //                   type="text"
// // //                   placeholder="e.g. Machine Learning, Bit Manipulation"
// // //                   value={customTopic}
// // //                   onChange={(e) => {
// // //                     const raw = e.target.value;
// // //                     setCustomTopic(raw);
// // //                     // Auto-format to UPPERCASE_WITH_UNDERSCORES for the backend
// // //                     const formatted = raw.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
// // //                     setFormData({ ...formData, topic: formatted });
// // //                   }}
// // //                   style={{
// // //                     width: '100%',
// // //                     padding: '8px 12px',
// // //                     border: '1px solid #2196F3',
// // //                     borderRadius: '4px',
// // //                     fontSize: '14px',
// // //                     marginTop: '8px',
// // //                     outline: 'none',
// // //                     boxSizing: 'border-box'
// // //                   }}
// // //                   autoFocus
// // //                   required={isCustomTopic}
// // //                 />
// // //               )}

// // //               {/* ✅ NEW: Preview of formatted topic value */}
// // //               {isCustomTopic && customTopic && (
// // //                 <div style={{
// // //                   fontSize: '11px',
// // //                   color: '#999',
// // //                   marginTop: '4px'
// // //                 }}>
// // //                   Saved as: <code style={{ color: '#2196F3' }}>{formData.topic}</code>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>

// // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
// // //             <div>
// // //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //                 Points
// // //               </label>
// // //               <input
// // //                 type="number"
// // //                 value={formData.points}
// // //                 onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
// // //                 style={{
// // //                   width: '100%',
// // //                   padding: '8px 12px',
// // //                   border: '1px solid #ddd',
// // //                   borderRadius: '4px',
// // //                   fontSize: '14px'
// // //                 }}
// // //                 min="1"
// // //               />
// // //             </div>
// // //             <div>
// // //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// // //                 Time Limit (ms)
// // //               </label>
// // //               <input
// // //                 type="number"
// // //                 value={formData.time_limit_ms}
// // //                 onChange={(e) => setFormData({ ...formData, time_limit_ms: parseInt(e.target.value) })}
// // //                 style={{
// // //                   width: '100%',
// // //                   padding: '8px 12px',
// // //                   border: '1px solid #ddd',
// // //                   borderRadius: '4px',
// // //                   fontSize: '14px'
// // //                 }}
// // //                 min="100"
// // //                 step="100"
// // //               />
// // //             </div>
// // //           </div>

// // //           <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '16px' }}>
// // //             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
// // //               <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Test Cases</h4>
// // //               <button
// // //                 type="button"
// // //                 onClick={addTestCase}
// // //                 style={{
// // //                   background: 'none',
// // //                   border: 'none',
// // //                   color: '#2196F3',
// // //                   cursor: 'pointer',
// // //                   fontSize: '14px',
// // //                   fontWeight: 500
// // //                 }}
// // //               >
// // //                 + Add Test Case
// // //               </button>
// // //             </div>
// // //             {testCases.map((tc, index) => (
// // //               <div key={index} style={{
// // //                 backgroundColor: '#f9f9f9',
// // //                 padding: '12px',
// // //                 borderRadius: '4px',
// // //                 marginBottom: '12px',
// // //                 border: '1px solid #eee'
// // //               }}>
// // //                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
// // //                   <span style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>
// // //                     Test Case #{index + 1}
// // //                   </span>
// // //                   {testCases.length > 1 && (
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => removeTestCase(index)}
// // //                       style={{
// // //                         background: 'none',
// // //                         border: 'none',
// // //                         color: '#F44336',
// // //                         cursor: 'pointer',
// // //                         fontSize: '12px'
// // //                       }}
// // //                     >
// // //                       ✕ Remove
// // //                     </button>
// // //                   )}
// // //                 </div>
// // //                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
// // //                   <div>
// // //                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>
// // //                       Input
// // //                     </label>
// // //                     <textarea
// // //                       value={tc.input}
// // //                       onChange={(e) => {
// // //                         const updated = [...testCases];
// // //                         updated[index].input = e.target.value;
// // //                         setTestCases(updated);
// // //                       }}
// // //                       style={{
// // //                         width: '100%',
// // //                         padding: '6px 8px',
// // //                         border: '1px solid #ddd',
// // //                         borderRadius: '4px',
// // //                         fontSize: '13px',
// // //                         minHeight: '60px',
// // //                         fontFamily: 'monospace'
// // //                       }}
// // //                       required
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>
// // //                       Expected Output
// // //                     </label>
// // //                     <textarea
// // //                       value={tc.expected_output}
// // //                       onChange={(e) => {
// // //                         const updated = [...testCases];
// // //                         updated[index].expected_output = e.target.value;
// // //                         setTestCases(updated);
// // //                       }}
// // //                       style={{
// // //                         width: '100%',
// // //                         padding: '6px 8px',
// // //                         border: '1px solid #ddd',
// // //                         borderRadius: '4px',
// // //                         fontSize: '13px',
// // //                         minHeight: '60px',
// // //                         fontFamily: 'monospace'
// // //                       }}
// // //                       required
// // //                     />
// // //                   </div>
// // //                 </div>
// // //                 <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '13px' }}>
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={tc.is_hidden}
// // //                     onChange={(e) => {
// // //                       const updated = [...testCases];
// // //                       updated[index].is_hidden = e.target.checked;
// // //                       setTestCases(updated);
// // //                     }}
// // //                     style={{ marginRight: '6px' }}
// // //                   />
// // //                   Hidden Test Case
// // //                 </label>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
// // //             <button
// // //               type="button"
// // //               onClick={onClose}
// // //               style={{
// // //                 flex: 1,
// // //                 padding: '10px',
// // //                 border: '1px solid #ddd',
// // //                 borderRadius: '4px',
// // //                 cursor: 'pointer',
// // //                 fontSize: '14px',
// // //                 fontWeight: 500,
// // //                 backgroundColor: 'white'
// // //               }}
// // //             >
// // //               Cancel
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               style={{
// // //                 flex: 1,
// // //                 padding: '10px',
// // //                 backgroundColor: '#2196F3',
// // //                 color: 'white',
// // //                 border: 'none',
// // //                 borderRadius: '4px',
// // //                 cursor: 'pointer',
// // //                 fontSize: '14px',
// // //                 fontWeight: 500
// // //               }}
// // //             >
// // //               Create Question
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default TeacherDashboard;

// // import { useState, useEffect } from 'react';
// // import { Plus, Search, Mail, Clock, Calendar, Eye } from 'lucide-react';
// // import axios from 'axios';
// // import TestDetailsPage from './TestDetailsPage';
// // import QuestionsModal from './QuestionsModal';

// // const API_URL = `https://dsa-platform-production-64f6.up.railway.app/api/teacher`;

// // function TeacherDashboard() {
// //   const [selectedTestForDetails, setSelectedTestForDetails] = useState(null);
// //   const [tests, setTests] = useState([]);
// //   const [submissions, setSubmissions] = useState([]);
// //   const [showCreateTest, setShowCreateTest] = useState(false);
// //   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
// //   const [selectedTest, setSelectedTest] = useState(null);
// //   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
// //   const [selectedTestId, setSelectedTestId] = useState(null);
// //   const [selectedTestTitle, setSelectedTestTitle] = useState('');
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('all');

// //   useEffect(() => {
// //     fetchTests();
// //     fetchSubmissions();
// //   }, []);

// //   const fetchTests = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/tests`);
// //       setTests(response.data);
// //     } catch (error) {
// //       console.error('Error fetching tests:', error);
// //     }
// //   };

// //   const fetchSubmissions = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/submissions`);
// //       setSubmissions(response.data);
// //     } catch (error) {
// //       console.error('Error fetching submissions:', error);
// //     }
// //   };

// //   const filteredTests = tests.filter(test => {
// //     const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
// //     const matchesStatus = statusFilter === 'all' || 
// //                          (statusFilter === 'drafts' && !test.is_active);
// //     return matchesSearch && matchesStatus;
// //   });

// //   if (selectedTestForDetails) {
// //     return (
// //       <TestDetailsPage
// //         test={selectedTestForDetails}
// //         onBack={() => setSelectedTestForDetails(null)}
// //         onAddQuestion={(test) => {
// //           setSelectedTest(test);
// //           setShowCreateQuestion(true);
// //         }}
// //       />
// //     );
// //   }

// //   return (
// //     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
// //       {/* Sidebar */}
// //       <div style={{ 
// //         width: '200px', 
// //         backgroundColor: '#fff', 
// //         borderRight: '1px solid #e0e0e0',
// //         padding: '20px',
// //         flexShrink: 0
// //       }}>
// //         <div style={{ marginBottom: '24px' }}>
// //           <div style={{ 
// //             fontSize: '13px', 
// //             color: '#666', 
// //             marginBottom: '12px',
// //             fontWeight: 600
// //           }}>
// //             Test status
// //           </div>
// //           <label style={{ 
// //             display: 'flex', 
// //             alignItems: 'center', 
// //             marginBottom: '8px',
// //             cursor: 'pointer',
// //             fontSize: '14px'
// //           }}>
// //             <input 
// //               type="radio" 
// //               name="status"
// //               checked={statusFilter === 'drafts'}
// //               onChange={() => setStatusFilter('drafts')}
// //               style={{ marginRight: '8px' }}
// //             />
// //             <span style={{ color: '#2196F3' }}>Drafts ({tests.filter(t => !t.is_active).length})</span>
// //           </label>
// //         </div>

// //         <div style={{ marginBottom: '24px' }}>
// //           <div style={{ 
// //             fontSize: '13px', 
// //             color: '#666', 
// //             marginBottom: '12px',
// //             fontWeight: 600
// //           }}>
// //             Created by
// //           </div>
// //           <select style={{ 
// //             width: '100%',
// //             padding: '6px 8px',
// //             border: '1px solid #ddd',
// //             borderRadius: '4px',
// //             fontSize: '14px',
// //             backgroundColor: '#fff'
// //           }}>
// //             <option>All</option>
// //           </select>
// //         </div>

// //         <div style={{ marginBottom: '24px' }}>
// //           <div style={{ 
// //             fontSize: '13px', 
// //             color: '#666', 
// //             marginBottom: '12px',
// //             fontWeight: 600
// //           }}>
// //             Creation date
// //           </div>
// //           <select style={{ 
// //             width: '100%',
// //             padding: '6px 8px',
// //             border: '1px solid #ddd',
// //             borderRadius: '4px',
// //             fontSize: '14px',
// //             backgroundColor: '#fff'
// //           }}>
// //             <option>Any time</option>
// //           </select>
// //         </div>

// //         <div>
// //           <div style={{ 
// //             fontSize: '13px', 
// //             color: '#666', 
// //             marginBottom: '12px',
// //             fontWeight: 600
// //           }}>
// //             Test type
// //           </div>
// //           <label style={{ 
// //             display: 'flex', 
// //             alignItems: 'center', 
// //             marginBottom: '8px',
// //             cursor: 'pointer',
// //             fontSize: '14px'
// //           }}>
// //             <input 
// //               type="checkbox" 
// //               defaultChecked
// //               style={{ marginRight: '8px' }}
// //             />
// //             Public
// //           </label>
// //           <label style={{ 
// //             display: 'flex', 
// //             alignItems: 'center',
// //             cursor: 'pointer',
// //             fontSize: '14px'
// //           }}>
// //             <input 
// //               type="checkbox" 
// //               defaultChecked
// //               style={{ marginRight: '8px' }}
// //             />
// //             Invite only
// //           </label>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div style={{ flex: 1, padding: '24px 40px' }}>
// //         {/* Header */}
// //         <div style={{ 
// //           display: 'flex', 
// //           justifyContent: 'space-between', 
// //           alignItems: 'center',
// //           marginBottom: '24px'
// //         }}>
// //           <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '600px' }}>
// //             <input
// //               type="text"
// //               placeholder="Search by test names or tags"
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               style={{
// //                 flex: 1,
// //                 padding: '8px 12px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px 0 0 4px',
// //                 fontSize: '14px',
// //                 outline: 'none'
// //               }}
// //             />
// //             <button style={{
// //               padding: '8px 16px',
// //               backgroundColor: '#2196F3',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '0 4px 4px 0',
// //               cursor: 'pointer',
// //               marginLeft: '-1px'
// //             }}>
// //               <Search size={16} />
// //             </button>
// //           </div>
          
// //           <button
// //             onClick={() => setShowCreateTest(true)}
// //             style={{
// //               padding: '10px 20px',
// //               backgroundColor: '#2196F3',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '4px',
// //               cursor: 'pointer',
// //               fontSize: '14px',
// //               fontWeight: 500,
// //               display: 'flex',
// //               alignItems: 'center',
// //               gap: '8px'
// //             }}
// //           >
// //             <Plus size={18} />
// //             Create new test
// //           </button>
// //         </div>

// //         {/* Test Cards */}
// //         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
// //           {filteredTests.map((test) => (
// //             <div 
// //               key={test.id}
// //               style={{
// //                 backgroundColor: '#fff',
// //                 border: '1px solid #e0e0e0',
// //                 borderRadius: '4px',
// //                 padding: '20px 24px',
// //                 cursor: 'pointer'
// //               }}
// //               onClick={() => setSelectedTestForDetails(test)} 
// //             >
// //               <div style={{ marginBottom: '12px' }}>
// //                 <h3 style={{ 
// //                   fontSize: '16px', 
// //                   fontWeight: 600, 
// //                   color: '#333',
// //                   marginBottom: '8px'
// //                 }}>
// //                   {test.title}
// //                 </h3>
// //               </div>

// //               <div style={{ 
// //                 display: 'flex', 
// //                 gap: '20px', 
// //                 fontSize: '13px', 
// //                 color: '#666',
// //                 marginBottom: '12px'
// //               }}>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// //                   <Mail size={14} />
// //                   <span>Invite only</span>
// //                 </div>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// //                   <Clock size={14} />
// //                   <span>{test.duration_minutes} min</span>
// //                 </div>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// //                   <Calendar size={14} />
// //                   <span>{new Date(test.created_at).toLocaleDateString('en-US', { 
// //                     month: 'short', 
// //                     day: 'numeric', 
// //                     year: 'numeric' 
// //                   })} {new Date(test.created_at).toLocaleTimeString('en-US', { 
// //                     hour: '2-digit', 
// //                     minute: '2-digit',
// //                     hour12: true 
// //                   })} IST (Asia/Kolkata) - No end date specified</span>
// //                 </div>
// //               </div>

// //               {/* ✅ Show allowed languages badges on the test card */}
// //               {test.allowed_languages && test.allowed_languages.length > 0 && (
// //                 <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
// //                   {test.allowed_languages.map(lang => (
// //                     <span key={lang} style={{
// //                       padding: '2px 8px',
// //                       backgroundColor: '#e3f2fd',
// //                       color: '#1565c0',
// //                       borderRadius: '12px',
// //                       fontSize: '11px',
// //                       fontWeight: 500,
// //                       textTransform: 'uppercase'
// //                     }}>
// //                       {lang === 'cpp' ? 'C++' : lang === 'python' ? 'Python' : lang === 'java' ? 'Java' : lang.toUpperCase()}
// //                     </span>
// //                   ))}
// //                 </div>
// //               )}

// //               <div style={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'space-between',
// //                 alignItems: 'center'
// //               }}>
// //                 <div style={{ fontSize: '13px', color: '#999' }}>
// //                   Created {Math.floor((Date.now() - new Date(test.created_at)) / (1000 * 60 * 60))} hours ago
// //                   {' · '}
// //                   <button
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       setSelectedTestId(test.id);
// //                       setSelectedTestTitle(test.title);
// //                       setShowQuestionsModal(true);
// //                     }}
// //                     style={{
// //                       background: 'none',
// //                       border: 'none',
// //                       color: '#2196F3',
// //                       cursor: 'pointer',
// //                       padding: 0,
// //                       fontSize: '13px'
// //                     }}
// //                   >
// //                     Review questions
// //                   </button>
// //                 </div>

// //                 <div style={{ display: 'flex', gap: '12px' }}>
// //                   <button
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       setSelectedTestId(test.id);
// //                       setSelectedTestTitle(test.title);
// //                       setShowQuestionsModal(true);
// //                     }}
// //                     style={{
// //                       padding: '6px 16px',
// //                       backgroundColor: 'transparent',
// //                       color: '#2196F3',
// //                       border: '1px solid #2196F3',
// //                       borderRadius: '4px',
// //                       cursor: 'pointer',
// //                       fontSize: '13px',
// //                       fontWeight: 500,
// //                       display: 'flex',
// //                       alignItems: 'center',
// //                       gap: '6px'
// //                     }}
// //                   >
// //                     <Eye size={14} />
// //                     Preview test
// //                   </button>
                  
// //                   <button
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       setSelectedTest(test);
// //                       setShowCreateQuestion(true);
// //                     }}
// //                     style={{
// //                       padding: '6px 16px',
// //                       backgroundColor: 'transparent',
// //                       color: '#666',
// //                       border: '1px solid #ddd',
// //                       borderRadius: '4px',
// //                       cursor: 'pointer',
// //                       fontSize: '13px',
// //                       fontWeight: 500
// //                     }}
// //                   >
// //                     <Plus size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
// //                     Add Question
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}

// //           {filteredTests.length === 0 && (
// //             <div style={{ 
// //               textAlign: 'center', 
// //               padding: '60px 20px',
// //               backgroundColor: '#fff',
// //               borderRadius: '4px',
// //               border: '1px solid #e0e0e0'
// //             }}>
// //               <p style={{ color: '#999', fontSize: '14px' }}>No tests found</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Modals */}
// //       {showCreateTest && (
// //         <CreateTestModal
// //           onClose={() => setShowCreateTest(false)}
// //           onSuccess={() => {
// //             setShowCreateTest(false);
// //             fetchTests();
// //           }}
// //         />
// //       )}

// //       {showCreateQuestion && selectedTest && (
// //         <CreateQuestionModal
// //           test={selectedTest}
// //           onClose={() => {
// //             setShowCreateQuestion(false);
// //             setSelectedTest(null);
// //           }}
// //           onSuccess={() => {
// //             setShowCreateQuestion(false);
// //             setSelectedTest(null);
// //           }}
// //         />
// //       )}

// //       <QuestionsModal
// //         testId={selectedTestId}
// //         testTitle={selectedTestTitle}
// //         isOpen={showQuestionsModal}
// //         onClose={() => {
// //           setShowQuestionsModal(false);
// //           setSelectedTestId(null);
// //           setSelectedTestTitle('');
// //         }}
// //       />
// //     </div>
// //   );
// // }

// // // ✅ Language options config — single source of truth
// // const LANGUAGE_OPTIONS = [
// //   { id: 'python', label: 'Python' },
// //   { id: 'c',      label: 'C' },
// //   { id: 'cpp',    label: 'C++' },
// //   { id: 'java',   label: 'Java' },
// // ];

// // function CreateTestModal({ onClose, onSuccess }) {
// //   const [formData, setFormData] = useState({
// //     title: '',
// //     description: '',
// //     duration_minutes: 60,
// //     is_active: true
// //   });

// //   // ✅ NEW: allowed_languages state — all checked by default
// //   const [allowedLangs, setAllowedLangs] = useState(['python', 'c', 'cpp', 'java']);

// //   const toggleLang = (langId) => {
// //     setAllowedLangs(prev =>
// //       prev.includes(langId)
// //         ? prev.filter(l => l !== langId)
// //         : [...prev, langId]
// //     );
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // ✅ Guard: at least one language must be selected
// //     if (allowedLangs.length === 0) {
// //       alert('Please allow at least one programming language.');
// //       return;
// //     }

// //     try {
// //       await axios.post(`${API_URL}/tests`, {
// //         ...formData,
// //         allowed_languages: allowedLangs  // ✅ send array — backend joins to comma string
// //       });
// //       onSuccess();
// //     } catch (error) {
// //       console.error('Error creating test:', error);
// //       alert('Failed to create test');
// //     }
// //   };

// //   return (
// //     <div style={{
// //       position: 'fixed',
// //       top: 0,
// //       left: 0,
// //       right: 0,
// //       bottom: 0,
// //       backgroundColor: 'rgba(0,0,0,0.5)',
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       zIndex: 1000
// //     }}>
// //       <div style={{
// //         backgroundColor: 'white',
// //         borderRadius: '8px',
// //         padding: '24px',
// //         width: '100%',
// //         maxWidth: '500px'
// //       }}>
// //         <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Create New Test</h3>
// //         <form onSubmit={handleSubmit}>
// //           <div style={{ marginBottom: '16px' }}>
// //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //               Title
// //             </label>
// //             <input
// //               type="text"
// //               value={formData.title}
// //               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// //               style={{
// //                 width: '100%',
// //                 padding: '8px 12px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px',
// //                 fontSize: '14px'
// //               }}
// //               required
// //             />
// //           </div>

// //           <div style={{ marginBottom: '16px' }}>
// //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //               Description
// //             </label>
// //             <textarea
// //               value={formData.description}
// //               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// //               style={{
// //                 width: '100%',
// //                 padding: '8px 12px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px',
// //                 fontSize: '14px',
// //                 minHeight: '80px'
// //               }}
// //             />
// //           </div>

// //           <div style={{ marginBottom: '16px' }}>
// //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //               Duration (minutes)
// //             </label>
// //             <input
// //               type="number"
// //               value={formData.duration_minutes}
// //               onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
// //               style={{
// //                 width: '100%',
// //                 padding: '8px 12px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px',
// //                 fontSize: '14px'
// //               }}
// //               min="1"
// //             />
// //           </div>

// //           {/* ✅ NEW: Allowed Languages checkboxes */}
// //           <div style={{ marginBottom: '24px' }}>
// //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '10px' }}>
// //               Allowed Languages
// //             </label>
// //             <div style={{
// //               display: 'flex',
// //               gap: '12px',
// //               flexWrap: 'wrap',
// //               padding: '12px',
// //               border: '1px solid #ddd',
// //               borderRadius: '4px',
// //               backgroundColor: '#fafafa'
// //             }}>
// //               {LANGUAGE_OPTIONS.map(lang => {
// //                 const checked = allowedLangs.includes(lang.id);
// //                 return (
// //                   <label
// //                     key={lang.id}
// //                     style={{
// //                       display: 'flex',
// //                       alignItems: 'center',
// //                       gap: '6px',
// //                       cursor: 'pointer',
// //                       padding: '6px 12px',
// //                       borderRadius: '4px',
// //                       border: `1px solid ${checked ? '#2196F3' : '#ddd'}`,
// //                       backgroundColor: checked ? '#e3f2fd' : '#fff',
// //                       fontSize: '13px',
// //                       fontWeight: 500,
// //                       color: checked ? '#1565c0' : '#555',
// //                       transition: 'all 0.15s',
// //                       userSelect: 'none'
// //                     }}
// //                   >
// //                     <input
// //                       type="checkbox"
// //                       checked={checked}
// //                       onChange={() => toggleLang(lang.id)}
// //                       style={{ display: 'none' }}  // hidden — the label itself is the toggle
// //                     />
// //                     {checked ? '✓' : '○'} {lang.label}
// //                   </label>
// //                 );
// //               })}
// //             </div>
// //             {allowedLangs.length === 0 && (
// //               <div style={{ fontSize: '12px', color: '#F44336', marginTop: '6px' }}>
// //                 ⚠ Select at least one language
// //               </div>
// //             )}
// //             <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>
// //               Students will only see languages you enable here.
// //             </div>
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               style={{
// //                 flex: 1,
// //                 padding: '10px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px',
// //                 cursor: 'pointer',
// //                 fontSize: '14px',
// //                 fontWeight: 500,
// //                 backgroundColor: 'white'
// //               }}
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               style={{
// //                 flex: 1,
// //                 padding: '10px',
// //                 backgroundColor: '#2196F3',
// //                 color: 'white',
// //                 border: 'none',
// //                 borderRadius: '4px',
// //                 cursor: 'pointer',
// //                 fontSize: '14px',
// //                 fontWeight: 500
// //               }}
// //             >
// //               Create Test
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // function CreateQuestionModal({ test, onClose, onSuccess }) {
// //   const [formData, setFormData] = useState({
// //     test_id: test.id,
// //     title: '',
// //     description: '',
// //     difficulty: 'EASY',
// //     topic: 'ARRAYS',
// //     points: 10,
// //     time_limit_ms: 2000
// //   });

// //   const [customTopic, setCustomTopic] = useState('');
// //   const [isCustomTopic, setIsCustomTopic] = useState(false);

// //   const [testCases, setTestCases] = useState([
// //     { input: '', expected_output: '', is_hidden: false, points: 1 }
// //   ]);

// //   const addTestCase = () => {
// //     setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false, points: 1 }]);
// //   };

// //   const removeTestCase = (index) => {
// //     if (testCases.length === 1) return;
// //     setTestCases(testCases.filter((_, i) => i !== index));
// //   };

// //   const handleTopicChange = (e) => {
// //     const value = e.target.value;
// //     if (value === 'CUSTOM') {
// //       setIsCustomTopic(true);
// //       setFormData({ ...formData, topic: '' });
// //     } else {
// //       setIsCustomTopic(false);
// //       setCustomTopic('');
// //       setFormData({ ...formData, topic: value });
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (isCustomTopic && !customTopic.trim()) {
// //       alert('Please enter a custom topic name.');
// //       return;
// //     }

// //     try {
// //       const questionResponse = await axios.post(`${API_URL}/questions`, formData);
// //       const questionId = questionResponse.data.id;

// //       for (const testCase of testCases) {
// //         await axios.post(`${API_URL}/test-cases`, {
// //           question_id: questionId,
// //           ...testCase
// //         });
// //       }

// //       alert('Question created successfully!');
// //       onSuccess();
// //     } catch (error) {
// //       console.error('Error creating question:', error);
// //       alert('Failed to create question');
// //     }
// //   };

// //   return (
// //     <div style={{
// //       position: 'fixed',
// //       top: 0,
// //       left: 0,
// //       right: 0,
// //       bottom: 0,
// //       backgroundColor: 'rgba(0,0,0,0.5)',
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       zIndex: 1000,
// //       overflowY: 'auto'
// //     }}>
// //       <div style={{
// //         backgroundColor: 'white',
// //         borderRadius: '8px',
// //         padding: '24px',
// //         width: '100%',
// //         maxWidth: '700px',
// //         margin: '20px'
// //       }}>
// //         <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
// //           Add Question to: {test.title}
// //         </h3>
// //         <form onSubmit={handleSubmit}>
// //           <div style={{ marginBottom: '16px' }}>
// //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //               Question Title
// //             </label>
// //             <input
// //               type="text"
// //               value={formData.title}
// //               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// //               style={{
// //                 width: '100%',
// //                 padding: '8px 12px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px',
// //                 fontSize: '14px'
// //               }}
// //               required
// //             />
// //           </div>
// //           <div style={{ marginBottom: '16px' }}>
// //             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //               Description
// //             </label>
// //             <textarea
// //               value={formData.description}
// //               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// //               style={{
// //                 width: '100%',
// //                 padding: '8px 12px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px',
// //                 fontSize: '14px',
// //                 minHeight: '100px'
// //               }}
// //               required
// //             />
// //           </div>
// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
// //             <div>
// //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //                 Difficulty
// //               </label>
// //               <select
// //                 value={formData.difficulty}
// //                 onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
// //                 style={{
// //                   width: '100%',
// //                   padding: '8px 12px',
// //                   border: '1px solid #ddd',
// //                   borderRadius: '4px',
// //                   fontSize: '14px'
// //                 }}
// //               >
// //                 <option value="EASY">Easy</option>
// //                 <option value="MEDIUM">Medium</option>
// //                 <option value="HARD">Hard</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //                 Topic
// //               </label>
// //               <select
// //                 value={isCustomTopic ? 'CUSTOM' : formData.topic}
// //                 onChange={handleTopicChange}
// //                 style={{
// //                   width: '100%',
// //                   padding: '8px 12px',
// //                   border: '1px solid #ddd',
// //                   borderRadius: '4px',
// //                   fontSize: '14px'
// //                 }}
// //               >
// //                 <option value="ARRAYS">Arrays</option>
// //                 <option value="STRINGS">Strings</option>
// //                 <option value="LINKED_LISTS">Linked Lists</option>
// //                 <option value="TREES">Trees</option>
// //                 <option value="GRAPHS">Graphs</option>
// //                 <option value="SORTING">Sorting</option>
// //                 <option value="SEARCHING">Searching</option>
// //                 <option value="DYNAMIC_PROGRAMMING">Dynamic Programming</option>
// //                 <option value="RECURSION">Recursion</option>
// //                 <option value="BACKTRACKING">Backtracking</option>
// //                 <option value="STACK_QUEUE">Stack & Queue</option>
// //                 <option value="HEAP">Heap / Priority Queue</option>
// //                 <option value="CUSTOM">✏️ Custom Topic...</option>
// //               </select>

// //               {isCustomTopic && (
// //                 <input
// //                   type="text"
// //                   placeholder="e.g. Machine Learning, Bit Manipulation"
// //                   value={customTopic}
// //                   onChange={(e) => {
// //                     const raw = e.target.value;
// //                     setCustomTopic(raw);
// //                     const formatted = raw.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
// //                     setFormData({ ...formData, topic: formatted });
// //                   }}
// //                   style={{
// //                     width: '100%',
// //                     padding: '8px 12px',
// //                     border: '1px solid #2196F3',
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     marginTop: '8px',
// //                     outline: 'none',
// //                     boxSizing: 'border-box'
// //                   }}
// //                   autoFocus
// //                   required={isCustomTopic}
// //                 />
// //               )}

// //               {isCustomTopic && customTopic && (
// //                 <div style={{
// //                   fontSize: '11px',
// //                   color: '#999',
// //                   marginTop: '4px'
// //                 }}>
// //                   Saved as: <code style={{ color: '#2196F3' }}>{formData.topic}</code>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
// //             <div>
// //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //                 Points
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.points}
// //                 onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
// //                 style={{
// //                   width: '100%',
// //                   padding: '8px 12px',
// //                   border: '1px solid #ddd',
// //                   borderRadius: '4px',
// //                   fontSize: '14px'
// //                 }}
// //                 min="1"
// //               />
// //             </div>
// //             <div>
// //               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
// //                 Time Limit (ms)
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.time_limit_ms}
// //                 onChange={(e) => setFormData({ ...formData, time_limit_ms: parseInt(e.target.value) })}
// //                 style={{
// //                   width: '100%',
// //                   padding: '8px 12px',
// //                   border: '1px solid #ddd',
// //                   borderRadius: '4px',
// //                   fontSize: '14px'
// //                 }}
// //                 min="100"
// //                 step="100"
// //               />
// //             </div>
// //           </div>

// //           <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '16px' }}>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
// //               <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Test Cases</h4>
// //               <button
// //                 type="button"
// //                 onClick={addTestCase}
// //                 style={{
// //                   background: 'none',
// //                   border: 'none',
// //                   color: '#2196F3',
// //                   cursor: 'pointer',
// //                   fontSize: '14px',
// //                   fontWeight: 500
// //                 }}
// //               >
// //                 + Add Test Case
// //               </button>
// //             </div>
// //             {testCases.map((tc, index) => (
// //               <div key={index} style={{
// //                 backgroundColor: '#f9f9f9',
// //                 padding: '12px',
// //                 borderRadius: '4px',
// //                 marginBottom: '12px',
// //                 border: '1px solid #eee'
// //               }}>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
// //                   <span style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>
// //                     Test Case #{index + 1}
// //                   </span>
// //                   {testCases.length > 1 && (
// //                     <button
// //                       type="button"
// //                       onClick={() => removeTestCase(index)}
// //                       style={{
// //                         background: 'none',
// //                         border: 'none',
// //                         color: '#F44336',
// //                         cursor: 'pointer',
// //                         fontSize: '12px'
// //                       }}
// //                     >
// //                       ✕ Remove
// //                     </button>
// //                   )}
// //                 </div>
// //                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
// //                   <div>
// //                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>
// //                       Input
// //                     </label>
// //                     <textarea
// //                       value={tc.input}
// //                       onChange={(e) => {
// //                         const updated = [...testCases];
// //                         updated[index].input = e.target.value;
// //                         setTestCases(updated);
// //                       }}
// //                       style={{
// //                         width: '100%',
// //                         padding: '6px 8px',
// //                         border: '1px solid #ddd',
// //                         borderRadius: '4px',
// //                         fontSize: '13px',
// //                         minHeight: '60px',
// //                         fontFamily: 'monospace'
// //                       }}
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>
// //                       Expected Output
// //                     </label>
// //                     <textarea
// //                       value={tc.expected_output}
// //                       onChange={(e) => {
// //                         const updated = [...testCases];
// //                         updated[index].expected_output = e.target.value;
// //                         setTestCases(updated);
// //                       }}
// //                       style={{
// //                         width: '100%',
// //                         padding: '6px 8px',
// //                         border: '1px solid #ddd',
// //                         borderRadius: '4px',
// //                         fontSize: '13px',
// //                         minHeight: '60px',
// //                         fontFamily: 'monospace'
// //                       }}
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //                 <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '13px' }}>
// //                   <input
// //                     type="checkbox"
// //                     checked={tc.is_hidden}
// //                     onChange={(e) => {
// //                       const updated = [...testCases];
// //                       updated[index].is_hidden = e.target.checked;
// //                       setTestCases(updated);
// //                     }}
// //                     style={{ marginRight: '6px' }}
// //                   />
// //                   Hidden Test Case
// //                 </label>
// //               </div>
// //             ))}
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               style={{
// //                 flex: 1,
// //                 padding: '10px',
// //                 border: '1px solid #ddd',
// //                 borderRadius: '4px',
// //                 cursor: 'pointer',
// //                 fontSize: '14px',
// //                 fontWeight: 500,
// //                 backgroundColor: 'white'
// //               }}
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               style={{
// //                 flex: 1,
// //                 padding: '10px',
// //                 backgroundColor: '#2196F3',
// //                 color: 'white',
// //                 border: 'none',
// //                 borderRadius: '4px',
// //                 cursor: 'pointer',
// //                 fontSize: '14px',
// //                 fontWeight: 500
// //               }}
// //             >
// //               Create Question
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default TeacherDashboard;







// import { useState, useEffect } from 'react';
// import { Plus, Search, Mail, Clock, Calendar, Eye, Copy, Tag, Lock, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
// import axios from 'axios';
// import TestDetailsPage from './TestDetailsPage';
// import QuestionsModal from './QuestionsModal';

// const API_URL = `https://dsa-platform-production-64f6.up.railway.app/api/teacher`;

// const LANGUAGE_OPTIONS = [
//   { id: 'python', label: 'Python' },
//   { id: 'c',      label: 'C' },
//   { id: 'cpp',    label: 'C++' },
//   { id: 'java',   label: 'Java' },
// ];

// function formatDate(iso) {
//   if (!iso) return null;
//   const d = new Date(iso);
//   return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) +
//     ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
// }

// function TeacherDashboard() {
//   const [selectedTestForDetails, setSelectedTestForDetails] = useState(null);
//   const [tests, setTests] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [showCreateTest, setShowCreateTest] = useState(false);
//   const [showCreateQuestion, setShowCreateQuestion] = useState(false);
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [showQuestionsModal, setShowQuestionsModal] = useState(false);
//   const [selectedTestId, setSelectedTestId] = useState(null);
//   const [selectedTestTitle, setSelectedTestTitle] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [copiedId, setCopiedId] = useState(null);

//   useEffect(() => { fetchTests(); fetchSubmissions(); }, []);

//   const fetchTests = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/tests`);
//       setTests(response.data);
//     } catch (error) { console.error('Error fetching tests:', error); }
//   };

//   const fetchSubmissions = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/submissions`);
//       setSubmissions(response.data);
//     } catch (error) { console.error('Error fetching submissions:', error); }
//   };

//   const toggleAccess = async (e, test) => {
//     e.stopPropagation();
//     try {
//       const updated = await axios.patch(`${API_URL}/tests/${test.id}`, { is_active: !test.is_active });
//       setTests(prev => prev.map(t => t.id === test.id ? { ...t, is_active: updated.data.is_active } : t));
//     } catch (err) { console.error('Toggle failed:', err); }
//   };

//   const copyToClipboard = (e, text, id) => {
//     e.stopPropagation();
//     navigator.clipboard.writeText(text);
//     setCopiedId(id);
//     setTimeout(() => setCopiedId(null), 2000);
//   };

//   const filteredTests = tests.filter(test => {
//     const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (test.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
//     const matchesStatus = statusFilter === 'all' || (statusFilter === 'drafts' && !test.is_active);
//     return matchesSearch && matchesStatus;
//   });

//   if (selectedTestForDetails) {
//     return (
//       <TestDetailsPage
//         test={selectedTestForDetails}
//         onBack={() => setSelectedTestForDetails(null)}
//         onAddQuestion={(test) => { setSelectedTest(test); setShowCreateQuestion(true); }}
//       />
//     );
//   }

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: "'Segoe UI', sans-serif" }}>
//       {/* Sidebar */}
//       <div style={{ width: '200px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0', padding: '20px', flexShrink: 0 }}>
//         <div style={{ marginBottom: '24px' }}>
//           <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 600 }}>Test status</div>
//           <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
//             <input type="radio" name="status" checked={statusFilter === 'all'} onChange={() => setStatusFilter('all')} style={{ marginRight: '8px' }} />
//             <span>All ({tests.length})</span>
//           </label>
//           <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
//             <input type="radio" name="status" checked={statusFilter === 'drafts'} onChange={() => setStatusFilter('drafts')} style={{ marginRight: '8px' }} />
//             <span style={{ color: '#2196F3' }}>Drafts ({tests.filter(t => !t.is_active).length})</span>
//           </label>
//         </div>
//         <div>
//           <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 600 }}>Test type</div>
//           <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
//             <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} /> Public
//           </label>
//           <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
//             <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} /> Invite only
//           </label>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={{ flex: 1, padding: '24px 40px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//           <div style={{ display: 'flex', gap: '0', flex: 1, maxWidth: '500px' }}>
//             <input
//               type="text"
//               placeholder="Search by test names or tags"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px 0 0 4px', fontSize: '14px', outline: 'none' }}
//             />
//             <button style={{ padding: '8px 14px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
//               <Search size={15} />
//             </button>
//           </div>
//           <button onClick={() => setShowCreateTest(true)} style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <Plus size={16} /> Create new test
//           </button>
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           {filteredTests.map((test) => {
//             const testLink = `${window.location.origin}/test/${test.id}`;
//             return (
//               <div key={test.id}
//                 style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '20px 24px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
//                 onClick={() => setSelectedTestForDetails(test)}
//                 onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
//                 onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
//               >
//                 {/* Row 1: Title + Access Toggle */}
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
//                   <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: 0, flex: 1, paddingRight: '16px' }}>{test.title}</h3>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
//                     <span style={{ fontSize: '12px', color: test.is_active ? '#4CAF50' : '#999' }}>{test.is_active ? 'Active' : 'Inactive'}</span>
//                     <button onClick={(e) => toggleAccess(e, test)} title="Toggle test access"
//                       style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: test.is_active ? '#4CAF50' : '#ccc' }}>
//                       {test.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Row 2: Meta info */}
//                 <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666', marginBottom: '10px', flexWrap: 'wrap' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                     {test.test_type === 'invite_only' ? <Lock size={13} /> : <Globe size={13} />}
//                     <span>{test.test_type === 'invite_only' ? 'Invite only' : 'Public'}</span>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                     <Clock size={13} />
//                     <span>{test.duration_minutes} min</span>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                     <Calendar size={13} />
//                     <span>
//                       {test.start_date ? formatDate(test.start_date) : 'No start date'}
//                       {' → '}
//                       {test.end_date ? formatDate(test.end_date) : 'No end date'}
//                     </span>
//                   </div>
//                   {test.assessment_id && (
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                       <span style={{ color: '#999' }}>ID:</span>
//                       <span style={{ fontFamily: 'monospace', color: '#555' }}>{test.assessment_id}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Row 3: Test link */}
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '6px 10px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}
//                   onClick={e => e.stopPropagation()}>
//                   <span style={{ color: '#999', flexShrink: 0 }}>Test link:</span>
//                   <span style={{ color: '#2196F3', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{testLink}</span>
//                   <button onClick={(e) => copyToClipboard(e, testLink, test.id)}
//                     style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === test.id ? '#4CAF50' : '#999', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', flexShrink: 0 }}>
//                     <Copy size={13} />
//                     {copiedId === test.id ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>

//                 {/* Row 4: Languages + Tags */}
//                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px', alignItems: 'center' }}>
//                   {test.allowed_languages && test.allowed_languages.map(lang => (
//                     <span key={lang} style={{ padding: '2px 8px', backgroundColor: '#e3f2fd', color: '#1565c0', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
//                       {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
//                     </span>
//                   ))}
//                   {test.tags && test.tags.length > 0 && (
//                     <>
//                       <span style={{ color: '#ccc', fontSize: '12px' }}>|</span>
//                       {test.tags.map((tag, i) => (
//                         <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 8px', backgroundColor: '#fff8e1', color: '#f57f17', borderRadius: '12px', fontSize: '11px', fontWeight: 500, border: '1px solid #ffe082' }}>
//                           <Tag size={10} />{tag}
//                         </span>
//                       ))}
//                     </>
//                   )}
//                 </div>

//                 {/* Row 5: Bottom actions */}
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div style={{ fontSize: '12px', color: '#999' }}>
//                     Created {Math.floor((Date.now() - new Date(test.created_at)) / (1000 * 60 * 60))}h ago
//                     {' · '}
//                     <button onClick={(e) => { e.stopPropagation(); setSelectedTestId(test.id); setSelectedTestTitle(test.title); setShowQuestionsModal(true); }}
//                       style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', padding: 0, fontSize: '12px' }}>
//                       Review questions
//                     </button>
//                   </div>
//                   <div style={{ display: 'flex', gap: '8px' }}>
//                     <button onClick={(e) => { e.stopPropagation(); setSelectedTestId(test.id); setSelectedTestTitle(test.title); setShowQuestionsModal(true); }}
//                       style={{ padding: '5px 14px', backgroundColor: 'transparent', color: '#2196F3', border: '1px solid #2196F3', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
//                       <Eye size={13} /> Preview
//                     </button>
//                     <button onClick={(e) => { e.stopPropagation(); setSelectedTest(test); setShowCreateQuestion(true); }}
//                       style={{ padding: '5px 14px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
//                       <Plus size={13} style={{ verticalAlign: 'middle', marginRight: '3px' }} />Add Question
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {filteredTests.length === 0 && (
//             <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
//               <p style={{ color: '#999', fontSize: '14px' }}>No tests found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {showCreateTest && (
//         <CreateTestModal onClose={() => setShowCreateTest(false)} onSuccess={() => { setShowCreateTest(false); fetchTests(); }} />
//       )}
//       {showCreateQuestion && selectedTest && (
//         <CreateQuestionModal test={selectedTest} onClose={() => { setShowCreateQuestion(false); setSelectedTest(null); }} onSuccess={() => { setShowCreateQuestion(false); setSelectedTest(null); }} />
//       )}
//       <QuestionsModal testId={selectedTestId} testTitle={selectedTestTitle} isOpen={showQuestionsModal}
//         onClose={() => { setShowQuestionsModal(false); setSelectedTestId(null); setSelectedTestTitle(''); }} />
//     </div>
//   );
// }

// function CreateTestModal({ onClose, onSuccess }) {
//   const [formData, setFormData] = useState({
//     title: '', description: '', duration_minutes: 60, is_active: true,
//     test_type: 'invite_only', start_date: '', end_date: '', tags: ''
//   });
//   const [allowedLangs, setAllowedLangs] = useState(['python', 'c', 'cpp', 'java']);

//   const toggleLang = (langId) => {
//     setAllowedLangs(prev => prev.includes(langId) ? prev.filter(l => l !== langId) : [...prev, langId]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (allowedLangs.length === 0) { alert('Please allow at least one programming language.'); return; }
//     try {
//       await axios.post(`${API_URL}/tests`, {
//         ...formData,
//         duration_minutes: parseInt(formData.duration_minutes),
//         allowed_languages: allowedLangs,
//         start_date: formData.start_date || null,
//         end_date: formData.end_date || null,
//       });
//       onSuccess();
//     } catch (error) { console.error('Error creating test:', error); alert('Failed to create test'); }
//   };

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
//       <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '28px', width: '100%', maxWidth: '540px', margin: '20px' }}>
//         <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Create New Test</h3>
//         <form onSubmit={handleSubmit}>
//           {/* Title */}
//           <div style={{ marginBottom: '14px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Title *</label>
//             <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
//               style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} required />
//           </div>

//           {/* Description */}
//           <div style={{ marginBottom: '14px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Description</label>
//             <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
//               style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '70px', boxSizing: 'border-box' }} />
//           </div>

//           {/* Duration + Test Type */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Duration (minutes)</label>
//               <input type="number" value={formData.duration_minutes} min="1"
//                 onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
//             </div>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Test Type</label>
//               <select value={formData.test_type} onChange={e => setFormData({ ...formData, test_type: e.target.value })}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
//                 <option value="invite_only">Invite Only</option>
//                 <option value="public">Public</option>
//               </select>
//             </div>
//           </div>

//           {/* Start + End Date */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Start Date</label>
//               <input type="datetime-local" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
//             </div>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>End Date</label>
//               <input type="datetime-local" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
//             </div>
//           </div>

//           {/* Tags */}
//           <div style={{ marginBottom: '14px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Tags <span style={{ color: '#999', fontWeight: 400 }}>(comma separated)</span></label>
//             <input type="text" placeholder="e.g. DSA, Arrays, Midterm" value={formData.tags}
//               onChange={e => setFormData({ ...formData, tags: e.target.value })}
//               style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
//           </div>

//           {/* Allowed Languages */}
//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Allowed Languages</label>
//             <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fafafa' }}>
//               {LANGUAGE_OPTIONS.map(lang => {
//                 const checked = allowedLangs.includes(lang.id);
//                 return (
//                   <label key={lang.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '5px 12px', borderRadius: '4px', border: `1px solid ${checked ? '#2196F3' : '#ddd'}`, backgroundColor: checked ? '#e3f2fd' : '#fff', fontSize: '13px', fontWeight: 500, color: checked ? '#1565c0' : '#555', userSelect: 'none' }}>
//                     <input type="checkbox" checked={checked} onChange={() => toggleLang(lang.id)} style={{ display: 'none' }} />
//                     {checked ? '✓' : '○'} {lang.label}
//                   </label>
//                 );
//               })}
//             </div>
//             {allowedLangs.length === 0 && <div style={{ fontSize: '12px', color: '#F44336', marginTop: '4px' }}>⚠ Select at least one language</div>}
//           </div>

//           <div style={{ display: 'flex', gap: '10px' }}>
//             <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' }}>Cancel</button>
//             <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Create Test</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function CreateQuestionModal({ test, onClose, onSuccess }) {
//   const [formData, setFormData] = useState({ test_id: test.id, title: '', description: '', difficulty: 'EASY', topic: 'ARRAYS', points: 10, time_limit_ms: 2000 });
//   const [customTopic, setCustomTopic] = useState('');
//   const [isCustomTopic, setIsCustomTopic] = useState(false);
//   const [testCases, setTestCases] = useState([{ input: '', expected_output: '', is_hidden: false, points: 1 }]);

//   const addTestCase = () => setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false, points: 1 }]);
//   const removeTestCase = (index) => { if (testCases.length === 1) return; setTestCases(testCases.filter((_, i) => i !== index)); };

//   const handleTopicChange = (e) => {
//     const value = e.target.value;
//     if (value === 'CUSTOM') { setIsCustomTopic(true); setFormData({ ...formData, topic: '' }); }
//     else { setIsCustomTopic(false); setCustomTopic(''); setFormData({ ...formData, topic: value }); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isCustomTopic && !customTopic.trim()) { alert('Please enter a custom topic name.'); return; }
//     try {
//       const questionResponse = await axios.post(`${API_URL}/questions`, formData);
//       const questionId = questionResponse.data.id;
//       for (const testCase of testCases) {
//         await axios.post(`${API_URL}/test-cases`, { question_id: questionId, ...testCase });
//       }
//       alert('Question created successfully!');
//       onSuccess();
//     } catch (error) { console.error('Error creating question:', error); alert('Failed to create question'); }
//   };

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
//       <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '700px', margin: '20px' }}>
//         <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Add Question to: {test.title}</h3>
//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: '14px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Question Title</label>
//             <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
//               style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} required />
//           </div>
//           <div style={{ marginBottom: '14px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Description</label>
//             <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
//               style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box' }} required />
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Difficulty</label>
//               <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}>
//                 <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
//               </select>
//             </div>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Topic</label>
//               <select value={isCustomTopic ? 'CUSTOM' : formData.topic} onChange={handleTopicChange}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}>
//                 <option value="ARRAYS">Arrays</option><option value="STRINGS">Strings</option>
//                 <option value="LINKED_LISTS">Linked Lists</option><option value="TREES">Trees</option>
//                 <option value="GRAPHS">Graphs</option><option value="SORTING">Sorting</option>
//                 <option value="SEARCHING">Searching</option><option value="DYNAMIC_PROGRAMMING">Dynamic Programming</option>
//                 <option value="RECURSION">Recursion</option><option value="BACKTRACKING">Backtracking</option>
//                 <option value="STACK_QUEUE">Stack & Queue</option><option value="HEAP">Heap / Priority Queue</option>
//                 <option value="CUSTOM">✏️ Custom Topic...</option>
//               </select>
//               {isCustomTopic && (
//                 <input type="text" placeholder="e.g. Machine Learning" value={customTopic}
//                   onChange={e => { setCustomTopic(e.target.value); setFormData({ ...formData, topic: e.target.value.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') }); }}
//                   style={{ width: '100%', padding: '8px 10px', border: '1px solid #2196F3', borderRadius: '4px', fontSize: '14px', marginTop: '8px', boxSizing: 'border-box' }} autoFocus required={isCustomTopic} />
//               )}
//             </div>
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Points</label>
//               <input type="number" value={formData.points} min="1" onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
//             </div>
//             <div>
//               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Time Limit (ms)</label>
//               <input type="number" value={formData.time_limit_ms} min="100" step="100" onChange={e => setFormData({ ...formData, time_limit_ms: parseInt(e.target.value) })}
//                 style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
//             </div>
//           </div>
//           <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', marginTop: '14px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//               <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Test Cases</h4>
//               <button type="button" onClick={addTestCase} style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>+ Add Test Case</button>
//             </div>
//             {testCases.map((tc, index) => (
//               <div key={index} style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #eee' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//                   <span style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Test Case #{index + 1}</span>
//                   {testCases.length > 1 && <button type="button" onClick={() => removeTestCase(index)} style={{ background: 'none', border: 'none', color: '#F44336', cursor: 'pointer', fontSize: '12px' }}>✕ Remove</button>}
//                 </div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
//                   <div>
//                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>Input</label>
//                     <textarea value={tc.input} onChange={e => { const u = [...testCases]; u[index].input = e.target.value; setTestCases(u); }}
//                       style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minHeight: '60px', fontFamily: 'monospace', boxSizing: 'border-box' }} required />
//                   </div>
//                   <div>
//                     <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>Expected Output</label>
//                     <textarea value={tc.expected_output} onChange={e => { const u = [...testCases]; u[index].expected_output = e.target.value; setTestCases(u); }}
//                       style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minHeight: '60px', fontFamily: 'monospace', boxSizing: 'border-box' }} required />
//                   </div>
//                 </div>
//                 <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '13px', cursor: 'pointer' }}>
//                   <input type="checkbox" checked={tc.is_hidden} onChange={e => { const u = [...testCases]; u[index].is_hidden = e.target.checked; setTestCases(u); }} style={{ marginRight: '6px' }} />
//                   Hidden Test Case
//                 </label>
//               </div>
//             ))}
//           </div>
//           <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//             <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' }}>Cancel</button>
//             <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Create Question</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default TeacherDashboard;


import { useState, useEffect } from 'react';
import { Plus, Search, Clock, Eye, X, Copy, Tag, Lock, Globe, ToggleLeft, ToggleRight, Pencil, Check } from 'lucide-react';
import axios from 'axios';
import TestDetailsPage from './TestDetailsPage';
import QuestionsModal from './QuestionsModal';

const API_URL = `https://dsa-platform-production-64f6.up.railway.app/api/teacher`;

const LANGUAGE_OPTIONS = [
  { id: 'python', label: 'Python' },
  { id: 'c',      label: 'C' },
  { id: 'cpp',    label: 'C++' },
  { id: 'java',   label: 'Java' },
];

function formatDate(iso) {
  if (!iso) return 'Not set';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
}

function toDatetimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── Inline Editable Field ────────────────────────────────────────────────────
function EditableField({ label, value, onSave, type = 'text', options = null }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => { setEditing(false); onSave(draft); };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', color: '#999', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {options ? (
            <select value={draft} onChange={e => setDraft(e.target.value)}
              style={{ flex: 1, padding: '6px 8px', border: '1px solid #2196F3', borderRadius: '4px', fontSize: '14px' }}>
              {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <input type={type} value={draft} onChange={e => setDraft(e.target.value)} autoFocus
              style={{ flex: 1, padding: '6px 8px', border: '1px solid #2196F3', borderRadius: '4px', fontSize: '14px' }} />
          )}
          <button onClick={handleSave} style={{ background: '#2196F3', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', color: '#fff', display: 'flex' }}>
            <Check size={14} />
          </button>
          <button onClick={() => { setEditing(false); setDraft(value); }} style={{ background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', display: 'flex' }}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', group: true }}
          onClick={() => { setDraft(value); setEditing(true); }}>
          <span style={{ fontSize: '14px', color: value ? '#333' : '#bbb' }}>{value || 'Click to set'}</span>
          <Pencil size={13} color="#ccc" />
        </div>
      )}
    </div>
  );
}

// ─── Test Info Modal ──────────────────────────────────────────────────────────
function TestInfoModal({ test, onClose, onUpdate }) {
  const [localTest, setLocalTest] = useState(test);
  const [copied, setCopied] = useState(false);
  const testLink = `${window.location.origin}/test/${test.id}`;

  const save = async (field, value) => {
    try {
      const payload = { [field]: value };
      const res = await axios.patch(`${API_URL}/tests/${localTest.id}`, payload);
      const updated = { ...localTest, ...res.data };
      setLocalTest(updated);
      onUpdate(updated);
    } catch (err) { console.error('Save failed:', err); }
  };

  const toggleAccess = async () => {
    try {
      const res = await axios.patch(`${API_URL}/tests/${localTest.id}`, { is_active: !localTest.is_active });
      const updated = { ...localTest, is_active: res.data.is_active };
      setLocalTest(updated);
      onUpdate(updated);
    } catch (err) { console.error('Toggle failed:', err); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(testLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagString = Array.isArray(localTest.tags) ? localTest.tags.join(', ') : (localTest.tags || '');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
      onClick={onClose}>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', margin: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Test Details</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#333', margin: 0 }}>{localTest.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}><X size={20} /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>

          {/* Test Access Toggle */}
          <div style={{ marginBottom: '20px', padding: '14px 16px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>Test Access</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                {localTest.is_active ? 'Students can access this test' : 'Test is hidden from students'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: localTest.is_active ? '#4CAF50' : '#999' }}>
                {localTest.is_active ? 'On' : 'Off'}
              </span>
              <button onClick={toggleAccess} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: localTest.is_active ? '#4CAF50' : '#ccc' }}>
                {localTest.is_active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          </div>

          {/* Test Name */}
          <EditableField label="Test name" value={localTest.title} onSave={v => save('title', v)} />

          {/* Test Type */}
          <EditableField label="Test type" value={localTest.test_type}
            onSave={v => save('test_type', v)}
            options={[{ value: 'invite_only', label: 'Invite Only' }, { value: 'public', label: 'Public' }]} />

          {/* Start Date */}
          <EditableField label="Starts on" value={toDatetimeLocal(localTest.start_date)}
            type="datetime-local"
            onSave={v => save('start_date', v || null)} />
          <div style={{ fontSize: '12px', color: '#999', marginTop: '-10px', marginBottom: '16px' }}>
            {formatDate(localTest.start_date)}
          </div>

          {/* End Date */}
          <EditableField label="Ends on" value={toDatetimeLocal(localTest.end_date)}
            type="datetime-local"
            onSave={v => save('end_date', v || null)} />
          <div style={{ fontSize: '12px', color: '#999', marginTop: '-10px', marginBottom: '16px' }}>
            {formatDate(localTest.end_date)}
          </div>

          {/* Test Link */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#999', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test Link</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
              <span style={{ flex: 1, fontSize: '13px', color: '#2196F3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{testLink}</span>
              <button onClick={copyLink} style={{ background: copied ? '#E8F5E9' : '#fff', border: `1px solid ${copied ? '#C8E6C9' : '#ddd'}`, borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', color: copied ? '#4CAF50' : '#666', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Assessment ID */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#999', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assessment ID</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, color: '#333', letterSpacing: '2px' }}>{localTest.assessment_id || '—'}</span>
              {localTest.assessment_id && (
                <button onClick={() => { navigator.clipboard.writeText(localTest.assessment_id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', display: 'flex' }}>
                  <Copy size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <EditableField label="Tags (comma separated)" value={tagString}
            onSave={v => save('tags', v)} />
          {Array.isArray(localTest.tags) && localTest.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '-8px', marginBottom: '16px' }}>
              {localTest.tags.map((tag, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 8px', backgroundColor: '#fff8e1', color: '#f57f17', borderRadius: '12px', fontSize: '11px', fontWeight: 500, border: '1px solid #ffe082' }}>
                  <Tag size={10} />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Allowed Languages */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', color: '#999', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Allowed Languages</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(localTest.allowed_languages || []).map(lang => (
                <span key={lang} style={{ padding: '3px 10px', backgroundColor: '#e3f2fd', color: '#1565c0', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                  {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 24px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ─── Teacher Dashboard ────────────────────────────────────────────────────────
function TeacherDashboard() {
  const [selectedTestForDetails, setSelectedTestForDetails] = useState(null);
  const [testInfoModal, setTestInfoModal] = useState(null);
  const [tests, setTests] = useState([]);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [selectedTestTitle, setSelectedTestTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${API_URL}/tests`);
      setTests(response.data);
    } catch (error) { console.error('Error fetching tests:', error); }
  };

  const handleTestUpdate = (updated) => {
    setTests(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (testInfoModal?.id === updated.id) setTestInfoModal(updated);
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(test.tags) ? test.tags : []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'drafts' && !test.is_active);
    return matchesSearch && matchesStatus;
  });

  if (selectedTestForDetails) {
    return (
      <TestDetailsPage
        test={selectedTestForDetails}
        onBack={() => setSelectedTestForDetails(null)}
        onAddQuestion={(test) => { setSelectedTest(test); setShowCreateQuestion(true); }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: '200px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0', padding: '20px', flexShrink: 0 }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 600 }}>Test status</div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input type="radio" name="status" checked={statusFilter === 'all'} onChange={() => setStatusFilter('all')} style={{ marginRight: '8px' }} />
            <span>All ({tests.length})</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input type="radio" name="status" checked={statusFilter === 'drafts'} onChange={() => setStatusFilter('drafts')} style={{ marginRight: '8px' }} />
            <span style={{ color: '#2196F3' }}>Drafts ({tests.filter(t => !t.is_active).length})</span>
          </label>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 600 }}>Test type</div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} /> Public
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
            <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} /> Invite only
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flex: 1, maxWidth: '500px' }}>
            <input type="text" placeholder="Search by test names or tags" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px 0 0 4px', fontSize: '14px', outline: 'none' }} />
            <button style={{ padding: '8px 14px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
              <Search size={15} />
            </button>
          </div>
          <button onClick={() => setShowCreateTest(true)}
            style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Create new test
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredTests.map(test => (
            <div key={test.id}
              style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '18px 22px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              onClick={() => setTestInfoModal(test)}
            >
              {/* Title + status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>{test.title}</h3>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: test.is_active ? '#E8F5E9' : '#f5f5f5', color: test.is_active ? '#4CAF50' : '#999' }}>
                  {test.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#888', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {test.test_type === 'invite_only' ? <Lock size={12} /> : <Globe size={12} />}
                  {test.test_type === 'invite_only' ? 'Invite only' : 'Public'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {test.duration_minutes} min
                </span>
                {test.assessment_id && <span style={{ fontFamily: 'monospace' }}>ID: {test.assessment_id}</span>}
              </div>

              {/* Languages + Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                {(test.allowed_languages || []).map(lang => (
                  <span key={lang} style={{ padding: '2px 7px', backgroundColor: '#e3f2fd', color: '#1565c0', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>
                    {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </span>
                ))}
                {Array.isArray(test.tags) && test.tags.length > 0 && (
                  <>
                    <span style={{ color: '#ddd' }}>|</span>
                    {test.tags.map((tag, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 7px', backgroundColor: '#fff8e1', color: '#f57f17', borderRadius: '10px', fontSize: '11px', border: '1px solid #ffe082' }}>
                        <Tag size={9} />{tag}
                      </span>
                    ))}
                  </>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#bbb' }}>
                  Created {Math.floor((Date.now() - new Date(test.created_at)) / 3600000)}h ago
                </span>
                <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                  <button onClick={e => { e.stopPropagation(); setSelectedTestId(test.id); setSelectedTestTitle(test.title); setShowQuestionsModal(true); }}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#2196F3', border: '1px solid #2196F3', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} /> Preview
                  </button>
                  <button onClick={e => { e.stopPropagation(); setSelectedTest(test); setShowCreateQuestion(true); }}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={12} /> Add Question
                  </button>
                  <button onClick={e => { e.stopPropagation(); setSelectedTestForDetails(test); }}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>No tests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Test Info Modal */}
      {testInfoModal && (
        <TestInfoModal
          test={testInfoModal}
          onClose={() => setTestInfoModal(null)}
          onUpdate={handleTestUpdate}
        />
      )}

      {showCreateTest && (
        <CreateTestModal onClose={() => setShowCreateTest(false)} onSuccess={() => { setShowCreateTest(false); fetchTests(); }} />
      )}
      {showCreateQuestion && selectedTest && (
        <CreateQuestionModal test={selectedTest}
          onClose={() => { setShowCreateQuestion(false); setSelectedTest(null); }}
          onSuccess={() => { setShowCreateQuestion(false); setSelectedTest(null); }} />
      )}
      <QuestionsModal testId={selectedTestId} testTitle={selectedTestTitle} isOpen={showQuestionsModal}
        onClose={() => { setShowQuestionsModal(false); setSelectedTestId(null); setSelectedTestTitle(''); }} />
    </div>
  );
}

// ─── Create Test Modal ────────────────────────────────────────────────────────
function CreateTestModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', description: '', duration_minutes: 60, is_active: true,
    test_type: 'invite_only', start_date: '', end_date: '', tags: ''
  });
  const [allowedLangs, setAllowedLangs] = useState(['python', 'c', 'cpp', 'java']);

  const toggleLang = id => setAllowedLangs(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (allowedLangs.length === 0) { alert('Please allow at least one programming language.'); return; }
    try {
      await axios.post(`${API_URL}/tests`, {
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes),
        allowed_languages: allowedLangs,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      });
      onSuccess();
    } catch (error) { console.error('Error creating test:', error); alert('Failed to create test'); }
  };

  const inp = { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '28px', width: '100%', maxWidth: '540px', margin: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Create New Test</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Title *</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={inp} required />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inp, minHeight: '70px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Duration (minutes)</label>
              <input type="number" value={formData.duration_minutes} min="1" onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Test Type</label>
              <select value={formData.test_type} onChange={e => setFormData({ ...formData, test_type: e.target.value })} style={inp}>
                <option value="invite_only">Invite Only</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Start Date</label>
              <input type="datetime-local" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>End Date</label>
              <input type="datetime-local" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} style={inp} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Tags <span style={{ color: '#999', fontWeight: 400 }}>(comma separated)</span></label>
            <input type="text" placeholder="e.g. DSA, Arrays, Midterm" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} style={inp} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Allowed Languages</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fafafa' }}>
              {LANGUAGE_OPTIONS.map(lang => {
                const checked = allowedLangs.includes(lang.id);
                return (
                  <label key={lang.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '5px 12px', borderRadius: '4px', border: `1px solid ${checked ? '#2196F3' : '#ddd'}`, backgroundColor: checked ? '#e3f2fd' : '#fff', fontSize: '13px', fontWeight: 500, color: checked ? '#1565c0' : '#555', userSelect: 'none' }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleLang(lang.id)} style={{ display: 'none' }} />
                    {checked ? '✓' : '○'} {lang.label}
                  </label>
                );
              })}
            </div>
            {allowedLangs.length === 0 && <div style={{ fontSize: '12px', color: '#F44336', marginTop: '4px' }}>⚠ Select at least one language</div>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Create Test</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Create Question Modal ────────────────────────────────────────────────────
function CreateQuestionModal({ test, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ test_id: test.id, title: '', description: '', difficulty: 'EASY', topic: 'ARRAYS', points: 10, time_limit_ms: 2000 });
  const [customTopic, setCustomTopic] = useState('');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [testCases, setTestCases] = useState([{ input: '', expected_output: '', is_hidden: false, points: 1 }]);

  const addTestCase = () => setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false, points: 1 }]);
  const removeTestCase = index => { if (testCases.length === 1) return; setTestCases(testCases.filter((_, i) => i !== index)); };

  const handleTopicChange = e => {
    const value = e.target.value;
    if (value === 'CUSTOM') { setIsCustomTopic(true); setFormData({ ...formData, topic: '' }); }
    else { setIsCustomTopic(false); setCustomTopic(''); setFormData({ ...formData, topic: value }); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isCustomTopic && !customTopic.trim()) { alert('Please enter a custom topic name.'); return; }
    try {
      const qRes = await axios.post(`${API_URL}/questions`, formData);
      for (const tc of testCases) await axios.post(`${API_URL}/test-cases`, { question_id: qRes.data.id, ...tc });
      alert('Question created successfully!');
      onSuccess();
    } catch (error) { console.error('Error:', error); alert('Failed to create question'); }
  };

  const inp = { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '700px', margin: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Add Question to: {test.title}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Question Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={inp} required />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inp, minHeight: '100px' }} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Difficulty</label>
              <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} style={inp}>
                <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Topic</label>
              <select value={isCustomTopic ? 'CUSTOM' : formData.topic} onChange={handleTopicChange} style={inp}>
                <option value="ARRAYS">Arrays</option><option value="STRINGS">Strings</option>
                <option value="LINKED_LISTS">Linked Lists</option><option value="TREES">Trees</option>
                <option value="GRAPHS">Graphs</option><option value="SORTING">Sorting</option>
                <option value="SEARCHING">Searching</option><option value="DYNAMIC_PROGRAMMING">Dynamic Programming</option>
                <option value="RECURSION">Recursion</option><option value="BACKTRACKING">Backtracking</option>
                <option value="STACK_QUEUE">Stack & Queue</option><option value="HEAP">Heap / Priority Queue</option>
                <option value="CUSTOM">✏️ Custom Topic...</option>
              </select>
              {isCustomTopic && (
                <input type="text" placeholder="e.g. Machine Learning" value={customTopic}
                  onChange={e => { setCustomTopic(e.target.value); setFormData({ ...formData, topic: e.target.value.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') }); }}
                  style={{ ...inp, border: '1px solid #2196F3', marginTop: '8px' }} autoFocus required={isCustomTopic} />
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Points</label>
              <input type="number" value={formData.points} min="1" onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Time Limit (ms)</label>
              <input type="number" value={formData.time_limit_ms} min="100" step="100" onChange={e => setFormData({ ...formData, time_limit_ms: parseInt(e.target.value) })} style={inp} />
            </div>
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Test Cases</h4>
              <button type="button" onClick={addTestCase} style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>+ Add Test Case</button>
            </div>
            {testCases.map((tc, index) => (
              <div key={index} style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Test Case #{index + 1}</span>
                  {testCases.length > 1 && <button type="button" onClick={() => removeTestCase(index)} style={{ background: 'none', border: 'none', color: '#F44336', cursor: 'pointer', fontSize: '12px' }}>✕ Remove</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>Input</label>
                    <textarea value={tc.input} onChange={e => { const u = [...testCases]; u[index].input = e.target.value; setTestCases(u); }}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minHeight: '60px', fontFamily: 'monospace', boxSizing: 'border-box' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>Expected Output</label>
                    <textarea value={tc.expected_output} onChange={e => { const u = [...testCases]; u[index].expected_output = e.target.value; setTestCases(u); }}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minHeight: '60px', fontFamily: 'monospace', boxSizing: 'border-box' }} required />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={tc.is_hidden} onChange={e => { const u = [...testCases]; u[index].is_hidden = e.target.checked; setTestCases(u); }} style={{ marginRight: '6px' }} />
                  Hidden Test Case
                </label>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Create Question</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherDashboard;
