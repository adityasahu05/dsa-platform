import { useState, useEffect } from 'react';
import { Search, Clock, FileText, Mail } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/teacher';

function StudentTestList({ onSelectTest, onSwitchView }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${API_URL}/student/tests`);
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Sidebar */}
      <div style={{ width: '200px', background: '#fff', borderRight: '1px solid #e0e0e0', padding: '24px 16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '16px', marginTop: 0 }}>
          Test filters
        </h3>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>Test status</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#333', marginBottom: '6px', cursor: 'pointer' }}>
            <input type="radio" name="status" defaultChecked /> Active
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#999', marginBottom: '6px', cursor: 'not-allowed' }}>
            <input type="radio" name="status" disabled /> Completed
          </label>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>Difficulty</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#333', marginBottom: '6px' }}>
            <input type="checkbox" defaultChecked /> All levels
          </label>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>Duration</div>
          <select style={{ width: '100%', padding: '6px 8px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#fff' }}>
            <option>Any time</option>
            <option>30-60 mins</option>
            <option>60-90 mins</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px 40px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333', margin: '0 0 4px' }}>Available Tests</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Select a test to begin your coding challenge</p>
          </div>
          {onSwitchView && (
            <button onClick={onSwitchView} style={{
              background: '#fff', color: '#2196F3', border: '1px solid #2196F3',
              borderRadius: '4px', padding: '8px 16px', fontSize: '14px', fontWeight: '500',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.background = '#2196F3'; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#2196F3'; }}
            >
              Teacher View
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Search by test name or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 36px', fontSize: '14px',
                border: '1px solid #e0e0e0', borderRadius: '4px', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button style={{
            background: '#2196F3', color: '#fff', border: 'none',
            borderRadius: '4px', padding: '10px 20px', fontSize: '14px', fontWeight: '500',
            cursor: 'pointer', whiteSpace: 'nowrap'
          }}>
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '32px', height: '32px', border: '3px solid #e0e0e0',
              borderTopColor: '#2196F3', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
            }} />
            <p style={{ color: '#999', fontSize: '14px' }}>Loading tests...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <FileText size={48} color="#ccc" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ color: '#666', fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              {searchQuery ? 'No tests found' : 'No tests available'}
            </h3>
            <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
              {searchQuery ? 'Try adjusting your search' : 'Check back later for new coding challenges'}
            </p>
          </div>
        )}

        {/* Test Cards */}
        {!loading && filteredTests.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredTests.map(test => (
              <TestCard key={test.id} test={test} onSelectTest={onSelectTest} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function TestCard({ test, onSelectTest }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '20px 24px',
        transition: 'box-shadow 0.2s',
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', margin: '0 0 8px' }}>
            {test.title}
          </h3>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px', lineHeight: '1.5' }}>
            {test.description || 'Test description'}
          </p>

          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} />
              <span>Invite only</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} />
              <span>{test.duration_minutes} min</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} />
              <span>{test.question_count || 0} question{test.question_count !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '13px', color: '#999' }}>
            Available now
          </div>
        </div>

        <button
          onClick={() => onSelectTest(test)}
          style={{
            marginLeft: '24px',
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.target.style.background = '#1976D2'}
          onMouseLeave={e => e.target.style.background = '#2196F3'}
        >
          Start Test
        </button>
      </div>
    </div>
  );
}

export default StudentTestList;