import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Search, X } from "lucide-react";
import { ROOMS_BASE, MESSAGE_BASE, API_BASE } from "../apiConfig";
import ReportModal from "../Components/ReportModal";

const GRADIENTS = [
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#ec4899,#f43f5e)",
  "linear-gradient(135deg,#6d28d9,#c026d3)",
  "linear-gradient(135deg,#f43f5e,#f97316)",
  "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
];

const initials = (name) => {
  const w = name.trim().split(" ");
  return w.length === 1 ? w[0][0].toUpperCase() : (w[0][0] + w[1][0]).toUpperCase();
};

export default function Community() {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState({});
  const [socket, setSocket] = useState(null);
  const [reportConfig, setReportConfig] = useState({ isOpen: false, type: "", id: "" });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("query") || "";
  });
  const [isSearching, setIsSearching] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const location = useLocation();
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const { user, loading } = useAuth();

  const BASE = ROOMS_BASE;
  const MSG  = MESSAGE_BASE;
  const auth = { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } };

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query") || "";
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [location.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const queryString = searchQuery.trim() ? `?query=${encodeURIComponent(searchQuery.trim())}` : "";
      setIsSearching(true);
      axios.get(`${BASE}/get-rooms${queryString}`)
        .then(({ data }) => setRooms(data.message.rooms || []))
        .catch((err) => {
          console.error(err);
          setRooms([]);
        })
        .finally(() => setIsSearching(false));
    }, 400);

    return () => clearTimeout(timeout);
  }, [user, searchQuery]);

  useEffect(() => {
    if (!selected) return;
    axios.get(`${BASE}/messages/${selected}`, auth)
      .then(({ data }) => setMessages(p => ({ ...p, [selected]: data.message || [] })))
      .catch(console.error);
  }, [selected, user]);

  const send = async () => {
    if (!newMsg.trim() || !selected) return;
    try {
      const { data } = await axios.post(`${MSG}/create/${selected}`, { content: newMsg }, auth);
      setMessages(p => ({ ...p, [selected]: [data.message, ...(p[selected] || [])] }));
      setNewMsg("");
    } catch (e) { console.error(e); }
  };

  const editMsg = async (id) => {
    if (!editText.trim()) return;
    try {
      const { data } = await axios.patch(`${MSG}/${id}`, { content: editText }, auth);
      setMessages(p => ({ ...p, [selected]: p[selected].map(m => m._id === id ? data.message : m) }));
      setEditId(null); setEditText("");
    } catch (e) { console.error(e); }
  };

  const deleteMsg = async (id) => {
    try {
      await axios.delete(`${MSG}/${id}`, auth);
      setMessages(p => ({ ...p, [selected]: p[selected].filter(m => m._id !== id) }));
    } catch (e) { console.error(e); }
  };

  const like = (id) => setMessages(p => ({
    ...p, [selected]: p[selected].map(m => m._id === id ? { ...m, likes: (m.likes || 0) + 1 } : m)
  }));

  const createRoom = async () => {
    if (!roomName.trim()) return;
    try {
      const { data } = await axios.post(`${BASE}/create-room`, { name: roomName, description: roomDesc }, auth);
      const newRoom = data.message;
      setRooms(p => [...p, newRoom]);
      setRoomName(""); setRoomDesc("");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to create room. Make sure you're logged in.");
      console.error(e);
    }
  };

  const openReport = (type, id) => {
    if (!user) { alert("Please login to report"); return; }
    setReportConfig({ isOpen: true, type, id });
  };

  const handleReportSubmit = async (selectedType, content) => {
    setIsSubmittingReport(true);
    try {
      await axios.post(`${API_BASE}/report/${reportConfig.type}/${reportConfig.id}`, 
        { type: selectedType, content }, auth);
      alert("Report submitted successfully");
      setReportConfig({ isOpen: false, type: "", id: "" });
    } catch (e) {
      console.error(e);
      alert("Failed to report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (loading) return (
    <div className="page flex items-center justify-center"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="glass p-8 text-center">
        <div className="spinner mx-auto mb-3" style={{ borderTopColor: "#8b5cf6", borderColor: "rgba(139,92,246,0.2)", width: "2rem", height: "2rem" }} />
        <p className="text-sm text-[var(--c-muted)]">Loading community…</p>
      </div>
    </div>
  );

  /* ── Chat view ── */
  if (selected) {
    const room = rooms.find(r => r._id === selected);
    const msgs = messages[selected] || [];
    return (
      <div className="page flex flex-col"
        style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)", height: "calc(100vh - 4rem)" }}>
        <div className="orb w-64 h-64 top-0 right-0 opacity-20"
          style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />

        <div className="relative z-10 flex flex-col h-full max-w-3xl mx-auto w-full px-4 py-5">
          {/* Room header */}
          <div className="glass p-4 mb-4 flex items-center gap-4">
            <button onClick={() => setSelected(null)} className="btn-ghost text-sm py-1.5 px-3">← Back</button>
            <div>
              <h2 className="font-semibold text-[var(--c-ink)]">{room?.name}</h2>
              <p className="text-xs text-[var(--c-muted)]">{room?.description}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
            {msgs.length === 0 && (
              <div className="text-center py-16 text-[var(--c-muted)] text-sm">
                <p className="text-3xl mb-2">💬</p>
                No messages yet. Start the conversation!
              </div>
            )}
            {msgs.map(m => (
              <div key={m._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                  {m.sender?.username?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[var(--c-ink)]">{m.sender?.username || "Anonymous"}</span>
                    <span className="text-xs text-[var(--c-muted)]">{m.time || "now"}</span>
                  </div>
                  {editId === m._id ? (
                    <div className="flex gap-2">
                      <input value={editText} onChange={e => setEditText(e.target.value)}
                        className="field flex-1 py-1.5 text-sm" />
                      <button onClick={() => editMsg(m._id)} className="text-violet-600 text-xs font-medium">Save</button>
                      <button onClick={() => setEditId(null)} className="text-rose-400 text-xs font-medium">Cancel</button>
                    </div>
                  ) : (
                    <div className="bubble inline-block max-w-xs sm:max-w-sm">{m.content}</div>
                  )}
                  <div className="flex gap-3 mt-1">
                    <button onClick={() => like(m._id)} className="text-xs text-[var(--c-muted)] hover:text-pink-500 transition-colors">
                      💖 {m.likes || 0}
                    </button>
                    {m.sender?._id === user?._id && editId !== m._id ? (
                      <>
                        <button onClick={() => { setEditId(m._id); setEditText(m.content); }}
                          className="text-xs text-[var(--c-muted)] hover:text-violet-600 transition-colors">Edit</button>
                        <button onClick={() => deleteMsg(m._id)}
                          className="text-xs text-[var(--c-muted)] hover:text-rose-500 transition-colors">Delete</button>
                      </>
                    ) : user?._id !== m.sender?._id ? (
                        <button onClick={() => openReport('message', m._id)}
                          className="text-xs text-[var(--c-muted)] hover:text-rose-500 transition-colors">Report</button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="glass p-3 flex gap-3">
            {user ? (
              <>
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder={`Message ${room?.name}…`}
                  className="field flex-1 py-2.5" />
                <button onClick={send} className="btn-primary px-5 py-2.5 text-sm">Send</button>
              </>
            ) : (
              <div className="flex-1 text-center py-2 text-sm text-[var(--c-muted)]">
                Please <Link to="/login" className="text-violet-600 font-semibold hover:underline">sign in</Link> to join the conversation
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Rooms list ── */
  return (
    <div className="page px-4 py-10 sm:py-14"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-80 h-80 top-0 left-0 opacity-25"
        style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />
      <div className="orb w-64 h-64 bottom-0 right-0 opacity-20"
        style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="tag tag-purple mb-4 mx-auto">Community</div>
          <h1 className="text-4xl sm:text-5xl font-light grad-text mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Find your room
          </h1>
          <p className="text-[var(--c-muted)] text-sm max-w-md mx-auto">
            Every room is a safe space built with love. Join a conversation or start your own.
          </p>
        </div>

        <div className="glass p-4 rounded-3xl mb-8" style={{ backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(139,92,246,0.14)" }}>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={18} className="absolute right-11 top-1/2 -translate-y-1/2 text-[var(--c-muted)]" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search rooms, topics, or keywords..."
                className="field pl-5 pr-16"
              />
              {searchQuery ? (
                <button type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-muted)] hover:text-[var(--c-ink)]"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--c-muted)]">
              {isSearching ? (
                <span className="inline-flex items-center gap-2">
                  <span className="spinner" style={{ width: "1rem", height: "1rem", borderTopColor: "#8b5cf6", borderColor: "rgba(139,92,246,0.25)" }} />
                  Searching...
                </span>
              ) : (
                <span>{searchQuery.trim() ? `${rooms.length} room${rooms.length === 1 ? "" : "s"} found` : "Showing all rooms"}</span>
              )}
            </div>
          </div>
        </div>

        {user && (
          <div className="glass p-5 mb-8 flex flex-col sm:flex-row gap-3">
            <input value={roomName} onChange={e => setRoomName(e.target.value)}
              placeholder="Room name…" className="field flex-1" />
            <input value={roomDesc} onChange={e => setRoomDesc(e.target.value)}
              placeholder="What's it about?" className="field flex-1" />
            <button onClick={createRoom} className="btn-primary whitespace-nowrap px-6">Create room</button>
          </div>
        )}

        {rooms.length === 0 ? (
          <div className="text-center py-20 text-[var(--c-muted)]">
            <p className="text-5xl mb-4">🌸</p>
            <p>No rooms yet. Create the first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {rooms.map((room, i) => (
              <div key={room._id} className="room-card p-6" onClick={() => setSelected(room._id)}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                  {initials(room.name)}
                </div>
                <h3 className="font-semibold text-[var(--c-ink)] mb-1 text-sm">{room.name}</h3>
                <p className="text-xs text-[var(--c-muted)] leading-relaxed mb-4">{room.description}</p>
                <div className="text-xs font-medium" style={{ color: "#8b5cf6" }}>Join conversation →</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ReportModal 
         isOpen={reportConfig.isOpen} 
         onClose={() => setReportConfig({ isOpen: false, type: "", id: "" })} 
         onSubmit={handleReportSubmit} 
         isSubmitting={isSubmittingReport} 
      />
    </div>
  );
}
