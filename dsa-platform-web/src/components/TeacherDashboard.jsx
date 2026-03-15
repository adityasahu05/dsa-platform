
import { useState, useEffect } from 'react';
import { Plus, Search, Clock, Eye, X, Copy, Tag, Lock, Globe, ToggleLeft, ToggleRight, Pencil, Check, Trash2 } from 'lucide-react';
import { apiClient } from '../services/api';
import TestDetailsPage from './TestDetailsPage';
import QuestionsModal from './QuestionsModal';

const API_URL = '/api/teacher'; // v18

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
      const res = await apiClient.patch(`${API_URL}/tests/${localTest.id}`, payload);
      const updated = { ...localTest, ...res.data };
      setLocalTest(updated);
      onUpdate(updated);
    } catch (err) { console.error('Save failed:', err); }
  };

  const toggleAccess = async () => {
    try {
      const res = await apiClient.patch(`${API_URL}/tests/${localTest.id}`, { is_active: !localTest.is_active });
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
  const [selectedTestTab, setSelectedTestTab] = useState('questions');
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
      const response = await apiClient.get(`${API_URL}/tests`);
      setTests(response.data);
    } catch (error) { console.error('Error fetching tests:', error); }
  };

  const handleDeleteTest = async (test, e) => {
    if (e) e.stopPropagation();
    const ok = window.confirm(`Delete test "${test.title}"? This will remove all questions, test cases, and submissions.`);
    if (!ok) return;
    try {
      await apiClient.delete(`${API_URL}/tests/${test.id}`);
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test. Please try again.');
    }
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
        initialTab={selectedTestTab}
        onBack={() => { setSelectedTestForDetails(null); setSelectedTestTab('questions'); }}
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
                  <button onClick={e => { e.stopPropagation(); setSelectedTestTab('questions'); setSelectedTestForDetails(test); }}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Open
                  </button>
                  <button onClick={e => { e.stopPropagation(); setSelectedTestTab('submissions'); setSelectedTestForDetails(test); }}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Submissions
                  </button>
                  <button onClick={e => { e.stopPropagation(); setSelectedTestTab('analytics'); setSelectedTestForDetails(test); }}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Analytics
                  </button>
                  <button onClick={e => handleDeleteTest(test, e)}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#F44336', border: '1px solid #F44336', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={12} /> Remove
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
      await apiClient.post(`${API_URL}/tests`, {
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
      const qRes = await apiClient.post(`${API_URL}/questions`, formData);
      for (const tc of testCases) await apiClient.post(`${API_URL}/test-cases`, { question_id: qRes.data.id, ...tc });
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
