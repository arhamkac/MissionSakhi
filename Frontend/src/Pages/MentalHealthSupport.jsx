const GLOBAL = [
  { name: "7 Cups", url: "https://www.7cups.com", desc: "Free anonymous chat with trained listeners, peer support groups, and optional therapist access." },
  { name: "iCall (India)", url: "https://icallhelpline.org", desc: "Free telephone & email counseling. Women-friendly, trauma-informed. 📞 +91 9152987821" },
  { name: "Mental Health America", url: "https://mhanational.org", desc: "Free mental health screenings and resources for trauma, anxiety, and depression." },
];

const WOMEN = [
  { name: "SHEROES", url: "https://sheroes.com/", desc: "Women-only community with anonymous Q&A, peer support, and spaces to discuss abuse, health, or trauma." },
  { name: "Saheli (India)", url: "https://saheliboston.org/", desc: "For South Asian women experiencing abuse or trauma — mental health, domestic violence, immigration support." },
  { name: "Safecity", url: "https://safecity.in", desc: "Crowd-sourced sexual harassment reporting. Share experiences anonymously. Community-driven advocacy." },
];

const REDDIT = [
  { name: "r/TwoXChromosomes", desc: "Focused on women's issues, experiences, and empowerment. Moderated, safe discussions." },
  { name: "r/MentalHealth", desc: "Supportive forums for mental health struggles, growth, and healing." },
];

function ResourceCard({ name, url, desc }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="glass feature-card p-5 sm:p-6 block group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-[var(--c-ink)] text-sm sm:text-base group-hover:text-[var(--c-violet)] transition-colors">
          {name}
        </h3>
        <span className="text-[var(--c-violet)] text-lg flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
      </div>
      <p className="text-xs sm:text-sm text-[var(--c-muted)] leading-relaxed">{desc}</p>
    </a>
  );
}

export default function MentalHealthSupport() {
  return (
    <div className="page px-4 py-10 sm:py-14"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-80 h-80 top-0 left-0 opacity-25"
        style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />
      <div className="orb w-64 h-64 bottom-0 right-0 opacity-20"
        style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="tag tag-purple mb-4 mx-auto">Resources</div>
          <h1 className="text-4xl sm:text-5xl font-light grad-text mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}>
            You are not alone
          </h1>
          <p className="text-[var(--c-muted)] text-sm max-w-md mx-auto leading-relaxed">
            Here are trusted resources for support and healing. Reaching out is a sign of strength.
          </p>
        </div>

        {/* Emergency banner */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl border"
          style={{ background: "rgba(244,63,94,0.04)", borderColor: "rgba(244,63,94,0.15)" }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🚨</span>
            <div>
              <h3 className="font-semibold text-rose-600 mb-2 text-sm">Emergency Support</h3>
              <p className="text-xs text-[var(--c-muted)] mb-3">
                If you're in immediate danger or having thoughts of self-harm, please reach out now:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Emergency: 911 (US) | 112 (EU)", "Crisis Text: Text HOME to 741741", "iCall: +91 9152987821"].map(s => (
                  <span key={s} className="tag tag-rose">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global platforms */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="tag tag-purple">Global</div>
            <h2 className="text-xl sm:text-2xl font-light text-[var(--c-ink)]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Mental Health Platforms
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GLOBAL.map(r => <ResourceCard key={r.name} {...r} />)}
          </div>
        </section>

        {/* Women's platforms */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="tag tag-pink">Women</div>
            <h2 className="text-xl sm:text-2xl font-light text-[var(--c-ink)]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Women's Support Spaces
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WOMEN.map(r => <ResourceCard key={r.name} {...r} />)}
          </div>
        </section>

        {/* Reddit */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="tag tag-purple">Community</div>
            <h2 className="text-xl sm:text-2xl font-light text-[var(--c-ink)]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Online Communities
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {REDDIT.map(r => (
              <div key={r.name} className="glass feature-card p-5 sm:p-6">
                <h3 className="font-semibold text-[var(--c-violet)] mb-2 text-sm">{r.name}</h3>
                <p className="text-xs text-[var(--c-muted)] leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
