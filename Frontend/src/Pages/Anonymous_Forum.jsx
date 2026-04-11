import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Heart, ThumbsDown, MessageCircle, Share2, X, MoreHorizontal, Flag, Search } from "lucide-react";
import { API_BASE } from "../apiConfig";
import ReportModal from "../Components/ReportModal";
import GoToTop from "../Components/GoToTop";

const CATEGORIES = [
  "Womens Safety", "Self-Defense & Training", "Legal Help & Rights",
  "Harassment & Abuse Support", "Mental Health & Wellness", "Health & Hygiene",
  "Career & Education", "Entrepreneurship & Business", "Relationships & Marriage",
  "Friendship & Community", "Travel & Safety Tips", "Fitness & Sports",
  "Parenting & Family", "Self-Love & Confidence", "Fashion & Lifestyle",
  "Art, Culture & Creativity", "Technology & Learning", "Finance & Money Management",
  "News & Awareness", "Open Mic (Anything Goes)"
];

export default function Anonymous_Forum() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("query") || "";
  });
  const [isSearching, setIsSearching] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newCategory, setNewCategory] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [commentText, setCommentText] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [reportConfig, setReportConfig] = useState({ isOpen: false, type: "", id: "" });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const BASE = API_BASE;
  const auth = { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } };

  const fetchPosts = async (query = "") => {
    try {
      const queryString = query.trim() ? `?query=${encodeURIComponent(query.trim())}` : "";
      const { data } = await axios.get(`${BASE}/posts/get-posts${queryString}`);
      setPosts(Array.isArray(data.data) ? data.data : data.message?.posts || []);
    } catch (e) {
      console.error(e);
      setPosts([]);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query") || "";
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [location.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSearching(true);
      fetchPosts(searchQuery).finally(() => setIsSearching(false));
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
  const saved = localStorage.getItem("forumDraft");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setNewTitle(parsed.title || "");
      setNewContent(parsed.content || "");
      setShowComposer(true);
    } catch (e) {
      localStorage.removeItem("forumDraft");
    }
  }
}, []);

  const upload = async () => {
    if (!user || !newTitle.trim() || !newContent.trim() || newCategory.length === 0) {
      alert("Please fill in title, content, and select at least one category");
      return;
    }
    const fd = new FormData();
    fd.append("title", newTitle);
    fd.append("content", newContent);
    fd.append("category", JSON.stringify(newCategory));
    if (newImage) fd.append("image", newImage);
    try {
      const { data } = await axios.post(`${BASE}/posts/upload-post`, fd,
        { headers: { ...auth.headers, "Content-Type": "multipart/form-data" } });
      setPosts(p => [data.message, ...p]);
      setNewTitle(""); setNewContent(""); setNewImage(null); setNewCategory([]);
      localStorage.removeItem("forumDraft"); 
      setShowComposer(false);
    } catch (e) { 
      alert(e.response?.data?.message || "Error uploading post");
      console.error(e); 
    }
  };

  const editPost = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content cannot be empty");
      return;
    }
    try {
      const { data } = await axios.patch(`${BASE}/posts/update-post/${id}`, 
        { title: editTitle, content: editContent }, auth);
      setPosts(p => p.map(x => x._id === id ? data.message : x));
      setEditPostId(null); setEditTitle(""); setEditContent("");
    } catch (e) { 
      alert(e.response?.data?.message || "Error updating post");
      console.error(e); 
    }
  };

  const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${BASE}/posts/delete-post/${id}`, auth);
      setPosts(p => p.filter(x => x._id !== id));
    } catch (e) { 
      alert(e.response?.data?.message || "Error deleting post");
      console.error(e); 
    }
  };

  const vote = async (id, up) => {
    if (!user) { alert("Please login to vote"); return; }
    const wasVote = userVotes[id];
    const newVote = wasVote === (up ? 'up' : 'down') ? null : (up ? 'up' : 'down');

    // Optimistic update — change UI immediately
    setUserVotes(v => ({ ...v, [id]: newVote }));
    setPosts(prev => prev.map(p => {
      if (p._id !== id) return p;
      let ups = p.upvotes || 0;
      let downs = p.downvotes || 0;
      // remove previous vote
      if (wasVote === 'up') ups--;
      if (wasVote === 'down') downs--;
      // add new vote
      if (newVote === 'up') ups++;
      if (newVote === 'down') downs++;
      return { ...p, upvotes: ups, downvotes: downs };
    }));

    try {
      await axios.post(`${BASE}/vote/toggle-post-vote/${id}?vote=${up}`, {}, auth);
    } catch (e) {
      // Rollback on failure
      console.error(e);
      setUserVotes(v => ({ ...v, [id]: wasVote }));
      setPosts(prev => prev.map(p => {
        if (p._id !== id) return p;
        let ups = p.upvotes || 0;
        let downs = p.downvotes || 0;
        if (newVote === 'up') ups--;
        if (newVote === 'down') downs--;
        if (wasVote === 'up') ups++;
        if (wasVote === 'down') downs++;
        return { ...p, upvotes: ups, downvotes: downs };
      }));
    }
  };

  const addComment = async (postId) => {
    if (!user || !commentText[postId]?.trim()) return;
    try {
      const { data } = await axios.post(`${BASE}/comment/post/${postId}`, { content: commentText[postId] }, auth);
      setPosts(p => p.map(x => x._id === postId ? { ...x, comments: [data.message, ...(x.comments || [])] } : x));
      setCommentText(t => ({ ...t, [postId]: "" }));
    } catch (e) { console.error(e); }
  };

  const editComment = async (postId, commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const { data } = await axios.patch(`${BASE}/comment/update/${commentId}`, { content: editCommentText }, auth);
      setPosts(p => p.map(x => x._id === postId
        ? { ...x, comments: x.comments.map(c => c._id === commentId ? data.message : c) } : x));
      setEditCommentId(null); setEditCommentText("");
    } catch (e) { console.error(e); }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${BASE}/comment/delete/${commentId}`, auth);
      setPosts(p => p.map(x => x._id === postId
        ? { ...x, comments: x.comments.filter(c => c._id !== commentId) } : x));
    } catch (e) { console.error(e); }
  };

  const openReport = (type, id) => {
    if (!user) { alert("Please login to report"); return; }
    setReportConfig({ isOpen: true, type, id });
  };

  const handleReportSubmit = async (selectedType, content) => {
    setIsSubmittingReport(true);
    try {
      await axios.post(`${BASE}/report/${reportConfig.type}/${reportConfig.id}`, 
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

  const handleShare = async (postId, title) => {
    const url = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Check out this post on MissionSakhi",
          url: url
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return (
    <div className="page flex items-center justify-center min-h-screen"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="glass p-8 text-center">
        <div className="spinner mx-auto mb-3" style={{ borderTopColor: "#8b5cf6", borderColor: "rgba(139,92,246,0.2)", width: "2rem", height: "2rem" }} />
        <p className="text-sm text-[var(--c-muted)]">Loading stories…</p>
      </div>
    </div>
  );

  return (
    <div className="page min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-96 h-96 top-0 right-0 opacity-20"
        style={{ background: "radial-gradient(circle,#e879f9,transparent 70%)" }} />
      <div className="orb w-80 h-80 bottom-0 left-0 opacity-15"
        style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl sm:text-6xl font-light grad-text"
                style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300, marginBottom: "0.5rem" }}>
                Stories
              </h1>
              <p className="text-[var(--c-muted)] text-sm">Safe, anonymous, and real</p>
            </div>
            <div className="text-5xl">✨</div>
          </div>

          <div className="glass p-4 rounded-3xl mb-8" style={{ backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(139,92,246,0.14)" }}>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={18} className="absolute right-11 top-1/2 -translate-y-1/2 text-[var(--c-muted)]" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search stories, tags, or support topics..."
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
                  <span>{searchQuery.trim() ? `${posts.length} result${posts.length === 1 ? "" : "s"}` : "Showing all stories"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Post Button / Composer */}
        {user ? (
          <>
            {!showComposer ? (
              <button onClick={() => setShowComposer(true)} 
                className="w-full mb-8 p-4 rounded-2xl transition-all duration-200 hover:shadow-lg"
                style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-[var(--c-muted)] text-sm">What's on your mind?</span>
                </div>
              </button>
            ) : (
              <div className="mb-8 rounded-3xl overflow-hidden" style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 10px 40px rgba(139,92,246,0.1)" }}>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-[var(--c-ink)]">Create a new story</p>
                    <button onClick={() => setShowComposer(false)} className="p-1 hover:bg-gray-100 rounded-full">
                      <X size={20} className="text-[var(--c-muted)]" />
                    </button>
                  </div>
                  
                  <input type="text" placeholder="Give your story a title…" value={newTitle} 
onChange={e => {
  setNewTitle(e.target.value);
  localStorage.setItem("forumDraft", JSON.stringify({
    title: e.target.value,
    content: newContent
  }));
}}                    className="field mb-3 font-medium text-base placeholder:text-[var(--c-muted)] border-0 bg-gray-50 rounded-xl focus:bg-white" />
                  
                  <textarea value={newContent}onChange={e => {
  setNewContent(e.target.value);
  localStorage.setItem("forumDraft", JSON.stringify({
    title: newTitle,
    content: e.target.value
  }));
}}
                    placeholder="Share something… your wins, your struggles, your truth 💜" 
                    className="field resize-none mb-4 min-h-28 border-0 bg-gray-50 rounded-xl focus:bg-white" />
                  
                  {newImage && (
                    <div className="mb-4 relative">
                      <img src={URL.createObjectURL(newImage)} alt="preview" className="w-full max-h-48 object-cover rounded-xl" />
                      <button onClick={() => setNewImage(null)} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full">
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-[var(--c-muted)] uppercase mb-3">Select categories</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                      {CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer text-xs hover:text-violet-600 transition-colors p-1 rounded hover:bg-white">
                          <input type="checkbox" checked={newCategory.includes(cat)} 
                            onChange={e => {
                              if (e.target.checked) {
                                setNewCategory([...newCategory, cat]);
                              } else {
                                setNewCategory(newCategory.filter(c => c !== cat));
                              }
                            }} className="rounded w-3.5 h-3.5 accent-violet-600"/>
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "rgba(139,92,246,0.1)" }}>
                    <label className="text-xs text-[var(--c-muted)] cursor-pointer hover:text-violet-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                      <span>🖼️</span>
                      <span>Add photo</span>
                      <input type="file" className="hidden" onChange={e => setNewImage(e.target.files[0])} accept="image/*" />
                    </label>
                    <button onClick={upload} className="ml-auto btn-primary text-sm px-8 py-2.5 rounded-lg">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mb-8 p-6 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <p className="text-[var(--c-muted)] text-sm"><Link to="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link> to share your story</p>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🌸</p>
              <p className="text-[var(--c-muted)] font-medium">No stories yet</p>
              <p className="text-[var(--c-muted)] text-sm">Be the first to share yours</p>
            </div>
          )}

          {posts.map(post => {
            const isOwner = user?._id === post.owner?._id;
            const userVote = userVotes[post._id];
            
            return (
              <div key={post._id} className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg"
                style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 2px 8px rgba(139,92,246,0.08)" }}>
                
                {/* Post Header */}
                <div className="p-4 sm:p-5 border-b" style={{ borderColor: "rgba(139,92,246,0.08)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 text-lg"
                        style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                        A
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--c-ink)]">Anonymous</p>
                        <p className="text-xs text-[var(--c-muted)]">Shared anonymously</p>
                      </div>
                    </div>
                    {user && user._id === post.owner && (
                      <div className="relative group">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreHorizontal size={18} className="text-[var(--c-muted)]" />
                        </button>
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-20">
                          <button onClick={() => { setEditPostId(post._id); setEditTitle(post.title); setEditContent(post.content); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-violet-600 hover:bg-gray-50 transition-colors">Edit</button>
                          <button onClick={() => deletePost(post._id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-gray-50 transition-colors border-t" style={{ borderColor: "rgba(0,0,0,0.05)" }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                {post.category && post.category.length > 0 && (
                  <div className="px-4 sm:px-5 pt-3 pb-2 flex flex-wrap gap-1.5">
                    {post.category.slice(0, 2).map(cat => (
                      <span key={cat} className="text-xs px-2.5 py-1 rounded-full font-medium" 
                        style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
                        {cat}
                      </span>
                    ))}
                    {post.category.length > 2 && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" 
                        style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
                        +{post.category.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Edit Mode or Display */}
                {editPostId === post._id ? (
                  <div className="p-4 sm:p-5 space-y-3">
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                      className="field font-semibold text-lg border-0 bg-gray-50 rounded-xl focus:bg-white" />
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                      className="field resize-none min-h-24 border-0 bg-gray-50 rounded-xl focus:bg-white" />
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => editPost(post._id)} className="btn-primary text-sm px-6 py-2 rounded-lg">Save</button>
                      <button onClick={() => setEditPostId(null)} className="text-sm px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="px-4 sm:px-5 pt-4 pb-3 cursor-pointer"
                    onClick={() => navigate(`/post/${post._id}`)}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--c-ink)] mb-2 leading-snug hover:text-violet-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[var(--c-ink)] leading-relaxed text-sm sm:text-base line-clamp-6">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Image */}
                {post.image && editPostId !== post._id && (
                  <div className="w-full max-h-96 bg-gray-100 relative z-0">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Actions Bar */}
                <div className="px-4 sm:px-5 py-3 border-t relative z-10" style={{ borderColor: "rgba(139,92,246,0.08)" }}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => vote(post._id, true)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-200 ${userVote === 'up' ? 'bg-red-50 text-red-600' : 'text-[var(--c-muted)] hover:bg-red-50 hover:text-red-600'}`}>
                        <Heart size={18} fill={userVote === 'up' ? '#ec4899' : 'none'}
                          className={userVote === 'up' ? 'text-red-600' : 'text-current'} />
                        <span className="text-xs font-semibold">{post.upvotes || 0}</span>
                      </button>
                      <button onClick={() => vote(post._id, false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-200 ${userVote === 'down' ? 'bg-sky-50 text-sky-600' : 'text-[var(--c-muted)] hover:bg-sky-50 hover:text-sky-600'}`}>
                        <ThumbsDown size={18} className={userVote === 'down' ? 'text-sky-600' : 'text-current'} />
                        <span className="text-xs font-semibold">{post.downvotes || 0}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setExpandedComments(e => ({ ...e, [post._id]: !e[post._id] }))}
                        className="flex items-center gap-2 px-3 py-2 rounded-2xl text-[var(--c-muted)] hover:bg-violet-50 hover:text-violet-600 transition-all">
                        <MessageCircle size={18} />
                        <span className="text-xs font-semibold">{post.comments?.length || 0}</span>
                      </button>
                      <button onClick={() => handleShare(post._id, post.title)} className="p-2 rounded-2xl text-[var(--c-muted)] hover:bg-gray-100 transition-colors" title="Share Post">
                        <Share2 size={16} />
                      </button>
                      <button onClick={() => openReport('post', post._id)} className="p-2 rounded-2xl text-[var(--c-muted)] hover:bg-rose-50 hover:text-rose-500 transition-colors" title="Report Post">
                        <Flag size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments[post._id] && (
                  <div className="px-4 sm:px-5 py-4 border-t" style={{ borderColor: "rgba(139,92,246,0.08)", background: "rgba(139,92,246,0.02)" }}>
                    <div className="space-y-3 mb-4">
                      {(post.comments && post.comments.length > 0) ? (
                        post.comments.map(c => (
                          <div key={c._id} className="flex gap-2">
                            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold text-lg"
                              style={{ background: "linear-gradient(135deg,#c084fc,#f472b6)" }}>A</div>
                            <div className="flex-1 min-w-0">
                              {editCommentId === c._id ? (
                                <div className="flex gap-2">
                                  <input value={editCommentText} onChange={e => setEditCommentText(e.target.value)}
                                    className="field flex-1 py-2 text-xs border-0 bg-white rounded-lg" />
                                  <button onClick={() => editComment(post._id, c._id)} className="text-violet-600 text-xs font-medium px-3 py-1 hover:bg-gray-50 rounded">Save</button>
                                  <button onClick={() => setEditCommentId(null)} className="text-rose-400 text-xs font-medium px-2">✕</button>
                                </div>
                              ) : (
                                <div className="bg-gray-50 rounded-lg p-2.5">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="text-xs font-semibold text-[var(--c-ink)]">Anonymous</p>
                                    {user?._id === c.postedBy && (
                                      <div className="flex gap-1.5">
                                        <button onClick={() => { setEditCommentId(c._id); setEditCommentText(c.content); }}
                                          className="text-xs text-[var(--c-muted)] hover:text-violet-600">Edit</button>
                                        <button onClick={() => deleteComment(post._id, c._id)}
                                          className="text-xs text-[var(--c-muted)] hover:text-rose-500">Delete</button>
                                      </div>
                                    )}
                                    {user && user?._id !== c.postedBy && (
                                       <button onClick={() => openReport('comment', c._id)} className="text-xs text-[var(--c-muted)] hover:text-rose-500">Report</button>
                                    )}
                                  </div>
                                  <p className="text-xs text-[var(--c-ink)] leading-relaxed break-words">{c.content}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-[var(--c-muted)]">No comments yet</p>
                      )}
                    </div>

                    {/* Add Comment Input */}
                    {user ? (
                      <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "rgba(139,92,246,0.08)" }}>
                        <input placeholder="Add a comment…"
                          value={commentText[post._id] || ""}
                          onChange={e => setCommentText(t => ({ ...t, [post._id]: e.target.value }))}
                          className="field flex-1 py-2 text-xs border-0 bg-gray-50 rounded-lg focus:bg-white" />
                        <button onClick={() => addComment(post._id)} className="btn-primary text-xs px-5 py-2 rounded-lg">Reply</button>
                      </div>
                    ) : (
                      <div className="pt-3 border-t text-center" style={{ borderColor: "rgba(139,92,246,0.08)" }}>
                        <p className="text-[var(--c-muted)] text-xs"><Link to="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link> to add a comment</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <GoToTop />

      <ReportModal 
         isOpen={reportConfig.isOpen} 
         onClose={() => setReportConfig({ isOpen: false, type: "", id: "" })} 
         onSubmit={handleReportSubmit} 
         isSubmitting={isSubmittingReport} 
      />
    </div>
  );
}
