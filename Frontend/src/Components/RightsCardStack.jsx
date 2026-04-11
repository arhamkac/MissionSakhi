
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  HeartHandshake,
  Phone,
  Briefcase,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";

const rights = [
  {
    id: 1,
    title: "POCSO Act",
    badge: "Child Protection",
    short: "Protection against child sexual abuse",
    details:
      "The POCSO Act protects children below 18 years from sexual offences and ensures child-friendly reporting, investigation, and trial procedures.",
    keyPoints: [
      "Protects children below 18 years",
      "Covers harassment, assault, and abuse",
      "Provides child-friendly legal process",
    ],
    helpline: "Childline: 1098",
    link: "https://www.wcd.nic.in/acts/protection-children-sexual-offences-pocso-act-2012",
    gradient: "from-pink-200 via-rose-100 to-orange-100",
    icon: Shield,
  },
  {
    id: 2,
    title: "PWDV Act",
    badge: "Domestic Safety",
    short: "Protection from domestic violence",
    details:
      "The Protection of Women from Domestic Violence Act helps women facing abuse seek shelter, legal protection, financial support, and restraining orders.",
    keyPoints: [
      "Protection from physical and emotional abuse",
      "Access to shelter and legal aid",
      "Financial support and restraining orders",
    ],
    helpline: "Women Helpline: 181",
    link: "https://wcd.nic.in/acts/protection-women-domestic-violence-act-2005",
    gradient: "from-purple-200 via-fuchsia-100 to-pink-100",
    icon: HeartHandshake,
  },
  {
    id: 3,
    title: "Emergency Helplines",
    badge: "Quick Support",
    short: "Immediate support and emergency contacts",
    details:
      "Women can contact helpline 1091, child helpline 1098, or emergency number 112 for immediate support and protection.",
    keyPoints: [
      "1091 for women in distress",
      "1098 for child emergency support",
      "112 for nationwide emergency assistance",
    ],
    helpline: "Emergency: 112",
    link: "https://www.india.gov.in/topics/women-child-development/women",
    gradient: "from-blue-200 via-cyan-100 to-sky-100",
    icon: Phone,
  },
  {
    id: 4,
    title: "POSH Act",
    badge: "Workplace Rights",
    short: "Protection against workplace harassment",
    details:
      "The POSH Act protects women from workplace harassment and requires organizations to provide complaint mechanisms and safe work environments.",
    keyPoints: [
      "Protection against workplace harassment",
      "Mandatory Internal Complaints Committee",
      "Ensures safer work environments",
    ],
    helpline: "National Commission for Women: 7827170170",
    link: "https://www.indiacode.nic.in/handle/123456789/2104",
    gradient: "from-amber-200 via-yellow-100 to-orange-100",
    icon: Briefcase,
  },
  {
    id: 5,
    title: "Cyber Safety",
    badge: "Online Protection",
    short: "Protection against online abuse and stalking",
    details:
      "Cybercrime portals and police cells can help women report stalking, fake profiles, harassment, blackmail, or leaked private content.",
    keyPoints: [
      "Report fake profiles and cyberstalking",
      "Protect against blackmail and harassment",
      "Use cybercrime portal for complaints",
    ],
    helpline: "Cyber Crime Portal: cybercrime.gov.in",
    link: "https://cybercrime.gov.in",
    gradient: "from-emerald-200 via-teal-100 to-cyan-100",
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

  const handleRemove = (id) => {
    setTimeout(() => {
      removeCard(id);
    }, 150);
  };

  return (
    <section className="w-full py-20 px-4 flex flex-col items-center overflow-hidden">
      <div className="max-w-6xl w-full text-center mb-12">
        <p className="text-pink-500 uppercase tracking-[0.3em] text-sm mb-3 font-semibold">
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

      <div className="relative h-[620px] w-full max-w-md">
        <AnimatePresence>
          {visibleCards
            .slice()
            .reverse()
            .map((card, index) => {
              const Icon = card.icon;
              const stackIndex = visibleCards.length - 1 - index;

              return (
                <motion.div
                  key={card.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.9}
                  onDragEnd={(event, info) => {
                    if (Math.abs(info.offset.x) > 120) {
                      handleRemove(card.id);
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
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
                  className={`absolute top-0 left-0 w-full rounded-[32px] border border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br ${card.gradient}`}
                  style={{ zIndex: 20 - stackIndex }}
                >
                  <div className="p-8 min-h-[540px] flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-xs font-medium text-black mb-5">
                        {card.badge}
                      </span>

                      <div className="w-14 h-14 rounded-2xl bg-black/10 border border-black/10 flex items-center justify-center mb-6">
                        <Icon className="text-black w-7 h-7" />
                      </div>

                      <h3 className="text-2xl font-bold text-black mb-3">
                        {card.title}
                      </h3>

                      <p className="text-gray-800 text-base mb-5 leading-7">
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
                            <p className="text-gray-900 leading-7 border-t border-black/10 pt-4 mb-5">
                              {card.details}
                            </p>

                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-semibold text-black mb-2">
                                  Key Rights
                                </p>

                                <ul className="space-y-2">
                                  {card.keyPoints.map((point, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-gray-700 flex items-start gap-2"
                                    >
                                      <span className="mt-1.5 w-2 h-2 rounded-full bg-pink-500" />
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="rounded-2xl bg-black/5 border border-black/10 px-4 py-3">
                                <p className="text-sm font-medium text-black">
                                  {card.helpline}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-8">
                      <button
                        onClick={() =>
                          setExpandedCard(
                            expandedCard === card.id ? null : card.id
                          )
                        }
                        className="px-5 py-2.5 rounded-full bg-black/10 hover:bg-black/20 text-black text-sm border border-black/10 transition"
                      >
                        {expandedCard === card.id ? "Show Less" : "Tap to Expand"}
                      </button>

                      <a
                        href={card.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:scale-105 transition"
                      >
                        Learn More
                        <ArrowUpRight size={16} />
                      </a>
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
