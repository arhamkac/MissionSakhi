import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import {API_BASE} from "../apiConfig";

const QUICK_LINKS = [
  { to: "/forum",          icon: "📝", label: "Forum",     desc: "Share anonymously" },
  { to: "/community-chat", icon: "💬", label: "Community", desc: "Join chat rooms"   },
  { to: "/chatbot",        icon: "🤖", label: "AI Friend", desc: "Talk anytime"      },
  { to: "/mental-health",  icon: "💜", label: "Support",   desc: "Resources & help"  },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    if (user && activeTab === "saved") {
      fetchSavedPosts();
    }
  }, [user, activeTab]);

  const fetchSavedPosts = async () => {
    try {
      setLoadingSaved(true);
      const auth = { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } };
      const { data } = await axios.get(`${API_BASE}/users/bookmarks`, auth);
      setSavedPosts(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSaved(false);
    }
  };

  if (loading) return (
    <div className="page flex items-center justify-center"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "2.5rem", height: "2.5rem",
          border: "3px solid rgba(139,92,246,0.2)",
          borderTopColor: "#8b5cf6", borderRadius: "50%",
          animation: "spin 0.7s linear infinite", margin: "0 auto 1rem",
        }} />
        <p style={{ color: "#6b5b7b", fontSize: "0.875rem" }}>Loading…</p>
      </div>
    </div>
  );

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

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setActiveTab("overview")} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-violet-600 text-white shadow-md' : 'glass text-[var(--c-muted)] hover:text-[var(--c-ink)]'}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab("saved")} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'saved' ? 'bg-violet-600 text-white shadow-md' : 'glass text-[var(--c-muted)] hover:text-[var(--c-ink)]'}`}>
            Saved Posts
          </button>
        </div>

        {activeTab === "overview" && (
          <>
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
          </>
        )}

        {activeTab === "saved" && (
          <div className="space-y-4">
            {loadingSaved ? (
              <div className="glass p-8 text-center text-sm text-[var(--c-muted)]">Loading saved posts...</div>
            ) : savedPosts.length === 0 ? (
              <div className="glass p-12 text-center">
                <div className="text-4xl mb-3">🔖</div>
                <h3 className="font-semibold text-[var(--c-ink)] mb-1">No saved posts</h3>
                <p className="text-sm text-[var(--c-muted)] mb-4">You haven't saved any forum posts yet.</p>
                <Link to="/forum" className="btn-ghost text-sm">Browse Forum</Link>
              </div>
            ) : (
              savedPosts.map(post => (
                <div key={post._id} className="glass p-4 sm:p-5 feature-card group" onClick={() => window.location.href = `/post/${post._id}`}>
                   <h3 className="text-base sm:text-lg font-semibold text-[var(--c-ink)] mb-1 leading-snug hover:text-violet-600 transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-[var(--c-muted)] text-sm line-clamp-2">
                       {post.content}
                    </p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
