import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';

function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const faq = [
    ["Is my identity really protected?", "Yes, you can post and interact completely anonymously."],
    ["Who moderates the platform?", "We use both AI and real moderators to ensure a safe space."],
    ["How do you remove posts and users?", "If a user gets too many reports, their content is removed."],
    ["How do you detect false users?", "We rely on the community to report and flag suspicious activity."],
  ];

  return (
    <div className="text-[#1e1e1e] min-h-screen grid grid-rows-[auto_1fr_auto]">
      <main
        className="relative bg-cover bg-center p-6"
        style={{ backgroundImage: "url(blob-scene-haikei.svg)" }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col gap-16 items-center justify-center px-4 sm:px-6 lg:px-12 py-12">

          <section className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">Welcome to Mission Sakhi</h1>
            <p className="text-2xl text-[#FAF3F0] italic">Your safe space. Your voice. Our mission.</p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button className="bg-[#5E548E] hover:bg-[#4c4075] text-white font-semibold py-2 px-6 rounded-full transition"><a href='/co'>Join the Community</a></button>
              {/* <button className="bg-white hover:bg-gray-200 text-[#5E548E] font-semibold py-2 px-6 rounded-full transition">Learn More</button> */}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <img src="/women.jpeg" alt="Happy Women" className="w-full h-80 object-cover rounded-2xl shadow-xl" />
            <img src="/women-2.jpg" alt="Happy Women" className="w-full h-80 object-cover rounded-2xl shadow-xl" />
          </section>

          <section className="bg-[#9e5ac5] text-black p-8 rounded-2xl shadow-xl w-full max-w-4xl text-left">
            <h2 className="text-3xl font-bold text-[#5E548E] mb-4">About Us</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Mission Sakhi is a privacy-first platform built for women to share experiences,
              seek support, and empower each other. Whether it’s harassment, abuse,
              or daily struggles — this space is yours, and your voice matters.
            </p>
          </section>

          <section className="w-full">
            <h2 className="text-3xl font-bold text-white mb-8">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "/forum.svg", title: "Anonymous Forums", desc: "Post your stories, gossips and incidents safely and anonymously." },
                { icon: "/support.svg", title: "Support Community", desc: "Connect with a positive, kind community." },
                { icon: "/women-majority.svg", title: "Women-Majority Discussions", desc: "Open, honest talk with real women." },
                { icon: "/privacy.svg", title: "Privacy-First", desc: "Your identity is always protected." },
                { icon: "/ai-chatbot.svg", title: "AI Chatbot", desc: "Talk to our assistant when you need support." },
              ].map((feature, i) => (
                <div key={i} className="bg-[#a85fd2] p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition cursor-pointer hover:scale-[1.02] duration-300">
                  <img src={feature.icon} alt={feature.title} className="h-20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-100">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#a85fd2] p-6 rounded-2xl shadow-md w-full max-w-3xl text-center">
            <h3 className="text-2xl font-bold text-[#5E548E] mb-3">Testimonials</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { quote: "It's a great initiative for women. A space where we can truly speak up.", name: "– A Female User" },
                { quote: "I finally found a safe space to express myself.", name: "– Anonymous" },
              ].map((t, i) => (
                <div key={i} className="bg-white text-gray-800 p-4 rounded-xl shadow-sm">
                  <p className="italic">"{t.quote}"</p>
                  <p className="text-sm font-medium mt-2 text-[#5D3A66]">{t.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 max-w-4xl w-full bg-[#a85fd2] p-6 rounded-2xl shadow-lg text-left">
            <h2 className="text-2xl font-bold mb-4 text-[#5E548E]">Frequently Asked Questions</h2>
            <div className="space-y-4 text-gray-100">
              {faq.map(([q, a], i) => (
                <div key={i} className="bg-[#5E548E]/30 p-3 rounded-md">
                  <button
                    className="font-semibold flex justify-between w-full cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>🟣 {q}</span>
                    <span>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <p className="text-sm mt-1">{a}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
