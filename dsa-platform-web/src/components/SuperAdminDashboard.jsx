import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://dsa-platform-production-64f6.up.railway.app/api/admin';
const ROOT_SUPERADMIN_EMAIL = 'sahuaditya2305@gmail.com';

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
  success: '#22c55e',
  successBg: '#052e16',
  successBorder: '#166534',
  error: '#f87171',
  errorBorder: '#7f1d1d',
  errorBg: '#1c0a0a',
  inputBg: '#0d1829',
  radiusSm: '7px',
  font: "'DM Sans', system-ui, sans-serif",
};

function ErrorBox({ message }) {
  return (
    <div style={{
      background: theme.errorBg, border: `1px solid ${theme.errorBorder}`,
      borderRadius: theme.radiusSm, padding: '11px 14px', marginBottom: '16px',
      fontSize: '13px', color: theme.error,
      display: 'flex', alignItems: 'flex-start', gap: '8px',
    }}>
      <span style={{ flexShrink: 0 }}>⚠</span>
      <span>{message}</span>
    </div>
  );
}

function SuccessBox({ message }) {
  return (
    <div style={{
      background: theme.successBg, border: `1px solid ${theme.successBorder}`,
      borderRadius: theme.radiusSm, padding: '11px 14px', marginBottom: '16px',
      fontSize: '13px', color: theme.success,
      display: 'flex', alignItems: 'flex-start', gap: '8px',
    }}>
      <span style={{ flexShrink: 0 }}>✓</span>
      <span>{message}</span>
    </div>
  );
}

function RoleBadge({ role }) {
  const styles = {
    superadmin: { bg: '#2e1065', color: '#a78bfa', border: '#4c1d95' },
    teacher:    { bg: '#0c2340', color: '#60a5fa', border: '#1e3a5f' },
    student:    { bg: '#052e16', color: '#4ade80', border: '#166534' },
  };
  const s = styles[role] || styles.student;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 600,
    }}>
      {role === 'superadmin' ? '👑 Superadmin' : role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
    </span>
  );
}

function RoleButton({ emoji, label, active, disabled, onClick }) {
  const activeStyles = {
    '👨‍🏫': { bg: '#0c2340', border: '#1e3a5f', color: '#60a5fa' },
    '🎓':   { bg: '#052e16', border: '#166534', color: '#4ade80' },
    '👑':   { bg: '#2e1065', border: '#4c1d95', color: '#a78bfa' },
  };
  const s = activeStyles[emoji] || {};
  return (
    <button
      onClick={onClick}
      disabled={disabled || active}
      style={{
        flex: 1, padding: '10px',
        background: active ? s.bg : 'transparent',
        border: `1.5px solid ${active ? s.border : theme.border}`,
        borderRadius: theme.radiusSm,
        color: active ? s.color : theme.textSub,
        fontSize: '13px', fontWeight: 600, fontFamily: theme.font,
        cursor: active || disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !active ? 0.6 : 1,
        transition: 'all 0.15s',
      }}
    >
      {emoji} {active ? `Already ${label}` : `Make ${label}`}
    </button>
  );
}

function SuperAdminDashboard({ user }) {
  const isRoot = user?.email?.toLowerCase() === ROOT_SUPERADMIN_EMAIL.toLowerCase();

  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setFoundUser(null); setSearchError(''); setSuccessMsg(''); setActionError('');
    setSearching(true);
    try {
      const res = await axios.get(`${API_URL}/users/search`, { params: { email } });
      setFoundUser(res.data);
    } catch (err) {
      setSearchError(err.response?.data?.detail || 'User not found.');
    } finally { setSearching(false); }
  };

  const handleRoleChange = async (newRole) => {
    setActionError(''); setSuccessMsg(''); setUpdating(true);
    try {
      await axios.patch(`${API_URL}/users/role`, { email: foundUser.email, role: newRole });
      setFoundUser({ ...foundUser, role: newRole });
      setSuccessMsg(`${foundUser.name} is now a ${newRole}.`);
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Failed to update role.');
    } finally { setUpdating(false); }
  };

  const isTargetRoot = foundUser?.email?.toLowerCase() === ROOT_SUPERADMIN_EMAIL.toLowerCase();
  const isTargetSuperadmin = foundUser?.role === 'superadmin';

  const renderActionButtons = () => {
    if (!foundUser) return null;

    // Root account — untouchable
    if (isTargetRoot) {
      return (
        <p style={{ fontSize: '13px', color: theme.textMuted, textAlign: 'center', margin: 0 }}>
          Root superadmin account cannot be modified.
        </p>
      );
    }

    // Target is superadmin but current user is not root
    if (isTargetSuperadmin && !isRoot) {
      return (
        <p style={{ fontSize: '13px', color: theme.textMuted, textAlign: 'center', margin: 0 }}>
          Only the root superadmin can change another superadmin's role.
        </p>
      );
    }

    return (
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <RoleButton emoji="👨‍🏫" label="Teacher"
          active={foundUser.role === 'teacher'} disabled={updating}
          onClick={() => handleRoleChange('teacher')} />
        <RoleButton emoji="🎓" label="Student"
          active={foundUser.role === 'student'} disabled={updating}
          onClick={() => handleRoleChange('student')} />
        {isRoot && (
          <RoleButton emoji="👑" label="Superadmin"
            active={foundUser.role === 'superadmin'} disabled={updating}
            onClick={() => handleRoleChange('superadmin')} />
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: theme.bg,
      fontFamily: theme.font, padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: isRoot
                ? 'linear-gradient(135deg, #7c3aed, #4c1d95)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px',
              boxShadow: isRoot
                ? '0 6px 16px rgba(124,58,237,0.3)'
                : '0 6px 16px rgba(59,130,246,0.3)',
            }}>{isRoot ? '👑' : '🛡️'}</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.text, letterSpacing: '-0.01em' }}>
                {isRoot ? 'Root Superadmin Panel' : 'Superadmin Panel'}
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>
                {isRoot ? 'Full control — manage all user roles' : 'Manage teacher & student roles'}
              </p>
            </div>
          </div>
        </div>

        {/* Search card */}
        <div style={{
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: '12px', padding: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <p style={{ margin: '0 0 18px', fontSize: '13px', fontWeight: 600, color: theme.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Search User
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              style={{
                flex: 1, padding: '10px 14px',
                background: theme.inputBg, border: `1.5px solid ${theme.border}`,
                borderRadius: theme.radiusSm, color: theme.text,
                fontSize: '14px', fontFamily: theme.font, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = theme.borderFocus}
              onBlur={e => e.target.style.borderColor = theme.border}
            />
            <button
              type="submit"
              disabled={searching}
              style={{
                padding: '10px 20px', background: theme.primary, color: '#fff',
                border: 'none', borderRadius: theme.radiusSm,
                fontSize: '14px', fontWeight: 600, fontFamily: theme.font,
                cursor: searching ? 'not-allowed' : 'pointer',
                opacity: searching ? 0.7 : 1, whiteSpace: 'nowrap',
              }}
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
          </form>

          {searchError && <ErrorBox message={searchError} />}

          {/* User result */}
          {foundUser && (
            <div style={{
              background: theme.bg, border: `1px solid ${theme.border}`,
              borderRadius: '10px', padding: '20px',
            }}>
              {actionError && <ErrorBox message={actionError} />}
              {successMsg && <SuccessBox message={successMsg} />}

              {/* User info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: theme.text }}>
                    {foundUser.name}
                    {isTargetRoot && (
                      <span style={{ marginLeft: '8px', fontSize: '11px', color: '#a78bfa', fontWeight: 600 }}>ROOT</span>
                    )}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: theme.textMuted }}>
                    {foundUser.email}
                  </p>
                  <RoleBadge role={foundUser.role} />
                </div>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: theme.surfaceHover, border: `1px solid ${theme.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', color: theme.textSub, fontWeight: 700,
                }}>
                  {foundUser.name?.[0]?.toUpperCase() || '?'}
                </div>
              </div>

              {renderActionButtons()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;