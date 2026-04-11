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

// Full markdown renderer for bot responses
function BotMessage({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Skip empty
    if (!trimmed) {
      elements.push(<div key={i} className="h-2" />);
      i++; continue;
    }

    // Numbered list  1. 2. 3.
    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-none space-y-1.5 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2.5 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white mt-0.5"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", minWidth: "1.25rem" }}>
                {j + 1}
              </span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Top-level bullet  - or * or •
    if (/^[-*•]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
        const bullet = lines[i].trim().replace(/^[-*•]\s/, "");
        const subitems = [];
        i++;
        // collect nested (tab or +)
        while (i < lines.length && /^(\t|\s{2,})[+\-*•]?\s/.test(lines[i])) {
          subitems.push(lines[i].trim().replace(/^[+\-*•]\s/, ""));
          i++;
        }
        items.push({ bullet, subitems });
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 pl-1">
          {items.map((item, j) => (
            <li key={j}>
              <div className="flex gap-2 items-start">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ background: "#8b5cf6" }} />
                <span dangerouslySetInnerHTML={{ __html: formatInline(item.bullet) }} />
              </div>
              {item.subitems.length > 0 && (
                <ul className="ml-5 mt-1 space-y-1">
                  {item.subitems.map((sub, k) => (
                    <li key={k} className="flex gap-2 items-start text-[var(--c-muted)]">
                      <span className="flex-shrink-0 w-1 h-1 rounded-full mt-2" style={{ background: "#c4b5fd" }} />
                      <span dangerouslySetInnerHTML={{ __html: formatInline(sub) }} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Bold heading (line is just **text**)
    if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
      elements.push(
        <p key={i} className="font-semibold text-[var(--c-ink)] mt-2"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
      i++; continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
    );
    i++;
  }

  return <div className="text-sm space-y-2">{elements}</div>;
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:rgba(139,92,246,0.1);padding:1px 6px;border-radius:4px;font-size:0.82em;font-family:monospace'>$1</code>");
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

  useEffect(() => {
  const savedDraft = localStorage.getItem("chatDraft");
  if (savedDraft) {
    setInput(savedDraft);
  }
}, []);

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
    localStorage.removeItem("chatDraft");
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

      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto w-full" style={{ minHeight: 0, height: "calc(100vh - 4.25rem)" }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b" style={{ borderColor: "rgba(139,92,246,0.1)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-md flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
              🤖
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-[var(--c-ink)] truncate" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>
                Sakhi AI
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs text-[var(--c-muted)] truncate">Groq Powered</span>
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[var(--c-muted)] hover:text-rose-500 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-rose-50 flex-shrink-0">
              <Trash2 size={12} />
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
            <div className="max-w-[85%] sm:max-w-sm">
              <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-sm border border-[rgba(139,92,246,0.1)] bg-white/90">
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--c-ink)]">
                  Hey{user ? ` ${name}` : ""} 🌸 I'm <strong>Sakhi</strong>, your AI companion. Ask me anything about safety, rights, or wellbeing.
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
              <div className={`max-w-[85%] sm:max-w-sm ${!msg.isBot ? "items-end flex flex-col self-end" : ""}`}>
                {msg.isBot ? (
                  <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-sm border border-[rgba(139,92,246,0.1)] bg-white/90">
                    <BotMessage text={msg.text} />
                  </div>
                ) : (
                  <div className="px-4 py-2.5 sm:py-3 rounded-2xl rounded-tr-sm shadow-md text-white text-xs sm:text-sm leading-relaxed"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                    {msg.text}
                  </div>
                )}
                {msg.time && (
                  <p className="text-[9px] sm:text-[10px] text-[var(--c-muted)] mt-1 px-1">{msg.time}</p>
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
                <span className="text-sm text-[var(--c-ink)]">Sakhi is thinking...</span>
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
              onChange={e => {
              setInput(e.target.value);
             localStorage.setItem("chatDraft", e.target.value);
            }}
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
