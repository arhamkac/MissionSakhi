import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext"
import axios from "axios"

function Settings() {
  const { user, setUser } = useAuth()
  const [formData, setFormData] = useState(user || {})
  const [isLoading, setIsLoading] = useState(false)

  const baseURL = "https://missionsakhi.onrender.com/api/users"

  // Sync local formData when user changes (important after login)
  useEffect(() => {
    if (user) setFormData(user)
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      const res = await axios.put(
        `${baseURL}/api/users/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setUser(res.data.user)
      localStorage.setItem("user", JSON.stringify(res.data.user))

    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/logout`, {}, { withCredentials: true })
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">Please login to access settings</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden p-4 sm:p-6 lg:p-8">
      
      {/* Decorative background (kept from your design) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <button className="bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white/90 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                  ← Back to Dashboard
                </button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-gray-600 text-sm">Manage your profile information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl p-6 sm:p-8 rounded-lg">
          <div className="space-y-6">
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-2">
                  <label htmlFor="username" className="text-gray-700 font-medium block">
                    Full Name
                  </label>
                  <input
                    id="username"
                    value={formData.username || ""}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="w-full bg-white/80 border rounded-lg px-3 py-2 outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="nickname" className="text-gray-700 font-medium block">
                    Nickname
                  </label>
                  <input
                    id="nickname"
                    value={formData.nickname || ""}
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                    className="w-full bg-white/80 border rounded-lg px-3 py-2 outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-gray-700 font-medium block">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-white/80 border rounded-lg px-3 py-2 outline-none focus:border-purple-400"
                  />
                </div>

              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  <>💾 Save Changes</>
                )}
              </button>
            </div>

            <div className="flex justify-end pt-4">
             <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
             onClick={handleLogout}>
              Logout
             </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
