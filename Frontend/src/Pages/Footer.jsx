import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const HIDE_ON = ["/chatbot", "/community-chat", "/ai-chatbot"];

const footerStyle = {
  background: "linear-gradient(135deg,rgba(109,40,217,0.95) 0%,rgba(192,38,211,0.95) 50%,rgba(244,63,94,0.9) 100%)",
  backdropFilter: "blur(24px)",
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

export default function Footer() {
  const { pathname } = useLocation();
  if (HIDE_ON.includes(pathname)) return null;

  return (
    <footer style={footerStyle} className="relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)" }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                🌸
              </div>
              <span className="text-white font-semibold" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem" }}>
                Mission Sakhi
              </span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              Creating safe spaces for women, one conversation at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Explore</p>
            <div className="space-y-2">
              {[
                { to: "/forum",          label: "Anonymous Forum"  },
                { to: "/community-chat", label: "Community Rooms"  },
                { to: "/chatbot",        label: "AI Support"       },
                { to: "/mental-health",  label: "Mental Health"    },
              ].map(({ to, label }) => (
                <Link key={to} to={to}
                  className="block text-white/65 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Contact</p>
            <div className="space-y-2 text-sm text-white/65">
              <p>hellomissionsakhi.org</p>
              <p>+91-9468804026</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Mission Sakhi. Made with love for our community.
          </p>
          <div className="flex gap-4 text-xs text-white/40">
            <span>Privacy-first</span>
            <span>·</span>
            <span>Women-only</span>
            <span>·</span>
            <span>Always free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
