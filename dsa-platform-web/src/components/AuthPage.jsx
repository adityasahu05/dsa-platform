

// import { useState } from 'react';
// import axios from 'axios';
// import { initializeApp, getApps } from 'firebase/app';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// const API_URL = 'https://dsa-platform-production-64f6.up.railway.app/api/auth';

// // ── Firebase client config (public — safe to commit) ─────────────────────────
// const firebaseConfig = {
//   apiKey: "AIzaSyDeR0IoojnXn_JoFjSteB8o_1YBg7mCc3Y",
//   authDomain: "test-slashcoder-20a45.firebaseapp.com",
//   projectId: "test-slashcoder-20a45",
//   databaseURL: "https://test-slashcoder-20a45-default-rtdb.firebaseio.com",
// };

// if (!getApps().length) initializeApp(firebaseConfig);
// const auth = getAuth();
// const googleProvider = new GoogleAuthProvider();

// // ── Main router ───────────────────────────────────────────────────────────────
// function AuthPage({ onLogin }) {
//   const [page, setPage] = useState('landing');

//   if (page === 'landing') return <LandingPage onSelect={setPage} />;
//   if (page === 'teacher') return <LoginRegisterPage role="teacher" onLogin={onLogin} onBack={() => setPage('landing')} />;
//   if (page === 'student') return <LoginRegisterPage role="student" onLogin={onLogin} onBack={() => setPage('landing')} />;
// }

// // ── Landing ───────────────────────────────────────────────────────────────────
// function LandingPage({ onSelect }) {
//   return (
//     <div style={{
//       minHeight: '100vh', backgroundColor: '#f5f5f5',
//       display: 'flex', flexDirection: 'column',
//       alignItems: 'center', justifyContent: 'center', gap: '40px'
//     }}>
//       <div style={{ textAlign: 'center' }}>
//         <div style={{
//           width: '64px', height: '64px', backgroundColor: '#2196F3',
//           borderRadius: '16px', display: 'flex', alignItems: 'center',
//           justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px'
//         }}>💻</div>
//         <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#333', margin: 0 }}>DSA Platform</h1>
//         <p style={{ fontSize: '15px', color: '#999', marginTop: '8px' }}>Choose how you want to continue</p>
//       </div>
//       <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
//         <RoleCard emoji="👨‍🏫" title="I'm a Teacher"
//           description="Create tests, manage questions, view student submissions"
//           color="#2196F3" lightColor="#E3F2FD" onClick={() => onSelect('teacher')} />
//         <RoleCard emoji="🎓" title="I'm a Student"
//           description="Attempt tests, submit code, track your performance"
//           color="#4CAF50" lightColor="#E8F5E9" onClick={() => onSelect('student')} />
//       </div>
//     </div>
//   );
// }

// function RoleCard({ emoji, title, description, color, lightColor, onClick }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <button onClick={onClick}
//       onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
//       style={{
//         width: '240px', padding: '40px 28px',
//         backgroundColor: hovered ? lightColor : '#fff',
//         border: `2px solid ${hovered ? color : '#e0e0e0'}`,
//         borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
//         boxShadow: hovered ? `0 8px 24px ${color}22` : '0 2px 8px rgba(0,0,0,0.06)',
//         transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
//         transition: 'all 0.2s ease'
//       }}>
//       <div style={{ fontSize: '48px', marginBottom: '16px' }}>{emoji}</div>
//       <div style={{ fontSize: '18px', fontWeight: 700, color: hovered ? color : '#333', marginBottom: '10px' }}>{title}</div>
//       <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.5' }}>{description}</div>
//       <div style={{
//         marginTop: '20px', padding: '8px 20px',
//         backgroundColor: hovered ? color : 'transparent',
//         color: hovered ? '#fff' : color,
//         border: `1px solid ${color}`, borderRadius: '20px',
//         fontSize: '13px', fontWeight: 600, display: 'inline-block', transition: 'all 0.2s'
//       }}>Continue →</div>
//     </button>
//   );
// }

// // ── Role picker modal (shown for new Google users) ────────────────────────────
// function RolePickerModal({ googleUser, onLogin, onCancel }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const pickRole = async (role) => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await axios.post(`${API_URL}/google`, {
//         id_token: googleUser.id_token,
//         role
//       });
//       const { token, user } = res.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       onLogin(token, user);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Something went wrong.');
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
//     }}>
//       <div style={{
//         backgroundColor: '#fff', borderRadius: '12px',
//         padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center'
//       }}>
//         <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
//         <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#333' }}>Welcome, {googleUser.name}!</h2>
//         <p style={{ color: '#999', fontSize: '14px', marginBottom: '28px' }}>
//           First time here. Are you a teacher or a student?
//         </p>

//         {error && (
//           <div style={{
//             backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2',
//             borderRadius: '4px', padding: '10px', marginBottom: '16px',
//             fontSize: '13px', color: '#C62828'
//           }}>{error}</div>
//         )}

//         <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
//           <button onClick={() => pickRole('teacher')} disabled={loading} style={{
//             flex: 1, padding: '14px', backgroundColor: '#E3F2FD',
//             border: '2px solid #2196F3', borderRadius: '8px', cursor: 'pointer',
//             fontSize: '15px', fontWeight: 600, color: '#2196F3'
//           }}>👨‍🏫 Teacher</button>
//           <button onClick={() => pickRole('student')} disabled={loading} style={{
//             flex: 1, padding: '14px', backgroundColor: '#E8F5E9',
//             border: '2px solid #4CAF50', borderRadius: '8px', cursor: 'pointer',
//             fontSize: '15px', fontWeight: 600, color: '#4CAF50'
//           }}>🎓 Student</button>
//         </div>

//         <button onClick={onCancel} style={{
//           marginTop: '16px', background: 'none', border: 'none',
//           color: '#999', cursor: 'pointer', fontSize: '13px'
//         }}>Cancel</button>
//       </div>
//     </div>
//   );
// }

// // ── Login / Register page ─────────────────────────────────────────────────────
// function LoginRegisterPage({ role, onLogin, onBack }) {
//   const [mode, setMode] = useState('login');
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [googleUser, setGoogleUser] = useState(null); // triggers role picker modal

//   const isTeacher = role === 'teacher';
//   const roleColor = isTeacher ? '#2196F3' : '#4CAF50';
//   const roleLabel = isTeacher ? '👨‍🏫 Teacher' : '🎓 Student';

//   // ── Email/password submit ──
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const endpoint = mode === 'login' ? '/login' : '/register';
//       const payload = mode === 'login'
//         ? { email: formData.email, password: formData.password }
//         : { name: formData.name, email: formData.email, password: formData.password, role };

//       const response = await axios.post(`${API_URL}${endpoint}`, payload);
//       const { token, user } = response.data;

//       const returnedRole = user.role?.toLowerCase();
//       if (returnedRole !== role) {
//         setError(`This account is a ${returnedRole} account. Please go back and select "${returnedRole === 'teacher' ? "I'm a Teacher" : "I'm a Student"}".`);
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       onLogin(token, user);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Google sign-in ──
//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const id_token = await result.user.getIdToken();

//       const res = await axios.post(`${API_URL}/google`, { id_token });

//       // Existing user → done
//       if (res.data.token) {
//         const { token, user } = res.data;

//         // Role guard for existing Google users
//         if (user.role !== role) {
//           setError(`This Google account is registered as a ${user.role}. Please go back and select the correct portal.`);
//           setGoogleLoading(false);
//           return;
//         }

//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//         onLogin(token, user);
//         return;
//       }

//       // New user → show role picker
//       if (res.data.needs_role) {
//         setGoogleUser({
//           id_token,
//           name: res.data.name,
//           email: res.data.email,
//         });
//       }
//     } catch (err) {
//       if (err.code === 'auth/popup-closed-by-user') {
//         // user closed popup, do nothing
//       } else {
//         setError(err.response?.data?.detail || 'Google sign-in failed. Please try again.');
//       }
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   return (
//     <>
//       {googleUser && (
//         <RolePickerModal
//           googleUser={googleUser}
//           onLogin={onLogin}
//           onCancel={() => setGoogleUser(null)}
//         />
//       )}

//       <div style={{
//         minHeight: '100vh', backgroundColor: '#f5f5f5',
//         display: 'flex', alignItems: 'center', justifyContent: 'center'
//       }}>
//         <div style={{
//           backgroundColor: '#fff', borderRadius: '8px',
//           border: '1px solid #e0e0e0', padding: '40px',
//           width: '100%', maxWidth: '420px'
//         }}>
//           <button onClick={onBack} style={{
//             background: 'none', border: 'none', color: '#999',
//             cursor: 'pointer', fontSize: '13px', padding: 0,
//             marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px'
//           }}>← Back</button>

//           <div style={{ textAlign: 'center', marginBottom: '28px' }}>
//             <div style={{
//               width: '48px', height: '48px', backgroundColor: roleColor,
//               borderRadius: '12px', display: 'flex', alignItems: 'center',
//               justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px'
//             }}>{isTeacher ? '👨‍🏫' : '🎓'}</div>
//             <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#333', margin: 0 }}>{roleLabel} Portal</h1>
//             <p style={{ fontSize: '13px', color: '#999', marginTop: '6px' }}>
//               {mode === 'login' ? `Sign in to your ${role} account` : `Create a new ${role} account`}
//             </p>
//           </div>

//           {/* Google button */}
//           <button onClick={handleGoogleLogin} disabled={googleLoading} style={{
//             width: '100%', padding: '11px',
//             backgroundColor: '#fff', border: '1px solid #ddd',
//             borderRadius: '4px', cursor: googleLoading ? 'not-allowed' : 'pointer',
//             fontSize: '14px', fontWeight: 500, color: '#444',
//             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
//             marginBottom: '16px', transition: 'background 0.15s',
//             opacity: googleLoading ? 0.7 : 1
//           }}>
//             <svg width="18" height="18" viewBox="0 0 18 18">
//               <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
//               <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
//               <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
//               <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
//             </svg>
//             {googleLoading ? 'Signing in...' : 'Continue with Google'}
//           </button>

//           <div style={{
//             display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px'
//           }}>
//             <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
//             <span style={{ fontSize: '12px', color: '#bbb' }}>or</span>
//             <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
//           </div>

//           {/* Tab toggle */}
//           <div style={{
//             display: 'flex', backgroundColor: '#f5f5f5',
//             borderRadius: '6px', padding: '4px', marginBottom: '24px'
//           }}>
//             {['login', 'register'].map(m => (
//               <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
//                 flex: 1, padding: '8px',
//                 backgroundColor: mode === m ? '#fff' : 'transparent',
//                 border: mode === m ? '1px solid #e0e0e0' : '1px solid transparent',
//                 borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
//                 fontWeight: mode === m ? 600 : 400,
//                 color: mode === m ? '#333' : '#999'
//               }}>{m === 'login' ? 'Sign In' : 'Register'}</button>
//             ))}
//           </div>

//           {error && (
//             <div style={{
//               backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2',
//               borderRadius: '4px', padding: '10px 14px',
//               marginBottom: '16px', fontSize: '13px', color: '#C62828'
//             }}>{error}</div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {mode === 'register' && (
//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>Full Name</label>
//                 <input type="text" value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   placeholder="John Doe"
//                   style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
//                   required />
//               </div>
//             )}

//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>Email</label>
//               <input type="email" value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="you@example.com"
//                 style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
//                 required />
//             </div>

//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#555' }}>Password</label>
//               <input type="password" value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 placeholder="••••••••"
//                 style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
//                 required minLength={6} />
//             </div>

//             <button type="submit" disabled={loading} style={{
//               width: '100%', padding: '11px',
//               backgroundColor: loading ? '#90CAF9' : roleColor,
//               color: 'white', border: 'none', borderRadius: '4px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               fontSize: '15px', fontWeight: 600
//             }}>
//               {loading
//                 ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
//                 : (mode === 'login' ? 'Sign In' : 'Create Account')}
//             </button>
//           </form>

//           <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
//             <p style={{ fontSize: '12px', color: '#bbb', marginBottom: '8px' }}>Dev quick fill</p>
//             <button
//               onClick={() => setFormData({ ...formData, email: isTeacher ? 'teacher@test.com' : 'student@test.com', password: 'password123' })}
//               style={{ padding: '5px 16px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff', color: '#666' }}
//             >Fill {isTeacher ? 'Teacher' : 'Student'} Credentials</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AuthPage;









  // import { useState } from 'react';
  // import axios from 'axios';
  // import { initializeApp, getApps } from 'firebase/app';
  // import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

  // const API_URL = 'https://dsa-platform-production-64f6.up.railway.app/api/auth';

  // const firebaseConfig = {
  //   apiKey: "AIzaSyDeR0IoojnXn_JoFjSteB8o_1YBg7mCc3Y",
  //   authDomain: "test-slashcoder-20a45.firebaseapp.com",
  //   projectId: "test-slashcoder-20a45",
  //   databaseURL: "https://test-slashcoder-20a45-default-rtdb.firebaseio.com",
  // };

  // if (!getApps().length) initializeApp(firebaseConfig);
  // const auth = getAuth();
  // const googleProvider = new GoogleAuthProvider();

  // // ── Design tokens ─────────────────────────────────────────────────────────────
  // const theme = {
  //   bg: '#0b1120',
  //   surface: '#111827',
  //   surfaceHover: '#1a2235',
  //   border: '#1f2d45',
  //   borderFocus: '#3b82f6',
  //   text: '#f1f5f9',
  //   textMuted: '#64748b',
  //   textSub: '#94a3b8',
  //   primary: '#3b82f6',
  //   primaryHover: '#2563eb',
  //   primaryDisabled: '#1e3a5f',
  //   error: '#f87171',
  //   errorBorder: '#7f1d1d',
  //   errorBg: '#1c0a0a',
  //   inputBg: '#0d1829',
  //   radius: '10px',
  //   radiusSm: '7px',
  //   font: "'DM Sans', system-ui, sans-serif",
  // };

  // const injectFontAndStyles = () => {
  //   if (document.getElementById('auth-global-styles')) return;
  //   const style = document.createElement('style');
  //   style.id = 'auth-global-styles';
  //   style.textContent = `
  //     @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  //     * { box-sizing: border-box; }
  //     .auth-input {
  //       width: 100%; padding: 11px 14px;
  //       background: ${theme.inputBg};
  //       border: 1.5px solid ${theme.border};
  //       border-radius: ${theme.radiusSm};
  //       color: ${theme.text}; font-size: 14px; font-family: ${theme.font};
  //       outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  //     }
  //     .auth-input::placeholder { color: ${theme.textMuted}; }
  //     .auth-input:focus {
  //       border-color: ${theme.borderFocus};
  //       box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
  //     }
  //     .auth-btn-primary {
  //       width: 100%; padding: 12px;
  //       background: ${theme.primary}; color: #fff;
  //       border: none; border-radius: ${theme.radiusSm};
  //       font-size: 14px; font-weight: 600; font-family: ${theme.font};
  //       cursor: pointer; transition: background 0.15s, opacity 0.15s, transform 0.1s;
  //       letter-spacing: 0.01em;
  //     }
  //     .auth-btn-primary:hover:not(:disabled) { background: ${theme.primaryHover}; transform: translateY(-1px); }
  //     .auth-btn-primary:disabled { background: ${theme.primaryDisabled}; color: #4a6a9a; cursor: not-allowed; }
  //     .auth-btn-google {
  //       width: 100%; padding: 11px 14px;
  //       background: transparent; border: 1.5px solid ${theme.border};
  //       border-radius: ${theme.radiusSm}; color: ${theme.text};
  //       font-size: 14px; font-weight: 500; font-family: ${theme.font};
  //       cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
  //       transition: background 0.15s, border-color 0.15s;
  //     }
  //     .auth-btn-google:hover:not(:disabled) { background: ${theme.surfaceHover}; border-color: #2d3f5a; }
  //     .auth-btn-google:disabled { opacity: 0.5; cursor: not-allowed; }
  //     .role-card {
  //       width: 220px; padding: 32px 24px;
  //       background: ${theme.surface}; border: 1.5px solid ${theme.border};
  //       border-radius: 12px; cursor: pointer; text-align: center;
  //       transition: all 0.2s ease; font-family: ${theme.font};
  //     }
  //     .role-card:hover {
  //       border-color: ${theme.borderFocus}; background: ${theme.surfaceHover};
  //       transform: translateY(-3px); box-shadow: 0 12px 32px rgba(59,130,246,0.12);
  //     }
  //     .tab-btn {
  //       flex: 1; padding: 9px; background: transparent;
  //       border: 1.5px solid transparent; border-radius: ${theme.radiusSm};
  //       cursor: pointer; font-size: 13.5px; font-family: ${theme.font}; transition: all 0.15s;
  //     }
  //     .tab-btn.active { background: ${theme.surface}; border-color: ${theme.border}; color: ${theme.text}; font-weight: 600; }
  //     .tab-btn:not(.active) { color: ${theme.textMuted}; font-weight: 400; }
  //     .tab-btn:not(.active):hover { color: ${theme.textSub}; }
  //     .back-btn {
  //       background: none; border: none; color: ${theme.textMuted}; cursor: pointer;
  //       font-size: 13px; font-family: ${theme.font}; padding: 0;
  //       display: flex; align-items: center; gap: 5px; margin-bottom: 24px; transition: color 0.15s;
  //     }
  //     .back-btn:hover { color: ${theme.textSub}; }
  //     .auth-label { display: block; font-size: 13px; font-weight: 500; color: ${theme.textSub}; margin-bottom: 7px; }
  //     .divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
  //     .divider-line { flex: 1; height: 1px; background: ${theme.border}; }
  //     .divider-text { font-size: 11px; font-weight: 600; color: ${theme.textMuted}; letter-spacing: 0.06em; text-transform: uppercase; }
  //   `;
  //   document.head.appendChild(style);
  // };

  // // ── Main router ───────────────────────────────────────────────────────────────
  // function AuthPage({ onLogin }) {
  //   injectFontAndStyles();
  //   const [page, setPage] = useState('landing');
  //   if (page === 'landing') return <LandingPage onSelect={setPage} />;
  //   if (page === 'teacher') return <LoginRegisterPage role="teacher" onLogin={onLogin} onBack={() => setPage('landing')} />;
  //   if (page === 'student') return <LoginRegisterPage role="student" onLogin={onLogin} onBack={() => setPage('landing')} />;
  // }

  // // ── Landing ───────────────────────────────────────────────────────────────────
  // function LandingPage({ onSelect }) {
  //   return (
  //     <div style={{
  //       minHeight: '100vh', backgroundColor: theme.bg,
  //       display: 'flex', flexDirection: 'column',
  //       alignItems: 'center', justifyContent: 'center',
  //       gap: '48px', padding: '24px', fontFamily: theme.font,
  //     }}>
  //       <div style={{ textAlign: 'center' }}>
  //         <div style={{
  //           width: '52px', height: '52px',
  //           background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  //           borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  //           margin: '0 auto 16px', fontSize: '26px',
  //           boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
  //         }}>💻</div>
  //         <h1 style={{ fontSize: '26px', fontWeight: 700, color: theme.text, margin: 0, letterSpacing: '-0.02em' }}>
  //           SlashCoder
  //         </h1>
  //         <p style={{ fontSize: '14px', color: theme.textMuted, marginTop: '8px' }}>
  //           Choose your portal to continue
  //         </p>
  //       </div>
  //       <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
  //         <RoleCard emoji="👨‍🏫" title="Teacher"
  //           description="Create tests, manage questions, view student submissions"
  //           accent="#3b82f6" onClick={() => onSelect('teacher')} />
  //         <RoleCard emoji="🎓" title="Student"
  //           description="Attempt tests, submit code, track your performance"
  //           accent="#22c55e" onClick={() => onSelect('student')} />
  //       </div>
  //     </div>
  //   );
  // }

  // function RoleCard({ emoji, title, description, accent, onClick }) {
  //   return (
  //     <button className="role-card" onClick={onClick}>
  //       <div style={{
  //         width: '48px', height: '48px', background: `${accent}18`,
  //         border: `1.5px solid ${accent}40`, borderRadius: '12px',
  //         display: 'flex', alignItems: 'center', justifyContent: 'center',
  //         margin: '0 auto 16px', fontSize: '22px',
  //       }}>{emoji}</div>
  //       <div style={{ fontSize: '16px', fontWeight: 700, color: theme.text, marginBottom: '8px' }}>{title}</div>
  //       <div style={{ fontSize: '13px', color: theme.textMuted, lineHeight: '1.6', marginBottom: '20px' }}>{description}</div>
  //       <div style={{
  //         display: 'inline-flex', alignItems: 'center', gap: '5px',
  //         padding: '7px 16px', background: `${accent}18`,
  //         border: `1px solid ${accent}40`, borderRadius: '20px',
  //         fontSize: '13px', fontWeight: 600, color: accent,
  //       }}>Continue →</div>
  //     </button>
  //   );
  // }

  // // ── Role picker modal ─────────────────────────────────────────────────────────
  // function RolePickerModal({ googleUser, onLogin, onCancel }) {
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState('');

  //   const pickRole = async (role) => {
  //     setLoading(true); setError('');
  //     try {
  //       const res = await axios.post(`${API_URL}/google`, { id_token: googleUser.id_token, role });
  //       const { token, user } = res.data;
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('user', JSON.stringify(user));
  //       onLogin(token, user);
  //     } catch (err) {
  //       setError(err.response?.data?.detail || 'Something went wrong.');
  //       setLoading(false);
  //     }
  //   };

  //   return (
  //     <div style={{
  //       position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
  //       backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
  //       justifyContent: 'center', zIndex: 1000, padding: '24px', fontFamily: theme.font,
  //     }}>
  //       <div style={{
  //         background: theme.surface, border: `1px solid ${theme.border}`,
  //         borderRadius: '14px', padding: '40px 36px',
  //         maxWidth: '400px', width: '100%', textAlign: 'center',
  //         boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  //       }}>
  //         <div style={{ fontSize: '36px', marginBottom: '14px' }}>👋</div>
  //         <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: theme.text }}>
  //           Welcome, {googleUser.name}!
  //         </h2>
  //         <p style={{ color: theme.textMuted, fontSize: '13.5px', marginBottom: '28px', lineHeight: '1.5' }}>
  //           First time here. Select your role to get started.
  //         </p>
  //         {error && <ErrorBox message={error} />}
  //         <div style={{ display: 'flex', gap: '12px' }}>
  //           {[
  //             { role: 'teacher', emoji: '👨‍🏫', label: 'Teacher', accent: '#3b82f6' },
  //             { role: 'student', emoji: '🎓', label: 'Student', accent: '#22c55e' },
  //           ].map(({ role, emoji, label, accent }) => (
  //             <button key={role} onClick={() => pickRole(role)} disabled={loading} style={{
  //               flex: 1, padding: '14px 10px', background: `${accent}10`,
  //               border: `1.5px solid ${accent}40`, borderRadius: theme.radiusSm,
  //               cursor: loading ? 'not-allowed' : 'pointer', color: accent,
  //               fontSize: '14px', fontWeight: 600, fontFamily: theme.font,
  //               transition: 'all 0.15s', opacity: loading ? 0.6 : 1,
  //             }}>
  //               <div style={{ fontSize: '22px', marginBottom: '6px' }}>{emoji}</div>
  //               {label}
  //             </button>
  //           ))}
  //         </div>
  //         <button onClick={onCancel} style={{
  //           marginTop: '18px', background: 'none', border: 'none',
  //           color: theme.textMuted, cursor: 'pointer', fontSize: '13px', fontFamily: theme.font,
  //         }}>Cancel</button>
  //       </div>
  //     </div>
  //   );
  // }

  // // ── Shared sub-components ─────────────────────────────────────────────────────
  // function ErrorBox({ message }) {
  //   return (
  //     <div style={{
  //       background: theme.errorBg, border: `1px solid ${theme.errorBorder}`,
  //       borderRadius: theme.radiusSm, padding: '11px 14px', marginBottom: '18px',
  //       fontSize: '13px', color: theme.error,
  //       display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left',
  //     }}>
  //       <span style={{ marginTop: '1px', flexShrink: 0 }}>⚠</span>
  //       <span>{message}</span>
  //     </div>
  //   );
  // }

  // function FormField({ label, children }) {
  //   return (
  //     <div style={{ marginBottom: '16px' }}>
  //       <label className="auth-label">{label}</label>
  //       {children}
  //     </div>
  //   );
  // }

  // function GoogleIcon() {
  //   return (
  //     <svg width="17" height="17" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
  //       <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
  //       <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
  //       <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
  //       <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
  //     </svg>
  //   );
  // }

  // // ── Login / Register page ─────────────────────────────────────────────────────
  // function LoginRegisterPage({ role, onLogin, onBack }) {
  //   const [mode, setMode] = useState('login');
  //   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  //   const [rememberMe, setRememberMe] = useState(false);
  //   const [error, setError] = useState('');
  //   const [loading, setLoading] = useState(false);
  //   const [googleLoading, setGoogleLoading] = useState(false);
  //   const [googleUser, setGoogleUser] = useState(null);

  //   const isTeacher = role === 'teacher';
  //   const accent = isTeacher ? '#3b82f6' : '#22c55e';
  //   const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  //   const handleSubmit = async (e) => {
  //     e.preventDefault(); setError(''); setLoading(true);
  //     try {
  //       const endpoint = mode === 'login' ? '/login' : '/register';
  //       const payload = mode === 'login'
  //         ? { email: formData.email, password: formData.password }
  //         : { name: formData.name, email: formData.email, password: formData.password, role };
  //       const response = await axios.post(`${API_URL}${endpoint}`, payload);
  //       const { token, user } = response.data;
  //       const returnedRole = user.role?.toLowerCase();
  //       if (returnedRole !== role) {
  //         setError(`This account is registered as a ${returnedRole}. Please go back and select the correct portal.`);
  //         setLoading(false); return;
  //       }
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('user', JSON.stringify(user));
  //       onLogin(token, user);
  //     } catch (err) {
  //       setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
  //     } finally { setLoading(false); }
  //   };

  //   const handleGoogleLogin = async () => {
  //     setError(''); setGoogleLoading(true);
  //     try {
  //       const result = await signInWithPopup(auth, googleProvider);
  //       const id_token = await result.user.getIdToken();
  //       const res = await axios.post(`${API_URL}/google`, { id_token });
  //       if (res.data.token) {
  //         const { token, user } = res.data;
  //         if (user.role !== role) {
  //           setError(`This Google account is registered as a ${user.role}. Please go back and select the correct portal.`);
  //           setGoogleLoading(false); return;
  //         }
  //         localStorage.setItem('token', token);
  //         localStorage.setItem('user', JSON.stringify(user));
  //         onLogin(token, user); return;
  //       }
  //       if (res.data.needs_role) {
  //         setGoogleUser({ id_token, name: res.data.name, email: res.data.email });
  //       }
  //     } catch (err) {
  //       if (err.code !== 'auth/popup-closed-by-user') {
  //         setError(err.response?.data?.detail || 'Google sign-in failed. Please try again.');
  //       }
  //     } finally { setGoogleLoading(false); }
  //   };

  //   return (
  //     <>
  //       {googleUser && (
  //         <RolePickerModal googleUser={googleUser} onLogin={onLogin} onCancel={() => setGoogleUser(null)} />
  //       )}
  //       <div style={{
  //         minHeight: '100vh', backgroundColor: theme.bg,
  //         display: 'flex', alignItems: 'center', justifyContent: 'center',
  //         padding: '24px', fontFamily: theme.font,
  //       }}>
  //         <div style={{
  //           background: theme.surface, border: `1px solid ${theme.border}`,
  //           borderRadius: '14px', padding: '36px 32px',
  //           width: '100%', maxWidth: '420px',
  //           boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  //         }}>
  //           <button className="back-btn" onClick={onBack}>← Back</button>

  //           <div style={{ textAlign: 'center', marginBottom: '28px' }}>
  //             <div style={{
  //               width: '46px', height: '46px', background: `${accent}18`,
  //               border: `1.5px solid ${accent}35`, borderRadius: '12px',
  //               display: 'flex', alignItems: 'center', justifyContent: 'center',
  //               margin: '0 auto 14px', fontSize: '22px',
  //             }}>{isTeacher ? '👨‍🏫' : '🎓'}</div>
  //             <h1 style={{ fontSize: '20px', fontWeight: 700, color: theme.text, margin: 0, letterSpacing: '-0.01em' }}>
  //               {isTeacher ? 'Teacher' : 'Student'} Portal
  //             </h1>
  //             <p style={{ fontSize: '13px', color: theme.textMuted, marginTop: '6px' }}>
  //               {mode === 'login' ? `Sign in to your ${role} account` : `Create a new ${role} account`}
  //             </p>
  //           </div>

  //           <button className="auth-btn-google" onClick={handleGoogleLogin} disabled={googleLoading}>
  //             <GoogleIcon />
  //             {googleLoading ? 'Signing in…' : 'Continue with Google'}
  //           </button>

  //           <div className="divider">
  //             <div className="divider-line" />
  //             <span className="divider-text">or</span>
  //             <div className="divider-line" />
  //           </div>

  //           <div style={{
  //             display: 'flex', background: theme.bg, border: `1px solid ${theme.border}`,
  //             borderRadius: theme.radiusSm, padding: '4px', marginBottom: '22px', gap: '4px',
  //           }}>
  //             {['login', 'register'].map(m => (
  //               <button key={m} className={`tab-btn${mode === m ? ' active' : ''}`}
  //                 onClick={() => { setMode(m); setError(''); }}>
  //                 {m === 'login' ? 'Sign In' : 'Register'}
  //               </button>
  //             ))}
  //           </div>

  //           {error && <ErrorBox message={error} />}

  //           <form onSubmit={handleSubmit}>
  //             {mode === 'register' && (
  //               <FormField label="Full Name">
  //                 <input className="auth-input" type="text" value={formData.name}
  //                   onChange={update('name')} placeholder="John Doe" required />
  //               </FormField>
  //             )}
  //             <FormField label="Email">
  //               <input className="auth-input" type="email" value={formData.email}
  //                 onChange={update('email')} placeholder="you@example.com" required />
  //             </FormField>
  //             <FormField label="Password">
  //               <input className="auth-input" type="password" value={formData.password}
  //                 onChange={update('password')} placeholder="••••••••" required minLength={6} />
  //             </FormField>

  //             {mode === 'login' && (
  //               <div style={{
  //                 display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px',
  //               }}>
  //                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
  //                   <input type="checkbox" checked={rememberMe}
  //                     onChange={(e) => setRememberMe(e.target.checked)}
  //                     style={{ accentColor: accent, width: '14px', height: '14px' }} />
  //                   <span style={{ fontSize: '13px', color: theme.textSub }}>Remember me</span>
  //                 </label>
  //                 <button type="button" style={{
  //                   background: 'none', border: 'none', color: accent, cursor: 'pointer',
  //                   fontSize: '13px', fontFamily: theme.font, fontWeight: 500, padding: 0,
  //                 }}>Forgot password?</button>
  //               </div>
  //             )}

  //             <button type="submit" className="auth-btn-primary" disabled={loading}
  //               style={{ background: loading ? undefined : accent }}>
  //               {loading
  //                 ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
  //                 : (mode === 'login' ? 'Sign In' : 'Create Account')}
  //             </button>
  //           </form>

  //           <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: theme.textMuted }}>
  //             {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
  //             <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
  //               style={{
  //                 background: 'none', border: 'none', color: accent, cursor: 'pointer',
  //                 fontSize: '13px', fontFamily: theme.font, fontWeight: 600, padding: 0,
  //               }}>
  //               {mode === 'login' ? 'Sign up' : 'Sign in'}
  //             </button>
  //           </p>

  //           <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: `1px solid ${theme.border}`, textAlign: 'center' }}>
  //             <p style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Dev</p>
  //             <button
  //               onClick={() => setFormData({ ...formData, email: isTeacher ? 'teacher@test.com' : 'student@test.com', password: 'password123' })}
  //               style={{
  //                 padding: '5px 14px', fontSize: '12px', border: `1px solid ${theme.border}`,
  //                 borderRadius: '6px', cursor: 'pointer', background: 'transparent',
  //                 color: theme.textMuted, fontFamily: theme.font,
  //               }}>Fill {isTeacher ? 'Teacher' : 'Student'} Credentials</button>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  // export default AuthPage;


import { useState } from 'react';
import axios from 'axios';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { API_BASE } from '../config';

const API_URL = API_BASE ? `${API_BASE}/api/auth` : undefined;

const firebaseConfig = {
  apiKey: "AIzaSyDeR0IoojnXn_JoFjSteB8o_1YBg7mCc3Y",
  authDomain: "test-slashcoder-20a45.firebaseapp.com",
  projectId: "test-slashcoder-20a45",
  databaseURL: "https://test-slashcoder-20a45-default-rtdb.firebaseio.com",
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

// ── Design tokens ─────────────────────────────────────────────────────────────
const theme = {
  bg: '#0b1120',
  surface: '#111827',
  surfaceHover: '#1a2235',
  border: '#1f2d45',
  borderFocus: '#3b82f6',
  text: '#f1f5f9',
  textMuted: '#64748b',
  textSub: '#94a3b8',
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryDisabled: '#1e3a5f',
  error: '#f87171',
  errorBorder: '#7f1d1d',
  errorBg: '#1c0a0a',
  inputBg: '#0d1829',
  radius: '10px',
  radiusSm: '7px',
  font: "'DM Sans', system-ui, sans-serif",
};

const injectFontAndStyles = () => {
  if (document.getElementById('auth-global-styles')) return;
  const style = document.createElement('style');
  style.id = 'auth-global-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    .auth-input {
      width: 100%; padding: 11px 14px;
      background: ${theme.inputBg};
      border: 1.5px solid ${theme.border};
      border-radius: ${theme.radiusSm};
      color: ${theme.text}; font-size: 14px; font-family: ${theme.font};
      outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    }
    .auth-input::placeholder { color: ${theme.textMuted}; }
    .auth-input:focus {
      border-color: ${theme.borderFocus};
      box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
    }
    .auth-btn-primary {
      width: 100%; padding: 12px;
      background: ${theme.primary}; color: #fff;
      border: none; border-radius: ${theme.radiusSm};
      font-size: 14px; font-weight: 600; font-family: ${theme.font};
      cursor: pointer; transition: background 0.15s, opacity 0.15s, transform 0.1s;
      letter-spacing: 0.01em;
    }
    .auth-btn-primary:hover:not(:disabled) { background: ${theme.primaryHover}; transform: translateY(-1px); }
    .auth-btn-primary:disabled { background: ${theme.primaryDisabled}; color: #4a6a9a; cursor: not-allowed; }
    .auth-btn-google {
      width: 100%; padding: 11px 14px;
      background: transparent; border: 1.5px solid ${theme.border};
      border-radius: ${theme.radiusSm}; color: ${theme.text};
      font-size: 14px; font-weight: 500; font-family: ${theme.font};
      cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: background 0.15s, border-color 0.15s;
    }
    .auth-btn-google:hover:not(:disabled) { background: ${theme.surfaceHover}; border-color: #2d3f5a; }
    .auth-btn-google:disabled { opacity: 0.5; cursor: not-allowed; }
    .tab-btn {
      flex: 1; padding: 9px; background: transparent;
      border: 1.5px solid transparent; border-radius: ${theme.radiusSm};
      cursor: pointer; font-size: 13.5px; font-family: ${theme.font}; transition: all 0.15s;
    }
    .tab-btn.active { background: ${theme.surface}; border-color: ${theme.border}; color: ${theme.text}; font-weight: 600; }
    .tab-btn:not(.active) { color: ${theme.textMuted}; font-weight: 400; }
    .tab-btn:not(.active):hover { color: ${theme.textSub}; }
    .auth-label { display: block; font-size: 13px; font-weight: 500; color: ${theme.textSub}; margin-bottom: 7px; }
    .divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
    .divider-line { flex: 1; height: 1px; background: ${theme.border}; }
    .divider-text { font-size: 11px; font-weight: 600; color: ${theme.textMuted}; letter-spacing: 0.06em; text-transform: uppercase; }
  `;
  document.head.appendChild(style);
};

// ── Sub-components ────────────────────────────────────────────────────────────
function ErrorBox({ message }) {
  return (
    <div style={{
      background: theme.errorBg, border: `1px solid ${theme.errorBorder}`,
      borderRadius: theme.radiusSm, padding: '11px 14px', marginBottom: '18px',
      fontSize: '13px', color: theme.error,
      display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left',
    }}>
      <span style={{ marginTop: '1px', flexShrink: 0 }}>⚠</span>
      <span>{message}</span>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label className="auth-label">{label}</label>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}

// ── Main AuthPage ─────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  injectFontAndStyles();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/login' : '/register';
      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(token, user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setError(''); setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const id_token = await result.user.getIdToken();
      const res = await axios.post(`${API_URL}/google`, { id_token });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(token, user);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.response?.data?.detail || 'Google sign-in failed. Please try again.');
      }
    } finally { setGoogleLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: theme.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: theme.font,
    }}>
      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: '14px', padding: '36px 32px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '46px', height: '46px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '12px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 14px', fontSize: '22px',
            boxShadow: '0 8px 20px rgba(59,130,246,0.25)',
          }}>💻</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: theme.text, margin: 0, letterSpacing: '-0.01em' }}>
            SlashCoder
          </h1>
          <p style={{ fontSize: '13px', color: theme.textMuted, marginTop: '6px' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Google */}
        <button className="auth-btn-google" onClick={handleGoogleLogin} disabled={googleLoading}>
          <GoogleIcon />
          {googleLoading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">or</span>
          <div className="divider-line" />
        </div>

        {/* Tab toggle */}
        <div style={{
          display: 'flex', background: theme.bg, border: `1px solid ${theme.border}`,
          borderRadius: theme.radiusSm, padding: '4px', marginBottom: '22px', gap: '4px',
        }}>
          {['login', 'register'].map(m => (
            <button key={m} className={`tab-btn${mode === m ? ' active' : ''}`}
              onClick={() => { setMode(m); setError(''); }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {error && <ErrorBox message={error} />}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <FormField label="Full Name">
              <input className="auth-input" type="text" value={formData.name}
                onChange={update('name')} placeholder="John Doe" required />
            </FormField>
          )}
          <FormField label="Email">
            <input className="auth-input" type="email" value={formData.email}
              onChange={update('email')} placeholder="you@example.com" required />
          </FormField>
          <FormField label="Password">
            <input className="auth-input" type="password" value={formData.password}
              onChange={update('password')} placeholder="••••••••" required minLength={6} />
          </FormField>

          {mode === 'login' && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: theme.primary, width: '14px', height: '14px' }} />
                <span style={{ fontSize: '13px', color: theme.textSub }}>Remember me</span>
              </label>
              <button type="button" style={{
                background: 'none', border: 'none', color: theme.primary, cursor: 'pointer',
                fontSize: '13px', fontFamily: theme.font, fontWeight: 500, padding: 0,
              }}>Forgot password?</button>
            </div>
          )}

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading
              ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: theme.textMuted }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{
              background: 'none', border: 'none', color: theme.primary, cursor: 'pointer',
              fontSize: '13px', fontFamily: theme.font, fontWeight: 600, padding: 0,
            }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Dev quick-fill */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: `1px solid ${theme.border}`, textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Dev</p>
          <button
            onClick={() => setFormData({ ...formData, email: 'student@test.com', password: 'password123' })}
            style={{
              padding: '5px 14px', fontSize: '12px', border: `1px solid ${theme.border}`,
              borderRadius: '6px', cursor: 'pointer', background: 'transparent',
              color: theme.textMuted, fontFamily: theme.font,
            }}>Fill Test Credentials</button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
