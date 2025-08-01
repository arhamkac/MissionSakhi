import { Link, Route, Routes } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#8943b2] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <h3 className="text-xl font-bold mb-3 border-b border-[#FAD2CF] pb-1">About Mission Sakhi</h3>
          <p className="text-sm text-[#E8DFF5] leading-relaxed">
            Mission Sakhi is a safe space for women to share, connect, and grow without fear or judgment.
            We’re building a privacy-first, supportive platform for real conversations and emotional support.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 border-b border-[#FAD2CF] pb-1">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#FAD2CF] cursor-pointer transition">
              <Link to="/report">Reporting Guidelines</Link>
            </li>
            <li className="hover:text-[#FAD2CF] cursor-pointer transition">
              <Link to="/mental-health">Mental Health Support</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 border-b border-[#FAD2CF] pb-1">Contact Us</h3>
          <p className="text-sm text-[#E8DFF5]">Email: support@missionsakhi.org</p>
          <p className="text-sm text-[#E8DFF5] mt-1">Phone: +91-9468804026</p>
        </div>

      </div>

      <div className="text-center mt-10 text-sm text-[#E8DFF5]">
        © {new Date().getFullYear()} Mission Sakhi. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
