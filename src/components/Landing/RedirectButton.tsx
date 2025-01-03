import React from "react";
import { useRouter } from "next/router";

const RedirectButton: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/captures");
  };

  return (
    <button
        onClick={handleRedirect}
        className="px-8 py-3 bg-indigo-600 text-white font-Trap-Regular text-lg  rounded-lg 
        shadow-[4px_4px_0px_#4c4298] transition-all transform hover:shadow-[6px_6px_0px_#6b46c1] 
        hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_#4c4298] 
        active:translate-x-[2px] active:translate-y-[2px] focus:outline-none focus:ring-4 focus:ring-indigo-300"
    >
        Go to Captures
    </button>

  );
};

export default RedirectButton;
