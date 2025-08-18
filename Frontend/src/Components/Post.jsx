"use client"

import { useState } from "react"

function Post() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Finally found my voice here 💪",
      content:
        "Okay, so this might sound cheesy but I literally just had a breakthrough moment. I've been lurking here for weeks (sorry lol) and reading everyone's stories gave me the courage to finally speak up about something at work that was really bothering me. Like, I actually did it! I walked into my boss's office and had that conversation I'd been avoiding for months. This community is honestly magic - you all make me feel like I can do anything. Thank you for being so real and supportive. I'm still shaking but in a good way! 💕",
      timestamp: "2 hours ago",
      likes: 12,
      replies: 3,
      isLiked: false,
    },
    {
      id: 2,
      title: "One of those days... but we got this 🌙",
      content:
        "Ugh, today was ROUGH. You know those days when everything feels like it's falling apart? Work was chaos, my car made that weird noise again, and I spilled coffee on my favorite shirt (RIP). But then I remembered this amazing community exists and suddenly I don't feel so alone in the mess. Sometimes I think we put so much pressure on ourselves to have it all figured out, but honestly? None of us do, and that's totally okay. We're all just winging it and supporting each other along the way. Love you all 💜",
      timestamp: "4 hours ago",
      likes: 8,
      replies: 5,
      isLiked: false,
    },
    {
      id: 3,
      title: "I DID IT! Got my raise!! 🎉",
      content:
        "GUYS. I can't even believe I'm typing this but I ACTUALLY got the raise I asked for! Like, what?! Three months ago I was too scared to even think about it, but you amazing humans kept telling me to know my worth and ASK FOR IT. So I did my research, practiced my pitch in the mirror (yes really), and went for it. My hands were literally shaking but I did it anyway. The answer was YES! If you're reading this and thinking about asking for what you deserve - DO IT. The worst they can say is no, but they might just say yes. Treating myself to something special tonight! 🥂✨",
      timestamp: "1 day ago",
      likes: 25,
      replies: 7,
      isLiked: false,
    },
  ])

  const [comments] = useState({
    1: [
      {
        id: 1,
        content:
          "OMG yes!! This is exactly what I needed to read today. You're literally so brave and I'm here for it! 💕",
        timestamp: "1 hour ago",
        likes: 5,
        isLiked: false,
      },
      {
        id: 2,
        content:
          "This gave me chills in the best way! I've been putting off a similar conversation and you just inspired me to stop making excuses. Thank you for sharing! 🌟",
        timestamp: "45 minutes ago",
        likes: 3,
        isLiked: false,
      },
      {
        id: 3,
        content:
          "The fact that you went from lurking to taking action is EVERYTHING. This community really does have some kind of magic ✨",
        timestamp: "30 minutes ago",
        likes: 7,
        isLiked: false,
      },
    ],
    2: [
      {
        id: 4,
        content:
          "Sending you the biggest virtual hug right now! Tomorrow's a fresh start and we're all rooting for you 🤗💜",
        timestamp: "3 hours ago",
        likes: 4,
        isLiked: false,
      },
      {
        id: 5,
        content:
          "The coffee shirt tragedy is so relatable it hurts 😭 But seriously, you're not alone in feeling overwhelmed. We've all been there!",
        timestamp: "2 hours ago",
        likes: 6,
        isLiked: false,
      },
    ],
    3: [
      {
        id: 6,
        content:
          "STOP IT I'M SO PROUD OF YOU!! 🎉 I've been putting off this exact conversation for literally 6 months. Your success is giving me life right now!",
        timestamp: "20 hours ago",
        likes: 8,
        isLiked: false,
      },
      {
        id: 7,
        content:
          "The mirror practice is SO real! I do the same thing 😂 Congratulations on knowing your worth and going after it! This is the energy we all need 💪✨",
        timestamp: "18 hours ago",
        likes: 12,
        isLiked: false,
      },
    ],
  })

  const [newPost, setNewPost] = useState("")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [showReplies, setShowReplies] = useState({})
  const [replyText, setReplyText] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPost.trim() && newPostTitle.trim()) {
      const post = {
        id: posts.length + 1,
        title: newPostTitle,
        content: newPost,
        timestamp: "Just now",
        likes: 0,
        replies: 0,
        isLiked: false,
      }
      setPosts([post, ...posts])
      setNewPost("")
      setNewPostTitle("")
    }
  }

  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post,
      ),
    )
  }

  const toggleReplies = (id) => {
    setShowReplies((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newPosts = [
        {
          id: posts.length + 1,
          title: "Book rec: Untamed changed my life 📚",
          content:
            "Okay so I just finished 'Untamed' by Glennon Doyle and I'm SHOOK. Like, where has this book been all my life?! It completely flipped my perspective on what it means to live authentically. I kept highlighting passages and texting quotes to my friends (they're probably sick of me by now lol). Anyone else read it? Or have similar book recs? I'm on this whole personal growth kick and need more books that'll make me question everything in the best way possible 📖✨",
          timestamp: "2 days ago",
          likes: 15,
          replies: 4,
          isLiked: false,
        },
        {
          id: posts.length + 2,
          title: "Started my own business!! Scared but excited 🚀",
          content:
            "Plot twist: I'm officially a business owner now! 😱 Launched my handmade jewelry line from my tiny apartment studio (aka my kitchen table lol). The imposter syndrome is REAL - like who am I to think I can do this? But also... why NOT me? I've been making jewelry as a hobby for years and people kept asking where they could buy pieces. So here we are! It's terrifying and exhilarating and I have no idea what I'm doing half the time. Any fellow entrepreneurs in here? Would love to connect and maybe panic together 😂💎",
          timestamp: "3 days ago",
          likes: 20,
          replies: 8,
          isLiked: false,
        },
      ]
      setPosts((prev) => [...prev, ...newPosts])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      {/* 3D Floating Elements with more organic positioning and timing */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div
          className="absolute top-24 left-12 w-7 h-7 lg:w-9 lg:h-9 bg-pink-300/25 rounded-full animate-bounce"
          style={{ animationDelay: "0.3s", animationDuration: "3.7s" }}
        ></div>
        <div
          className="absolute top-44 right-16 w-5 h-5 lg:w-7 lg:h-7 bg-purple-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "1.4s", animationDuration: "4.1s" }}
        ></div>
        <div
          className="absolute bottom-36 left-20 w-9 h-9 lg:w-11 lg:h-11 bg-rose-300/20 rounded-full animate-bounce"
          style={{ animationDelay: "2.3s", animationDuration: "3.2s" }}
        ></div>
        <div
          className="absolute bottom-28 right-8 w-6 h-6 lg:w-8 lg:h-8 bg-pink-400/35 rounded-full animate-bounce"
          style={{ animationDelay: "0.9s", animationDuration: "4.6s" }}
        ></div>
        <div
          className="absolute top-1/3 left-8 w-4 h-4 bg-purple-200/40 rounded-full animate-pulse"
          style={{ animationDelay: "1.7s", animationDuration: "2.8s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-3 h-3 bg-rose-200/45 rounded-full animate-pulse"
          style={{ animationDelay: "2.6s", animationDuration: "3.4s" }}
        ></div>

        {/* 3D Geometric Shapes with slight irregularities */}
        <div
          className="absolute top-32 right-28 w-11 h-11 lg:w-13 lg:h-13 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg rotate-45 animate-pulse opacity-18 transform-gpu"
          style={{ animationDuration: "2.6s", transform: "rotate(48deg)" }}
        ></div>
        <div
          className="absolute bottom-40 left-36 w-13 h-13 lg:w-17 lg:h-17 bg-gradient-to-br from-rose-300 to-purple-300 rounded-full animate-pulse opacity-13 transform-gpu"
          style={{ animationDuration: "3.3s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/3 w-5 h-5 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg rotate-12 animate-pulse opacity-27"
          style={{ animationDuration: "2.4s", transform: "rotate(16deg)" }}
        ></div>
      </div>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto">
        {/* Create Post Section with improved typography */}
        <div className="mb-8 sm:mb-10 lg:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-rose-200/20 rounded-2xl sm:rounded-3xl blur-xl transform scale-110"></div>
          <div className="relative bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-lg mb-2 sm:mb-3 leading-tight">
                What's on your mind? ✨
              </h1>
              <div className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-2 sm:mb-3"></div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Share your story, celebrate wins, or just say hi - this is your safe space 💜
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-xl sm:rounded-2xl blur-lg"></div>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Give your post a catchy title... ✨"
                  className="relative w-full p-4 sm:p-6 border border-white/40 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 bg-white/60 backdrop-blur-md text-sm sm:text-base leading-relaxed shadow-xl transition-all duration-300 placeholder:text-gray-400"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-xl sm:rounded-2xl blur-lg"></div>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Spill the tea, share your wins, vent about your day, ask for advice... whatever you need! This community has your back 💕"
                  className="relative w-full p-4 sm:p-6 border border-white/40 rounded-xl sm:rounded-2xl resize-none h-24 sm:h-32 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 bg-white/60 backdrop-blur-md text-sm sm:text-base leading-relaxed shadow-xl transition-all duration-300 placeholder:text-gray-400"
                  rows={4}
                />
              </div>

              <div className="flex justify-center sm:justify-end pt-2">
                <button
                  type="submit"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 text-sm sm:text-base relative overflow-hidden"
                >
                  <span className="relative z-10">Share with the sisterhood ✨</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Posts Section with improved typography */}
        <div className="space-y-6 sm:space-y-8">
          {posts.map((post, index) => (
            <div key={post.id} className="mb-8 sm:mb-10 lg:mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
              <article className="relative bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                {/* Post Header */}
                <header className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                        A
                      </div>
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-xs animate-bounce"
                        style={{ animationDuration: "2.1s" }}
                      >
                        ✨
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Anonymous Sister</h4>
                      <p className="text-xs sm:text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                </header>

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                    {post.title}
                  </h3>
                </div>

                {/* Post Content */}
                <div className="mb-4 sm:mb-6 relative">
                  <div
                    className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full opacity-30"
                    style={{ transform: "translateX(1px)" }}
                  ></div>
                  <div className="pl-4 sm:pl-6">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{post.content}</p>
                  </div>
                </div>

                {/* Post Actions */}
                <footer className="flex items-center justify-between pt-4 sm:pt-6 border-t border-purple-200/40">
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`group flex items-center space-x-2 transition-all duration-300 transform hover:scale-110 ${
                        post.isLiked ? "text-pink-500 scale-105" : "text-gray-600 hover:text-pink-500"
                      }`}
                    >
                      <span
                        className="text-base sm:text-lg group-hover:animate-bounce"
                        style={{ animationDuration: "0.6s" }}
                      >
                        ❤️
                      </span>
                      <span className="font-semibold text-sm sm:text-base">{post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleReplies(post.id)}
                      className="group flex items-center space-x-2 text-gray-600 hover:text-purple-500 transition-all duration-300 transform hover:scale-110"
                    >
                      <span
                        className="text-base sm:text-lg group-hover:animate-bounce"
                        style={{ animationDuration: "0.8s" }}
                      >
                        💬
                      </span>
                      <span className="font-semibold text-sm sm:text-base">{post.replies}</span>
                    </button>
                  </div>
                </footer>

                {/* Comments Section with improved typography */}
                {showReplies[post.id] && (
                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-purple-200/40">
                    <div className="text-center mb-4 sm:mb-6">
                      <h5 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center">
                        <span className="text-purple-500 mr-2 animate-bounce">💬</span>
                        Comments ({comments[post.id]?.length || 0})
                        <span className="text-purple-500 ml-2 animate-bounce">💬</span>
                      </h5>
                    </div>

                    <div className="space-y-4 mb-4 sm:space-y-6">
                      {comments[post.id]?.map((comment, commentIndex) => (
                        <div key={comment.id} className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105 group-hover:scale-110 transition-all duration-300"></div>
                          <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg flex-shrink-0">
                                A
                              </div>

                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-semibold text-gray-700">Anonymous Friend</span>
                                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                </div>

                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base pl-3 border-l-2 border-purple-300">
                                  {comment.content}
                                </p>

                                <div className="flex items-center space-x-4 pt-2">
                                  <button className="group flex items-center space-x-1 text-gray-500 hover:text-pink-500 transition-all duration-200 transform hover:scale-110">
                                    <span className="text-sm group-hover:animate-bounce">❤️</span>
                                    <span className="text-xs font-semibold">{comment.likes}</span>
                                  </button>
                                  <button className="text-xs text-gray-500 hover:text-purple-500 transition-all duration-200 font-semibold hover:scale-110 transform">
                                    Reply ✨
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Form with improved typography */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-xl sm:rounded-2xl blur-lg"></div>
                      <div className="relative bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                        <div className="flex space-x-3 sm:space-x-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg flex-shrink-0">
                            A
                          </div>
                          <div className="flex-1 space-y-3 sm:space-y-4">
                            <textarea
                              placeholder="Write a supportive reply... Share your thoughts, encouragement, or similar experiences. ✨💕"
                              className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-pink-200/60 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 bg-white/95 resize-none h-16 sm:h-20 leading-relaxed shadow-inner transition-all duration-300 placeholder:text-gray-400"
                              value={replyText[post.id] || ""}
                              onChange={(e) => setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              rows={3}
                            />
                            <div className="flex justify-end">
                              <button className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 relative overflow-hidden">
                                <span className="relative z-10">Post Reply ✨</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            </div>
          ))}
        </div>

        {/* Load More Button with more personality */}
        <div className="text-center pt-6 sm:pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl text-gray-700 font-semibold hover:bg-white/80 transform hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:shadow-purple-500/20 relative overflow-hidden"
          >
            <span className="relative z-10">
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin">✨</span>
                  <span>Loading more stories...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>Show me more stories</span>
                  <span
                    className="group-hover:animate-bounce"
                    style={{ animationDuration: "0.7s", transform: "translateX(-1px)" }}
                  >
                    🌟
                  </span>
                </span>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Post
