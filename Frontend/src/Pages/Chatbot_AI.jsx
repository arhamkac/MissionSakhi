import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { CHATBOT_BASE } from "../apiConfig";

export default function Chatbot_AI() {
  const { user } = useAuth();
  const name = user?.username || "You";

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sakhiChat")) || []; } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("sakhiChat", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || typing) return;
    const text = input.trim();
    setInput("");
    setMessages(p => [...p, { sender: name, text, isBot: false }]);
    setTyping(true);

    try {
      const history = messages.map(m => `${m.sender}: ${m.text}`).concat(`${name}: ${text}`).join("\n");
      const { data } = await axios.post(`${CHATBOT_BASE}/ask`, { question: text, history });
      setMessages(p => [...p, { sender: "Sakhi", text: data.answer, isBot: true }]);
    } catch {
      setMessages(p => [...p, { sender: "Sakhi", text: "Sorry, I'm having trouble connecting right now. Please try again 💜", isBot: true }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="page flex flex-col" style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)", height: "calc(100vh - 4rem)" }}>
      <div className="orb w-80 h-80 top-0 right-0 opacity-20" style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />
      <div className="orb w-64 h-64 bottom-0 left-0 opacity-15" style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 flex flex-col h-full max-w-3xl mx-auto w-full px-4 py-5">

        {/* Header */}
        <div className="glass p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
              🤖
            </div>
            <div>
              <h1 className="font-semibold text-[var(--c-ink)] text-sm" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem" }}>
                Sakhi AI
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[var(--c-muted)]">Always here for you</span>
              </div>
            </div>
          </div>
          <button onClick={() => { setMessages([]); localStorage.removeItem("sakhiChat"); }}
            className="btn-ghost text-xs py-1.5 px-3">
            Clear chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="max-w-xs sm:max-w-sm">
                <p className="text-xs text-[var(--c-muted)] mb-1 ml-1">Sakhi</p>
                <div className="bubble" style={{ borderRadius: "0 var(--radius) var(--radius) var(--radius)" }}>
                  Hey there 🌸 I'm Sakhi, your AI companion. I'm here to listen, support, and help — whatever you need. What's on your mind?
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-xs sm:max-w-sm ${msg.isBot ? "" : "items-end flex flex-col"}`}>
                <p className="text-xs text-[var(--c-muted)] mb-1 mx-1">{msg.sender}</p>
                {msg.isBot ? (
                  <div className="bubble">{msg.text}</div>
                ) : (
                  <div className="px-4 py-3 text-sm text-white rounded-2xl leading-relaxed"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", borderRadius: "var(--radius) 0 var(--radius) var(--radius)" }}>
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="max-w-xs">
                <p className="text-xs text-[var(--c-muted)] mb-1 ml-1">Sakhi</p>
                <div className="bubble flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass p-3 mt-3 flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Share what's on your mind…"
            className="field flex-1 py-3"
            disabled={typing}
          />
          <button onClick={send} disabled={typing || !input.trim()} className="btn-primary px-6 py-3 disabled:opacity-50">
            {typing ? <span className="spinner" /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
