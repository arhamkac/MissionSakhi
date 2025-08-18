"use client"

import { useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const googleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Google login successful:", credentialResponse)
      alert("Welcome back! Google login successful.")
    },
    onError: () => {
      console.log("Google login failed")
      alert("Oops, something went wrong with Google login. Try again?")
    },
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login attempt:", formData)
    alert("Login functionality would connect to your backend here!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        
        <div
          className="absolute top-24 left-8 w-7 h-7 lg:w-9 lg:h-9 bg-pink-300/25 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s", animationDuration: "3.8s" }}
        ></div>
        <div
          className="absolute top-36 right-24 w-5 h-5 lg:w-7 lg:h-7 bg-purple-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "1.3s", animationDuration: "4.2s" }}
        ></div>
        <div
          className="absolute bottom-44 left-16 w-9 h-9 lg:w-11 lg:h-11 bg-rose-300/20 rounded-full animate-bounce"
          style={{ animationDelay: "2.2s", animationDuration: "3.1s" }}
        ></div>
        <div
          className="absolute bottom-24 right-12 w-6 h-6 lg:w-8 lg:h-8 bg-pink-400/35 rounded-full animate-bounce"
          style={{ animationDelay: "0.7s", animationDuration: "4.7s" }}
        ></div>
        <div
          className="absolute top-1/3 left-6 w-4 h-4 bg-purple-200/40 rounded-full animate-pulse"
          style={{ animationDelay: "1.8s", animationDuration: "2.6s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-3 h-3 bg-rose-200/45 rounded-full animate-pulse"
          style={{ animationDelay: "2.5s", animationDuration: "3.3s" }}
        ></div>

       
        <div
          className="absolute top-28 right-36 w-11 h-11 lg:w-13 lg:h-13 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg rotate-45 animate-pulse opacity-18 transform-gpu"
          style={{ animationDuration: "2.4s", transform: "rotate(43deg)" }}
        ></div>
        <div
          className="absolute bottom-36 left-28 w-13 h-13 lg:w-17 lg:h-17 bg-gradient-to-br from-rose-300 to-purple-300 rounded-full animate-pulse opacity-14 transform-gpu"
          style={{ animationDuration: "3.7s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/3 w-5 h-5 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg rotate-12 animate-pulse opacity-26"
          style={{ animationDuration: "2.1s", transform: "rotate(18deg)" }}
        ></div>
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl transform rotate-2 hidden sm:block"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-purple-100/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl transform -rotate-2 hidden sm:block"></div>

        
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 transform hover:shadow-3xl transition-all duration-500"
        >
          <div className="absolute top-4 left-4 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-pink-400 rounded-full animate-pulse hidden sm:block opacity-70"></div>
          <div
            className="absolute top-6 right-3 sm:top-7 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse hidden sm:block opacity-60"
            style={{ animationDelay: "0.8s" }}
          ></div>
          <div
            className="absolute bottom-5 left-3 sm:bottom-6 sm:left-4 w-2 h-2 sm:w-3 sm:h-3 bg-rose-400 rounded-full animate-pulse hidden sm:block opacity-80"
            style={{ animationDelay: "1.4s" }}
          ></div>
          <div
            className="absolute bottom-3 right-5 sm:bottom-4 sm:right-6 w-1 h-1 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-pulse hidden sm:block opacity-50"
            style={{ animationDelay: "1.9s" }}
          ></div>

          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-lg">
              Welcome back!
            </h1>
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-2"></div>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">We missed you</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Your username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                placeholder="What should we call you?"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Your secret password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 sm:h-12 lg:h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Let's go!
          </button>

          <p className="text-xs sm:text-sm text-center text-gray-600">
            New here?
            <a
              href="/signup"
              className="ml-1 text-purple-600 hover:text-pink-600 font-medium transition-colors duration-300"
            >
              Join our community
            </a>
          </p>

          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-3 sm:px-4 text-xs sm:text-sm text-gray-500 bg-white/50 rounded-full">
              or continue with
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={googleLogin}
              className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl border border-white/50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <span className="font-medium">Quick sign in with Google</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              Your privacy matters to us. We'll never share your information or spam you.
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default Login
