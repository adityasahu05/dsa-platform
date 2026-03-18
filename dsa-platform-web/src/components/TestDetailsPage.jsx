



import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Eye, Edit2, Trash2, Users, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { apiClient } from '../services/api';

const API_URL = '/api/teacher';

function TestDetailsPage({ test, onBack, onAddQuestion }) {
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const [loading, setLoading] = useState(true);
  const [linkStatus, setLinkStatus] = useState('');

  // Edit modal state
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Delete confirm state
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchTestData();
    const id = setInterval(fetchTestData, 20000);
    return () => clearInterval(id);
  }, [test.id]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const questionsRes = await apiClient.get(`${API_URL}/test/${test.id}/questions`);
      setQuestions(questionsRes.data);
      
      const submissionsRes = await apiClient.get(`${API_URL}/submissions`);
      const testSubmissions = submissionsRes.data.filter(sub => 
        questionsRes.data.some(q => q.id === sub.question_id)
      );
      setSubmissions(testSubmissions);
      
      try {
        const analyticsRes = await apiClient.get(`${API_URL}/analytics/test/${test.id}`);
        setAnalytics(analyticsRes.data);
      } catch {
        console.log('Analytics not available');
      }

      try {
        const detailedRes = await apiClient.get(`${API_URL}/analytics/test/${test.id}/detailed`);
        setDetailedAnalytics(detailedRes.data);
      } catch {
        console.log('Detailed analytics not available');
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingQuestion) return;
    setDeleteLoading(true);
    try {
      await apiClient.delete(`${API_URL}/questions/${deletingQuestion.id}`);
      setQuestions(prev => prev.filter(q => q.id !== deletingQuestion.id));
      setDeletingQuestion(null);
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = { EASY: '#4caf50', MEDIUM: '#ff9800', HARD: '#f44336' };
    return colors[difficulty] || '#999';
  };

  const formatDateTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN');
  };

  const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) return '—';
    const total = Math.max(0, Math.floor(seconds));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}m ${s}s`;
  };

  const formatDurationMs = (ms) => {
    if (ms === null || ms === undefined) return '—';
    const total = Math.max(0, Math.floor(ms));
    if (total < 1000) return `${total}ms`;
    const s = Math.floor(total / 1000);
    const rem = total % 1000;
    return `${s}.${String(rem).padStart(3, '0')}s`;
  };

  const formatCompletionWithExec = (baseSeconds, execMs, compMs) => {
    if (baseSeconds === null || baseSeconds === undefined) return '—';
    const execSec = execMs ? execMs / 1000 : 0;
    const compSec = compMs ? compMs / 1000 : 0;
    return formatDuration(baseSeconds + execSec + compSec);
  };

  const linkCode = test?.assessment_id || test?.id;
  const shareUrl = linkCode ? `${window.location.origin}/match/${linkCode}` : '';

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkStatus('Link copied');
      setTimeout(() => setLinkStatus(''), 1500);
    } catch {
      setLinkStatus('Copy failed');
      setTimeout(() => setLinkStatus(''), 1500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '20px 40px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer',
            fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '12px', padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back to tests
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              {test.title}
            </h1>
            <p style={{ fontSize: '14px', color: '#666' }}>{test.description || 'No description'}</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '13px', color: '#999' }}>
              <span><Clock size={14} style={{ verticalAlign: 'middle' }} /> {test.duration_minutes} mins</span>
              <span><Users size={14} style={{ verticalAlign: 'middle' }} /> {submissions.length} submissions</span>
              <span>{questions.length} questions</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {shareUrl && (
              <button
                onClick={handleCopyLink}
                style={{
                  padding: '10px 16px', backgroundColor: '#111827', color: 'white',
                  border: 'none', borderRadius: '4px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 600
                }}
              >
                Copy Test Link
              </button>
            )}
            {linkStatus && (
              <span style={{ fontSize: '12px', color: '#16a34a' }}>{linkStatus}</span>
            )}
            <button
              onClick={() => onAddQuestion(test)}
              style={{
                padding: '10px 20px', backgroundColor: '#2196F3', color: 'white',
                border: 'none', borderRadius: '4px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Plus size={18} /> Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '0 40px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['questions', 'submissions', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid #2196F3' : '2px solid transparent',
                color: activeTab === tab ? '#2196F3' : '#666',
                cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: '12px 0',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'questions' ? `Questions (${questions.length})` :
               tab === 'submissions'
                 ? `Submissions (${Array.isArray(detailedAnalytics?.students) ? detailedAnalytics.students.length : submissions.length})`
                 : 'Analytics'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{
              width: '40px', height: '40px', border: '4px solid #f3f3f3',
              borderTop: '4px solid #2196F3', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto'
            }} />
          </div>
        ) : (
          <>
            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div>
                {questions.length === 0 ? (
                  <div style={{
                    backgroundColor: '#fff', border: '1px solid #e0e0e0',
                    borderRadius: '4px', padding: '60px', textAlign: 'center'
                  }}>
                    <p style={{ color: '#999', marginBottom: '16px' }}>No questions added yet</p>
                    <button
                      onClick={() => onAddQuestion(test)}
                      style={{
                        padding: '10px 20px', backgroundColor: '#2196F3', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer',
                        fontSize: '14px', fontWeight: 500
                      }}
                    >
                      <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      Add First Question
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        style={{
                          backgroundColor: '#fff', border: '1px solid #e0e0e0',
                          borderRadius: '4px', padding: '20px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <span style={{
                                backgroundColor: '#f0f0f0', color: '#666',
                                padding: '4px 12px', borderRadius: '12px',
                                fontSize: '12px', fontWeight: 600
                              }}>Q{index + 1}</span>
                              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: 0 }}>
                                {question.title}
                              </h3>
                              <span style={{
                                backgroundColor: getDifficultyColor(question.difficulty) + '20',
                                color: getDifficultyColor(question.difficulty),
                                padding: '3px 10px', borderRadius: '12px',
                                fontSize: '12px', fontWeight: 600
                              }}>{question.difficulty}</span>
                              <span style={{
                                backgroundColor: '#E3F2FD', color: '#1976D2',
                                padding: '3px 10px', borderRadius: '12px',
                                fontSize: '12px', fontWeight: 500
                              }}>{question.topic.replace(/_/g, ' ')}</span>
                            </div>
                            
                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                              {question.description.length > 150
                                ? question.description.substring(0, 150) + '...'
                                : question.description}
                            </p>
                            
                            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#999' }}>
                              <span>{question.points} points</span>
                              <span>{question.time_limit_ms}ms time limit</span>
                              <span>{question.test_cases?.length || 0} test cases</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingQuestion(question)}
                              title="Edit question"
                              style={{
                                padding: '6px 12px', backgroundColor: 'transparent',
                                color: '#2196F3', border: '1px solid #2196F3',
                                borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                              }}
                            >
                              <Edit2 size={14} /> Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeletingQuestion(question)}
                              title="Delete question"
                              style={{
                                padding: '6px 12px', backgroundColor: 'transparent',
                                color: '#f44336', border: '1px solid #f44336',
                                borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                              }}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                {detailedAnalytics && Array.isArray(detailedAnalytics.students) ? (
                  detailedAnalytics.students.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                      <tr>
                        {[
                          'NAME',
                          'EMAIL ID',
                          'TEST START',
                          'TEST END',
                          'OVERALL COMP TIME',
                          'OVERALL SUBMIT TIME',
                          'TOTAL TIME (WITH EXEC)',
                          'OVERALL MARKS',
                          'TAB SWITCHES',
                          'PASTED'
                        ].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detailedAnalytics.students.map((s) => (
                        <tr key={s.student_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>{s.student_name || 'Unknown'}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>{s.student_email || 'Unknown'}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                            {formatDateTime(s.started_at)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                            {formatDateTime(s.overall_submitted_at || s.deadline_at)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                            {formatDurationMs(s.total_compilation_time_ms)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                            {formatDuration(s.overall_submission_time_seconds)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                            {formatCompletionWithExec(
                              s.overall_submission_time_seconds,
                              s.total_execution_time_ms,
                              s.total_compilation_time_ms
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                              backgroundColor: s.overall_score >= 90 ? '#E8F5E9' : s.overall_score >= 50 ? '#FFF3E0' : '#FFEBEE',
                              color: s.overall_score >= 90 ? '#4CAF50' : s.overall_score >= 50 ? '#FF9800' : '#F44336'
                            }}>
                              {s.overall_score ?? 0}%
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                            {s.tab_switches ?? 0}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                            {(s.paste_count ?? 0) > 0 ? `Yes (${s.paste_count})` : 'No'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <Users size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
                    <p style={{ color: '#999' }}>No submissions yet</p>
                  </div>
                )
                ) : submissions.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <Users size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
                    <p style={{ color: '#999' }}>No submissions yet</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                      <tr>
                        {['STUDENT', 'QUESTION', 'SCORE', 'VERDICT', 'EXEC TIME', 'COMP TIME', 'TOTAL (EXEC+COMP)', 'SUBMITTED'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                            <div style={{ fontWeight: 600, color: '#333' }}>
                              {submission.student_name || `Student #${submission.student_id}`}
                            </div>
                            {submission.student_email && (
                              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                                {submission.student_email}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                            {submission.question_title || `Q#${submission.question_id}`}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                              backgroundColor: submission.score === 100 ? '#E8F5E9' : submission.score >= 50 ? '#FFF3E0' : '#FFEBEE',
                              color: submission.score === 100 ? '#4CAF50' : submission.score >= 50 ? '#FF9800' : '#F44336'
                            }}>{submission.score}%</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: submission.verdict === 'PASS' ? '#4CAF50' : '#F44336' }}>
                              {submission.verdict === 'PASS' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                              {submission.verdict}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                            {formatDurationMs(submission.execution_time_ms)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                            {formatDurationMs(submission.compilation_time_ms)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                            {formatDurationMs(
                              (submission.execution_time_ms || 0) + (submission.compilation_time_ms || 0)
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#999' }}>
                            {new Date(submission.submitted_at).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { label: 'Total Questions', value: questions.length, color: '#2196F3' },
                    { label: 'Total Submissions', value: submissions.length, color: '#4CAF50' },
                    { label: 'Average Score', value: submissions.length > 0 ? Math.round(submissions.reduce((s, x) => s + x.score, 0) / submissions.length) + '%' : '0%', color: '#FF9800' },
                    { label: 'Pass Rate', value: submissions.length > 0 ? Math.round((submissions.filter(s => s.verdict === 'PASS').length / submissions.length) * 100) + '%' : '0%', color: '#9C27B0' }
                  ].map(card => (
                    <div key={card.label} style={{
                      backgroundColor: '#fff', border: '1px solid #e0e0e0',
                      borderRadius: '4px', padding: '20px', borderLeft: `4px solid ${card.color}`
                    }}>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{card.label}</div>
                      <div style={{ fontSize: '28px', fontWeight: 600, color: '#333' }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Detailed Student Analytics</h3>
                  {!detailedAnalytics || !Array.isArray(detailedAnalytics.students) ? (
                    <div style={{ color: '#999', fontSize: '14px' }}>Detailed analytics not available.</div>
                  ) : detailedAnalytics.students.length === 0 ? (
                    <div style={{ color: '#999', fontSize: '14px' }}>No student attempts yet.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                          <tr>
                            {[
                              'STUDENT',
                              'EMAIL',
                              'TEST START',
                              'OVERALL SUBMITTED',
                              'OVERALL TIME',
                              'OVERALL SCORE'
                            ].map(h => (
                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>
                                {h}
                              </th>
                            ))}
                            {(detailedAnalytics.questions || questions).map((q, i) => (
                              <th key={q.id || i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>
                                Q{i + 1} END
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {detailedAnalytics.students.map((s) => {
                            const qList = detailedAnalytics.questions || questions;
                            return (
                              <tr key={s.student_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600 }}>{s.student_name}</td>
                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{s.student_email}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>{formatDateTime(s.started_at)}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>{formatDateTime(s.overall_submitted_at)}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>{formatDuration(s.overall_submission_time_seconds)}</td>
                                <td style={{ padding: '12px 16px' }}>
                                  <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    backgroundColor: s.overall_score >= 70 ? '#E8F5E9' : s.overall_score >= 40 ? '#FFF3E0' : '#FFEBEE',
                                    color: s.overall_score >= 70 ? '#4CAF50' : s.overall_score >= 40 ? '#FF9800' : '#F44336'
                                  }}>
                                    {s.overall_score}%
                                  </span>
                                </td>
                                {qList.map((q, i) => {
                                  const qEntry = s.questions?.[q.id];
                                  const submittedAt = qEntry?.submitted_at;
                                  const score = qEntry?.score;
                                  return (
                                    <td key={q.id || i} style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>
                                      {submittedAt ? `${formatDateTime(submittedAt)}${score !== undefined ? ` (${score}%)` : ''}` : '—'}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Question-wise Performance</h3>
                  {(detailedAnalytics?.questions || questions).map((question, index) => {
                    const questionSubs = submissions.filter(s => s.question_id === question.id);
                    const avgScore = question.average_score !== undefined
                      ? Math.round(question.average_score)
                      : questionSubs.length > 0
                        ? Math.round(questionSubs.reduce((sum, s) => sum + s.score, 0) / questionSubs.length)
                        : 0;
                    const avgExecMs = question.avg_execution_time_ms ?? null;
                    const avgCompMs = question.avg_compilation_time_ms ?? null;
                    return (
                      <div key={question.id} style={{
                        display: 'flex', alignItems: 'center', padding: '12px 0',
                        borderBottom: index < questions.length - 1 ? '1px solid #f0f0f0' : 'none'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                            Q{index + 1}: {question.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {questionSubs.length} submissions · Avg: {avgScore}% · Exec: {formatDurationMs(avgExecMs)} · Comp: {formatDurationMs(avgCompMs)}
                          </div>
                        </div>
                        <div style={{ width: '200px' }}>
                          <div style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', width: `${avgScore}%`,
                              backgroundColor: avgScore >= 70 ? '#4CAF50' : avgScore >= 40 ? '#FF9800' : '#F44336',
                              transition: 'width 0.3s'
                            }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ EDIT QUESTION MODAL */}
      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSuccess={(updatedQuestion) => {
            setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
            setEditingQuestion(null);
          }}
        />
      )}

      {/* ✅ DELETE CONFIRMATION DIALOG */}
      {deletingQuestion && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '8px', padding: '28px',
            width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Trash2 size={20} color="#F44336" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#333', margin: 0 }}>
                Delete Question?
              </h3>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px', lineHeight: '1.5' }}>
              Are you sure you want to delete:
            </p>
            <div style={{
              backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0',
              borderRadius: '4px', padding: '12px', marginBottom: '20px'
            }}>
              <strong style={{ fontSize: '14px', color: '#333' }}>{deletingQuestion.title}</strong>
              <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0' }}>
                This will also delete all test cases and submissions for this question. This action cannot be undone.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeletingQuestion(null)}
                disabled={deleteLoading}
                style={{
                  flex: 1, padding: '10px', border: '1px solid #ddd',
                  borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
                  fontWeight: 500, backgroundColor: 'white', color: '#333'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{
                  flex: 1, padding: '10px', backgroundColor: deleteLoading ? '#ef9a9a' : '#F44336',
                  color: 'white', border: 'none', borderRadius: '4px',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 500
                }}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ EDIT QUESTION MODAL COMPONENT - with full test case editing
function EditQuestionModal({ question, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: question.title,
    description: question.description,
    difficulty: question.difficulty,
    topic: question.topic,
    points: question.points,
    time_limit_ms: question.time_limit_ms
  });
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [saving, setSaving] = useState(false);

  // Each test case: { id (if existing), input, expected_output, is_hidden, points, _status: 'existing'|'new'|'deleted' }
  const [testCases, setTestCases] = useState(
    (question.test_cases || []).map(tc => ({ ...tc, _status: 'existing' }))
  );

  const PRESET_TOPICS = [
    'ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS',
    'SORTING', 'SEARCHING', 'DYNAMIC_PROGRAMMING', 'RECURSION',
    'BACKTRACKING', 'STACK_QUEUE', 'HEAP'
  ];

  useEffect(() => {
    const topicUpper = question.topic.toUpperCase();
    if (!PRESET_TOPICS.includes(topicUpper)) {
      setIsCustomTopic(true);
      setCustomTopic(question.topic.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()));
    } else {
      setFormData(prev => ({ ...prev, topic: topicUpper }));
    }
  }, []);

  const handleTopicChange = (e) => {
    const value = e.target.value;
    if (value === 'CUSTOM') {
      setIsCustomTopic(true);
      setFormData({ ...formData, topic: '' });
    } else {
      setIsCustomTopic(false);
      setCustomTopic('');
      setFormData({ ...formData, topic: value });
    }
  };

  const updateTestCase = (index, field, value) => {
    setTestCases(prev => prev.map((tc, i) => i === index ? { ...tc, [field]: value } : tc));
  };

  const markDeleted = (index) => {
    setTestCases(prev => prev.map((tc, i) => i === index ? { ...tc, _status: 'deleted' } : tc));
  };

  const addNewTestCase = () => {
    setTestCases(prev => [...prev, {
      input: '', expected_output: '', is_hidden: false, points: 1, _status: 'new'
    }]);
  };

  const visibleTestCases = testCases.map((tc, i) => ({ ...tc, _index: i })).filter(tc => tc._status !== 'deleted');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCustomTopic && !customTopic.trim()) {
      alert('Please enter a custom topic name.');
      return;
    }
    setSaving(true);
    try {
      // 1. Update question fields
      const response = await apiClient.put(`${API_URL}/questions/${question.id}`, formData);

      // 2. Delete test cases marked as deleted
      const toDelete = testCases.filter(tc => tc._status === 'deleted' && tc.id);
      for (const tc of toDelete) {
        await apiClient.delete(`${API_URL}/test-cases/${tc.id}`);
      }

      // 3. Update existing test cases that were modified
      const toUpdate = testCases.filter(tc => tc._status === 'existing' && tc.id);
      for (const tc of toUpdate) {
        await apiClient.put(`${API_URL}/test-cases/${tc.id}`, {
          input: tc.input,
          expected_output: tc.expected_output,
          is_hidden: tc.is_hidden,
          points: tc.points
        });
      }

      // 4. Create new test cases
      const toCreate = testCases.filter(tc => tc._status === 'new');
      for (const tc of toCreate) {
        await apiClient.post(`${API_URL}/test-cases`, {
          question_id: question.id,
          input: tc.input,
          expected_output: tc.expected_output,
          is_hidden: tc.is_hidden,
          points: tc.points
        });
      }

      onSuccess(response.data);
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto',
      padding: '20px 0'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '8px', padding: '24px',
        width: '100%', maxWidth: '700px', margin: '0 20px'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#333', margin: 0 }}>Edit Question</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Question Title</label>
            <input
              type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
              required
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box' }}
              required
            />
          </div>

          {/* Difficulty + Topic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Topic</label>
              <select
                value={isCustomTopic ? 'CUSTOM' : formData.topic}
                onChange={handleTopicChange}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              >
                {PRESET_TOPICS.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                <option value="CUSTOM">✏️ Custom Topic...</option>
              </select>
              {isCustomTopic && (
                <>
                  <input
                    type="text" placeholder="e.g. Machine Learning" value={customTopic}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setCustomTopic(raw);
                      setFormData({ ...formData, topic: raw.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') });
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #2196F3', borderRadius: '4px', fontSize: '14px', marginTop: '8px', boxSizing: 'border-box' }}
                    autoFocus required={isCustomTopic}
                  />
                  {customTopic && <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Saved as: <code style={{ color: '#2196F3' }}>{formData.topic}</code></div>}
                </>
              )}
            </div>
          </div>

          {/* Points + Time Limit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Points</label>
              <input type="number" value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                min="1"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Time Limit (ms)</label>
              <input type="number" value={formData.time_limit_ms}
                onChange={(e) => setFormData({ ...formData, time_limit_ms: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                min="100" step="100"
              />
            </div>
          </div>

          {/* ✅ TEST CASES SECTION */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>
                Test Cases
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#999', marginLeft: '8px' }}>
                  ({visibleTestCases.length} total)
                </span>
              </h4>
              <button
                type="button" onClick={addNewTestCase}
                style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              >
                + Add Test Case
              </button>
            </div>

            {visibleTestCases.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', color: '#999', fontSize: '14px' }}>
                No test cases. Click "+ Add Test Case" to add one.
              </div>
            )}

            {visibleTestCases.map((tc) => {
              const idx = tc._index;
              const isNew = tc._status === 'new';
              return (
                <div key={idx} style={{
                  backgroundColor: isNew ? '#F3F9FF' : '#f9f9f9',
                  border: `1px solid ${isNew ? '#BBDEFB' : '#eee'}`,
                  borderRadius: '4px', padding: '12px', marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>
                      {isNew ? '🆕 New Test Case' : `Test Case #${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => isNew
                        ? setTestCases(prev => prev.filter((_, i) => i !== idx))
                        : markDeleted(idx)
                      }
                      style={{ background: 'none', border: 'none', color: '#F44336', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: '#555' }}>Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minHeight: '56px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: '#555' }}>Expected Output</label>
                      <textarea
                        value={tc.expected_output}
                        onChange={(e) => updateTestCase(idx, 'expected_output', e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minHeight: '56px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                        required
                      />
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox" checked={tc.is_hidden}
                      onChange={(e) => updateTestCase(idx, 'is_hidden', e.target.checked)}
                      style={{ marginRight: '6px' }}
                    />
                    Hidden Test Case
                  </label>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, backgroundColor: 'white', color: '#333' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 1, padding: '10px', backgroundColor: saving ? '#90CAF9' : '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TestDetailsPage;
