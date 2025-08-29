import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export default function Anonymous_Forum() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentContent, setCommentContent] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const BASE_URL = "https://missionsakhi.onrender.com/api/posts";

  const fetchMyPosts = async () => {
    if (!user) return;

    try {
      const { data } = await axios.get(`${BASE_URL}/get-posts?owner=${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const postsArray = Array.isArray(data.message) ? data.message : data.message.posts || [];

      const postsWithMyCommentsAndVotes = await Promise.all(
        postsArray.map(async (post) => {
          try {
            const { data: commentData } = await axios.get(
              `${BASE_URL}/comment/get/${post._id}?owner=${user._id}`,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            const { data: voteData } = await axios.get(
              `${BASE_URL}/vote/get/${post._id}?owner=${user._id}`,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            return {
              ...post,
              comments: commentData.data.comments || [],
              upvotes: voteData.data.upvotes || 0,
              downvotes: voteData.data.downvotes || 0,
            };
          } catch {
            return { ...post, comments: [], upvotes: 0, downvotes: 0 };
          }
        })
      );

      setPosts(postsWithMyCommentsAndVotes);
    } catch (err) {
      console.error("Fetch posts error:", err.response?.data || err.message);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  const handleUploadPost = async () => {
    if (!user || !newContent.trim()) return alert("Post content is required");

    const formData = new FormData();
    formData.append("content", newContent);
    if (newImage) formData.append("image", newImage);

    try {
      const { data } = await axios.post(`${BASE_URL}/upload-post`, formData, {
        headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "multipart/form-data" },
      });
      setPosts([data.message, ...posts]);
      setNewContent("");
      setNewImage(null);
    } catch (err) {
      console.error("Upload post error:", err.response?.data || err.message);
    }
  };

  const handleEditPost = async (postId) => {
    if (!editingContent.trim()) return;
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/update-post/${postId}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPosts(posts.map((p) => (p._id === postId ? data.message : p)));
      setEditingPostId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Edit post error:", err.response?.data || err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${BASE_URL}/delete-post/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete post error:", err.response?.data || err.message);
    }
  };

  const handleVotePost = async (postId, isUpvote) => {
    if (!user) return alert("Login to vote");
    try {
      await axios.post(
        `${BASE_URL}/vote/toggle-post-vote/${postId}?vote=${isUpvote}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchMyPosts();
    } catch (err) {
      console.error("Vote error:", err.response?.data || err.message);
    }
  };

  const handlePostComment = async (postId) => {
    if (!user || !commentContent[postId]?.trim()) return alert("Comment content is required");
    try {
      const { data } = await axios.post(
        `${BASE_URL}/comment/${postId}`,
        { content: commentContent[postId] },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPosts(posts.map((p) => (p._id === postId ? { ...p, comments: [data.message, ...(p.comments || [])] } : p)));
      setCommentContent({ ...commentContent, [postId]: "" });
    } catch (err) {
      console.error("Post comment error:", err.response?.data || err.message);
    }
  };

  const handleEditComment = async (postId, commentId) => {
    if (!editingCommentContent.trim()) return;
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/comment/update/${commentId}`,
        { content: editingCommentContent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPosts(
        posts.map((p) =>
          p._id === postId
            ? { ...p, comments: p.comments.map((c) => (c._id === commentId ? data.message : c)) }
            : p
        )
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (err) {
      console.error("Edit comment error:", err.response?.data || err.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${BASE_URL}/comment/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(posts.map((p) => (p._id === postId ? { ...p, comments: p.comments.filter((c) => c._id !== commentId) } : p)));
    } catch (err) {
      console.error("Delete comment error:", err.response?.data || err.message);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative">
      <main className="relative z-10 min-h-screen p-6 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 max-w-4xl w-full">
          <div className="bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Anonymous Forum
            </h1>
            <p className="text-gray-700 text-lg font-medium max-w-2xl mx-auto">
              Your safe space to share, connect, and empower each other ✨
            </p>
          </div>
        </div>

        {/* New Post */}
        {user && (
          <div className="max-w-4xl w-full mb-8 bg-white/50 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Share something..."
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none transition-all duration-200"
              rows={4}
            />
            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="mt-2"
            />
            <button
              onClick={handleUploadPost}
              className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform duration-200"
            >
              Post
            </button>
          </div>
        )}

        {/* Posts List */}
        <div className="max-w-4xl w-full space-y-6">
          {posts.length === 0 && (
            <p className="text-center text-gray-500">No posts yet.</p>
          )}

          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {editingPostId === post._id ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditPost(post._id)}
                      className="text-green-600 font-medium hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPostId(null)}
                      className="text-red-500 font-medium hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mb-3">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="post"
                      className="rounded-2xl max-h-80 object-cover mb-3 w-full"
                    />
                  )}

                  {/* Votes */}
                  <div className="flex gap-3 items-center mb-3">
                    <button
                      onClick={() => handleVotePost(post._id, true)}
                      className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors duration-200"
                    >
                      👍 {post.upvotes}
                    </button>
                    <button
                      onClick={() => handleVotePost(post._id, false)}
                      className="px-3 py-1 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors duration-200"
                    >
                      👎 {post.downvotes}
                    </button>
                  </div>

                  {/* Edit/Delete */}
                  {user && post.sender === user._id && (
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      <button
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditingContent(post.content);
                        }}
                        className="hover:text-purple-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="hover:text-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Comments */}
                  <div className="pl-4 border-l border-gray-300 space-y-2">
                    {(post.comments || []).map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-50 p-3 rounded-xl flex justify-between items-center hover:bg-gray-100 transition-all duration-200"
                      >
                        {editingCommentId === comment._id ? (
                          <div className="flex gap-2 w-full">
                            <input
                              value={editingCommentContent}
                              onChange={(e) =>
                                setEditingCommentContent(e.target.value)
                              }
                              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-purple-400 outline-none"
                            />
                            <button
                              onClick={() =>
                                handleEditComment(post._id, comment._id)
                              }
                              className="text-green-600 font-medium hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="text-red-500 font-medium hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span>{comment.content}</span>
                            {user && comment.postedBy === user._id && (
                              <div className="flex gap-2 text-xs text-gray-500">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditingCommentContent(comment.content);
                                  }}
                                  className="hover:text-purple-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(post._id, comment._id)
                                  }
                                  className="hover:text-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}

                    {/* Add comment */}
                    {user && (
                      <div className="flex gap-2 mt-2">
                        <input
                          placeholder="Add a comment..."
                          value={commentContent[post._id] || ""}
                          onChange={(e) =>
                            setCommentContent({
                              ...commentContent,
                              [post._id]: e.target.value,
                            })
                          }
                          className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                        <button
                          onClick={() => handlePostComment(post._id)}
                          className="bg-purple-500 text-white px-4 py-1 rounded-lg font-medium hover:bg-purple-600 transition-colors duration-200"
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
