"use client"

import { useState } from "react"
import sampleMessages from "../data/sampleMessages.json"
import chatTopicsData from "../data/chatTopics.json"

const chatTopics = chatTopicsData
const topicMessages = sampleMessages

export default function Community() {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState({})

  const getTopicMessages = (topicId) => {
    return topicMessages[topicId] || []
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedTopic) {
      const message = {
        id: Date.now(),
        user: "You",
        avatar: "👤",
        message: newMessage,
        time: "now",
        likes: 0,
      }

      const currentMessages = getTopicMessages(selectedTopic)
      topicMessages[selectedTopic] = [message, ...currentMessages]
      setNewMessage("")
      setMessages({ ...messages })
    }
  }

  const handleLike = (messageId) => {
    if (selectedTopic && topicMessages[selectedTopic]) {
      topicMessages[selectedTopic] = topicMessages[selectedTopic].map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg,
      )
      setMessages({ ...messages })
    }
  }

  if (selectedTopic) {
    const topic = chatTopics.find((t) => t.id === selectedTopic)
    const currentMessages = getTopicMessages(selectedTopic)

    return (
      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 left-10 w-6 h-6 bg-pink-300/20 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-4 h-4 bg-purple-300/20 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-8 h-8 bg-rose-300/20 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "3.5s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setSelectedTopic(null)}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base"
              >
                ← Back
              </button>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl shadow-lg`}
              >
                {topic.icon}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{topic.name}</h1>
                <p className="text-sm sm:text-base text-gray-600">{topic.members} members online</p>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {currentMessages.map((message) => (
                <div key={message.id} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-lg">
                      {message.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">{message.user}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base mb-3">{message.message}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(message.id)}
                          className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-pink-600 transition-colors"
                        >
                          <span>💖</span>
                          <span>{message.likes}</span>
                        </button>
                        <button className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-lg">
                👤
              </div>
              <div className="flex-1 flex gap-3">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Share your thoughts about ${topic.name.toLowerCase()}...`}
                  className="flex-1 bg-white/50 border border-white/30 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-200"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm sm:text-base px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-8 h-8 bg-pink-300/20 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-purple-300/20 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-10 h-10 bg-rose-300/20 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-7 h-7 bg-pink-400/20 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="relative bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Community Chat Rooms
            </h1>
            <div className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Connect with amazing women from around the world. Choose a topic that resonates with you and join the
              conversation! 💬
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {chatTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white/40 backdrop-blur-md border border-white/30 p-4 sm:p-6 hover:bg-white/50 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl rounded-lg"
              onClick={() => setSelectedTopic(topic.id)}
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl sm:text-3xl shadow-lg mx-auto mb-4 transform hover:rotate-6 transition-transform duration-300`}
                >
                  {topic.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg mb-2 leading-tight">
                  {topic.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-700 mb-2">{topic.description}</p>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{topic.members.toLocaleString()} online</span>
                </div>
                <div className="mt-3 text-xs sm:text-sm text-gray-500">Click to join chat</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}