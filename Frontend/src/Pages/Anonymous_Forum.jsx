import Post from "../components/Post"

function Anonymous_Forum() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        
        <div
          className="absolute top-20 left-10 w-8 h-8 bg-pink-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-purple-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-10 h-10 bg-rose-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-7 h-7 bg-pink-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        ></div>

        
        <div
          className="absolute top-32 right-32 w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg rotate-45 animate-pulse opacity-20 transform-gpu"
          style={{ animationDuration: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-br from-rose-300 to-purple-300 rounded-full animate-pulse opacity-15 transform-gpu"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <main className="relative z-10 min-h-screen p-6">
        <div className="text-center mb-12 relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-rose-200/20 rounded-3xl blur-xl transform scale-110"></div>
          <div className="relative bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-lg mb-4">
              Anonymous Forum
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
              Your safe space to share, connect, and empower each other ✨
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-3xl shadow-xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 to-purple-100/40 backdrop-blur-sm rounded-3xl shadow-xl transform -rotate-1"></div>

          
          <div className="relative bg-white/50 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-2xl transform hover:shadow-3xl transition-all duration-500">
            
            <div className="absolute top-4 left-4 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            <div
              className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute bottom-4 left-4 w-3 h-3 bg-rose-400 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-4 right-4 w-3 h-3 bg-pink-500 rounded-full animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>

            <div className="relative z-10">
              <Post />
            </div>
          </div>
        </div>

        
        <div className="fixed bottom-8 right-8 flex flex-col gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white text-xl cursor-pointer hover:scale-110 transition-transform duration-300 animate-pulse">
            💬
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white text-lg cursor-pointer hover:scale-110 transition-transform duration-300">
            ❤️
          </div>
        </div>
      </main>

      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default Anonymous_Forum
