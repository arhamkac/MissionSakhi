import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-[#8943b2] text-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-wide hover:text-[#E8DFF5] transition duration-200">
          SakhiVerse
        </Link>

        {/* Nav Links */}
        <nav className="flex gap-6 text-lg font-medium">
          <Link 
            to="/forum" 
            className="hover:text-[#FAD2CF] transition duration-200"
          >
            Anonymous Forum
          </Link>

          <Link 
            to="/chatbot" 
            className="hover:text-[#FAD2CF] transition duration-200"
          >
            AI Chat
          </Link>

          <Link 
            to="/login" 
            className="bg-[#FAD2CF] text-[#5D3A66] px-4 py-1 rounded-full font-semibold hover:bg-[#f9c6c3] transition"
          >
            Login / Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
