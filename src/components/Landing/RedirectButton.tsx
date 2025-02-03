import React from "react";
import styles from "./CustomButton.module.css";
import { useRouter } from "next/router";

const CustomButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/captures"); // Navigates to the 'captures' page
  };

  return (
    <button
      className="text-md border-1 z-50 mx-auto my-10 w-52 max-w-xs transform rounded-full border-white bg-gradient-to-br from-gray-900 via-blue-800 to-gray-900 px-6 py-3 font-Trap-Regular font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
      onClick={handleClick}
    >
      <span>Go to Captures</span>
    </button>
  );
};

export default CustomButton;
