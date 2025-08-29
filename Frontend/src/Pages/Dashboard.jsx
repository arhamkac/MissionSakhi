import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">Please login to view dashboard</h2>
      </div>
    );
  }
  const { username, nickname = "", email } = user || {};
  if (!username) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden p-4 sm:p-6 lg:p-8">
      
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div
          className="absolute top-20 left-10 w-6 h-6 lg:w-8 lg:h-8 bg-pink-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "0.3s", animationDuration: "3.2s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-4 h-4 lg:w-6 lg:h-6 bg-purple-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "1.7s", animationDuration: "4.1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-8 h-8 lg:w-10 lg:h-10 bg-rose-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "2.3s", animationDuration: "3.7s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-5 h-5 lg:w-7 lg:h-7 bg-pink-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "0.8s", animationDuration: "4.3s" }}
        ></div>
        <div
          className="absolute top-60 left-1/3 w-3 h-3 bg-purple-200/40 rounded-full animate-pulse"
          style={{ animationDelay: "1.2s", animationDuration: "2.8s" }}
        ></div>
        <div
          className="absolute bottom-60 right-1/3 w-4 h-4 bg-rose-200/35 rounded-full animate-pulse"
          style={{ animationDelay: "2.1s", animationDuration: "3.4s" }}
        ></div>

        <div
          className="absolute top-32 right-32 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg rotate-45 animate-pulse opacity-20 transform-gpu"
          style={{ animationDuration: "2.3s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-rose-300 to-purple-300 rounded-full animate-pulse opacity-15 transform-gpu"
          style={{ animationDuration: "3.1s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/4 w-6 h-6 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg rotate-12 animate-pulse opacity-25"
          style={{ animationDuration: "2.7s" }}
        ></div>
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      
      <div className="relative z-10 max-w-4xl mx-auto">
       
        <div className="mb-8 sm:mb-12">
          <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
              Welcome back, {username}!
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6">Ready to connect with your community?</p>

           
            <Link to="/settings">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                Manage Profile
              </button>
            </Link>
          </div>
        </div>

        
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] p-6 sm:p-8 rounded-2xl relative">
            <div className="absolute top-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {username}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{username.charAt(0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] p-6 sm:p-8 rounded-2xl relative">
            <div
              className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.7s" }}
            ></div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nickname</label>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {nickname}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">@</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] p-6 sm:p-8 rounded-2xl relative">
            <div
              className="absolute top-4 left-4 w-2 h-2 bg-rose-400 rounded-full animate-pulse"
              style={{ animationDelay: "1.4s" }}
            ></div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  {email}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">✉</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard