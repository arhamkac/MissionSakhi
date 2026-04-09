import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { AUTH_BASE } from "../apiConfig";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(user || {});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { if (user) setForm(user); }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(`${AUTH_BASE}/profile`, form,
        { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.message));
      setToast("Saved successfully ✨");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast("Save failed. Try again.");
      setTimeout(() => setToast(""), 3000);
    } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    try { await axios.post(`${AUTH_BASE}/logout`, {}, { withCredentials: true }); }
    catch { /* ignore */ }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) return (
    <div className="page flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="glass p-10 text-center max-w-sm w-full">
        <div className="text-4xl mb-4">🔒</div>
        <Link to="/login" className="btn-primary w-full justify-center">Sign in</Link>
      </div>
    </div>
  );

  return (
    <div className="page px-4 py-10 sm:py-14"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-64 h-64 top-0 left-0 opacity-25"
        style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="btn-ghost text-sm py-2 px-4">← Back</Link>
          <div>
            <h1 className="text-2xl font-light grad-text" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Profile Settings
            </h1>
            <p className="text-xs text-[var(--c-muted)]">Manage your account</p>
          </div>
        </div>

        <div className="glass p-7 sm:p-9">
          <h3 className="text-xs font-semibold text-[var(--c-muted)] uppercase tracking-widest mb-6">Basic Information</h3>

          <div className="space-y-5 mb-8">
            {[
              { id: "username", label: "Username",  type: "text"  },
              { id: "nickname", label: "Nickname",  type: "text"  },
              { id: "email",    label: "Email",     type: "email" },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label className="block text-xs font-medium text-[var(--c-muted)] mb-1.5 uppercase tracking-wide">{label}</label>
                <input id={id} type={type} value={form[id] || ""}
                  onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
                  className="field" />
              </div>
            ))}
          </div>

          {toast && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-center"
              style={{
                background: toast.includes("failed") ? "rgba(244,63,94,0.06)" : "rgba(139,92,246,0.06)",
                border: `1px solid ${toast.includes("failed") ? "rgba(244,63,94,0.15)" : "rgba(139,92,246,0.15)"}`,
                color: toast.includes("failed") ? "#f43f5e" : "#7c3aed",
              }}>
              {toast}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? <><span className="spinner" /> Saving…</> : "Save changes"}
            </button>
            <button onClick={handleLogout} className="btn-danger flex-1 py-3">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
