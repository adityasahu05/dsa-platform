import { useState, useEffect } from "react";
import { apiClient } from "../services/api";    

const ROOT_EMAIL = "sahuaditya2305@gmail.com";

const TABS = [
  { id: "users",       label: "Users",        icon: "👥" },
  { id: "tests",       label: "Tests",         icon: "📝" },
  { id: "student",     label: "Student View",  icon: "🎓" },
  { id: "submissions", label: "Submissions",   icon: "📊" },
  { id: "analytics",   label: "Analytics",     icon: "📈" },
];

const ROLE_COLORS = {
  superadmin: { bg: "#2d1b69", text: "#a78bfa", border: "#7c3aed" },
  teacher:    { bg: "#1a3a2a", text: "#34d399", border: "#059669" },
  student:    { bg: "#1e3a5f", text: "#60a5fa", border: "#2563eb" },
};

const RoleBadge = ({ role }) => {
  const c = ROLE_COLORS[role] || ROLE_COLORS.student;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>
      {role}
    </span>
  );
};

// ─── ADD TEACHER MODAL ────────────────────────────────────────────────────────
function AddTeacherModal({ onClose, onSuccess }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = async () => {
    if (!name.trim() || !email.trim()) { setError("Name and email are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await apiClient.post("/api/admin/add-teacher", { name: name.trim(), email: email.trim() });
      onSuccess(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to create teacher.");
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>Add Teacher</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b" }}>
          A new teacher account will be created and login credentials will be sent to their email.
        </p>

        {error && <div style={styles.alertError}>{error}</div>}

        <label style={styles.label}>Full Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
          style={{ ...styles.input, marginBottom: 14 }}
        />

        <label style={styles.label}>Email Address</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="e.g. rahul@college.edu"
          style={{ ...styles.input, marginBottom: 20 }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ ...styles.btnSecondary, flex: 1 }}>Cancel</button>
          <button onClick={submit} disabled={loading} style={{ ...styles.btnPrimary, flex: 2 }}>
            {loading ? "Creating…" : "Create Teacher & Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SUCCESS CARD after adding teacher ───────────────────────────────────────
function TeacherCreatedCard({ result, onDismiss }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(result.generated_password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ ...styles.card, border: "1px solid #059669", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#34d399", marginBottom: 4 }}>
            ✅ Teacher account created!
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
            {result.email_sent
              ? "Welcome email sent successfully."
              : "⚠️ Email failed to send — share credentials manually."}
          </div>
        </div>
        <button onClick={onDismiss} style={styles.closeBtn}>✕</button>
      </div>

      <div style={{ background: "#0b1120", border: "1px solid #1f2d45", borderRadius: 8, padding: "14px 16px" }}>
        <div style={styles.credRow}>
          <span style={styles.credLabel}>Name</span>
          <span style={styles.credValue}>{result.user.name}</span>
        </div>
        <div style={styles.credRow}>
          <span style={styles.credLabel}>Email</span>
          <span style={styles.credValue}>{result.user.email}</span>
        </div>
        <div style={{ ...styles.credRow, borderBottom: "none" }}>
          <span style={styles.credLabel}>Password</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...styles.credValue, fontFamily: "monospace" }}>{result.generated_password}</span>
            <button onClick={copy} style={styles.copyBtn}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── USERS TAB ────────────────────────────────────────────────────────────────
function UsersTab({ isRoot }) {
  const [email, setEmail]           = useState("");
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [deleting, setDeleting]     = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [addResult, setAddResult]   = useState(null);

  const search = async () => {
    if (!email.trim()) return;
    setLoading(true); setError(""); setSuccess(""); setUser(null);
    try {
      const res = await apiClient.get(`/api/admin/users/search?email=${encodeURIComponent(email.trim())}`);
      setUser(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "User not found.");
    } finally { setLoading(false); }
  };

  const changeRole = async (newRole) => {
    setError(""); setSuccess("");
    try {
      await apiClient.patch("/api/admin/users/role", { email: user.email, role: newRole });
      setUser(prev => ({ ...prev, role: newRole }));
      setSuccess(`Role updated to ${newRole}.`);
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to update role.");
    }
  };

  const deleteUser = async () => {
    if (!window.confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) return;
    setDeleting(true); setError(""); setSuccess("");
    try {
      await apiClient.delete(`/api/admin/users/${user.id}`);
      setSuccess("User deleted successfully.");
      setUser(null); setEmail("");
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to delete user.");
    } finally { setDeleting(false); }
  };

  const handleTeacherAdded = (result) => {
    setShowModal(false);
    setAddResult(result);
  };

  const isTargetRoot      = user?.email?.toLowerCase() === ROOT_EMAIL.toLowerCase();
  const canMakeSuperadmin = isRoot && !isTargetRoot;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={styles.sectionTitle}>User Management</h2>
          <p style={{ ...styles.sectionSubtitle, marginBottom: 0 }}>Search users or add a new teacher directly.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.btnGreen}>
          + Add Teacher
        </button>
      </div>

      <div style={{ height: 1, background: "#1f2d45", margin: "16px 0 20px" }} />

      {/* Add Teacher Result */}
      {addResult && <TeacherCreatedCard result={addResult} onDismiss={() => setAddResult(null)} />}

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder="Search by email..."
          style={styles.input}
        />
        <button onClick={search} disabled={loading} style={styles.btnPrimary}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error   && <div style={styles.alertError}>{error}</div>}
      {success && <div style={styles.alertSuccess}>{success}</div>}

      {/* User Card */}
      {user && (
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={styles.userName}>{user.name}</span>
                <RoleBadge role={user.role} />
                {isTargetRoot && (
                  <span style={{ background: "#3b0764", color: "#d8b4fe", border: "1px solid #7e22ce", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>
                    ROOT
                  </span>
                )}
              </div>
              <div style={styles.userEmail}>{user.email}</div>
              <div style={styles.userMeta}>
                Provider: {user.auth_provider} &nbsp;·&nbsp; Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
              </div>
            </div>

            {!isTargetRoot && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {user.role !== "teacher" && (
                  <button onClick={() => changeRole("teacher")} style={styles.btnGreen}>Make Teacher</button>
                )}
                {user.role !== "student" && (
                  <button onClick={() => changeRole("student")} style={styles.btnBlue}>Make Student</button>
                )}
                {canMakeSuperadmin && user.role !== "superadmin" && (
                  <button onClick={() => changeRole("superadmin")} style={styles.btnPurple}>Make Superadmin</button>
                )}
                <button onClick={deleteUser} disabled={deleting} style={styles.btnRed}>
                  {deleting ? "Deleting…" : "Delete User"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && <AddTeacherModal onClose={() => setShowModal(false)} onSuccess={handleTeacherAdded} />}
    </div>
  );
}

// ─── SUBMISSIONS TAB ──────────────────────────────────────────────────────────
function SubmissionsTab() {
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/api/admin/submissions?limit=100");
        setSubs(res.data);
      } catch (e) {
        setError(e.response?.data?.detail || "Failed to load submissions.");
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div style={styles.loading}>Loading submissions…</div>;
  if (error)   return <div style={styles.alertError}>{error}</div>;

  return (
    <div>
      <h2 style={styles.sectionTitle}>All Submissions</h2>
      <p style={styles.sectionSubtitle}>{subs.length} submission{subs.length !== 1 ? "s" : ""} across all teachers and students.</p>

      {subs.length === 0 ? (
        <div style={styles.empty}>No submissions yet.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Student", "Question", "Language", "Score", "Passed", "Submitted"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map(s => (
                <tr key={s.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{s.student_name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{s.student_email}</div>
                  </td>
                  <td style={styles.td}>{s.question_title}</td>
                  <td style={styles.td}>
                    <span style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 5, padding: "2px 8px", fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>
                      {s.language}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: 700, color: s.score >= 70 ? "#34d399" : s.score >= 40 ? "#fbbf24" : "#f87171" }}>
                      {s.score ?? "—"}%
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: s.passed === s.total ? "#34d399" : "#f87171", fontWeight: 600 }}>
                      {s.passed ?? 0}/{s.total ?? 0}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS TAB ───────────────────────────────────────────────────────────
function AnalyticsTab() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/api/admin/analytics");
        setData(res.data);
      } catch (e) {
        setError(e.response?.data?.detail || "Failed to load analytics.");
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div style={styles.loading}>Loading analytics…</div>;
  if (error)   return <div style={styles.alertError}>{error}</div>;

  const StatCard = ({ label, value, accent }) => (
    <div style={{ ...styles.card, borderLeft: `3px solid ${accent || "#3b82f6"}`, flex: "1 1 160px" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent || "#f1f5f9", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginTop: 6 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <h2 style={styles.sectionTitle}>Platform Analytics</h2>
      <p style={styles.sectionSubtitle}>Real-time stats across the entire platform.</p>

      <div style={styles.groupLabel}>👥 Users</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Users"   value={data.users.total}       accent="#3b82f6" />
        <StatCard label="Students"      value={data.users.students}    accent="#60a5fa" />
        <StatCard label="Teachers"      value={data.users.teachers}    accent="#34d399" />
        <StatCard label="Superadmins"   value={data.users.superadmins} accent="#a78bfa" />
      </div>

      <div style={styles.groupLabel}>📝 Tests</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Tests" value={data.tests.total}    accent="#f59e0b" />
        <StatCard label="Active"      value={data.tests.active}   accent="#34d399" />
        <StatCard label="Inactive"    value={data.tests.inactive} accent="#64748b" />
      </div>

      <div style={styles.groupLabel}>📊 Submissions</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Questions"   value={data.questions.total}              accent="#f472b6" />
        <StatCard label="Total Submissions" value={data.submissions.total}            accent="#fb923c" />
        <StatCard label="Average Score"     value={`${data.submissions.average_score}%`} accent="#34d399" />
      </div>

      {Object.keys(data.submissions.by_language).length > 0 && (
        <>
          <div style={styles.groupLabel}>⚙️ By Language</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(data.submissions.by_language).map(([lang, count]) => (
              <StatCard key={lang} label={lang} value={count} accent="#38bdf8" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── COMING SOON ─────────────────────────────────────────────────────────────
function ComingSoon({ tab }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{tab.icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{tab.label}</div>
      <div style={{ fontSize: 14, color: "#475569", maxWidth: 320 }}>
        This section is under construction and will be available in the next session.
      </div>
      <div style={{ marginTop: 20, background: "#1e293b", border: "1px dashed #334155", borderRadius: 10, padding: "8px 20px", fontSize: 12, color: "#64748b", letterSpacing: "0.05em" }}>
        COMING SOON
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function SuperAdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("users");
  const isRoot = user?.email?.toLowerCase() === ROOT_EMAIL.toLowerCase();

  const renderTab = () => {
    switch (activeTab) {
      case "users":       return <UsersTab isRoot={isRoot} />;
      case "submissions": return <SubmissionsTab />;
      case "analytics":   return <AnalyticsTab />;
      case "tests":       return <ComingSoon tab={TABS.find(t => t.id === "tests")} />;
      case "student":     return <ComingSoon tab={TABS.find(t => t.id === "student")} />;
      default:            return null;
    }
  };

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={{ ...styles.header, borderBottom: isRoot ? "2px solid #7c3aed" : "2px solid #2563eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: isRoot ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "linear-gradient(135deg, #2563eb, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>
            {isRoot ? "👑" : "🛡️"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.2 }}>
              {isRoot ? "Root Superadmin" : "Superadmin"}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ ...styles.tabBtn, ...(activeTab === tab.id ? styles.tabBtnActive : {}) }}
          >
            <span style={{ marginRight: 6 }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {renderTab()}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0b1120",
    fontFamily: "'DM Sans', sans-serif",
    color: "#f1f5f9",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 28px",
    background: "#111827",
    position: "sticky", top: 0, zIndex: 100,
  },
  tabBar: {
    display: "flex", gap: 4,
    padding: "0 28px",
    background: "#111827",
    borderBottom: "1px solid #1f2d45",
    overflowX: "auto",
  },
  tabBtn: {
    padding: "12px 18px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#64748b",
    fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "color 0.15s, border-color 0.15s",
  },
  tabBtnActive: {
    color: "#f1f5f9",
    borderBottom: "2px solid #3b82f6",
  },
  content: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "32px 24px",
  },
  sectionTitle: {
    fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px",
  },
  sectionSubtitle: {
    fontSize: 14, color: "#64748b", margin: "0 0 24px",
  },
  groupLabel: {
    fontSize: 12, fontWeight: 700, color: "#475569",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
  },
  card: {
    background: "#111827",
    border: "1px solid #1f2d45",
    borderRadius: 12,
    padding: "18px 20px",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    background: "#111827",
    border: "1px solid #1f2d45",
    borderRadius: 8,
    color: "#f1f5f9",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    fontSize: 12, fontWeight: 700, color: "#475569",
    letterSpacing: "0.06em", textTransform: "uppercase",
    marginBottom: 6,
  },
  btnPrimary: {
    padding: "10px 20px",
    background: "#2563eb", border: "none", borderRadius: 8,
    color: "#fff", fontSize: 14, fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnSecondary: {
    padding: "10px 20px",
    background: "transparent", border: "1px solid #1f2d45", borderRadius: 8,
    color: "#94a3b8", fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  btnGreen: {
    padding: "8px 16px",
    background: "#064e3b", border: "1px solid #059669", borderRadius: 8,
    color: "#34d399", fontSize: 13, fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnBlue: {
    padding: "8px 14px",
    background: "#1e3a5f", border: "1px solid #2563eb", borderRadius: 8,
    color: "#60a5fa", fontSize: 13, fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  btnPurple: {
    padding: "8px 14px",
    background: "#2d1b69", border: "1px solid #7c3aed", borderRadius: 8,
    color: "#a78bfa", fontSize: 13, fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  btnRed: {
    padding: "8px 14px",
    background: "#450a0a", border: "1px solid #dc2626", borderRadius: 8,
    color: "#f87171", fontSize: 13, fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 18px",
    background: "transparent", border: "1px solid #1f2d45", borderRadius: 8,
    color: "#94a3b8", fontSize: 13, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  copyBtn: {
    padding: "4px 10px",
    background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
    color: "#94a3b8", fontSize: 12, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  closeBtn: {
    background: "transparent", border: "none",
    color: "#475569", fontSize: 16, cursor: "pointer", padding: 4,
  },
  alertError: {
    background: "#450a0a", border: "1px solid #dc2626", borderRadius: 8,
    padding: "10px 14px", color: "#f87171", fontSize: 14, marginBottom: 16,
  },
  alertSuccess: {
    background: "#064e3b", border: "1px solid #059669", borderRadius: 8,
    padding: "10px 14px", color: "#34d399", fontSize: 14, marginBottom: 16,
  },
  modalOverlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    background: "#111827", border: "1px solid #1f2d45", borderRadius: 14,
    padding: "28px", width: "100%", maxWidth: 440,
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  },
  credRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 0", borderBottom: "1px solid #1a2535",
  },
  credLabel: {
    fontSize: 11, color: "#475569", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  credValue: {
    fontSize: 14, color: "#f1f5f9", fontWeight: 600,
  },
  userName:  { fontSize: 17, fontWeight: 700, color: "#f1f5f9" },
  userEmail: { fontSize: 13, color: "#64748b", marginBottom: 4 },
  userMeta:  { fontSize: 12, color: "#475569" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left", padding: "10px 14px",
    background: "#111827", color: "#475569",
    fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
    borderBottom: "1px solid #1f2d45",
  },
  tr:      { borderBottom: "1px solid #1a2535" },
  td:      { padding: "12px 14px", verticalAlign: "middle", color: "#94a3b8" },
  loading: { padding: "60px 0", textAlign: "center", color: "#475569", fontSize: 14 },
  empty:   { padding: "60px 0", textAlign: "center", color: "#475569", fontSize: 14 },
};