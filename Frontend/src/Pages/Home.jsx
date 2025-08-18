"use client"
import { useState } from "react"
import {Link} from 'react-router-dom'

function Home() {
  const [openFaq, setOpenFaq] = useState(null)

  const faq = [
    [
      "Is my identity really protected here?",
      "We've built this with privacy at the core. You can share your story without anyone knowing who you are - that's a promise.",
    ],
    [
      "Who actually moderates this space?",
      "We have a mix of AI tools and real human moderators (mostly women) who understand the nuances of what we're dealing with.",
    ],
    [
      "What happens if someone's being toxic?",
      "Our community is pretty good at self-policing. If someone gets multiple reports, we review and take action quickly.",
    ],
    [
      "How do you spot fake accounts?",
      "Honestly, we rely on our amazing community to flag suspicious behavior. Plus, we have some behind-the-scenes checks.",
    ],
    [
      "Can I delete my posts later?",
      "Of course! Your content, your choice. You can edit or delete anything you've shared whenever you want.",
    ],
  ]

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none hidden md:block">

        <div
          className="absolute top-16 left-12 w-7 h-7 lg:w-9 lg:h-9 bg-pink-300/25 rounded-full animate-bounce"
          style={{ animationDelay: "0.3s", animationDuration: "3.7s" }}
        ></div>
        <div
          className="absolute top-44 right-16 w-5 h-5 lg:w-7 lg:h-7 bg-purple-300/30 rounded-full animate-bounce"
          style={{ animationDelay: "1.2s", animationDuration: "4.3s" }}
        ></div>
        <div
          className="absolute bottom-36 left-24 w-9 h-9 lg:w-11 lg:h-11 bg-rose-300/20 rounded-full animate-bounce"
          style={{ animationDelay: "2.1s", animationDuration: "3.2s" }}
        ></div>
        <div
          className="absolute bottom-28 right-8 w-6 h-6 lg:w-8 lg:h-8 bg-pink-400/35 rounded-full animate-bounce"
          style={{ animationDelay: "0.8s", animationDuration: "4.8s" }}
        ></div>
        <div
          className="absolute top-1/3 left-8 w-4 h-4 bg-purple-200/40 rounded-full animate-pulse"
          style={{ animationDelay: "1.7s", animationDuration: "2.9s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-3 h-3 bg-rose-200/45 rounded-full animate-pulse"
          style={{ animationDelay: "2.4s", animationDuration: "3.6s" }}
        ></div>

        <div
          className="absolute top-28 right-28 w-11 h-11 lg:w-13 lg:h-13 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg rotate-45 animate-pulse opacity-18 transform-gpu"
          style={{ animationDuration: "2.7s", transform: "rotate(47deg)" }}
        ></div>
        <div
          className="absolute bottom-40 left-36 w-13 h-13 lg:w-17 lg:h-17 bg-gradient-to-br from-rose-300 to-purple-300 rounded-full animate-pulse opacity-12 transform-gpu"
          style={{ animationDuration: "3.4s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/3 w-5 h-5 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg rotate-12 animate-pulse opacity-28"
          style={{ animationDuration: "2.3s", transform: "rotate(15deg)" }}
        ></div>
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <main className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-8 sm:gap-12 lg:gap-16 items-center justify-center py-8 sm:py-12 lg:py-16">
          
          <section className="flex flex-col gap-4 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-rose-200/20 rounded-2xl sm:rounded-3xl blur-xl transform scale-110"></div>
            <div className="relative bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-lg leading-tight">
                Hey there, welcome to Mission Sakhi
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 italic mt-3 sm:mt-4 leading-relaxed">
                Finally, a space that gets it. Your stories matter here.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-4 sm:mt-6">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                  <Link to="/community-chat">Let's do this together</Link>
                </button>
              </div>
            </div>
          </section>

          
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-6xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105"></div>
              <img
                src="/happy-women-supporting.png"
                alt="Happy Women"
                className="relative w-full h-60 sm:h-72 lg:h-80 object-cover rounded-xl sm:rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105"></div>
              <img
                src="/empowered-women-community.png"
                alt="Empowered Women"
                className="relative w-full h-60 sm:h-72 lg:h-80 object-cover rounded-xl sm:rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
          </section>

         
          <section className="w-full max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
            <div className="relative bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                What we're really about
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                Look, we know there are tons of platforms out there, but most weren't built with us in mind. Mission
                Sakhi is different - it's privacy-first, women-centered, and actually safe. Whether you're dealing with
                workplace harassment, relationship issues, or just need someone who gets it, this is your space. No
                judgment, just real support from real women.
              </p>
            </div>
          </section>

          
          <section className="w-full">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 sm:mb-8">
              What makes us different
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: "💬",
                  title: "Anonymous & Safe",
                  desc: "Share your real stories without worrying about who's watching. Complete anonymity, always.",
                },
                {
                  icon: "🤝",
                  title: "Genuine Support",
                  desc: "Connect with women who actually understand what you're going through. No fake positivity here.",
                },
                {
                  icon: "👩‍👩‍👧‍👧",
                  title: "Real Women, Real Talk",
                  desc: "Honest conversations with people who've been there. No bots, no fake accounts.",
                },
                {
                  icon: "🔒",
                  title: "Privacy That Actually Works",
                  desc: "We built this from the ground up with your privacy in mind. Your identity stays yours.",
                },
                {
                  icon: "🤖",
                  title: "AI Support When You Need It",
                  desc: "Sometimes you need to talk at 3am. Our AI assistant is trained to actually help, not just chat.",
                },
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-xl sm:rounded-2xl blur-lg transform scale-105 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                    <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          
          <section className="w-full max-w-4xl text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 to-purple-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
            <div className="relative bg-white/50 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                What our community says
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    quote:
                      "Finally found a place where I can talk about workplace harassment without fear. The support here is incredible.",
                    name: "– Sarah, 28",
                  },
                  {
                    quote:
                      "I was skeptical at first, but this community genuinely cares. It's not just another social media platform.",
                    name: "– Anonymous user",
                  },
                  {
                    quote:
                      "The AI chatbot actually helped me process some difficult emotions at 2am when I couldn't sleep.",
                    name: "– Maya, 24",
                  },
                  {
                    quote: "Love that I can be completely honest here without judgment. It's therapeutic.",
                    name: "– K, 31",
                  },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="bg-white/70 backdrop-blur-sm text-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-white/30"
                  >
                    <p className="italic text-sm sm:text-base">"{t.quote}"</p>
                    <p className="text-xs sm:text-sm font-medium mt-2 text-purple-600">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-2xl sm:rounded-3xl blur-lg"></div>
            <div className="relative bg-white/50 backdrop-blur-md border border-white/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl text-left">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Questions we get asked a lot
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {faq.map(([q, a], i) => (
                  <div
                    key={i}
                    className="bg-white/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/30"
                  >
                    <button
                      className="font-semibold flex justify-between w-full cursor-pointer text-gray-700 hover:text-purple-600 transition-colors text-sm sm:text-base"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-left">💜 {q}</span>
                      <span className="ml-2 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && <p className="text-sm sm:text-base mt-2 text-gray-600 leading-relaxed">{a}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 flex flex-col gap-2 sm:gap-4">
        <div
          className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white text-lg sm:text-xl cursor-pointer hover:scale-110 transition-transform duration-300 animate-pulse"
          style={{ animationDuration: "2.3s" }}
        >
          💬
        </div>
        <div
          className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white text-sm sm:text-lg cursor-pointer hover:scale-110 transition-transform duration-300"
          style={{ transform: "translateX(-2px)" }}
        >
          ❤️
        </div>
      </div>
    </div>
  )
}

export default Home
