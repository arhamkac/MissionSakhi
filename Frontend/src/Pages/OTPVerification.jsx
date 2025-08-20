import { useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { Link } from "react-router-dom"

function OTPVerification() {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Google credential:", credentialResponse)
    },
    onError: () => {
      console.log("Login Failed")
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      console.log("OTP verified:", otp)
    }, 2000)
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-300 to-rose-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-r from-rose-300 to-pink-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-20 animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="relative backdrop-blur-xl bg-white/20 rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 mb-8 sm:mb-10 lg:mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10 rounded-3xl"></div>

            <div className="relative z-10 space-y-6 sm:space-y-8">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                  OTP Verification
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Enter the 6-digit code sent to your device</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    One Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 sm:py-4 text-center text-lg sm:text-xl font-mono tracking-widest rounded-2xl border-2 border-purple-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-gray-400"
                    maxLength="6"
                    inputMode="numeric"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 text-center">{otp.length}/6 digits entered</p>
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-xs sm:text-sm text-gray-600">Didn't receive the code?</p>
                <button
                  type="button"
                  className="text-sm sm:text-base text-purple-600 hover:text-purple-800 font-medium underline transition-colors duration-300"
                >
                  Resend OTP
                </button>
              </div>

              <div className="text-center pt-4 border-t border-white/20">
                <Link
                  to="/login"
                  className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors duration-300"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
