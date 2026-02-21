// import { useState, useEffect } from 'react';
// import { X, ChevronLeft, ChevronRight, Code2, Clock, Award } from 'lucide-react';
// import api from '../services/api';

// export default function QuestionsModal({ testId, testTitle, isOpen, onClose }) {
//   const [questions, setQuestions] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (isOpen && testId) {
//       fetchQuestions();
//     }
//   }, [isOpen, testId]);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.getTestQuestions(testId);
//       setQuestions(response);
//       setCurrentIndex(0);
//     } catch (err) {
//       setError(err.message || 'Failed to load questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   if (!isOpen) return null;

//   const currentQuestion = questions[currentIndex];

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         {/* Header */}
//         <div className="modal-header">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">{testTitle}</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
//             </p>
//           </div>
//           <button onClick={onClose} className="close-button">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="modal-body">
//           {loading && (
//             <div className="text-center py-12">
//               <div className="spinner"></div>
//               <p className="text-gray-600 mt-4">Loading questions...</p>
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-700">{error}</p>
//             </div>
//           )}

//           {!loading && !error && questions.length === 0 && (
//             <div className="text-center py-12">
//               <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-600">No questions in this test yet.</p>
//             </div>
//           )}

//           {!loading && !error && currentQuestion && (
//             <div className="question-content">
//               {/* Question Header */}
//               <div className="question-header">
//                 <span className="question-number">
//                   Question {currentIndex + 1} of {questions.length}
//                 </span>
//                 <div className="question-meta">
//                   <span className={`badge badge-${currentQuestion.difficulty.toLowerCase()}`}>
//                     {currentQuestion.difficulty}
//                   </span>
//                   <span className="badge badge-topic">
//                     {currentQuestion.topic.replace(/_/g, ' ')}
//                   </span>
//                 </div>
//               </div>

//               {/* Question Title */}
//               <h3 className="question-title">{currentQuestion.title}</h3>

//               {/* Question Stats */}
//               <div className="question-stats">
//                 <div className="stat">
//                   <Award className="w-4 h-4" />
//                   <span>{currentQuestion.points} points</span>
//                 </div>
//                 <div className="stat">
//                   <Clock className="w-4 h-4" />
//                   <span>{currentQuestion.time_limit_ms}ms</span>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="question-description">
//                 <h4 className="font-semibold text-gray-900 mb-2">Description:</h4>
//                 <p className="text-gray-700 whitespace-pre-wrap">
//                   {currentQuestion.description}
//                 </p>
//               </div>

//               {/* Test Cases */}
//               {currentQuestion.test_cases && currentQuestion.test_cases.length > 0 && (
//                 <div className="test-cases-section">
//                   <h4 className="font-semibold text-gray-900 mb-3">
//                     Test Cases ({currentQuestion.test_cases.length}):
//                   </h4>
//                   <div className="test-cases-list">
//                     {currentQuestion.test_cases.map((tc, idx) => (
//                       <div key={tc.id} className="test-case-item">
//                         <div className="test-case-header">
//                           <span className="font-medium">Test Case {idx + 1}</span>
//                           {tc.is_hidden && (
//                             <span className="badge badge-hidden">Hidden</span>
//                           )}
//                           <span className="text-sm text-gray-600">{tc.points} pts</span>
//                         </div>
//                         <div className="test-case-content">
//                           <div>
//                             <span className="text-sm font-medium text-gray-600">Input:</span>
//                             <pre className="test-case-code">
//                               {tc.input || '(empty)'}
//                             </pre>
//                           </div>
//                           <div>
//                             <span className="text-sm font-medium text-gray-600">Expected Output:</span>
//                             <pre className="test-case-code">
//                               {tc.expected_output}
//                             </pre>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer with Navigation */}
//         {!loading && questions.length > 0 && (
//           <div className="modal-footer">
//             <button
//               onClick={handlePrevious}
//               disabled={currentIndex === 0}
//               className="nav-button"
//             >
//               <ChevronLeft className="w-5 h-5" />
//               Previous
//             </button>
//             <span className="text-sm text-gray-600">
//               {currentIndex + 1} / {questions.length}
//             </span>
//             <button
//               onClick={handleNext}
//               disabled={currentIndex === questions.length - 1}
//               className="nav-button"
//             >
//               Next
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import { X, ChevronLeft, ChevronRight, Code2, Clock, Award } from 'lucide-react';
// import api from '../services/api';

// export default function QuestionsModal({ testId, testTitle, isOpen, onClose }) {
//   const [questions, setQuestions] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (isOpen && testId) {
//       fetchQuestions();
//     }
//   }, [isOpen, testId]);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.getTestQuestions(testId);
//       setQuestions(response);
//       setCurrentIndex(0);
//     } catch (err) {
//       setError(err.message || 'Failed to load questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   if (!isOpen) return null;

//   const currentQuestion = questions[currentIndex];

//   const getDifficultyColor = (difficulty) => {
//     const colors = {
//       easy: 'bg-green-100 text-green-800',
//       medium: 'bg-yellow-100 text-yellow-800',
//       hard: 'bg-red-100 text-red-800'
//     };
//     return colors[difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//       onClick={onClose}
//     >
//       <div 
//         className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg flex justify-between items-start">
//           <div>
//             <h2 className="text-2xl font-bold text-white">{testTitle}</h2>
//             <p className="text-sm text-blue-100 mt-1">
//               {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
//             </p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {loading && (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               <p className="text-gray-600 mt-4">Loading questions...</p>
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-700">{error}</p>
//             </div>
//           )}

//           {!loading && !error && questions.length === 0 && (
//             <div className="text-center py-12">
//               <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-600 text-lg">No questions in this test yet.</p>
//               <p className="text-gray-500 text-sm mt-2">Click "Add Question" to create one.</p>
//             </div>
//           )}

//           {!loading && !error && currentQuestion && (
//             <div className="space-y-6">
//               {/* Question Header */}
//               <div className="flex justify-between items-start">
//                 <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
//                   Question {currentIndex + 1} of {questions.length}
//                 </span>
//                 <div className="flex gap-2">
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(currentQuestion.difficulty)}`}>
//                     {currentQuestion.difficulty}
//                   </span>
//                   <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
//                     {currentQuestion.topic.replace(/_/g, ' ')}
//                   </span>
//                 </div>
//               </div>

//               {/* Question Title */}
//               <h3 className="text-2xl font-bold text-gray-900">{currentQuestion.title}</h3>

//               {/* Question Stats */}
//               <div className="flex gap-6 text-sm text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <Award className="w-4 h-4 text-yellow-500" />
//                   <span className="font-medium">{currentQuestion.points} points</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4 text-blue-500" />
//                   <span className="font-medium">{currentQuestion.time_limit_ms}ms time limit</span>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <h4 className="font-semibold text-gray-900 mb-2">Description:</h4>
//                 <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                   {currentQuestion.description}
//                 </p>
//               </div>

//               {/* Test Cases */}
//               {currentQuestion.test_cases && currentQuestion.test_cases.length > 0 && (
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-3 text-lg">
//                     Test Cases ({currentQuestion.test_cases.length}):
//                   </h4>
//                   <div className="space-y-3">
//                     {currentQuestion.test_cases.map((tc, idx) => (
//                       <div key={tc.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
//                         <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-200">
//                           <span className="font-medium text-gray-900">Test Case {idx + 1}</span>
//                           <div className="flex items-center gap-2">
//                             {tc.is_hidden && (
//                               <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800">
//                                 Hidden
//                               </span>
//                             )}
//                             <span className="text-sm text-gray-600 font-medium">{tc.points} pts</span>
//                           </div>
//                         </div>
//                         <div className="p-4 space-y-3">
//                           <div>
//                             <span className="text-sm font-semibold text-gray-700 mb-1 block">Input:</span>
//                             <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto font-mono">
// {tc.input || '(empty)'}
//                             </pre>
//                           </div>
//                           <div>
//                             <span className="text-sm font-semibold text-gray-700 mb-1 block">Expected Output:</span>
//                             <pre className="bg-gray-900 text-blue-400 p-3 rounded text-sm overflow-x-auto font-mono">
// {tc.expected_output}
//                             </pre>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer with Navigation */}
//         {!loading && questions.length > 0 && (
//           <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-b-lg">
//             <button
//               onClick={handlePrevious}
//               disabled={currentIndex === 0}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:hover:bg-white"
//             >
//               <ChevronLeft className="w-5 h-5" />
//               Previous
//             </button>
//             <span className="text-sm font-medium text-gray-600">
//               {currentIndex + 1} / {questions.length}
//             </span>
//             <button
//               onClick={handleNext}
//               disabled={currentIndex === questions.length - 1}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600"
//             >
//               Next
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Code2, Clock, Award } from 'lucide-react';
import api from '../services/api';

export default function QuestionsModal({ testId, testTitle, isOpen, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && testId) {
      fetchQuestions();
    }
  }, [isOpen, testId]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTestQuestions(testId);
      setQuestions(response);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];

  const getDifficultyStyle = (difficulty) => {
    const styles = {
      EASY: { bg: '#E8F5E9', color: '#4CAF50' },
      MEDIUM: { bg: '#FFF3E0', color: '#FF9800' },
      HARD: { bg: '#FFEBEE', color: '#F44336' }
    };
    return styles[difficulty] || { bg: '#f5f5f5', color: '#666' };
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        fontFamily: "'Segoe UI', sans-serif"
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#fff',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: '#2196F3',
          color: '#fff',
          padding: '24px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px' }}>{testTitle}</h2>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
              {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: '40px', height: '40px', border: '3px solid #e0e0e0',
                borderTopColor: '#2196F3', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
              }} />
              <p style={{ color: '#666', fontSize: '14px' }}>Loading questions...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && (
            <div style={{
              background: '#FFEBEE', border: '1px solid #FFCDD2',
              borderRadius: '4px', padding: '16px', color: '#F44336'
            }}>
              {error}
            </div>
          )}

          {!loading && !error && questions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Code2 size={64} color="#ccc" style={{ margin: '0 auto 16px', display: 'block' }} />
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>No questions in this test yet.</p>
              <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>Click "Add Question" to create one.</p>
            </div>
          )}

          {!loading && !error && currentQuestion && (
            <div>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span style={{
                  fontSize: '13px', fontWeight: '600', color: '#2196F3',
                  background: '#E3F2FD', padding: '6px 12px', borderRadius: '20px'
                }}>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(() => {
                    const diffStyle = getDifficultyStyle(currentQuestion.difficulty);
                    return (
                      <span style={{
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        background: diffStyle.bg, color: diffStyle.color
                      }}>
                        {currentQuestion.difficulty}
                      </span>
                    );
                  })()}
                  <span style={{
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    background: '#E3F2FD', color: '#2196F3'
                  }}>
                    {currentQuestion.topic.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Question Title */}
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 16px' }}>
                {currentQuestion.title}
              </h3>

              {/* Question Stats */}
              <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} color="#FF9800" />
                  <span style={{ fontWeight: '500' }}>{currentQuestion.points} points</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#2196F3" />
                  <span style={{ fontWeight: '500' }}>{currentQuestion.time_limit_ms}ms time limit</span>
                </div>
              </div>

              {/* Description */}
              <div style={{
                background: '#f5f5f5', borderRadius: '4px', padding: '16px',
                border: '1px solid #e0e0e0', marginBottom: '20px'
              }}>
                <h4 style={{ fontWeight: '600', color: '#333', margin: '0 0 8px', fontSize: '14px' }}>Description:</h4>
                <p style={{ color: '#666', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
                  {currentQuestion.description}
                </p>
              </div>

              {/* Test Cases */}
              {currentQuestion.test_cases && currentQuestion.test_cases.length > 0 && (
                <div>
                  <h4 style={{ fontWeight: '600', color: '#333', marginBottom: '12px', fontSize: '16px' }}>
                    Test Cases ({currentQuestion.test_cases.length}):
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentQuestion.test_cases.map((tc, idx) => (
                      <div key={tc.id} style={{
                        background: '#fff', border: '1px solid #e0e0e0',
                        borderRadius: '4px', overflow: 'hidden'
                      }}>
                        <div style={{
                          background: '#f5f5f5', padding: '10px 16px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          <span style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
                            Test Case {idx + 1}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {tc.is_hidden && (
                              <span style={{
                                padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
                                fontWeight: '600', background: '#FFF3E0', color: '#FF9800'
                              }}>
                                Hidden
                              </span>
                            )}
                            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                              {tc.points} pts
                            </span>
                          </div>
                        </div>
                        <div style={{ padding: '16px' }}>
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '6px' }}>
                              Input:
                            </span>
                            <pre style={{
                              background: '#f5f5f5', color: '#333', padding: '12px',
                              borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace',
                              margin: 0, whiteSpace: 'pre-wrap', border: '1px solid #e0e0e0'
                            }}>
{tc.input || '(empty)'}
                            </pre>
                          </div>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '6px' }}>
                              Expected Output:
                            </span>
                            <pre style={{
                              background: '#f5f5f5', color: '#333', padding: '12px',
                              borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace',
                              margin: 0, whiteSpace: 'pre-wrap', border: '1px solid #e0e0e0'
                            }}>
{tc.expected_output}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        {!loading && questions.length > 0 && (
          <div style={{
            borderTop: '1px solid #e0e0e0', padding: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#f5f5f5', borderRadius: '0 0 8px 8px'
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '4px', fontWeight: '500',
                fontSize: '14px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                background: '#fff', border: '1px solid #e0e0e0', color: '#666',
                opacity: currentIndex === 0 ? 0.5 : 1, transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (currentIndex !== 0) e.target.style.background = '#f5f5f5'; }}
              onMouseLeave={e => { if (currentIndex !== 0) e.target.style.background = '#fff'; }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
              {currentIndex + 1} / {questions.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '4px', fontWeight: '500',
                fontSize: '14px', cursor: currentIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
                background: '#2196F3', border: 'none', color: '#fff',
                opacity: currentIndex === questions.length - 1 ? 0.5 : 1, transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (currentIndex !== questions.length - 1) e.target.style.background = '#1976D2'; }}
              onMouseLeave={e => { if (currentIndex !== questions.length - 1) e.target.style.background = '#2196F3'; }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}