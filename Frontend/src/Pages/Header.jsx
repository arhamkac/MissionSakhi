import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="relative z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-rose-500/80 backdrop-blur-md"></div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400"
        style={{ transform: "scaleY(1.2)" }}
      ></div>

      <div className="relative px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-lg sm:rounded-xl blur-lg transform scale-110 group-hover:scale-125 transition-all duration-300"></div>
            <Link
              to="/"
              className="relative text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 transform hover:scale-105 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <span className="bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                Mission Sakhi
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-4 lg:gap-6 text-sm lg:text-base font-medium items-center">
            <Link
              to="/forum"
              className="relative group text-white hover:text-pink-100 transition-all duration-300 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
            >
              Share Your Story
            </Link>

            <Link
              to="/chatbot"
              className="relative group text-white hover:text-pink-100 transition-all duration-300 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
            >
              Chat with AI Friend
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="relative bg-gradient-to-r from-pink-200/90 to-purple-200/90 backdrop-blur-sm text-purple-700 px-4 lg:px-6 py-2 rounded-full font-semibold hover:from-pink-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/30 text-sm lg:text-base"
              >
                Join Us 💜
              </Link>
            ) : (
              <div className="flex items-center gap-3">
               
                <Link
                  to="/dashboard"
                  className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold"
                >
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </Link>

              
                <button
                  onClick={logout}
                  className="bg-white/20 backdrop-blur-sm text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          
          <button
            onClick={toggleMobileMenu}
            className="md:hidden relative z-10 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                }`}
              ></span>
            </div>
          </button>
        </div>

        
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-purple-500/95 via-pink-500/95 to-rose-500/95 backdrop-blur-md border-t border-white/20 transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <nav className="flex flex-col items-stretch space-y-2 p-4">
            <Link
              to="/forum"
              className="w-full text-center text-white hover:text-pink-100 transition-all duration-300 px-4 py-3 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Share Your Story 💬
            </Link>
            <Link
              to="/chatbot"
              className="w-full text-center text-white hover:text-pink-100 transition-all duration-300 px-4 py-3 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chat with AI Friend 🤖
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="w-full text-center bg-gradient-to-r from-pink-200/90 to-purple-200/90 backdrop-blur-sm text-purple-700 px-4 py-3 rounded-lg font-semibold hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-lg border border-white/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Our Community 💜
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  className="w-full text-center bg-white/20 backdrop-blur-sm text-purple-700 px-4 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    window.location.reload()
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-white/20 backdrop-blur-sm text-purple-700 px-4 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ transform: "translateY(0.5px)" }}
      ></div>
    </header>
  );
}
