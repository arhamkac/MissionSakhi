import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { CHATBOT_BASE } from "../apiConfig";
import { Send, Trash2, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "What are my legal rights if I face workplace harassment?",
  "How can I stay safe when traveling alone?",
  "I'm feeling overwhelmed and anxious. Can you help?",
  "What should I do if I feel unsafe at home?",
  "Tell me about self-defense basics for women.",
];

// Renders plain text with basic markdown: **bold**, *italic*, line breaks, bullet lists
function BotMessage({ text }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        // Bullet
        if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#8b5cf6", marginTop: "0.45rem" }} />
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[-•]\s/, "")) }} />
            </div>
          );
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
      })}
    </div>
  );
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:rgba(139,92,246,0.1);padding:1px 5px;border-radius:4px;font-size:0.85em'>$1</code>");
}

export default function Chatbot_AI() {
  const { user } = useAuth();
  const name = user?.nickname || user?.username || "You";

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sakhiChat")) || []; } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    localStorage.setItem("sakhiChat", JSON.stringify(messages));
    if (isMounted.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      isMounted.current = true;
    }
  }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const send = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || typing) return;
    setInput("");
    const userMsg = { sender: name, text, isBot: false, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(p => [...p, userMsg]);
    setTyping(true);

    try {
      const history = messages.map(m => `${m.sender}: ${m.text}`).concat(`${name}: ${text}`).join("\n");
      const { data } = await axios.post(`${CHATBOT_BASE}/ask`, { question: text, history });
      setMessages(p => [...p, {
        sender: "Sakhi",
        text: data.answer,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } catch {
      setMessages(p => [...p, {
        sender: "Sakhi",
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment 💜",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("sakhiChat");
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex flex-col"
      style={{
        background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)",
        flex: "1 1 0",
        minHeight: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient */}
      <div className="orb w-80 h-80 top-0 right-0 opacity-20" style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />
      <div className="orb w-64 h-64 bottom-0 left-0 opacity-15" style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto w-full" style={{ minHeight: 0 }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(139,92,246,0.1)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
              🤖
            </div>
            <div>
              <h1 className="font-semibold text-[var(--c-ink)]" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.15rem" }}>
                Sakhi AI
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[var(--c-muted)]">Powered by Groq · Always here</span>
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-[var(--c-muted)] hover:text-rose-500 transition-colors px-3 py-1.5 rounded-xl hover:bg-rose-50">
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

          {/* Greeting */}
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow-sm"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
              🤖
            </div>
            <div className="max-w-sm">
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
                style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(139,92,246,0.1)" }}>
                <p className="text-sm leading-relaxed text-[var(--c-ink)]">
                  Hey{user ? ` ${name}` : ""} 🌸 I'm <strong>Sakhi</strong>, your AI companion — trained on women's safety,
                  health, legal rights, and wellbeing resources. Ask me anything, or just talk. I'm here.
                </p>
              </div>
            </div>
          </div>

          {/* Suggested prompts */}
          {isEmpty && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Sparkles size={13} className="text-violet-400" />
                <span className="text-xs text-[var(--c-muted)] font-medium">Try asking…</span>
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    className="text-left text-xs px-4 py-2.5 rounded-xl transition-all"
                    style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)", color: "#6d4f8c" }}
                    onMouseEnter={e => e.target.style.background = "rgba(139,92,246,0.12)"}
                    onMouseLeave={e => e.target.style.background = "rgba(139,92,246,0.06)"}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.isBot ? "justify-start" : "justify-end"}`}>
              {msg.isBot && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow-sm"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                  🤖
                </div>
              )}
              <div className={`max-w-sm ${!msg.isBot ? "items-end flex flex-col" : ""}`}>
                {msg.isBot ? (
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
                    style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(139,92,246,0.1)" }}>
                    <BotMessage text={msg.text} />
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-2xl rounded-tr-sm shadow-md text-white text-sm leading-relaxed"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                    {msg.text}
                  </div>
                )}
                {msg.time && (
                  <p className="text-[10px] text-[var(--c-muted)] mt-1 px-1">{msg.time}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                🤖
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5"
                style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(139,92,246,0.1)" }}>
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex gap-2 items-end p-2 rounded-2xl shadow-md"
            style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Share what's on your mind… (Shift+Enter for new line)"
              disabled={typing}
              rows={1}
              className="flex-1 resize-none bg-transparent border-0 outline-none text-sm text-[var(--c-ink)] placeholder:text-[var(--c-muted)] py-2 px-2"
              style={{ maxHeight: "120px", lineHeight: "1.5" }}
            />
            <button
              onClick={() => send()}
              disabled={typing || !input.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
              title="Send (Enter)"
            >
              {typing
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Send size={16} />
              }
            </button>
          </div>
          <p className="text-center text-[10px] text-[var(--c-muted)] mt-2">
            Sakhi is an AI trained on women's safety data. Not a substitute for professional help.
          </p>
        </div>

      </div>
    </div>
  );
}
