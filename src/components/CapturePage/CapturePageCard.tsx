import React from "react";
import Link from "next/link";
import Countdown from "react-countdown";
import toast from "react-hot-toast";

interface CapturePageCardProps {
  title: string;
  description: string;
  imagePath: string;
  link: string;
  cardState?: string;
  cardRtime?: Date;
}

const CapturePageCard: React.FC<CapturePageCardProps> = ({
  title,
  description,
  imagePath,
  link,
  cardState,
  cardRtime,
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
        className="relative w-80 h-96 cursor-pointer bg-black overflow-hidden rounded-2xl transition-transform transform hover:scale-105 shadow-lg group"
      >
        {/* Background Image with Larger Scale on Hover */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${
            isActive ? "" : "filter grayscale"
          } group-hover:scale-125`} 
          style={{
            backgroundImage: `url('${imagePath}')`,
            opacity: 0.6, 
          }}
        ></div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 group-hover:opacity-60 transition-opacity duration-500"></div>

        {/* Glow Effect and Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400 rounded-2xl transition-all duration-500"></div>
        <div className="absolute inset-0 rounded-2xl group-hover:ring-4 ring-indigo-500 opacity-20 transition-all duration-500"></div>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-sm mb-4 max-w-[90%] mx-auto">{description}</p>
          {!isActive && cardRtime && (
            <div className="text-lg font-semibold mt-4">
              <Countdown date={new Date(cardRtime)} />
            </div>
          )}
        </div>

        {/* Glow on Hover */}
        <div className="absolute -inset-1 bg-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"></div>
      </div>
    </Link>
  );
};

export default CapturePageCard;
