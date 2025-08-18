"use client"

function MentalHealthSupport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      {/* 3D Floating Elements - Hidden on mobile for better performance */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Floating Hearts */}
        <div
          className="absolute top-20 left-10 w-6 h-6 lg:w-8 lg:h-8 bg-pink-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-4 h-4 lg:w-6 lg:h-6 bg-purple-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-8 h-8 lg:w-10 lg:h-10 bg-rose-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-5 h-5 lg:w-7 lg:h-7 bg-pink-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        ></div>

        {/* 3D Geometric Shapes */}
        <div
          className="absolute top-32 right-32 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg rotate-45 animate-pulse opacity-20 transform-gpu"
          style={{ animationDuration: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-rose-300 to-purple-300 rounded-full animate-pulse opacity-15 transform-gpu"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-rose-200/20 rounded-2xl sm:rounded-3xl blur-xl transform scale-110"></div>
          <div className="relative bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-lg mb-3 sm:mb-4 leading-tight">
              Mental Health Support Resources
            </h1>
            <div className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              You are not alone. Here are trusted resources for support and healing.
            </p>
          </div>
        </div>

        {/* Global Support Platforms */}
        <div className="mb-8 sm:mb-10 lg:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
          <div className="relative bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Global Mental Health Support Platforms 🌍
            </h2>

            <div className="grid gap-4 sm:gap-6">
              {[
                {
                  name: "7 Cups",
                  url: "https://www.7cups.com",
                  features: [
                    "Free anonymous chat with trained listeners",
                    "Peer support groups",
                    "Option to talk to a therapist (paid)",
                  ],
                },
                {
                  name: "iCall (India-based but available globally)",
                  url: "https://icallhelpline.org",
                  features: [
                    "Free telephone and email-based counseling",
                    "Women-friendly and trauma-informed",
                    "📞 +91 9152987821",
                  ],
                },
                {
                  name: "Mental Health America",
                  url: "https://mhanational.org",
                  features: ["Free mental health screenings and support", "Resources for trauma, anxiety, depression"],
                },
              ].map((platform, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-pink-600 transition-colors underline break-words"
                      >
                        {platform.name}
                      </a>
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {platform.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Women-Specific Platforms */}
        <div className="mb-8 sm:mb-10 lg:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 to-purple-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
          <div className="relative bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              💜 Platforms for Women's Daily Life & Support
            </h2>

            <div className="grid gap-4 sm:gap-6">
              {[
                {
                  name: "SHEROES - Ask SHEROES",
                  url: "https://sheroes.com/",
                  features: [
                    "Women-only community",
                    "Anonymous Q&A, peer support, and chat spaces",
                    "Discuss abuse, harassment, health, or trauma",
                  ],
                },
                {
                  name: "Saheli (India)",
                  url: "https://sahelihelpline.org",
                  features: [
                    "For South Asian women experiencing abuse or trauma",
                    "Mental health, domestic violence, immigration-related support",
                  ],
                },
                {
                  name: "Safecity",
                  url: "https://safecity.in",
                  features: [
                    "Crowd-sourced sexual harassment reporting platform",
                    "Women can share experiences anonymously",
                    "Community-driven advocacy",
                  ],
                },
              ].map((platform, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-pink-600 transition-colors underline break-words"
                      >
                        {platform.name}
                      </a>
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {platform.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reddit Communities */}
        <div className="mb-8 sm:mb-10 lg:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
          <div className="relative bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Reddit & Online Communities (Anonymous + Supportive)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105 group-hover:scale-110 transition-all duration-300"></div>
                <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-purple-600">r/TwoXChromosomes</h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 text-base sm:text-lg flex-shrink-0">👭</span>
                      <span className="leading-relaxed">Focused on women's issues, experiences, and empowerment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 text-base sm:text-lg flex-shrink-0">🔒</span>
                      <span className="leading-relaxed">Moderated, safe discussions</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300/20 to-rose-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105 group-hover:scale-110 transition-all duration-300"></div>
                <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-purple-600">
                    r/MentalHealth & r/DecidingToBeBetter
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 text-base sm:text-lg flex-shrink-0">🧠</span>
                      <span className="leading-relaxed">
                        Supportive forums for mental health struggles, growth, and healing
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
          <div className="relative bg-white/60 backdrop-blur-md border border-red-300/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2 sm:mb-3">🚨 Emergency Support</h3>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                If you're in immediate danger or having thoughts of self-harm, please reach out for emergency help:
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4">
                <div className="bg-red-100 px-3 sm:px-4 py-2 rounded-full">
                  <span className="font-semibold text-red-700 text-sm sm:text-base">
                    Emergency: 911 (US) | 112 (EU)
                  </span>
                </div>
                <div className="bg-pink-100 px-3 sm:px-4 py-2 rounded-full">
                  <span className="font-semibold text-pink-700 text-sm sm:text-base">
                    Crisis Text Line: Text HOME to 741741
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentalHealthSupport
