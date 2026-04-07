import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function SignUp() {
  const [form, setForm] = useState({ email: "", username: "", nickname: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin, user, isConfigured, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) return null;
  if (user) { navigate("/dashboard"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!isConfigured) {
      setError("Google sign-in is not configured yet. Use email/password signup.");
      return;
    }
    setError(""); setLoading(true);
    try {
      await googleLogin();
      navigate("/dashboard");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally { setLoading(false); }
  };

  const fields = [
    { key: "username",  label: "Username",           type: "text",     placeholder: "how_you_appear" },
    { key: "email",     label: "Email",               type: "email",    placeholder: "you@example.com", required: true },
    { key: "nickname",  label: "Nickname (optional)", type: "text",     placeholder: "your vibe name" },
    { key: "password",  label: "Password",            type: "password", placeholder: "••••••••", required: true },
  ];

  return (
    <div className="page flex items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-80 h-80 top-0 right-0 opacity-30"
        style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />
      <div className="orb w-64 h-64 bottom-0 left-0 opacity-25"
        style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 text-[var(--c-muted)] hover:text-[var(--c-violet)] text-sm transition-colors">
            ← Back to home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-light grad-text mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Join us
          </h1>
          <p className="text-[var(--c-muted)] text-sm">Your safe space starts here 🌸</p>
        </div>

        <div className="glass p-7 sm:p-9">
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-all mb-5 font-medium text-sm"
            style={{ background: "rgba(255,255,255,0.9)", borderColor: "rgba(139,92,246,0.15)", color: "var(--c-ink)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.15)"}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider mb-5">or create with email</div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-rose-600"
              style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, required }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-[var(--c-muted)] mb-1.5 uppercase tracking-wide">{label}</label>
                <input type={type} value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="field" placeholder={placeholder} required={required} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-1">
              {loading ? <span className="spinner" /> : "Create my account"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--c-muted)] mt-5">
            Already a member?{" "}
            <Link to="/login" className="text-[var(--c-violet)] font-medium hover:text-[var(--c-pink)] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
