import React, { useState } from "react"
import axios from "axios"

function Chatbot_AI() {
  const [inputMess, setInputMess] = useState("")
  const [messages, setMessages] = useState([])

  const username = "User"

  const element = (sender, message, isBot = false) => (
    <li className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4 sm:mb-6`} key={Date.now() + Math.random()}>
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${isBot ? "items-start" : "items-end"}`}>
        <label className="text-xs sm:text-sm text-gray-200 mb-2 font-medium">{sender}</label>
        <div
          className={`${isBot ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80" : "bg-gradient-to-r from-pink-500/80 to-rose-500/80"} 
          backdrop-blur-sm border border-white/20 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-lg
          text-sm sm:text-base leading-relaxed`}
        >
          {message}
        </div>
      </div>
    </li>
  )

  const askQuestion = async (userInput) => {
    try {
      const chatHistory = messages.map((msg) => {
        const sender = msg.props.children.props.children[0].props.children
        const message = msg.props.children.props.children[1].props.children
        return `${sender}: ${message}`
      })

      chatHistory.push(`${username}: ${userInput}`)

      const res = await axios.post("http://localhost:3001/ask", {
        question: userInput,
        history: chatHistory.join("\n"),
      })

      const botReply = res.data.answer
      setMessages((prev) => [...prev, element("Chatbot", botReply, true)])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [...prev, element("Chatbot", "Sorry, something went wrong.", true)])
    }
  }

  const handleSend = async () => {
    if (!inputMess.trim()) return

    const userInput = inputMess
    setMessages((prev) => [...prev, element(username, userInput)])
    setInputMess("")
    await askQuestion(userInput)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-rose-300/30 to-pink-300/30 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-300/20 to-rose-300/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-pink-300/25 to-purple-300/25 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Sakhi AI Chatbot
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your supportive AI companion for meaningful conversations and guidance
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-b border-white/20 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">Chat with Sakhi</h2>
              </div>

              <div className="flex-1 overflow-hidden">
                <ul className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-0">
                  <li className="flex justify-start mb-4 sm:mb-6">
                    <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]">
                      <label className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Chatbot</label>
                      <div
                        className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm border border-white/20 
                        text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-lg text-sm sm:text-base leading-relaxed"
                      >
                        Hello, how are you doing Sakhi?
                      </div>
                    </div>
                  </li>
                  {messages.map((msg, index) => (
                    <React.Fragment key={index}>{msg}</React.Fragment>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-t border-white/20 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Enter your message..."
                    className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/30 
                      text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
                      text-sm sm:text-base transition-all duration-300"
                    value={inputMess}
                    onChange={(e) => setInputMess(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") await handleSend()
                    }}
                  />
                  <button
                    className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 
                      text-white font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 
                      transition-all duration-300 shadow-lg text-sm sm:text-base"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot_AI
