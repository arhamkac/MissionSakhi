import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/forum",          label: "Forum"     },
  { to: "/community-chat", label: "Community" },
  { to: "/chatbot",        label: "AI Friend" },
  { to: "/mental-health",  label: "Support"   },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header
      className="relative z-50"
      style={{
        background: "linear-gradient(135deg,rgba(109,40,217,0.95) 0%,rgba(192,38,211,0.95) 50%,rgba(244,63,94,0.9) 100%)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
            🌸
          </div>
          <span className="text-white font-semibold text-base tracking-tight"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
            Mission Sakhi
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`nav-link ${pathname === to ? "!text-white after:!w-full" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Sign in
              </Link>
              <Link to="/signup"
                className="btn-primary text-sm py-2 px-5"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                Join free
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/dashboard"
                className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)" }}>
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span>{user.username}</span>
              </Link>
              <button onClick={logout}
                className="text-white/60 hover:text-white/90 text-sm transition-colors">
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
          style={{ background: "rgba(255,255,255,0.1)" }}
          aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-5 pb-5 pt-2 space-y-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="block py-3 text-white/85 hover:text-white font-medium text-sm border-b transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="btn-ghost w-full justify-center text-white border-white/20 hover:bg-white/10">
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center">
                  Join free
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}
                  className="btn-ghost w-full justify-center text-white border-white/20">
                  My Profile
                </Link>
                <button onClick={() => { logout(); setOpen(false); }}
                  className="btn-danger w-full justify-center border-white/20 text-white/70">
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
