import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

/**
 * LandingButtons Component
 * Renders the main call-to-action button on the landing page
 * Features a pulsing animation effect every 5 seconds
 */
export const LandingButtons = () => {
  // State to control button scale animation
  const [scale, setScale] = useState("scale-100");

  // Setup pulsing animation interval
  useEffect(() => {
    // Create interval for scale animation
    const interval = setInterval(() => {
      setScale((prevScale) => (
        prevScale === "scale-100" ? "scale-105" : "scale-100"
      ));
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 flex h-full w-screen flex-col items-center justify-center overflow-x-hidden">
      {/* Button container with responsive positioning */}
      <div className="absolute bottom-10 my-16 w-fit flex-col items-center gap-10 md:flex-row md:gap-10 lg:flex">
        <Link href="/captures">
          <Button
            className={`hover:bg-pink-500 font-Teknaf tracking-widest text-4xl h-16 w-64 px-6 py-4 
            sm:px-16 sm:py-6 ml-2 border-white border-2 bg-gradient shadow-2xl text-white rounded-2xl 
            backdrop-blur font-bold transform transition duration-300 ease-in-out ${scale}`}
          >
            Enter Studio
          </Button>
        </Link>
      </div>
    </div>
  );
};
