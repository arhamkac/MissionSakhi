
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import {
  Shield,
  HeartHandshake,
  Phone,
  Briefcase,
  Smartphone,
} from "lucide-react";

const rights = [
  {
    id: 1,
    title: "POCSO Act",
    short: "Protection against child sexual abuse",
    details:
      "The POCSO Act protects children below 18 years from sexual offences and ensures child-friendly reporting, investigation, and trial procedures.",
    gradient: "from-pink-500/30 via-rose-500/20 to-orange-500/20",
    icon: Shield,
  },
  {
    id: 2,
    title: "PWDV Act",
    short: "Protection from domestic violence",
    details:
      "The Protection of Women from Domestic Violence Act helps women facing abuse seek shelter, legal protection, financial support, and restraining orders.",
    gradient: "from-purple-500/30 via-fuchsia-500/20 to-pink-500/20",
    icon: HeartHandshake,
  },
  {
    id: 3,
    title: "Emergency Helplines",
    short: "Quick access to support services",
    details:
      "Women can contact helpline 1091, child helpline 1098, or emergency number 112 for immediate support and protection.",
    gradient: "from-blue-500/30 via-cyan-500/20 to-sky-500/20",
    icon: Phone,
  },
  {
    id: 4,
    title: "Workplace Harassment",
    short: "Protection at work under POSH",
    details:
      "The POSH Act protects women from workplace harassment and requires companies to provide complaint mechanisms and safe work environments.",
    gradient: "from-amber-500/30 via-yellow-500/20 to-orange-500/20",
    icon: Briefcase,
  },
  {
    id: 5,
    title: "Cyber Safety",
    short: "Protection against online abuse",
    details:
      "Cybercrime portals and police cells can help women report stalking, fake profiles, harassment, blackmail, or leaked private content.",
    gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/20",
    icon: Smartphone,
  },
];

export default function RightsCardStack() {
  const [cards, setCards] = useState(rights);
  const [expandedCard, setExpandedCard] = useState(null);

  const visibleCards = useMemo(() => cards.slice(0, 3), [cards]);

  const removeCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));

    if (expandedCard === id) {
      setExpandedCard(null);
    }
  };

  return (
    <section className="w-full py-20 px-4 flex flex-col items-center overflow-hidden">
      <div className="max-w-6xl w-full text-center mb-12">
        <p className="text-pink-400 uppercase tracking-[0.3em] text-sm mb-3">
          Know Your Rights
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Swipe Through Important Legal Rights
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg">
          Explore important laws, helplines, and protections designed to keep
          women and children safe.
        </p>
      </div>

      <div className="relative h-[520px] w-full max-w-md">
        <AnimatePresence>
          {visibleCards
            .slice()
            .reverse()
            .map((card, index) => {
              const Icon = card.icon;
              const stackIndex = visibleCards.length - 1 - index;

              const bind = useDrag(({ down, movement: [mx], velocity }) => {
                if (!down && Math.abs(mx) > 120 && velocity > 0.15) {
                  removeCard(card.id);
                }
              });

              return (
                <motion.div
                  key={card.id}
                  {...bind()}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: stackIndex * 14,
                    scale: 1 - stackIndex * 0.05,
                    rotate: stackIndex % 2 === 0 ? -2 : 2,
                  }}
                  exit={{
                    opacity: 0,
                    x: 400,
                    rotate: 12,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                  className={`absolute top-0 left-0 w-full rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br ${card.gradient}`}
                  style={{ zIndex: 20 - stackIndex }}
                >
                  <div className="p-7 min-h-[420px] flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-6">
                        <Icon className="text-black w-7 h-7" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3">
                        {card.title}
                      </h3>

                      <p className="text-white/80 text-base mb-5">
                        {card.short}
                      </p>

                      <AnimatePresence>
                        {expandedCard === card.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-white/90 leading-7 border-t border-white/10 pt-4">
                              {card.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <button
                        onClick={() =>
                          setExpandedCard(
                            expandedCard === card.id ? null : card.id
                          )
                        }
                        className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm border border-white/20 transition"
                      >
                        {expandedCard === card.id ? "Show Less" : "Tap to Expand"}
                      </button>

                      <button
                        onClick={() => removeCard(card.id)}
                        className="text-sm text-white/70 hover:text-white transition"
                      >
                        Swipe Away →
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {cards.length === 0 && (
        <button
          onClick={() => {
            setCards(rights);
            setExpandedCard(null);
          }}
          className="mt-10 px-6 py-3 rounded-full bg-pink-500 text-white font-medium hover:scale-105 transition"
        >
          Restart Deck
        </button>
      )}
    </section>
  );
}


