import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

const NAV = [
  { to: "/forum",          label: "Forum"     },
  { to: "/community-chat", label: "Community" },
  { to: "/chatbot",        label: "AI Friend" },
  { to: "/mental-health",  label: "Support"   },
];

import { usePanic } from "./PanicContext";
import { ShieldCheck } from "lucide-react";
import SOSButton from "../Components/SOSButton";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { togglePanic } = usePanic();

  const handleHeaderSearch = (event) => {
    event.preventDefault();
    const query = headerSearch.trim();
    if (!query) return;
    const target = pathname === "/community-chat" ? "/community-chat" : "/forum";
    navigate(`${target}?query=${encodeURIComponent(query)}`);
  };

  return (
    <header
      className="relative z-50"
      style={{
        background: "linear-gradient(135deg,rgba(109,40,217,0.95) 0%,rgba(192,38,211,0.95) 50%,rgba(244,63,94,0.9) 100%)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Panic Switch (Subtle Switch Dot) */}
      <button 
        onClick={togglePanic}
        className="absolute top-1/2 -translate-y-1/2 right-4 w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 border border-white/10 transition-all cursor-default z-[60]"
        title="Safety Switch"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
           <ShieldCheck size={10} className="text-white" />
        </div>
      </button>

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
        <nav className="hidden md:flex items-center gap-7 ml-12">
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`nav-link ${pathname === to ? "!text-white after:!w-full" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleHeaderSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-xl ml-6 mr-8">
          <div className="relative flex-1">
            <input
              value={headerSearch}
              onChange={e => setHeaderSearch(e.target.value)}
              placeholder="Search stories or rooms..."
              className="field w-full pl-5 pr-16 bg-white/12 text-white placeholder:text-white/60"
              style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)" }}
            />
            {headerSearch ? (
              <button type="button" onClick={() => setHeaderSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
                <X size={16} />
              </button>
            ) : null}
            <Search size={18} className="absolute right-11 top-1/2 -translate-y-1/2 text-white/70" />
          </div>
        </form>

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
          <div className="pl-1 border-l border-white/20 ml-1">
            <SOSButton />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <SOSButton />
          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          aria-label="Menu">
          <div className="relative w-5 h-4">
            <span className={`absolute left-0 block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "top-2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-2 block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "top-2 -rotate-45" : "top-4"}`} />
          </div>
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 glass shadow-2xl animate-in slide-in-from-top-4 duration-300 z-50 overflow-hidden"
          style={{ margin: "0.5rem", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(109,40,217,0.98)", backdropFilter: "blur(24px)" }}>
          <div className="px-6 py-8 space-y-6">
            <nav className="flex flex-col gap-1">
              {NAV.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)}
                  className="py-4 text-white hover:text-white/80 font-medium text-lg border-b border-white/10 transition-colors last:border-0">
                  {label}
                </Link>
              ))}
            </nav>
            
            <form onSubmit={handleHeaderSearch} className="relative">
              <input
                value={headerSearch}
                onChange={e => setHeaderSearch(e.target.value)}
                placeholder="Search..."
                className="field w-full pl-5 pr-12 bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:bg-white/15"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                <Search size={18} />
              </button>
            </form>

            <div className="flex flex-col gap-3 pt-4">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="btn-ghost w-full justify-center text-white border-white/20 bg-white/5 py-3">
                    Sign in
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}
                    className="btn-primary w-full justify-center py-3 shadow-lg">
                    Join free
                  </Link>
                </>
              ) : (
                <div className="space-y-3">
                  <Link to="/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10">
                    <div className="flex items-center gap-3 text-white font-medium">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-white/20 border border-white/30">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </div>
                    <span className="text-white/60 text-sm">Dashboard →</span>
                  </Link>
                  <button onClick={() => { logout(); setOpen(false); }}
                    className="w-full text-center py-3 text-white/50 hover:text-white/80 text-sm transition-colors">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
