import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden">
      
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400"
        style={{ transform: "scaleY(1.1)" }}
      ></div>

      
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-rose-500/80 backdrop-blur-md"></div>

     
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-6 text-center text-white">
        
        
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent mb-1">
          Mission Sakhi ✨
        </h3>
        <p className="text-xs sm:text-sm text-pink-100 mb-4">
          Creating safe spaces, one conversation at a time 💜
        </p>

       
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-pink-100">
            <p className="font-semibold">Drop us a line:</p>
            <p className="text-white">hellomissionsakhi.org</p>
            <span className="text-white/50">|</span>
            <p className="font-semibold">Call us:</p>
            <p className="text-white">+91-9468804026</p>
            <span className="text-white/50">|</span>
            <Link to="/mental-health">Mental Health Support</Link>
        </div>
        
        
        <div className="w-12 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto my-6"></div>
        
        
        <p className="text-[10px] sm:text-xs text-pink-100 leading-relaxed mb-2">
          Mission Sakhi is where women come to be real, share their stories, and find genuine support.
        </p>
        <p className="text-[10px] sm:text-xs text-pink-100">
          © {new Date().getFullYear()} All rights reserved. Made with love for our amazing community.
        </p>
        
      </div>
      
      
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ transform: "translateY(-0.5px)" }}
      ></div>
    </footer>
  )
}

export default Footer;