import { useState } from 'react';
import axios from 'axios';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Lottie from 'lottie-react';
import developerCodingAnimation from '../assets/animations/developer_coding_loop.json';

const API_URL = 'https://dsa-platform-production-64f6.up.railway.app/api/auth';

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
      minHeight: '100vh', backgroundColor: '#F7F7F7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: theme.font,
    }}>
      <style>{`
        .auth-shell {
          width: 100%;
          max-width: 1080px;
          display: grid;
          grid-template-columns: 1.1fr 420px;
          background: #ffffff;
          border: 1px solid #ececec;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 52px rgba(0,0,0,0.08);
        }
        .auth-left {
          padding: 36px;
          background: #F7F7F7;
          border-right: 1px solid #eeeeee;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .auth-right {
          background: ${theme.surface};
          padding: 36px 32px;
        }
        @media (max-width: 980px) {
          .auth-shell {
            grid-template-columns: 1fr;
            max-width: 460px;
          }
          .auth-left {
            display: none;
          }
        }
      `}</style>
      <div className="auth-shell">
        <div className="auth-left">
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#2D3436',
            marginBottom: '10px',
            letterSpacing: '-0.02em',
          }}>
            Build. Run. Improve.
          </div>
          <div style={{
            fontSize: '14px',
            color: '#636e72',
            maxWidth: '420px',
            lineHeight: 1.6,
            marginBottom: '18px',
          }}>
            Practice and test your skills with a clean coding workflow designed for students and instructors.
          </div>
          <div style={{ width: '100%', maxWidth: '460px' }}>
            <Lottie
              animationData={developerCodingAnimation}
              loop
              autoplay
              style={{ width: '100%', height: '360px' }}
            />
          </div>
        </div>
        <div className="auth-right">
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
    </div>
  );
}

export default AuthPage;
