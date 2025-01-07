"use client";

import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

const TeamCommitteeCard: React.FC<CardProps> = ({ title, description, imageUrl, href }) => {
  return (
    <Link href={href} passHref>
      <div
        className="relative w-64 h-64 md:w-72 md:h-72 bg-cover bg-center flex justify-center rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-xl" />
        <div className="relative flex flex-col items-center justify-center h-full text-white text-2xl text-center font-Teknaf w-3/4">
          {title}
          <p className="mt-2 text-center text-base text-gray-300 font-Trap-Regular">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TeamCommitteeCard;
