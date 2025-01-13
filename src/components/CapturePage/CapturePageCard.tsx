import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface CapturePageCardProps {
  title: string;
  description: string;
  imagePath: string;
  link: string;
  cardState?: string;
}

const CapturePageCard: React.FC<CapturePageCardProps> = ({
  title,
  description,
  imagePath,
  link,
  cardState,
}) => {
  const isActive = cardState === "active";

  const handleClick = (event: React.MouseEvent) => {
    if (!isActive) {
      event.preventDefault();
      toast("We are cooking for you, maybe some more time.", {
        icon: '😊',
      });
    }
  };

  return (
    <Link href={link} passHref>
      <div
        onClick={handleClick}
        className="relative border border-gray-50 w-72 h-96 sm:w-80 cursor-pointer bg-black overflow-hidden rounded-2xl transition-transform transform hover:scale-105 shadow-lg group"
      >
        {/* Background Image with Larger Scale on Hover */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${isActive ? "" : "filter grayscale"
            } group-hover:scale-125`}
          style={{
            backgroundImage: `url('${imagePath}')`,
            opacity: 0.5,
          }}
        ></div>

        {/* Black to Transparent Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

        {/* Glow Effect and Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-600 rounded-2xl transition-all duration-500"></div>
        <div className="absolute inset-0 rounded-2xl group-hover:ring-4 ring-indigo-600 opacity-20 transition-all duration-500"></div>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full p-6 text-center text-white">
          <h2 className="text-3xl font-Teknaf mb-2">{title}</h2>
          <p className="text-sm mt-2 max-w-[90%] mx-auto font-Trap-Regular truncate overflow-hidden whitespace-nowrap">
            {description}
          </p>
        </div>
        {/* Glow on Hover */}
        <div className="absolute -inset-1 bg-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"></div>
      </div>
    </Link>

  );
};

export default CapturePageCard;
