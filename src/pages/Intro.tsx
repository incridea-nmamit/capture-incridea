import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

type IntroAnimationProps = {
  onAnimationComplete: () => void;
};

const IntroAnimation = ({ onAnimationComplete }: IntroAnimationProps) => {
  const [retrigger, setRetrigger] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onAnimationComplete === "function") {
        onAnimationComplete(); // Ensure it's a function before calling
      }
    }, 5000); // Animation duration in milliseconds

    return () => clearTimeout(timer); // Cleanup the timeout
  }, [onAnimationComplete]);

  return (
    <div className="relative bg-neutral-950 min-h-screen overflow-hidden font-passion text-white">
      {/* Hidden Retrigger Inputs */}
      <input
        type="radio"
        name="rerun"
        id="retrigger-1"
        className="hidden"
        checked={retrigger === 1}
        onChange={() => setRetrigger(1)}
      />
      <input
        type="radio"
        name="rerun"
        id="retrigger-2"
        className="hidden"
        checked={retrigger === 2}
        onChange={() => setRetrigger(2)}
      />

      {/* Background Animation */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-[6s] ${
          retrigger === 1 ? "animate-fade-1" : "animate-fade-2"
        }`}
        style={{
          backgroundImage: "url('/images/general/intro.webp')",
        }}
      ></div>
    </div>
  );
};

export default IntroAnimation;
