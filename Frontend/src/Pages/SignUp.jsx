import { useState, useRef } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

function SignUp() {
  const formRef = useRef(null)
  const [userEmail, setUserEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname]=useState("")
  const navigate=useNavigate();
  const {signup}=useAuth();
  const baseUrl="https://missionsakhi.onrender.com/api"

  const googleSignup = useGoogleLogin({
    onSuccess: async(credentialResponse) => {
      console.log("Google signup successful:", credentialResponse)
      const { data } = await axios.post(`${baseUrl}/users/register`, {
        token: credentialResponse.credential,
      });

      alert("Google signup successful!")
    },
    onError: () => {
      console.log("Google signup failed")
      alert("Google signup failed. Please try again.")
    },
  })

  const handleSignUp=async(e)=>{
    e.preventDefault();
    try {
      const response=await signup(
      {
      email: userEmail,
      nickname: nickname, 
      username: username,
      password: password
      }
      )
      alert("SignUp successfull")
      navigate("/dashboard")
      formRef.current.reset();
    } catch (error) {
      console.log("Error in signing up",error)
      alert("SignUp failed")
    }

  }

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSendOTP = (e) => {
    e.preventDefault()
    const otp = generateOTP()

    console.log("Sending OTP:", otp, "to:", userEmail)
    alert("OTP functionality would be implemented here!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
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

      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl transform rotate-2 hidden sm:block"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-purple-100/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl transform -rotate-2 hidden sm:block"></div>

        
        <form
          ref={formRef}
          onSubmit={handleSignUp}
          className="relative bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 transform hover:shadow-3xl transition-all duration-500"
        >
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-pulse hidden sm:block"></div>
          <div
            className="absolute top-6 right-3 sm:top-7 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse hidden sm:block"
            style={{ animationDelay: "0.7s" }}
          ></div>
          <div
            className="absolute bottom-5 left-3 sm:bottom-6 sm:left-4 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-rose-400 rounded-full animate-pulse hidden sm:block"
            style={{ animationDelay: "1.3s" }}
          ></div>
          <div
            className="absolute bottom-3 right-6 sm:bottom-4 sm:right-7 w-1 h-1 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-pulse hidden sm:block"
            style={{ animationDelay: "1.8s" }}
          ></div>

          
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-lg">
              Join Our Community
            </h1>
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-2"></div>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Create your safe space account</p>
          </div>

          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Choose a unique username else auto generate"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Any nickname of your choice only if you wish"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>

          
          <button
            type="submit"
            className="w-full h-10 sm:h-12 lg:h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            SignUp
          </button>

          
          <p className="text-xs sm:text-sm text-center text-gray-600">
            Already part of our community?
            <a
              href="/login"
              className="ml-1 text-purple-600 hover:text-pink-600 font-medium transition-colors duration-300"
            >
              Sign in here
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
              onClick={googleSignup}
              className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl border border-white/50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/30">
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
              By joining, you're entering a supportive community where your privacy matters. We're committed to creating
              a safe, judgment-free space for meaningful connections.
            </p>
          </div>
        </form>
      </div>

      
    </div>
  )
}

export default SignUp
