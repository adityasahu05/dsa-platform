


import { useState, useEffect, useRef } from 'react';
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
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [submissionsByQuestion, setSubmissionsByQuestion] = useState({});
  const [attemptInfo, setAttemptInfo] = useState(null);
  const [codeByQuestionId, setCodeByQuestionId] = useState({});
  const [languageByQuestionId, setLanguageByQuestionId] = useState({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [pasteWarning, setPasteWarning] = useState(null);
  const [forfeited, setForfeited] = useState(false);
  const [forfeitMessage, setForfeitMessage] = useState(null);
  const autoSubmitRef = useRef(false);
  const lastSwitchRef = useRef(0);
  const forfeitInFlightRef = useRef(false);
  const pasteWarningTimerRef = useRef(null);
  const TAB_SWITCH_LIMIT = 3;

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoadingQuestions(true);
      setLoadError(null);
      try {
        const [questionsData, submissionsData, attemptData] = await Promise.all([
          api.getStudentTestQuestions(test.id),
          api.getStudentTestSubmissions(test.id),
          api.startTestAttempt(test.id),
        ]);
        if (!Array.isArray(questionsData)) throw new Error('Unexpected response format');
        setQuestions(questionsData);
        setAttemptInfo(attemptData);
        if (attemptData?.forfeited) {
          setForfeited(true);
          setForfeitMessage('Test forfeited due to excessive tab switching.');
        }

        const submissionMap = {};
        const scoreMap = {};
        if (Array.isArray(submissionsData)) {
          submissionsData.forEach((sub) => {
            if (sub?.question_id) {
              submissionMap[sub.question_id] = sub;
              if (sub.score !== undefined) scoreMap[sub.question_id] = sub.score;
            }
          });
        }
        setSubmissionsByQuestion(submissionMap);
        if (Object.keys(scoreMap).length > 0) {
          setQuestionResults(prev => ({ ...prev, ...scoreMap }));
        }
        if (Array.isArray(questionsData) && questionsData.length > 0) {
          setCodeByQuestionId(prev => {
            const next = { ...prev };
            questionsData.forEach((q) => {
              if (submissionMap[q.id]?.code !== undefined) {
                next[q.id] = submissionMap[q.id].code;
              } else if (next[q.id] === undefined) {
                next[q.id] = DEFAULT_CODE[allowedLanguages[0]] || DEFAULT_CODE.python;
              }
            });
            return next;
          });
          setLanguageByQuestionId(prev => {
            const next = { ...prev };
            questionsData.forEach((q) => {
              if (submissionMap[q.id]?.language) {
                next[q.id] = submissionMap[q.id].language;
              } else if (next[q.id] === undefined) {
                next[q.id] = allowedLanguages[0] || 'python';
              }
            });
            return next;
          });
        }
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
    autoSubmitRef.current = false;
  }, [test?.id]);

  useEffect(() => {
    setTabSwitches(0);
    setPasteCount(0);
    setPasteWarning(null);
    setForfeited(false);
    setForfeitMessage(null);
    if (pasteWarningTimerRef.current) {
      clearTimeout(pasteWarningTimerRef.current);
      pasteWarningTimerRef.current = null;
    }
  }, [test?.id]);

  useEffect(() => {
    if (!attemptInfo || typeof attemptInfo.remaining_seconds !== 'number') return;
    const totalSeconds = Math.max(0, Math.floor(attemptInfo.remaining_seconds));
    setTimeLeft(totalSeconds);
    setTimeUp(totalSeconds <= 0);
    if (totalSeconds <= 0) return;
    const endAt = Date.now() + totalSeconds * 1000;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        setTimeUp(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [attemptInfo?.started_at, attemptInfo?.remaining_seconds]);

  useEffect(() => {
    const current = questions[currentQuestionIndex];
    if (!current) return;
    const submitted = submissionsByQuestion[current.id];
    if (submitted) {
      if (submitted.language && submitted.language !== language) {
        setLanguage(submitted.language);
      }
      setLanguageByQuestionId(prev => ({ ...prev, [current.id]: submitted.language || prev[current.id] }));
      setCodeByQuestionId(prev => ({ ...prev, [current.id]: submitted.code ?? prev[current.id] }));
      setCode(submitted.code || '');
      setSubmitSuccess(`Already submitted. Score: ${submitted.score ?? 0}%`);
    } else {
      const storedLang = languageByQuestionId[current.id] || allowedLanguages[0] || 'python';
      const storedCode = codeByQuestionId[current.id] ?? (DEFAULT_CODE[storedLang] || DEFAULT_CODE.python);
      if (storedLang !== language) setLanguage(storedLang);
      setCode(storedCode || '');
      setSubmitSuccess(null);
    }
    setResult(null);
    setError(null);
  }, [currentQuestionIndex, submissionsByQuestion, questions, languageByQuestionId, codeByQuestionId]);

  useEffect(() => {
    const current = questions[currentQuestionIndex];
    const submitted = current ? submissionsByQuestion[current.id] : null;
    if (!current || submitted) return;
    const defaultCode = DEFAULT_CODE[language] || DEFAULT_CODE.python;
    setCode(defaultCode);
    setCodeByQuestionId(prev => ({ ...prev, [current.id]: defaultCode }));
    setLanguageByQuestionId(prev => ({ ...prev, [current.id]: language }));
    setResult(null);
    setError(null);
    setSubmitSuccess(null);
  }, [language]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentSubmission = currentQuestion ? submissionsByQuestion[currentQuestion.id] : null;

  const extractErrorMessage = (err) => {
    if (Array.isArray(err?.response?.data?.detail))
      return err.response.data.detail.map(e => `${e.loc?.join('.')} — ${e.msg}`).join('\n');
    if (typeof err?.response?.data?.detail === 'string') return err.response.data.detail;
    if (typeof err?.response?.data === 'string') return err.response.data;
    return err?.message || 'An unknown error occurred';
  };

  const triggerForfeit = async (count) => {
    if (forfeitInFlightRef.current || forfeited) return;
    forfeitInFlightRef.current = true;
    setForfeited(true);
    setForfeitMessage('Test forfeited due to excessive tab switching.');
    try {
      await api.forfeitTestAttempt(test.id, count);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      forfeitInFlightRef.current = false;
    }
  };

  useEffect(() => {
    if (!test?.id) return;
    const onSwitch = () => {
      if (forfeited) return;
      const now = Date.now();
      if (now - lastSwitchRef.current < 800) return;
      lastSwitchRef.current = now;
      setTabSwitches((prev) => {
        const next = prev + 1;
        if (next > TAB_SWITCH_LIMIT) {
          void triggerForfeit(next);
        }
        return next;
      });
    };
    const handleVisibility = () => {
      if (document.hidden) onSwitch();
    };
    const handleBlur = () => onSwitch();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [test?.id, forfeited]);

  // ✅ FIXED: positional args + summary field now returned by backend
  const runCodeFor = async (question, codeText, lang, includeHidden = true) => {
    if (!question) return null;
    const tests = includeHidden
      ? (question.test_cases || [])
      : (question.test_cases || []).filter(tc => !tc.is_hidden);
    const response = await api.executeCode(
      codeText,
      lang,
      tests,
      question.id,
      (question.time_limit_ms || 2000) / 1000,
      256000
    );
    if (!response || typeof response !== 'object') throw new Error('Invalid response from execution server');
    const safeResponse = {
      ...response,
      results: Array.isArray(response.results) ? response.results : [],
      summary: response.summary && typeof response.summary === 'object'
        ? response.summary : { score: 0, passed: 0, total: 0 },
    };
    setResult(safeResponse);
    if (safeResponse.summary?.score !== undefined)
      setQuestionResults(prev => ({ ...prev, [question.id]: safeResponse.summary.score }));
    return safeResponse;
  };

  const handleCodeChange = (value) => {
    const next = value || '';
    setCode(next);
    if (currentQuestion?.id) {
      setCodeByQuestionId(prev => ({ ...prev, [currentQuestion.id]: next }));
    }
  };

  const handlePasteBlocked = () => {
    setPasteCount((prev) => prev + 1);
    setPasteWarning('Pasting is disabled during the test.');
    if (pasteWarningTimerRef.current) {
      clearTimeout(pasteWarningTimerRef.current);
    }
    pasteWarningTimerRef.current = setTimeout(() => {
      setPasteWarning(null);
      pasteWarningTimerRef.current = null;
    }, 2000);
  };

  const handleExecute = async () => {
    if (timeUp || currentSubmission || forfeited) return;
    setIsExecuting(true);
    setError(null);
    setResult(null);
    setSubmitSuccess(null);
    try {
      await runCodeFor(currentQuestion, code, language, false);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;
    if (forfeited) {
      setError('Test forfeited due to excessive tab switching.');
      return;
    }
    if (timeUp) {
      setError('Test time is over.');
      return;
    }
    if (currentSubmission) {
      setError('You have already submitted this question.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setSubmitSuccess(null);
    try {
      const safeResponse = await runCodeFor(currentQuestion, code, language, true);
      if (!safeResponse) return;

      await api.submitSolution({
        question_id: currentQuestion.id,
        test_id: test.id,
        language,
        code,
        score: safeResponse.summary.score,
        passed: safeResponse.summary.passed,
        total: safeResponse.summary.total,
        auto_submit: false,
      });

      setSubmitSuccess(`Submitted successfully! Score: ${safeResponse.summary.score}%`);
      const newSubmission = {
        question_id: currentQuestion.id,
        test_id: test.id,
        language,
        code,
        score: safeResponse.summary.score,
        passed: safeResponse.summary.passed,
        total: safeResponse.summary.total,
        submitted_at: new Date().toISOString(),
      };
      setSubmissionsByQuestion(prev => ({ ...prev, [currentQuestion.id]: newSubmission }));
      setQuestionResults(prev => ({ ...prev, [currentQuestion.id]: safeResponse.summary.score }));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!timeUp) return;
    if (forfeited) return;
    if (autoSubmitRef.current) return;
    if (!Array.isArray(questions) || questions.length === 0) return;
    autoSubmitRef.current = true;

    const doAutoSubmitAll = async () => {
      setIsSubmitting(true);
      setError(null);
      setResult(null);
      setSubmitSuccess(null);
      try {
        for (const q of questions) {
          if (submissionsByQuestion[q.id]) continue;
          const lang = languageByQuestionId[q.id] || allowedLanguages[0] || 'python';
          const codeText = codeByQuestionId[q.id] ?? (DEFAULT_CODE[lang] || DEFAULT_CODE.python);
          const safeResponse = await runCodeFor(q, codeText, lang, true);
          if (!safeResponse) continue;

          await api.submitSolution({
            question_id: q.id,
            test_id: test.id,
            language: lang,
            code: codeText,
            score: safeResponse.summary.score,
            passed: safeResponse.summary.passed,
            total: safeResponse.summary.total,
            auto_submit: true,
          });

          const newSubmission = {
            question_id: q.id,
            test_id: test.id,
            language: lang,
            code: codeText,
            score: safeResponse.summary.score,
            passed: safeResponse.summary.passed,
            total: safeResponse.summary.total,
            submitted_at: new Date().toISOString(),
            auto_submit: true,
          };
          setSubmissionsByQuestion(prev => ({ ...prev, [q.id]: newSubmission }));
          setQuestionResults(prev => ({ ...prev, [q.id]: safeResponse.summary.score }));
        }
        setSubmitSuccess('Auto-submitted all unanswered questions.');
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    };

    void doAutoSubmitAll();
  }, [timeUp, questions, submissionsByQuestion, languageByQuestionId, codeByQuestionId]);

  const getDifficultyStyle = (d) => {
    if (d === 'EASY' || d === 'easy') return { color: '#4CAF50', bg: '#E8F5E9' };
    if (d === 'MEDIUM' || d === 'medium') return { color: '#FF9800', bg: '#FFF3E0' };
    if (d === 'HARD' || d === 'hard') return { color: '#F44336', bg: '#FFEBEE' };
    return { color: '#999', bg: '#f5f5f5' };
  };

  // ✅ FIXED: handles verdict string AND boolean passed fallback
  const getVerdictStyle = (testResult) => {
    const verdict = testResult.verdict || (testResult.passed ? 'PASS' : 'FAIL');
    if (verdict === 'PASS') return { icon: <CheckCircle size={16} color="#4CAF50" />, color: '#4CAF50', label: 'PASS' };
    if (verdict === 'TIME_LIMIT_EXCEEDED') return { icon: <Clock size={16} color="#FF9800" />, color: '#FF9800', label: 'TLE' };
    return { icon: <XCircle size={16} color="#F44336" />, color: '#F44336', label: 'FAIL' };
  };

  const isLocked = timeUp || !!currentSubmission || forfeited;
  const isBusy = isExecuting || isSubmitting || isLocked;

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isLoadingQuestions) return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora', 'Segoe UI', sans-serif", color: '#e5e7eb' }}>
      <div style={{ textAlign: 'center', background: 'rgba(15,23,42,0.9)', border: '1px solid #1f2937', borderRadius: '16px', padding: '32px 28px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #1f2937', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'rgba(226,232,240,0.8)', fontSize: '14px' }}>Loading questions...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora', 'Segoe UI', sans-serif", color: '#e5e7eb' }}>
      <div style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #1f2937', borderRadius: '16px', padding: '32px', textAlign: 'center', maxWidth: '440px' }}>
        <AlertCircle size={48} color="#f87171" style={{ margin: '0 auto 16px', display: 'block' }} />
        <h2 style={{ color: '#e5e7eb', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Failed to Load Test</h2>
        <p style={{ color: 'rgba(226,232,240,0.7)', fontSize: '14px', marginBottom: '24px' }}>{loadError}</p>
        <button onClick={onBack} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>Go Back</button>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora', 'Segoe UI', sans-serif", color: '#e5e7eb' }}>
      <div style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #1f2937', borderRadius: '16px', padding: '32px', textAlign: 'center', maxWidth: '440px' }}>
        <BookOpen size={48} color="#94a3b8" style={{ margin: '0 auto 16px', display: 'block' }} />
        <h2 style={{ color: '#e5e7eb', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No Questions Found</h2>
        <p style={{ color: 'rgba(226,232,240,0.7)', fontSize: '14px', marginBottom: '24px' }}>This test doesn't have any questions yet.</p>
        <button onClick={onBack} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>Go Back</button>
      </div>
    </div>
  );

  const diffStyle = getDifficultyStyle(currentQuestion?.difficulty);

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', fontFamily: "'Sora', 'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', color: '#e5e7eb' }}>
      {forfeited && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2,6,23,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: 'rgba(15,23,42,0.98)',
            border: '1px solid rgba(248,113,113,0.5)',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(248,113,113,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertCircle size={24} color="#f87171" />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fecaca', marginBottom: '8px' }}>
              Tab Switch Limit Exceeded
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(226,232,240,0.75)', marginBottom: '20px', lineHeight: 1.6 }}>
              You switched tabs more than {TAB_SWITCH_LIMIT} times. This test has been forfeited and you can’t continue.
            </div>
            <button
              onClick={onBack}
              style={{
                padding: '10px 18px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Exit Test
            </button>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid #1f2937', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #1f2937', borderRadius: '8px', padding: '6px 12px', color: 'rgba(226,232,240,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
              <ChevronLeft size={14} /> Back
            </button>
          )}
          <div style={{ borderLeft: '1px solid #1f2937', paddingLeft: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb' }}>{test?.title}</div>
            <div style={{ fontSize: '12px', color: 'rgba(226,232,240,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {test?.duration_minutes} mins
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {questions.map((q, i) => {
            const score = questionResults[q.id];
            const isActive = i === currentQuestionIndex;
            let bg = '#1f2937', color = '#cbd5f5';
            if (isActive) { bg = '#2563eb'; color = '#fff'; }
            else if (score === 100) { bg = '#22c55e'; color = '#fff'; }
            else if (score > 0) { bg = '#f59e0b'; color = '#111827'; }
            else if (score === 0 && score !== undefined) { bg = '#ef4444'; color = '#fff'; }
            return (
              <button key={q.id} onClick={() => setCurrentQuestionIndex(i)} style={{
                width: '24px', height: '24px', borderRadius: '6px', background: bg, color,
                border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
              }}>{i + 1}</button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {timeLeft !== null && (
            <div style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #1f2937',
              background: timeUp ? 'rgba(248,113,113,0.2)' : 'rgba(15,23,42,0.7)',
              color: timeUp ? '#fecaca' : '#e5e7eb',
              fontSize: '12px',
              fontWeight: 600,
              minWidth: '70px',
              textAlign: 'center'
            }}>
              {formatTime(timeLeft)}
            </div>
          )}
          <div style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #1f2937',
            background: tabSwitches > TAB_SWITCH_LIMIT ? 'rgba(248,113,113,0.2)' : 'rgba(15,23,42,0.7)',
            color: tabSwitches > TAB_SWITCH_LIMIT ? '#fecaca' : '#e5e7eb',
            fontSize: '12px',
            fontWeight: 600,
            minWidth: '90px',
            textAlign: 'center'
          }}>
            Tabs: {tabSwitches}/{TAB_SWITCH_LIMIT}
          </div>
          <div style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #1f2937',
            background: 'rgba(15,23,42,0.7)',
            color: '#e5e7eb',
            fontSize: '12px',
            fontWeight: 600,
            minWidth: '85px',
            textAlign: 'center'
          }}>
            Paste: {pasteCount}
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={isBusy}
            style={{ background: '#0f172a', color: '#e5e7eb', border: '1px solid #1f2937', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer' }}>
            {allowedLanguages.map(lang => (
              <option key={lang} value={lang}>{LANGUAGE_LABELS[lang] || lang}</option>
            ))}
          </select>

          <button
            onClick={() => { setCode(DEFAULT_CODE[language] || ''); setResult(null); setError(null); setSubmitSuccess(null); }}
            disabled={isBusy}
            style={{
              background: isBusy ? '#111827' : '#0f172a',
              color: isBusy ? '#475569' : '#cbd5f5',
              border: '1px solid #1f2937',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: isBusy ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
            <RotateCcw size={13} /> Reset
          </button>

          <button onClick={handleExecute} disabled={isBusy}
            style={{ background: isBusy ? '#1f2937' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isExecuting ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Running...</> : <><Play size={14} /> Run</>}
          </button>

          <button onClick={handleSubmit} disabled={isBusy}
            style={{ background: isBusy ? '#1f2937' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isSubmitting ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Submitting...</> : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT: Problem */}
        <div style={{ width: '45%', minWidth: '320px', maxWidth: '550px', background: 'rgba(15,23,42,0.95)', borderRight: '1px solid #1f2937', overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(226,232,240,0.6)', fontWeight: '500' }}>Question {currentQuestionIndex + 1} / {questions.length}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))} disabled={currentQuestionIndex === 0}
                style={{ background: '#0f172a', border: '1px solid #1f2937', borderRadius: '8px', padding: '4px 8px', color: currentQuestionIndex === 0 ? '#374151' : '#cbd5f5', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer' }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))} disabled={currentQuestionIndex === questions.length - 1}
                style={{ background: '#0f172a', border: '1px solid #1f2937', borderRadius: '8px', padding: '4px 8px', color: currentQuestionIndex === questions.length - 1 ? '#374151' : '#cbd5f5', cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {currentQuestion?.difficulty && (
              <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', background: diffStyle.bg, color: diffStyle.color }}>
                {(currentQuestion.difficulty || '').toUpperCase()}
              </span>
            )}
            {currentQuestion?.topic && (
              <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                {currentQuestion.topic}
              </span>
            )}
            {currentQuestion?.points && (
              <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', background: 'rgba(148,163,184,0.15)', color: '#cbd5f5' }}>
                {currentQuestion.points} pts
              </span>
            )}
          </div>

          <h2 style={{ color: '#e5e7eb', fontSize: '18px', fontWeight: '600', marginBottom: '12px', lineHeight: '1.4' }}>{currentQuestion?.title}</h2>
          <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Task</div>
          <p style={{ color: 'rgba(226,232,240,0.75)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{currentQuestion?.description}</p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Allowed Languages</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {allowedLanguages.map(lang => (
                <span key={lang} style={{
                  fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px',
                  background: language === lang ? '#2563eb' : 'rgba(148,163,184,0.15)',
                  color: language === lang ? '#fff' : '#cbd5f5',
                  border: '1px solid rgba(148,163,184,0.2)'
                }}>{LANGUAGE_LABELS[lang] || lang}</span>
              ))}
            </div>
          </div>

          {Array.isArray(currentQuestion?.test_cases) && currentQuestion.test_cases.filter(tc => !tc.is_hidden).length > 0 && (
            <>
              <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Sample Test Cases</div>
              {currentQuestion.test_cases.filter(tc => !tc.is_hidden).map((tc, idx) => (
                <div key={tc.id ?? idx} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: 'rgba(226,232,240,0.6)', marginBottom: '6px' }}>Example {idx + 1}</div>
                  <div style={{ background: 'rgba(2,6,23,0.7)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', padding: '10px 12px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '6px' }}>
                    <div style={{ color: 'rgba(226,232,240,0.5)', fontSize: '12px', marginBottom: '2px' }}>Input:</div>
                    <div style={{ color: '#e2e8f0' }}>{tc.input || '(empty)'}</div>
                  </div>
                  <div style={{ background: 'rgba(2,6,23,0.7)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', padding: '10px 12px', fontFamily: 'monospace', fontSize: '13px' }}>
                    <div style={{ color: 'rgba(226,232,240,0.5)', fontSize: '12px', marginBottom: '2px' }}>Output:</div>
                    <div style={{ color: '#e2e8f0' }}>{tc.expected_output}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* RIGHT: Editor + Results */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: result || error || submitSuccess || forfeitMessage ? '0 0 60%' : 1, overflow: 'hidden', background: '#1e1e1e' }}>
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              language={language}
              readOnly={isBusy}
              disablePaste={true}
              onPasteBlocked={handlePasteBlocked}
            />
          </div>

          {(result || error || submitSuccess || forfeitMessage || pasteWarning) && (
            <div style={{ flex: '0 0 40%', overflowY: 'auto', background: 'rgba(15,23,42,0.95)', borderTop: '1px solid #1f2937', padding: '16px 24px' }}>

              {pasteWarning && (
                <div style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '10px', padding: '12px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle size={16} color="#60a5fa" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ color: '#bfdbfe', fontWeight: '600', fontSize: '14px' }}>{pasteWarning}</div>
                </div>
              )}

              {forfeitMessage && (
                <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)', borderRadius: '10px', padding: '12px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle size={16} color="#f87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#fecaca', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Test Forfeited</div>
                    <pre style={{ color: 'rgba(226,232,240,0.7)', fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {forfeitMessage}
                    </pre>
                  </div>
                </div>
              )}

              {submitSuccess && (
                <div style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '10px', padding: '12px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <CheckCircle size={16} color="#22c55e" />
                  <span style={{ color: '#bbf7d0', fontWeight: '600', fontSize: '14px' }}>{submitSuccess}</span>
                </div>
              )}

              {timeUp && !error && (
                <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)', borderRadius: '10px', padding: '12px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle size={16} color="#f87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#fecaca', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Time is up</div>
                    <pre style={{ color: 'rgba(226,232,240,0.7)', fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      The test duration has ended. Please contact your instructor if you need more time.
                    </pre>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)', borderRadius: '10px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle size={16} color="#f87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#fecaca', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Error</div>
                    <pre style={{ color: 'rgba(226,232,240,0.7)', fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{error}</pre>
                  </div>
                </div>
              )}

              {result && (
                <>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ flex: 1, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#60a5fa', marginBottom: '4px' }}>Score</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: result.summary.score === 100 ? '#22c55e' : result.summary.score > 0 ? '#f59e0b' : '#f87171' }}>
                        {result.summary.score}%
                      </div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#22c55e', marginBottom: '4px' }}>Passed</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#e5e7eb' }}>
                        {result.summary.passed}<span style={{ fontSize: '16px', color: '#999' }}>/{result.summary.total}</span>
                      </div>
                    </div>
                  </div>

                  {result.compilation_error && (
                    <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                      <div style={{ color: '#fecaca', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Compilation Error</div>
                      <pre style={{ color: 'rgba(226,232,240,0.7)', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>{result.compilation_error}</pre>
                    </div>
                  )}

                  {Array.isArray(result.results) && result.results.length > 0 && (
                    <>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>Test Cases</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {result.results.map((testResult, idx) => {
                          if (!testResult || typeof testResult !== 'object') return null;
                          const vs = getVerdictStyle(testResult);
                          return (
                            <div key={testResult.id ?? idx} style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '10px', padding: '10px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {vs.icon}
                                  <span style={{ color: vs.color, fontWeight: '600', fontSize: '13px' }}>{vs.label}</span>
                                  <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: '12px' }}>#{idx + 1}</span>
                                  {testResult.is_hidden && <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: '11px', background: 'rgba(148,163,184,0.2)', padding: '1px 6px', borderRadius: '4px' }}>hidden</span>}
                                </div>
                                {testResult.time_ms !== undefined && testResult.time_ms !== null && (
                                  <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: '12px' }}>{testResult.time_ms}ms</span>
                                )}
                              </div>
                              {testResult.error && (
                                <pre style={{ background: 'rgba(2,6,23,0.6)', borderRadius: '6px', padding: '6px 8px', color: '#f87171', fontSize: '12px', fontFamily: 'monospace', margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>{testResult.error}</pre>
                              )}
                              {testResult.stdout && !testResult.is_hidden && (
                                <pre style={{ background: 'rgba(2,6,23,0.6)', borderRadius: '6px', padding: '6px 8px', color: 'rgba(226,232,240,0.75)', fontSize: '12px', fontFamily: 'monospace', margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>{testResult.stdout}</pre>
                              )}
                              {testResult.stderr && (
                                <pre style={{ background: 'rgba(2,6,23,0.6)', borderRadius: '6px', padding: '6px 8px', color: '#f87171', fontSize: '12px', fontFamily: 'monospace', margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>{testResult.stderr}</pre>
                              )}
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
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap");
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default TestAttempt;
