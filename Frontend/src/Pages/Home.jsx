import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RightsCardStack from "../Components/RightsCardStack";

const FEATURES = [
  {
    icon: "🕊️",
    tag: "Privacy",
    title: "Truly Anonymous",
    body: "Share stories, post in the forum, and chat in rooms — all without revealing your real identity. Your name, your choice.",
    link: "/forum",
    linkText: "Browse Forum →"
  },
  {
    icon: "💬",
    tag: "Community",
    title: "Safe Chat Rooms",
    body: "Join topic-based rooms for real conversations — from mental health to career growth, self-defense to travel safety.",
    link: "/community-chat",
    linkText: "Join a Room →"
  },
  {
    icon: "🤖",
    tag: "AI",
    title: "24/7 AI Companion",
    body: "Our Groq-powered AI chatbot is trained on women's safety resources. Ask anything — health, legal rights, safety tips — any hour.",
    link: "/chatbot",
    linkText: "Talk to AI →"
  },
  {
    icon: "🛡️",
    tag: "Safety",
    title: "Auto-Moderation",
    body: "Every post, comment, and message is screened in real time by Google's Perspective AI to block toxic content before it reaches you.",
    link: "/forum",
    linkText: "See Posts →"
  },
  {
    icon: "📝",
    tag: "Forum",
    title: "Anonymous Posts",
    body: "Share your experience, ask for advice, or just vent. Vote on posts that resonate, and comment without judgment.",
    link: "/forum",
    linkText: "Read Stories →"
  },
  {
    icon: "🚩",
    tag: "Reporting",
    title: "Community Reports",
    body: "See something wrong? Flag posts, comments, or messages instantly. Repeat offenders are automatically reviewed and banned.",
    link: "/forum",
    linkText: "Explore →"
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create an account", body: "Sign up with email or Google. No real name needed — pick a username that's yours." },
  { step: "02", title: "Post or explore", body: "Browse anonymous forum posts by category, or create your own. No judgment, just support." },
  { step: "03", title: "Join the conversation", body: "Comment on posts, join live chat rooms, or have a private conversation with our AI." },
  { step: "04", title: "Stay safe", body: "Report anything that feels wrong. The platform auto-screens all content so your feed stays clean." },
];

const FAQ = [
  ["Is my identity really protected?", "Yes — completely. You can post and chat without anyone knowing who you are. That's built into the core architecture, not an add-on."],
  ["What is the AI chatbot trained on?", "It uses a curated dataset of women's safety resources, mental health guidance, legal rights, and emergency contacts — all powered by Groq's llama-3.3 model."],
  ["What happens when I report someone?", "Each report is logged instantly. If a user accumulates 5 or more reports, their account is automatically reviewed and temporarily suspended for 48 hours."],
  ["Can I delete my own posts and comments?", "Absolutely. You own your content — you can edit or delete your posts and comments at any time, no questions asked."],
  ["Is the chat real-time?", "Yes — community rooms use WebSocket connections for live messaging. Messages are also saved so you can catch up when you return."],
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useAuth();

  return (
    <div className="page" style={{ background: "linear-gradient(160deg, #fdf0f5 0%, #f7f0ff 40%, #fdf0f5 100%)" }}>
      {/* Ambient orbs */}
      <div className="orb w-96 h-96 top-0 left-0" style={{ background: "radial-gradient(circle, #e879f9, transparent 70%)" }} />
      <div className="orb w-80 h-80 bottom-40 right-0" style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)", animationDelay: "3s" }} />
      <div className="orb w-64 h-64 top-1/2 left-1/3" style={{ background: "radial-gradient(circle, #f9a8d4, transparent 70%)", animationDelay: "6s" }} />

      <div className="relative z-10">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl">
            <div className="tag tag-purple mb-6">Women-first platform</div>
            <h1 className="hero-title text-[var(--c-ink)] mb-6">
              A space built<br />
              <em className="grad-text">for you</em><br />
            </h1>
            <p className="text-lg text-[var(--c-muted)] leading-relaxed max-w-xl mb-10" style={{ fontWeight: 300 }}>
              Mission Sakhi is an anonymous community platform for women — real conversations in safe chat rooms,
              an AI powered by women's safety data, and a forum where every voice matters.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Link to={user ? "/forum" : "/signup"} className="btn-primary text-base px-7 py-3.5">
                {user ? "Go to Forum" : "Join the community"}
              </Link>
              <Link to="/forum" className="btn-ghost text-base px-7 py-3.5">
                Browse Forum
              </Link>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-3 mt-10">
              {["100% anonymous", "AI-moderated content", "Open source community"].map(s => (
                <div key={s} className="stat-pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About strip ──────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="glass noise relative overflow-hidden p-8 sm:p-12">
            <div className="orb w-48 h-48 -top-12 -right-12 opacity-30"
              style={{ background: "radial-gradient(circle, #e879f9, transparent 70%)" }} />
            <div className="relative z-10 max-w-2xl">
              <div className="tag tag-pink mb-4">What is Mission Sakhi?</div>
              <h2 className="text-3xl sm:text-4xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Built from scratch, just for this.
              </h2>
              <p className="text-[var(--c-muted)] leading-relaxed" style={{ fontWeight: 300 }}>
                Mission Sakhi combines an <strong>anonymous forum</strong>, <strong>live topic-based chat rooms</strong>,
                and a <strong>Groq-powered AI chatbot</strong> trained on women's safety resources into one safe space.
                Every piece of content is screened by Google's Perspective API. You can share, talk, and get support —
                all without giving up your identity.
              </p>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="text-center mb-12">
            <div className="tag tag-purple mb-4 mx-auto">Features</div>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Everything that's actually <em>built in</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass feature-card p-6 sm:p-7 flex flex-col">
                <div className="text-3xl mb-4">{f.icon}</div>
                <div className="tag tag-purple mb-3">{f.tag}</div>
                <h3 className="text-xl font-semibold text-[var(--c-ink)] mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--c-muted)] leading-relaxed flex-1">{f.body}</p>
                <Link to={f.link} className="mt-4 text-sm font-medium text-violet-500 hover:text-violet-700 transition-colors">
                  {f.linkText}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <RightsCardStack />

        {/* ── How it works ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="text-center mb-12">
            <div className="tag tag-pink mb-4 mx-auto">How it works</div>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Simple to start, real from day one
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="glass p-6">
                <div className="text-4xl font-light mb-3 grad-text" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {step.step}
                </div>
                <h3 className="font-semibold text-[var(--c-ink)] mb-2 text-base">{step.title}</h3>
                <p className="text-sm text-[var(--c-muted)] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Common questions
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
                Ready to find your place?
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Join the community — post anonymously, chat in real time, or just talk to the AI. No pressure, no judgment.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {!user && (
                  <Link to="/signup"
                    className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all shadow-xl"
                    style={{ fontSize: "0.95rem" }}>
                    Create your account
                  </Link>
                )}
                <Link to="/chatbot"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-all"
                  style={{ fontSize: "0.95rem" }}>
                  Try the AI first →
                </Link>
                {user && (
                  <Link to="/community-chat"
                    className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all shadow-xl"
                    style={{ fontSize: "0.95rem" }}>
                    Go to community →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Floating chatbot button */}
      <Link to="/chatbot"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 flex items-center justify-center rounded-full text-white text-xl shadow-2xl transition-transform hover:scale-110"
        style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", width: "3.25rem", height: "3.25rem", boxShadow: "0 8px 32px rgba(139,92,246,0.4)" }}
        title="Chat with AI">
        🤖
      </Link>
    </div>
  );
}
