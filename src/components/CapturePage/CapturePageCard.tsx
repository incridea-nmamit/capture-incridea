import Link from "next/link";
import React from "react";

interface CapturePageCardProps {
  title: string;
  description: string;
  imagePath: string;
  link: string;
}

const CapturePageCard: React.FC<CapturePageCardProps> = ({ title, description, imagePath, link }) => {
  return (
    <Link href={link} passHref>
    <div
      className="relative group w-96 h-48 rounded-xl overflow-hidden cursor-pointer bg-cover bg-center shadow-lg"
      style={{ backgroundImage: `url('${imagePath}')` }}
    >
  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex flex-col items-center justify-center text-white text-center z-10">
    <span className="text-3xl font-bold">{title}</span>
    <p className="mt-2 text-sm">{description}</p>
  </div>
  <div className="absolute inset-0 border-4 border-transparent group-hover:border-indigo-500 rounded-xl transition-all"></div>
</div>

    </Link> 
  );
};

export default CapturePageCard;
