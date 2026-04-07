import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const QUICK_LINKS = [
  { to: "/forum",          icon: "📝", label: "Forum",     desc: "Share anonymously" },
  { to: "/community-chat", icon: "💬", label: "Community", desc: "Join chat rooms"   },
  { to: "/chatbot",        icon: "🤖", label: "AI Friend", desc: "Talk anytime"      },
  { to: "/mental-health",  icon: "💜", label: "Support",   desc: "Resources & help"  },
];

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return (
    <div className="page flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="glass p-10 text-center max-w-sm w-full">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-[var(--c-ink)] mb-2">Sign in required</h2>
        <p className="text-sm text-[var(--c-muted)] mb-6">Please sign in to view your dashboard.</p>
        <Link to="/login" className="btn-primary w-full justify-center">Sign in</Link>
      </div>
    </div>
  );

  const { username, nickname, email } = user;

  return (
    <div className="page px-4 py-10 sm:py-14"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-72 h-72 top-0 right-0 opacity-25"
        style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Profile hero */}
        <div className="glass p-8 sm:p-10 text-center mb-6 relative overflow-hidden">
          <div className="orb w-40 h-40 -top-10 -right-10 opacity-40"
            style={{ background: "radial-gradient(circle,#c084fc,transparent 70%)" }} />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 8px 24px rgba(139,92,246,0.35)" }}>
              {username?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl sm:text-4xl font-light grad-text mb-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Hey, {username} 🌸
            </h1>
            <p className="text-sm text-[var(--c-muted)] mb-6">Welcome back to your safe space</p>
            <Link to="/settings" className="btn-ghost text-sm">Edit profile</Link>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Username", value: username },
            { label: "Nickname", value: nickname || "—" },
            { label: "Email",    value: email },
          ].map(({ label, value }) => (
            <div key={label} className="glass p-4 sm:p-5">
              <p className="text-xs font-medium text-[var(--c-muted)] uppercase tracking-wider mb-1">{label}</p>
              <p className="font-medium text-[var(--c-ink)] text-sm truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          {QUICK_LINKS.map(({ to, icon, label, desc }) => (
            <Link key={to} to={to}
              className="glass p-5 flex items-center gap-4 feature-card group">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(236,72,153,0.12))" }}>
                {icon}
              </div>
              <div>
                <p className="font-semibold text-[var(--c-ink)] text-sm">{label}</p>
                <p className="text-xs text-[var(--c-muted)]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
