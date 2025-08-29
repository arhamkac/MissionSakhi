import { useState } from "react"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import { useAuth } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const { login, googleLogin } = useAuth();
  const baseURL="https://missionsakhi.onrender.com"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6"
        >
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              We missed you
            </p>
          </div>

          {error && (
            <p className="bg-red-100 text-red-600 text-center p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg p-3 bg-white/80 border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg p-3 bg-white/80 border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                placeholder="Your secret password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Let’s go!
          </button>

          <p className="text-xs sm:text-sm text-center text-gray-600">
            New here?
            <a
              href="/signup"
              className="ml-1 text-purple-600 hover:text-pink-600 font-medium"
            >
              Join our community
            </a>
          </p>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                // console.log(credentialResponse.credential)
                await googleLogin(credentialResponse.credential);
                navigate("/dashboard");
              } catch (err) {
                console.error("Google login error:", err.message);
              }
            }}
            onError={() => {
              console.log("Google login failed");
            }}
            />

          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
