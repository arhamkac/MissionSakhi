import React, { useState } from 'react';
import axios from 'axios';

function Chatbot_AI() {
  const [inputMess, setInputMess] = useState("");
  const [messages, setMessages] = useState([]);

  const username = "User";

  // const time=Date.now();
  const element = (sender, message, isBot = false) => (
    <li
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
      key={Date.now() + Math.random()}
    >
      <div className={`flex flex-col max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        <label className="text-xs text-gray-200 mb-1 font-semibold">{sender}</label>
        <div className={`${isBot ? 'bg-purple-700' : 'bg-purple-500'} text-white px-4 py-2 rounded-2xl`}>
          {message}
        </div>
      </div>
    </li>
  );

  const askQuestion = async (userInput) => {
    try {
      const chatHistory = messages.map((msg) => {
        const sender = msg.props.children.props.children[0].props.children;
        const message = msg.props.children.props.children[1].props.children;
        return `${sender}: ${message}`;
      });

      chatHistory.push(`${username}: ${userInput}`);

      const res = await axios.post("http://localhost:3001/ask", {
        question: userInput,
        history: chatHistory.join('\n'),
      });

      const botReply = res.data.answer;
      setMessages((prev) => [...prev, element("Chatbot", botReply, true)]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, element("Chatbot", "Sorry, something went wrong.", true)]);
    }
  };

  const handleSend = async () => {
    if (!inputMess.trim()) return;

    const userInput = inputMess;
    setMessages((prev) => [...prev, element(username, userInput)]);
    setInputMess("");
    await askQuestion(userInput);
  };

  return (
    <div className="h-screen bg-[url('low-poly-grid-haikei.svg')] bg-cover flex justify-center items-center px-4 py-6">
      <div className="chatbox bg-[rgba(255,255,255,0.08)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] 
      rounded-2xl h-full max-h-[700px] w-full max-w-[800px] flex flex-col p-6 shadow-xl ">
        
        <h2 className="text-2xl font-bold text-white underline text-center mb-4">Sakhi Chatbot</h2>

        <ul className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 text-white scrollbar-thin scrollbar-thumb-purple-500">
          <li className="flex justify-start">
            <div className="flex flex-col items-start max-w-[75%]">
              <label className="text-xs text-gray-200 mb-1 font-semibold">Chatbot</label>
              <div className="bg-purple-700 text-white px-4 py-2 rounded-2xl">
                Hello, how are you doing Sakhi?
              </div>
            </div>
          </li>
          {messages.map((msg, index) => (
            <React.Fragment key={index}>{msg}</React.Fragment>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter your message"
            className="flex-1 px-4 py-2 rounded-md text-black focus:outline-none"
            value={inputMess}
            onChange={(e) => setInputMess(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleSend();
            }}
          />
          <button
            className="px-4 py-2 rounded-md bg-gradient-to-br from-[#3C1C78] to-[#5C32A5] text-white font-semibold hover:from-[#4C2592] hover:to-[#6D3BBD] transition duration-300 cursor-pointer"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}



export default Chatbot_AI;
