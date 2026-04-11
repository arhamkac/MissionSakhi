import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Heart, ThumbsDown, Share2, Flag, ArrowLeft, Send, Trash2 } from "lucide-react";
import { API_BASE } from "../apiConfig";
import ReportModal from "../Components/ReportModal";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [reportConfig, setReportConfig] = useState({ isOpen: false, type: "", id: "" });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const isOwner = user?._id === post?.owner;
  const BASE = API_BASE;
  const auth = { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE}/posts/get-post/${id}`);
      setPost(data.message || data.data);
    } catch (e) {
      console.error(e);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPost(); }, [id]);

  const vote = async (up) => {
    if (!user) { alert("Please sign in to vote"); return; }
    try {
      await axios.post(`${BASE}/vote/toggle-post-vote/${id}?vote=${up}`, {}, auth);
      fetchPost();
    } catch (e) { console.error(e); }
  };

  const submitComment = async () => {
    if (!user) { alert("Please sign in to comment"); return; }
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await axios.post(`${BASE}/comment/post/${id}`, { content: commentText }, auth);
      setCommentText("");
      fetchPost();
    } catch (e) { console.error(e); }
    finally { setSubmittingComment(false); }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${BASE}/comment/delete-comment/${commentId}`, auth);
      fetchPost();
    } catch (e) { console.error(e); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, text: "Check out this post on MissionSakhi", url });
      } catch (err) { console.error(err); }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const openReport = (type, targetId) => {
    if (!user) { alert("Please sign in to report"); return; }
    setReportConfig({ isOpen: true, type, id: targetId });
  };

  const handleReportSubmit = async (selectedType, content) => {
    setIsSubmittingReport(true);
    try {
      await axios.post(`${BASE}/report/${reportConfig.type}/${reportConfig.id}`, { type: selectedType, content }, auth);
      alert("Report submitted successfully");
      setReportConfig({ isOpen: false, type: "", id: "" });
    } catch (e) { console.error(e); alert("Failed to report"); }
    finally { setIsSubmittingReport(false); }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="page flex items-center justify-center min-h-screen"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
        <p className="text-sm text-[var(--c-muted)]">Loading post…</p>
      </div>
    </div>
  );

  // ── Not Found ────────────────────────────────────────────────────────────
  if (notFound || !post) return (
    <div className="page flex items-center justify-center min-h-screen"
      style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="text-center">
        <p className="text-6xl mb-4">🌸</p>
        <h2 className="text-2xl font-semibold text-[var(--c-ink)] mb-2">Post not found</h2>
        <p className="text-sm text-[var(--c-muted)] mb-6">This post may have been removed or doesn't exist.</p>
        <Link to="/forum" className="btn-primary px-8 py-3">← Back to Forum</Link>
      </div>
    </div>
  );

  // ── Post Detail ──────────────────────────────────────────────────────────
  return (
    <div className="page min-h-screen" style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)" }}>
      <div className="orb w-96 h-96 top-0 left-0 opacity-20"
        style={{ background: "radial-gradient(circle,#f9a8d4,transparent 70%)" }} />
      <div className="orb w-72 h-72 bottom-20 right-0 opacity-15"
        style={{ background: "radial-gradient(circle,#c4b5fd,transparent 70%)", animationDelay: "3s" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

        {/* Back */}
        <Link to="/forum"
          className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-ink)] transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Forum
        </Link>

        {/* Post card */}
        <div className="glass p-8 mb-6 rounded-3xl">
          {/* Categories */}
          {post.category?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category.map(cat => (
                <span key={cat} className="tag tag-purple text-xs">{cat}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--c-ink)] leading-tight mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {post.title}
          </h1>

          {/* Image */}
          {post.image && (
            <img src={post.image} alt={post.title}
              className="w-full rounded-2xl mb-6 object-cover max-h-80" />
          )}

          {/* Content */}
          <p className="text-[var(--c-ink)] leading-relaxed text-sm whitespace-pre-wrap mb-6">
            {post.content}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: "rgba(139,92,246,0.1)" }}>
            <span className="text-xs text-[var(--c-muted)]">
              {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <div className="flex items-center gap-2">
              {/* Upvote */}
              <button onClick={() => vote(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[var(--c-muted)] hover:bg-pink-50 hover:text-pink-500 transition-colors">
                <Heart size={16} />
                <span className="text-xs font-semibold">{post.upvotes || 0}</span>
              </button>
              {/* Downvote */}
              <button onClick={() => vote(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[var(--c-muted)] hover:bg-gray-100 transition-colors">
                <ThumbsDown size={16} />
                <span className="text-xs font-semibold">{post.downvotes || 0}</span>
              </button>
              {/* Share */}
              <button onClick={handleShare}
                className="p-2 rounded-xl text-[var(--c-muted)] hover:bg-gray-100 transition-colors" title="Share">
                <Share2 size={16} />
              </button>
              {/* Report */}
              {user && user._id !== post.owner && (
                <button onClick={() => openReport("post", post._id)}
                  className="p-2 rounded-xl text-[var(--c-muted)] hover:bg-rose-50 hover:text-rose-500 transition-colors" title="Report">
                  <Flag size={16} />
                </button>
              )}

              {isOwner && (
               <button
                onClick={() => console.log("delete post")}
                className="p-2 rounded-xl text-[var(--c-muted)] hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
               </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="glass p-6 rounded-3xl">
          <h2 className="text-lg font-semibold text-[var(--c-ink)] mb-5">
            💬 {post.comments?.length || 0} Comments
          </h2>

          {/* Comment input */}
          {user ? (
            <div className="flex gap-3 mb-6">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a thoughtful comment…"
                rows={2}
                className="field flex-1 resize-none text-sm"
              />
              <button onClick={submitComment} disabled={submittingComment || !commentText.trim()}
                className="btn-primary px-4 py-2 self-end flex items-center gap-2 disabled:opacity-50">
                <Send size={14} />
              </button>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-2xl text-center text-sm text-[var(--c-muted)]"
              style={{ background: "rgba(139,92,246,0.05)", border: "1px dashed rgba(139,92,246,0.2)" }}>
              <Link to="/login" className="text-violet-500 font-medium hover:underline">Sign in</Link> to leave a comment
            </div>
          )}

          {/* Comment list */}
          {post.comments?.length === 0 ? (
            <p className="text-sm text-center text-[var(--c-muted)] py-8">
              No comments yet. Be the first to share your thoughts! 🌸
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {post.comments.map(c => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                    {(c.postedByUser?.nickname || c.postedByUser?.username || "A")[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[var(--c-ink)]">
                        {c.postedByUser?.nickname || c.postedByUser?.username || "Anonymous"}
                      </span>
                      <span className="text-xs text-[var(--c-muted)]">
                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        {user?._id === c.postedBy?.toString() && (
                          <button onClick={() => deleteComment(c._id)}
                            className="text-xs text-[var(--c-muted)] hover:text-rose-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        )}
                        {user && user._id !== c.postedBy?.toString() && (
                          <button onClick={() => openReport("comment", c._id)}
                            className="text-xs text-[var(--c-muted)] hover:text-rose-500 transition-colors">Report</button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--c-ink)] leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
