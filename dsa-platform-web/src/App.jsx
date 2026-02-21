// // import { useState } from 'react';
// // import TestAttempt from './components/TestAttempt';
// // import TeacherDashboard from './components/TeacherDashboard';
// // import StudentTestList from './components/StudentTestList';
// // import './App.css';

// // function App() {
// //   const [view, setView] = useState('student');
// //   const [selectedTest, setSelectedTest] = useState(null);

// //   const handleSelectTest = (test) => {
// //     setSelectedTest(test);
// //   };

// //   const handleBackToTests = () => {
// //     setSelectedTest(null);
// //   };

// //   return (
// //     <div style={{ minHeight: '100vh', background: '#0d1117', position: 'relative' }}>

// //       {/* View Switcher */}
// //       {!selectedTest && (
// //         <div style={{ position: 'fixed', top: '12px', right: '16px', zIndex: 1000 }}>
// //           <button
// //             onClick={() => {
// //               setView(view === 'student' ? 'teacher' : 'student');
// //               setSelectedTest(null);
// //             }}
// //             style={{
// //               background: '#1a2233',
// //               color: '#f0f6fc',
// //               border: '1px solid #2a3444',
// //               borderRadius: '8px',
// //               padding: '0.45rem 1rem',
// //               fontSize: '0.825rem',
// //               fontWeight: '600',
// //               cursor: 'pointer',
// //               fontFamily: "'Segoe UI', system-ui, sans-serif",
// //               transition: 'all 0.15s',
// //             }}
// //             onMouseEnter={e => {
// //               e.target.style.borderColor = '#ef4444';
// //               e.target.style.color = '#ef4444';
// //             }}
// //             onMouseLeave={e => {
// //               e.target.style.borderColor = '#2a3444';
// //               e.target.style.color = '#f0f6fc';
// //             }}
// //           >
// //             Switch to {view === 'student' ? 'Teacher' : 'Student'} View
// //           </button>
// //         </div>
// //       )}

// //       {/* Views */}
// //       {view === 'student' ? (
// //         selectedTest ? (
// //           <TestAttempt test={selectedTest} onBack={handleBackToTests} />
// //         ) : (
// //           <StudentTestList onSelectTest={handleSelectTest} />
// //         )
// //       ) : (
// //         <TeacherDashboard />
// //       )}

// //     </div>
// //   );
// // }

// // export default App;

// import { useState } from 'react';
// import TestAttempt from './components/TestAttempt';
// import TeacherDashboard from './components/TeacherDashboard';
// import StudentTestList from './components/StudentTestList';
// import './App.css';

// function App() {
//   const [view, setView] = useState('student');
//   const [selectedTest, setSelectedTest] = useState(null);

//   const switchView = () => {
//     setView(v => v === 'student' ? 'teacher' : 'student');
//     setSelectedTest(null);
//   };

//   return (
//     <div style={{ minHeight: '100vh', background: '#0d1117' }}>
//       {view === 'student' ? (
//         selectedTest ? (
//           <TestAttempt test={selectedTest} onBack={() => setSelectedTest(null)} />
//         ) : (
//           <StudentTestList onSelectTest={setSelectedTest} onSwitchView={switchView} />
//         )
//       ) : (
//         <TeacherDashboard onSwitchView={switchView} />
//       )}
//     </div>
//   );
// }

// export default App;

import { useState } from 'react';
import axios from 'axios';
import TestAttempt from './components/TestAttempt';
import TeacherDashboard from './components/TeacherDashboard';
import StudentTestList from './components/StudentTestList';
import AuthPage from './components/AuthPage';
import './App.css';

// ✅ Axios interceptor — attaches JWT to every request automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  // ✅ FIX: Initialize from localStorage so refresh doesn't log user out
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation state
  const [selectedTest, setSelectedTest] = useState(null);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setSelectedTest(null);
  };

  const handleLogout = () => {
    // ✅ FIX: Clear localStorage on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setSelectedTest(null);
  };

  // Not logged in → show auth page
  if (!token || !user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Logged in as TEACHER
  if (user.role === 'teacher') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <TopBar user={user} onLogout={handleLogout} />
        <TeacherDashboard token={token} />
      </div>
    );
  }

  // Logged in as STUDENT
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {!selectedTest && <TopBar user={user} onLogout={handleLogout} />}
      {selectedTest ? (
        <TestAttempt
          test={selectedTest}
          token={token}
          user={user}
          onBack={() => setSelectedTest(null)}
        />
      ) : (
        <StudentTestList
          token={token}
          onSelectTest={setSelectedTest}
        />
      )}
    </div>
  );
}

// ✅ Top navigation bar shown when logged in
function TopBar({ user, onLogout }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #e0e0e0',
      padding: '0 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '52px'
    }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px',
          backgroundColor: '#2196F3', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px'
        }}>💻</div>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#333' }}>DSA Platform</span>
        <span style={{
          fontSize: '11px', fontWeight: 600,
          backgroundColor: user.role === 'teacher' ? '#E8F5E9' : '#E3F2FD',
          color: user.role === 'teacher' ? '#2E7D32' : '#1565C0',
          padding: '2px 8px', borderRadius: '10px', marginLeft: '4px'
        }}>
          {user.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
        </span>
      </div>

      {/* Right: User info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {user.name}
        </span>
        <button
          onClick={onLogout}
          style={{
            padding: '6px 16px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default App;