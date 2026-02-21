// import { useState } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/auth';

// function AuthPage({ onLogin }) {
//   const [mode, setMode] = useState('login'); // 'login' | 'register'
//   const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const endpoint = mode === 'login' ? '/login' : '/register';
//       const payload = mode === 'login'
//         ? { email: formData.email, password: formData.password }
//         : formData;

//       const response = await axios.post(`${API_URL}${endpoint}`, payload);
//       const { token, user } = response.data;

//       // ✅ FIX: Save token to localStorage so axios interceptor can use it
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));

//       onLogin(token, user);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#f5f5f5',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     }}>
//       <div style={{
//         backgroundColor: '#fff',
//         borderRadius: '8px',
//         border: '1px solid #e0e0e0',
//         padding: '40px',
//         width: '100%',
//         maxWidth: '420px'
//       }}>
//         {/* Logo / Title */}
//         <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//           <div style={{
//             width: '48px', height: '48px',
//             backgroundColor: '#2196F3',
//             borderRadius: '12px',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             margin: '0 auto 16px',
//             fontSize: '24px'
//           }}>
//             💻
//           </div>
//           <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#333', margin: 0 }}>
//             DSA Platform
//           </h1>
//           <p style={{ fontSize: '14px', color: '#999', marginTop: '6px' }}>
//             {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
//           </p>
//         </div>

//         {/* Tab switcher */}
//         <div style={{
//           display: 'flex',
//           backgroundColor: '#f5f5f5',
//           borderRadius: '6px',
//           padding: '4px',
//           marginBottom: '24px'
//         }}>
//           {['login', 'register'].map(m => (
//             <button
//               key={m}
//               onClick={() => { setMode(m); setError(''); }}
//               style={{
//                 flex: 1, padding: '8px',
//                 backgroundColor: mode === m ? '#fff' : 'transparent',
//                 border: mode === m ? '1px solid #e0e0e0' : '1px solid transparent',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 fontWeight: mode === m ? 600 : 400,
//                 color: mode === m ? '#333' : '#999',
//                 textTransform: 'capitalize'
//               }}
//             >
//               {m === 'login' ? 'Sign In' : 'Register'}
//             </button>
//           ))}
//         </div>

//         {/* Error */}
//         {error && (
//           <div style={{
//             backgroundColor: '#FFEBEE',
//             border: '1px solid #FFCDD2',
//             borderRadius: '4px',
//             padding: '10px 14px',
//             marginBottom: '16px',
//             fontSize: '13px',
//             color: '#C62828'
//           }}>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Name - register only */}
//           {mode === 'register' && (
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="John Doe"
//                 style={{
//                   width: '100%', padding: '10px 12px',
//                   border: '1px solid #ddd', borderRadius: '4px',
//                   fontSize: '14px', boxSizing: 'border-box', outline: 'none'
//                 }}
//                 required
//               />
//             </div>
//           )}

//           {/* Email */}
//           <div style={{ marginBottom: '16px' }}>
//             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               placeholder="you@example.com"
//               style={{
//                 width: '100%', padding: '10px 12px',
//                 border: '1px solid #ddd', borderRadius: '4px',
//                 fontSize: '14px', boxSizing: 'border-box', outline: 'none'
//               }}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div style={{ marginBottom: '16px' }}>
//             <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>
//               Password
//             </label>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               placeholder="••••••••"
//               style={{
//                 width: '100%', padding: '10px 12px',
//                 border: '1px solid #ddd', borderRadius: '4px',
//                 fontSize: '14px', boxSizing: 'border-box', outline: 'none'
//               }}
//               required
//               minLength={6}
//             />
//           </div>

//           {/* Role - register only */}
//           {mode === 'register' && (
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#555' }}>
//                 I am a...
//               </label>
//               <div style={{ display: 'flex', gap: '12px' }}>
//                 {['student', 'teacher'].map(role => (
//                   <label
//                     key={role}
//                     style={{
//                       flex: 1,
//                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
//                       padding: '10px',
//                       border: formData.role === role ? '2px solid #2196F3' : '1px solid #ddd',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       backgroundColor: formData.role === role ? '#E3F2FD' : '#fff',
//                       fontSize: '14px',
//                       fontWeight: formData.role === role ? 600 : 400,
//                       color: formData.role === role ? '#1976D2' : '#666'
//                     }}
//                   >
//                     <input
//                       type="radio"
//                       name="role"
//                       value={role}
//                       checked={formData.role === role}
//                       onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                       style={{ display: 'none' }}
//                     />
//                     {role === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: '100%', padding: '11px',
//               backgroundColor: loading ? '#90CAF9' : '#2196F3',
//               color: 'white', border: 'none', borderRadius: '4px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               fontSize: '15px', fontWeight: 600,
//               marginTop: mode === 'login' ? '8px' : '0'
//             }}
//           >
//             {loading
//               ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
//               : (mode === 'login' ? 'Sign In' : 'Create Account')
//             }
//           </button>
//         </form>

//         {/* Dev helper - quick login */}
//         <div style={{
//           marginTop: '24px', paddingTop: '20px',
//           borderTop: '1px solid #f0f0f0',
//           textAlign: 'center'
//         }}>
//           <p style={{ fontSize: '12px', color: '#bbb', marginBottom: '8px' }}>Dev quick login</p>
//           <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
//             <button
//               onClick={() => setFormData({ ...formData, email: 'teacher@test.com', password: 'password123' })}
//               style={{
//                 padding: '5px 12px', fontSize: '12px',
//                 border: '1px solid #ddd', borderRadius: '4px',
//                 cursor: 'pointer', backgroundColor: '#fff', color: '#666'
//               }}
//             >
//               Fill Teacher
//             </button>
//             <button
//               onClick={() => setFormData({ ...formData, email: 'student@test.com', password: 'password123' })}
//               style={{
//                 padding: '5px 12px', fontSize: '12px',
//                 border: '1px solid #ddd', borderRadius: '4px',
//                 cursor: 'pointer', backgroundColor: '#fff', color: '#666'
//               }}
//             >
//               Fill Student
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuthPage;


import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

function AuthPage({ onLogin }) {
  const [page, setPage] = useState('landing');

  if (page === 'landing') return <LandingPage onSelect={setPage} />;
  if (page === 'teacher') return <LoginRegisterPage role="teacher" onLogin={onLogin} onBack={() => setPage('landing')} />;
  if (page === 'student') return <LoginRegisterPage role="student" onLogin={onLogin} onBack={() => setPage('landing')} />;
}

function LandingPage({ onSelect }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '40px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px',
          backgroundColor: '#2196F3',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '32px'
        }}>💻</div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#333', margin: 0 }}>DSA Platform</h1>
        <p style={{ fontSize: '15px', color: '#999', marginTop: '8px' }}>Choose how you want to continue</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <RoleCard
          emoji="👨‍🏫"
          title="I'm a Teacher"
          description="Create tests, manage questions, view student submissions"
          color="#2196F3"
          lightColor="#E3F2FD"
          onClick={() => onSelect('teacher')}
        />
        <RoleCard
          emoji="🎓"
          title="I'm a Student"
          description="Attempt tests, submit code, track your performance"
          color="#4CAF50"
          lightColor="#E8F5E9"
          onClick={() => onSelect('student')}
        />
      </div>
    </div>
  );
}

function RoleCard({ emoji, title, description, color, lightColor, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '240px', padding: '40px 28px',
        backgroundColor: hovered ? lightColor : '#fff',
        border: `2px solid ${hovered ? color : '#e0e0e0'}`,
        borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
        boxShadow: hovered ? `0 8px 24px ${color}22` : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{emoji}</div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: hovered ? color : '#333', marginBottom: '10px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.5' }}>{description}</div>
      <div style={{
        marginTop: '20px', padding: '8px 20px',
        backgroundColor: hovered ? color : 'transparent',
        color: hovered ? '#fff' : color,
        border: `1px solid ${color}`,
        borderRadius: '20px', fontSize: '13px', fontWeight: 600,
        display: 'inline-block', transition: 'all 0.2s'
      }}>Continue →</div>
    </button>
  );
}

function LoginRegisterPage({ role, onLogin, onBack }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isTeacher = role === 'teacher';
  const roleColor = isTeacher ? '#2196F3' : '#4CAF50';
  const roleLabel = isTeacher ? '👨‍🏫 Teacher' : '🎓 Student';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/login' : '/register';
      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, role };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      const { token, user } = response.data;

      // ✅ Role guard: prevent student logging in via teacher portal and vice versa
      const returnedRole = user.role?.toLowerCase();
      if (returnedRole !== role) {
        setError(`This account is a ${returnedRole} account. Please go back and select "${returnedRole === 'teacher' ? "I'm a Teacher" : "I'm a Student"}".`);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(token, user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f5f5f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '8px',
        border: '1px solid #e0e0e0', padding: '40px',
        width: '100%', maxWidth: '420px'
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#999',
          cursor: 'pointer', fontSize: '13px', padding: 0,
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px'
        }}>← Back</button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px', height: '48px', backgroundColor: roleColor,
            borderRadius: '12px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px'
          }}>{isTeacher ? '👨‍🏫' : '🎓'}</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#333', margin: 0 }}>{roleLabel} Portal</h1>
          <p style={{ fontSize: '13px', color: '#999', marginTop: '6px' }}>
            {mode === 'login' ? `Sign in to your ${role} account` : `Create a new ${role} account`}
          </p>
        </div>

        <div style={{
          display: 'flex', backgroundColor: '#f5f5f5',
          borderRadius: '6px', padding: '4px', marginBottom: '24px'
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '8px',
              backgroundColor: mode === m ? '#fff' : 'transparent',
              border: mode === m ? '1px solid #e0e0e0' : '1px solid transparent',
              borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
              fontWeight: mode === m ? 600 : 400,
              color: mode === m ? '#333' : '#999'
            }}>{m === 'login' ? 'Sign In' : 'Register'}</button>
          ))}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2',
            borderRadius: '4px', padding: '10px 14px',
            marginBottom: '16px', fontSize: '13px', color: '#C62828'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>Full Name</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                required />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>Email</label>
            <input type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              required />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>Password</label>
            <input type="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              required minLength={6} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '11px',
            backgroundColor: loading ? '#90CAF9' : roleColor,
            color: 'white', border: 'none', borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px', fontWeight: 600
          }}>
            {loading
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#bbb', marginBottom: '8px' }}>Dev quick fill</p>
          <button
            onClick={() => setFormData({ ...formData, email: isTeacher ? 'teacher@test.com' : 'student@test.com', password: 'password123' })}
            style={{ padding: '5px 16px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff', color: '#666' }}
          >Fill {isTeacher ? 'Teacher' : 'Student'} Credentials</button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;