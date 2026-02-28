




import { useState, useEffect } from 'react';
import { Play, Loader2, CheckCircle, XCircle, AlertCircle, Clock, ChevronLeft, ChevronRight, BookOpen, RotateCcw } from 'lucide-react';
import CodeEditor from './CodeEditor';
import api from '../services/api';

const LANGUAGE_LABELS = {
  python: 'Python',
  c: 'C',
  cpp: 'C++',
  java: 'Java',
};

const DEFAULT_CODE = {
  python: '# Write your code here\n',
  c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n',
};

function TestAttempt({ test, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [questionResults, setQuestionResults] = useState({});

  const allowedLanguages = Array.isArray(test?.allowed_languages)
    ? test.allowed_languages
    : ['python', 'c', 'cpp', 'java'];

  const [language, setLanguage] = useState(allowedLanguages[0] || 'python');
  const [code, setCode] = useState(DEFAULT_CODE[allowedLanguages[0]] || DEFAULT_CODE.python);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoadingQuestions(true);
      setLoadError(null);
      try {
        const data = await api.getStudentTestQuestions(test.id);
        if (!Array.isArray(data)) throw new Error('Unexpected response format');
        setQuestions(data);
      } catch (err) {
        const msg = typeof err?.response?.data?.detail === 'string'
          ? err.response.data.detail
          : Array.isArray(err?.response?.data?.detail)
            ? err.response.data.detail.map(e => e.msg || JSON.stringify(e)).join(', ')
            : err?.message || 'Failed to load questions';
        setLoadError(msg);
      } finally {
        setIsLoadingQuestions(false);
      }
    }
    if (test?.id) fetchQuestions();
  }, [test?.id]);

  useEffect(() => {
    setCode(DEFAULT_CODE[language] || DEFAULT_CODE.python);
    setResult(null);
    setError(null);
    setSubmitSuccess(null);
  }, [currentQuestionIndex, language]);

  const currentQuestion = questions[currentQuestionIndex];

  const extractErrorMessage = (err) => {
    if (Array.isArray(err?.response?.data?.detail))
      return err.response.data.detail.map(e => `${e.loc?.join('.')} — ${e.msg}`).join('\n');
    if (typeof err?.response?.data?.detail === 'string') return err.response.data.detail;
    if (typeof err?.response?.data === 'string') return err.response.data;
    return err?.message || 'An unknown error occurred';
  };

  const runCode = async () => {
    if (!currentQuestion) return null;
    const response = await api.executeCode({
      language,
      code,
      question_id: currentQuestion.id,
      tests: currentQuestion.test_cases || [],
      time_limit_ms: currentQuestion.time_limit_ms || 2000,
    });
    if (!response || typeof response !== 'object') throw new Error('Invalid response from execution server');
    const safeResponse = {
      ...response,
      results: Array.isArray(response.results) ? response.results : [],
      summary: response.summary && typeof response.summary === 'object'
        ? response.summary : { score: 0, passed: 0, total: 0 },
    };
    setResult(safeResponse);
    if (safeResponse.summary?.score !== undefined)
      setQuestionResults(prev => ({ ...prev, [currentQuestion.id]: safeResponse.summary.score }));
    return safeResponse;
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);
    setSubmitSuccess(null);
    try {
      await runCode();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setSubmitSuccess(null);
    try {
      // Run code first
      const safeResponse = await runCode();
      if (!safeResponse) return;

      // Save submission to DB
      await api.submitSolution({
        question_id: currentQuestion.id,
        test_id: test.id,
        language,
        code,
        score: safeResponse.summary.score,
        passed: safeResponse.summary.passed,
        total: safeResponse.summary.total,
      });

      setSubmitSuccess(`Submitted successfully! Score: ${safeResponse.summary.score}%`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyStyle = (d) => {
    if (d === 'EASY' || d === 'easy') return { color: '#4CAF50', bg: '#E8F5E9' };
    if (d === 'MEDIUM' || d === 'medium') return { color: '#FF9800', bg: '#FFF3E0' };
    if (d === 'HARD' || d === 'hard') return { color: '#F44336', bg: '#FFEBEE' };
    return { color: '#999', bg: '#f5f5f5' };
  };

  const getVerdictStyle = (verdict) => {
    if (verdict === 'PASS') return { icon: <CheckCircle size={16} color="#4CAF50" />, color: '#4CAF50' };
    if (verdict === 'FAIL') return { icon: <XCircle size={16} color="#F44336" />, color: '#F44336' };
    if (verdict === 'TIME_LIMIT_EXCEEDED') return { icon: <Clock size={16} color="#FF9800" />, color: '#FF9800' };
    return { icon: <AlertCircle size={16} color="#999" />, color: '#999' };
  };

  const isBusy = isExecuting || isSubmitting;

  if (isLoadingQuestions) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #e0e0e0', borderTopColor: '#2196F3', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#999', fontSize: '14px' }}>Loading questions...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '32px', textAlign: 'center', maxWidth: '400px' }}>
        <AlertCircle size={48} color="#F44336" style={{ margin: '0 auto 16px', display: 'block' }} />
        <h2 style={{ color: '#333', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Failed to Load Test</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>{loadError}</p>
        <button onClick={onBack} style={{ background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 20px', fontSize: '14px', cursor: 'pointer' }}>Go Back</button>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '32px', textAlign: 'center', maxWidth: '400px' }}>
        <BookOpen size={48} color="#ccc" style={{ margin: '0 auto 16px', display: 'block' }} />
        <h2 style={{ color: '#333', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No Questions Found</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>This test doesn't have any questions yet.</p>
        <button onClick={onBack} style={{ background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 20px', fontSize: '14px', cursor: 'pointer' }}>Go Back</button>
      </div>
    </div>
  );

  const diffStyle = getDifficultyStyle(currentQuestion?.difficulty);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Top Toolbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '6px 12px', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
              <ChevronLeft size={14} /> Back
            </button>
          )}
          <div style={{ borderLeft: '1px solid #e0e0e0', paddingLeft: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{test?.title}</div>
            <div style={{ fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {test?.duration_minutes} mins
            </div>
          </div>
        </div>

        {/* Center: Question dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {questions.map((q, i) => {
            const score = questionResults[q.id];
            const isActive = i === currentQuestionIndex;
            let bg = '#e0e0e0', color = '#666';
            if (isActive) { bg = '#2196F3'; color = '#fff'; }
            else if (score === 100) { bg = '#4CAF50'; color = '#fff'; }
            else if (score > 0) { bg = '#FF9800'; color = '#fff'; }
            else if (score === 0 && score !== undefined) { bg = '#F44336'; color = '#fff'; }
            return (
              <button key={q.id} onClick={() => setCurrentQuestionIndex(i)} style={{
                width: '24px', height: '24px', borderRadius: '4px', background: bg, color,
                border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
              }}>{i + 1}</button>
            );
          })}
        </div>

        {/* Right: Language selector + controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={isBusy}
            style={{ background: '#fff', color: '#333', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer' }}>
            {allowedLanguages.map(lang => (
              <option key={lang} value={lang}>{LANGUAGE_LABELS[lang] || lang}</option>
            ))}
          </select>

          <button onClick={() => { setCode(DEFAULT_CODE[language] || ''); setResult(null); setError(null); setSubmitSuccess(null); }}
            style={{ background: '#fff', color: '#666', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RotateCcw size={13} /> Reset
          </button>

          <button onClick={handleExecute} disabled={isBusy}
            style={{ background: isBusy ? '#ccc' : '#F44336', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isExecuting ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Running...</> : <><Play size={14} /> Run</>}
          </button>

          <button onClick={handleSubmit} disabled={isBusy}
            style={{ background: isBusy ? '#ccc' : '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isSubmitting ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Submitting...</> : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT: Problem */}
        <div style={{ width: '45%', minWidth: '320px', maxWidth: '550px', background: '#fff', borderRight: '1px solid #e0e0e0', overflowY: 'auto', padding: '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#999', fontWeight: '500' }}>Question {currentQuestionIndex + 1} / {questions.length}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))} disabled={currentQuestionIndex === 0}
                style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '4px 8px', color: currentQuestionIndex === 0 ? '#ccc' : '#666', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer' }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))} disabled={currentQuestionIndex === questions.length - 1}
                style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '4px 8px', color: currentQuestionIndex === questions.length - 1 ? '#ccc' : '#666', cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {currentQuestion?.difficulty && (
              <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '4px', background: diffStyle.bg, color: diffStyle.color }}>
                {(currentQuestion.difficulty || '').toUpperCase()}
              </span>
            )}
            {currentQuestion?.topic && (
              <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '4px', background: '#E3F2FD', color: '#2196F3' }}>
                {currentQuestion.topic}
              </span>
            )}
            {currentQuestion?.points && (
              <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '4px', background: '#f5f5f5', color: '#666' }}>
                {currentQuestion.points} pts
              </span>
            )}
          </div>

          <h2 style={{ color: '#333', fontSize: '18px', fontWeight: '600', marginBottom: '12px', lineHeight: '1.4' }}>{currentQuestion?.title}</h2>
          <div style={{ color: '#333', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Task</div>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{currentQuestion?.description}</p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#333', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Allowed Languages</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {allowedLanguages.map(lang => (
                <span key={lang} style={{
                  fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px',
                  background: language === lang ? '#2196F3' : '#f5f5f5',
                  color: language === lang ? '#fff' : '#666',
                  border: '1px solid #e0e0e0'
                }}>{LANGUAGE_LABELS[lang] || lang}</span>
              ))}
            </div>
          </div>

          {Array.isArray(currentQuestion?.test_cases) && currentQuestion.test_cases.filter(tc => !tc.is_hidden).length > 0 && (
            <>
              <div style={{ color: '#333', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Sample Test Cases</div>
              {currentQuestion.test_cases.filter(tc => !tc.is_hidden).map((tc, idx) => (
                <div key={tc.id ?? idx} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#999', marginBottom: '6px' }}>Example {idx + 1}</div>
                  <div style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '10px 12px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '6px' }}>
                    <div style={{ color: '#999', fontSize: '12px', marginBottom: '2px' }}>Input:</div>
                    <div style={{ color: '#333' }}>{tc.input || '(empty)'}</div>
                  </div>
                  <div style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '10px 12px', fontFamily: 'monospace', fontSize: '13px' }}>
                    <div style={{ color: '#999', fontSize: '12px', marginBottom: '2px' }}>Output:</div>
                    <div style={{ color: '#333' }}>{tc.expected_output}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* RIGHT: Editor + Results */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: result || error || submitSuccess ? '0 0 60%' : 1, overflow: 'hidden', background: '#1e1e1e' }}>
            <CodeEditor code={code} onChange={(value) => setCode(value || '')} language={language} readOnly={isBusy} />
          </div>

          {(result || error || submitSuccess) && (
            <div style={{ flex: '0 0 40%', overflowY: 'auto', background: '#fff', borderTop: '1px solid #e0e0e0', padding: '16px 24px' }}>

              {submitSuccess && (
                <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '4px', padding: '12px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <CheckCircle size={16} color="#4CAF50" />
                  <span style={{ color: '#2E7D32', fontWeight: '600', fontSize: '14px' }}>{submitSuccess}</span>
                </div>
              )}

              {error && (
                <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '4px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle size={16} color="#F44336" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#F44336', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Error</div>
                    <pre style={{ color: '#666', fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{error}</pre>
                  </div>
                </div>
              )}

              {result && (
                <>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ flex: 1, background: '#E3F2FD', border: '1px solid #BBDEFB', borderRadius: '4px', padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#2196F3', marginBottom: '4px' }}>Score</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: result.summary.score === 100 ? '#4CAF50' : result.summary.score > 0 ? '#FF9800' : '#F44336' }}>
                        {result.summary.score}%
                      </div>
                    </div>
                    <div style={{ flex: 1, background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '4px', padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#4CAF50', marginBottom: '4px' }}>Passed</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>
                        {result.summary.passed}<span style={{ fontSize: '16px', color: '#999' }}>/{result.summary.total}</span>
                      </div>
                    </div>
                  </div>

                  {result.compilation_error && (
                    <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '4px', padding: '12px', marginBottom: '12px' }}>
                      <div style={{ color: '#F44336', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Compilation Error</div>
                      <pre style={{ color: '#666', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>{result.compilation_error}</pre>
                    </div>
                  )}

                  {Array.isArray(result.results) && result.results.length > 0 && (
                    <>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>Test Cases</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {result.results.map((testResult, idx) => {
                          if (!testResult || typeof testResult !== 'object') return null;
                          const vs = getVerdictStyle(testResult.verdict);
                          return (
                            <div key={testResult.id ?? idx} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '10px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {vs.icon}
                                  <span style={{ color: vs.color, fontWeight: '600', fontSize: '13px' }}>{testResult.verdict}</span>
                                  <span style={{ color: '#999', fontSize: '12px' }}>#{idx + 1}</span>
                                </div>
                                {testResult.time_ms !== undefined && testResult.time_ms !== null && (
                                  <span style={{ color: '#999', fontSize: '12px' }}>{testResult.time_ms}ms</span>
                                )}
                              </div>
                              {testResult.stdout && <pre style={{ background: '#fff', borderRadius: '4px', padding: '6px 8px', color: '#666', fontSize: '12px', fontFamily: 'monospace', margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>{testResult.stdout}</pre>}
                              {testResult.stderr && <pre style={{ background: '#fff', borderRadius: '4px', padding: '6px 8px', color: '#F44336', fontSize: '12px', fontFamily: 'monospace', margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>{testResult.stderr}</pre>}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {Array.isArray(result.results) && result.results.length === 0 && !result.compilation_error && (
                    <div style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '16px' }}>No test case results returned.</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default TestAttempt;