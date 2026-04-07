export default function Chatbot() {
  return (
    <div className="page px-4 py-10 sm:py-14"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-80 h-80 top-0 right-0 opacity-25"
        style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />
      <div className="orb w-64 h-64 bottom-0 left-0 opacity-20"
        style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="tag tag-purple mb-4 mx-auto">AI Support</div>
          <h1 className="text-4xl sm:text-5xl font-light grad-text mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Your AI companion
          </h1>
          <p className="text-[var(--c-muted)] max-w-md mx-auto text-sm leading-relaxed">
            Ask anything, share what you're feeling. She's here for you — no judgment, any hour.
          </p>
        </div>

        <div className="glass overflow-hidden" style={{ height: "72vh" }}>
          <div className="h-1 w-full"
            style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899,#f43f5e)" }} />
          <iframe
            src="https://app.thinkstack.ai/bot/previews/iframeview.html?bot=aHR0cHM6Ly9hcHAudGhpbmtzdGFjay5haS9ib3QvaW5kZXguaHRtbD9jaGF0Ym90X2lkPTY4ODViZTUyNTk3NmRmMGU4ZTQxYTg1MCZ0eXBlPWlubGluZQ=="
            frameBorder="0"
            className="w-full"
            style={{ height: "calc(100% - 4px)" }}
            allow="clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
