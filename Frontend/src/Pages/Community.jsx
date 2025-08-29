import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export default function Community() {
  const [chatTopics, setChatTopics] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const { user, loading } = useAuth();
  const BASE_URL = "https://missionsakhi.onrender.com/api/rooms";
  const MSG_URL = "https://missionsakhi.onrender.com/api/message";

  const getRoomInitials = (name) => {
    const words = name.split(" ");
    return words.length === 1 ? words[0][0].toUpperCase() : (words[0][0] + words[1][0]).toUpperCase();
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 60%, 70%)`;
  };

  useEffect(() => {
    if (!user) return;
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/get-rooms`);
        setChatTopics(data.message.rooms || []);
      } catch (err) {
        console.error("Fetch rooms error:", err.response?.data || err.message);
      }
    };
    fetchRooms();
  }, [user]);

  useEffect(() => {
    if (!selectedTopic || !user) return;
    const fetchMessages = async () => {
      try {
        console.log(user.token)
        const { data } = await axios.get(`${BASE_URL}/messages/${selectedTopic}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages((prev) => ({ ...prev, [selectedTopic]: data.message || [] }));
      } catch (err) {
        console.error("Fetch messages error:", err.response?.data || err.message);
      }
    };
    fetchMessages();
  }, [selectedTopic, user]);

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || !selectedTopic) return;
    try {
      console.log("")
      const { data } = await axios.post(
        `${BASE_URL}/${selectedTopic}`,
        { headers: { Authorization: `Bearer ${user.token}` } },
        { message: newMessage }
      );
      setMessages((prev) => ({
        ...prev,
        [selectedTopic]: [data.message, ...(prev[selectedTopic] || [])],
      }));
      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editingContent.trim()) return;
    try {
      const { data } = await axios.patch(
        `${MSG_URL}/${messageId}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessages((prev) => ({
        ...prev,
        [selectedTopic]: prev[selectedTopic].map((msg) =>
          msg._id === messageId ? data.message : msg
        ),
      }));
      setEditingMessageId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Edit message error:", err.response?.data || err.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!user) return;
    try {
      await axios.delete(`${MSG_URL}/${messageId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages((prev) => ({
        ...prev,
        [selectedTopic]: prev[selectedTopic].filter((msg) => msg._id !== messageId),
      }));
    } catch (err) {
      console.error("Delete message error:", err.response?.data || err.message);
    }
  };

  const handleLike = (messageId) => {
    setMessages((prev) => ({
      ...prev,
      [selectedTopic]: prev[selectedTopic].map((msg) =>
        msg._id === messageId ? { ...msg, likes: (msg.likes || 0) + 1 } : msg
      ),
    }));
  };

  const handleCreateRoom = async () => {
    if (!user || !newRoomName.trim()) return alert("Room name cannot be empty");
    try {
      const { data } = await axios.post(
        `${BASE_URL}/create-room`,
        { name: newRoomName, description: newRoomDesc },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setChatTopics((prev) => [...prev, data.message]);
      setNewRoomName("");
      setNewRoomDesc("");
      alert("Room created successfully!");
    } catch (err) {
      console.error("Create room error:", err.response?.data || err.message);
    }
  };

  const currentMessages = selectedTopic ? messages[selectedTopic] || [] : [];

  if (loading) return <div className="text-center p-6">Loading...</div>;

  if (selectedTopic) {
    const topic = chatTopics.find((t) => t._id === selectedTopic);
    return (
      <div className="relative overflow-hidden min-h-screen">
        <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6">
          <div className="mb-6 sm:mb-8 flex items-center gap-4">
            <button onClick={() => setSelectedTopic(null)} className="bg-white/20 ...">← Back</button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{topic.name}</h1>
              <p className="text-sm sm:text-base text-gray-600">{topic.description}</p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl max-h-96 overflow-y-auto space-y-4">
            {currentMessages.map((message) => (
              <div key={message._id} className="bg-white/50 rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800">{message.user}</span>
                      <span className="text-xs text-gray-500">{message.time || "now"}</span>
                    </div>

                    {editingMessageId === message._id ? (
                      <div className="flex gap-2">
                        <input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="flex-1 border rounded px-2 py-1"
                        />
                        <button
                          onClick={() => handleEditMessage(message._id)}
                          className="text-green-600 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="text-red-500 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-700 mb-2">{message.message}</p>
                    )}

                    <div className="flex items-center gap-3 text-xs">
                      <button onClick={() => handleLike(message._id)}>💖 {message.likes || 0}</button>
                      {message.sender === user._id && editingMessageId !== message._id && (
                        <>
                          <button onClick={() => { setEditingMessageId(message._id); setEditingContent(message.message); }}>Edit</button>
                          <button onClick={() => handleDeleteMessage(message._id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Share your thoughts about ${topic.name.toLowerCase()}...`}
              className="flex-1 ..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="bg-gradient-to-r ...">Send</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8">
          <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Community Chat Rooms
            </h1>
            <p className="text-gray-600">Connect with amazing women ...</p>
          </div>
        </div>

        {user && (
          <div className="mb-6 bg-white/40 ... flex flex-col sm:flex-row gap-3">
            <input value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="New room name" className="flex-1 ..." />
            <input value={newRoomDesc} onChange={(e) => setNewRoomDesc(e.target.value)} placeholder="Room description" className="flex-1 ..." />
            <button onClick={handleCreateRoom} className="bg-gradient-to-r ...">Create Room</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {chatTopics.map((topic) => (
            <div key={topic._id} className="bg-white/40 ..." onClick={() => setSelectedTopic(topic._id)}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4" style={{ backgroundColor: stringToColor(topic.name) }}>
                {getRoomInitials(topic.name)}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{topic.name}</h3>
              <p className="text-xs sm:text-sm text-gray-700">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
