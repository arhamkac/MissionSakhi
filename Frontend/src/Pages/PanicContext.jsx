import { createContext, useContext, useState, useEffect } from "react";

const PanicContext = createContext();

export function PanicProvider({ children }) {
  const [isPanic, setIsPanic] = useState(false);

  const togglePanic = () => setIsPanic(prev => !prev);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        togglePanic();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <PanicContext.Provider value={{ isPanic, togglePanic }}>
      {children}
    </PanicContext.Provider>
  );
}

export function usePanic() {
  const context = useContext(PanicContext);
  if (!context) {
    throw new Error("usePanic must be used within a PanicProvider");
  }
  return context;
}
