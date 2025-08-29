import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    nickname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(formData);
      navigate("/dashboard");
      alert("SignUp successful!");
    } catch (err) {
      console.error("SignUp error:", err);
      setError("SignUp failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSignUp}
          className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl p-8 space-y-4"
        >
          <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            Join Our Community
          </h1>

          {error && (
            <p className="bg-red-100 text-red-600 text-center p-2 rounded-lg">
              {error}
            </p>
          )}

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            placeholder="Nickname (optional)"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-400"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
          >
            Sign Up
          </button>

          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:text-pink-600">
              Sign in
            </a>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  await googleLogin(credentialResponse.credential);
                  navigate("/dashboard");
                } catch (err) {
                  console.error("Google signup error:", err);
                }
              }}
              onError={() => {
                console.log("Google signup failed");
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
