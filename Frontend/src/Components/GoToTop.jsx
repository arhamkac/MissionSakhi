import React, { useEffect, useState } from "react";
import UpArrow from "../../public/UpArrow.svg"

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const goToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const listenToScroll = () => {
    let heightToHidden = 1000;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <>
    {isVisible && (
    <div className="fixed bottom-10 right-10 z-50">
      <button onClick={goToBtn} className="bg-gradient-to-l from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
        <img src={UpArrow} alt="" className="w-6 h-6 invert" />
      </button>
    </div>)}
    </>
  );
};

export default GoToTop;