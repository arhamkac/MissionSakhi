function Chatbot() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#CBB8E7] via-[#D8C5EB] to-[#E8DFF5] p-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-[#3E2F5B]">Support Chatbot</h1>
        <p className="text-xl text-[#4B445B]">
          Ask questions or share what you're feeling — our AI bot is here to help.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[70vh] shadow-2xl rounded-2xl overflow-hidden border-2 border-[#5D3A66] bg-white">
        <iframe
          src="https://app.thinkstack.ai/bot/previews/iframeview.html?bot=aHR0cHM6Ly9hcHAudGhpbmtzdGFjay5haS9ib3QvaW5kZXguaHRtbD9jaGF0Ym90X2lkPTY4ODViZTUyNTk3NmRmMGU4ZTQxYTg1MCZ0eXBlPWlubGluZQ=="
          frameBorder="0"
          className="w-full h-full"
          allow="clipboard-write"
        ></iframe>
      </div>
    </div>
  );
}

export default Chatbot;
