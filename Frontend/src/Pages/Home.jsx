import { useState } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🕊️", tag: "Privacy", title: "Truly Anonymous", body: "No real names, no tracking. Share your story knowing it stays yours." },
  { icon: "💬", tag: "Community", title: "Real Conversations", body: "Rooms built around what matters — safety, healing, growth, and joy." },
  { icon: "🤖", tag: "AI", title: "3am Support", body: "Our AI companion listens without judgment, any hour you need her." },
  { icon: "🛡️", tag: "Safety", title: "Zero Tolerance", body: "Perspective AI + human moderators keep this space genuinely safe." },
  { icon: "📝", tag: "Forum", title: "Share & Heal", body: "Post anonymously, get upvotes, build solidarity with women worldwide." },
];

const TESTIMONIALS = [
  { quote: "Finally a platform that actually gets it. I've never felt safer sharing online.", name: "Sarah", age: 28 },
  { quote: "The AI chatbot helped me process things at 2am when I had no one to call.", name: "Maya", age: 24 },
  { quote: "I came here broken and left feeling like I had a whole sisterhood behind me.", name: "Priya", age: 31 },
  { quote: "No judgment, no toxicity. Just real women being real with each other.", name: "Anonymous" },
];

const FAQ = [
  ["Is my identity really protected?", "Completely. You can share without anyone knowing who you are — that's a core promise, not a feature."],
  ["Who moderates this space?", "A mix of Perspective AI and real human moderators (mostly women) who understand nuance."],
  ["What happens if someone is toxic?", "Multiple reports trigger an immediate review. We act fast. Zero tolerance is real here."],
  ["Can I delete my posts?", "Always. Your content, your choice — edit or delete anything, anytime."],
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page" style={{ background: "linear-gradient(160deg, #fdf0f5 0%, #f7f0ff 40%, #fdf0f5 100%)" }}>
      {/* Ambient orbs */}
      <div className="orb w-96 h-96 top-0 left-0" style={{ background: "radial-gradient(circle, #e879f9, transparent 70%)" }} />
      <div className="orb w-80 h-80 bottom-40 right-0" style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)", animationDelay: "3s" }} />
      <div className="orb w-64 h-64 top-1/2 left-1/3" style={{ background: "radial-gradient(circle, #f9a8d4, transparent 70%)", animationDelay: "6s" }} />

      <div className="relative z-10">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl">
            <div className="tag tag-purple mb-6">Women-first platform</div>
            <h1 className="hero-title text-[var(--c-ink)] mb-6">
              A space built<br />
              <em className="grad-text">for you</em><br />
            </h1>
            <p className="text-lg text-[var(--c-muted)] leading-relaxed max-w-xl mb-10"
              style={{ fontWeight: 300 }}>
              Mission Sakhi is where women come to be real — share stories, find support,
              and connect without the toxicity of mainstream platforms.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Link to="/signup" className="btn-primary text-base px-7 py-3.5">
                Join the community
              </Link>
              <Link to="/forum" className="btn-ghost text-base px-7 py-3.5">
                Browse stories
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3 mt-10">
              {["100% anonymous", "AI-moderated", "Women-only space"].map(s => (
                <div key={s} className="stat-pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Images ───────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {["/happy-women-supporting.png", "/empowered-women-community.png"].map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl group"
                style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.12)" }}>
                <img src={src} alt="" className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(to top, rgba(124,58,237,0.15), transparent)" }} />
              </div>
            ))}
          </div>
        </section>

        {/* ── About strip ──────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="glass noise relative overflow-hidden p-8 sm:p-12">
            <div className="orb w-48 h-48 -top-12 -right-12 opacity-30"
              style={{ background: "radial-gradient(circle, #e879f9, transparent 70%)" }} />
            <div className="relative z-10 max-w-2xl">
              <div className="tag tag-pink mb-4">Our mission</div>
              <h2 className="text-3xl sm:text-4xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Built different, on purpose.
              </h2>
              <p className="text-[var(--c-muted)] leading-relaxed" style={{ fontWeight: 300 }}>
                Most platforms weren't built with women in mind. Mission Sakhi is privacy-first,
                women-centered, and genuinely safe. Whether you're navigating workplace harassment,
                relationship struggles, or just need someone who gets it — this is your space.
                No judgment. Just real support from real women.
              </p>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="text-center mb-12">
            <div className="tag tag-purple mb-4 mx-auto">Why us</div>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              What makes us <em>different</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass feature-card p-6 sm:p-7">
                <div className="text-3xl mb-4">{f.icon}</div>
                <div className="tag tag-purple mb-3">{f.tag}</div>
                <h3 className="text-xl font-semibold text-[var(--c-ink)] mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--c-muted)] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="text-center mb-12">
            <div className="tag tag-pink mb-4 mx-auto">Community voices</div>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              What our sisters say
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass p-6 sm:p-8 relative overflow-hidden">
                <div className="quote-mark absolute top-3 left-5">"</div>
                <p className="text-[var(--c-ink)] leading-relaxed mb-4 pt-4 relative z-10"
                  style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontStyle: "italic", fontWeight: 400 }}>
                  {t.quote}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                    {t.name[0]}
                  </div>
                  <span className="text-sm text-[var(--c-muted)]">
                    {t.name}{t.age ? `, ${t.age}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Questions we hear often
            </h2>
          </div>
          <div className="glass overflow-hidden">
            {FAQ.map(([q, a], i) => (
              <div key={i} className="faq-item">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium text-[var(--c-ink)] text-sm sm:text-base">{q}</span>
                  <span className="text-[var(--c-violet)] text-xl ml-4 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-[var(--c-muted)] leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA banner ───────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
            style={{ background: "linear-gradient(135deg,#6d28d9 0%,#c026d3 50%,#f43f5e 100%)" }}>
            <div className="orb w-64 h-64 -top-16 -left-16 opacity-30"
              style={{ background: "radial-gradient(circle,rgba(255,255,255,0.4),transparent 70%)" }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-light text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Ready to find your people?
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Join thousands of women who've found their safe space here.
              </p>
              <Link to="/signup"
                className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all shadow-xl"
                style={{ fontSize: "0.95rem" }}>
                Get started — it's free
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* Floating action */}
      <Link to="/chatbot"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 flex items-center justify-center rounded-full text-white text-xl shadow-2xl transition-transform hover:scale-110"
        style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", width: "3.25rem", height: "3.25rem", boxShadow: "0 8px 32px rgba(139,92,246,0.4)" }}
        title="Chat with AI">
        🤖
      </Link>
    </div>
  );
}
