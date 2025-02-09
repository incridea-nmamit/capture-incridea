import React, { useState, useEffect } from "react";
import styles from "./CustomButton.module.css";
import { useRouter } from "next/router";

/**
 * CustomButton Component
 * Navigation button with gradient styling and hover effects
 */
const CustomButton: React.FC = () => {
  const router = useRouter();

  // Navigation handler
  const handleClick = () => {
    router.push("/captures"); // Navigates to the 'captures' page
  };

  return (
    <button
      className="text-md border-1 mx-auto my-10 w-52 max-w-xs transform rounded-full border-white bg-gradient-to-br from-gray-900 via-blue-800 to-gray-900 px-6 py-3 font-Trap-Regular font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
      onClick={handleClick}
    >
      <span>Go to Captures</span>
    </button>
  );
};

/**
 * LandingFooter Component
 * Alternating footer with links and credits
 */
export const LandingFooter = () => {
  // Toggle state for footer content
  const [show, setShow] = useState(true);

  // Toggle effect
  useEffect(() => {
    // ...existing code...
  }, [show]);

  // ...existing code...
};

export default CustomButton;
