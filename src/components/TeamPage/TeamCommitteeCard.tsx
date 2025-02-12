/**
 * Team Committee Card Component
 * Displays committee information with icon and hover effects
 */
"use client";

import { Camera, Computer, PcCase } from "lucide-react";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

const TeamCommitteeCard: React.FC<CardProps> = ({ title, description, imageUrl, href }) => {
  /**
   * Renders appropriate icon based on committee title
   */
  const renderIcon = (title:string) => {
    switch (title) {
      case "Capture Incridea Developers":
        return <Computer size={32} className="text-white" />;
      case "Media Team":
        return <Camera size={32} className="text-white" />;
      case "Social Media Team":
        return <PcCase size={32} className="text-white" />; 
      case "Documentation Team":
        return <IoDocumentTextOutline size={32} className="text-white" />; 
      default:
        return null; 
    }
  };
  return (
    <Link href={href} passHref>
      <div className="relative bg-blend-saturation w-72 h-64 md:w-80 md:h-72 bg-cover bg-center flex flex-col justify-center items-start rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:border hover:border-white"
        style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-lg rounded-3xl"></div>
        <div className="absolute top-0 left-0 ml-6 mt-6 ">
        {renderIcon(title)}
        </div>

     
        <div className="p-6 text-white mt-24 z-50 space-y-2">
          <h3 className="text-xl font-semibold ">{title}</h3>
          <p className="text-sm ">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default TeamCommitteeCard;