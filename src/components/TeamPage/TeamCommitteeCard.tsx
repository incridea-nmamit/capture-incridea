"use client";

import React from "react";
import Image from "next/image";
import { Camera, Computer, PcCase } from "lucide-react";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

const TeamCommitteeCard: React.FC<CardProps> = ({ title, description, imageUrl, href }) => {

  const renderIcon = (title: string) => {
    switch (title) {
      case "Developers Team & Editors":
        return <Computer size={32} className="text-white" />;
      case "Media Team":
        return <Camera size={32} className="text-white" />;
      case "Social Media Team":
        return <PcCase size={32} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <Link href={href} passHref>
      <div className="relative w-72 h-64 md:w-80 md:h-72 rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:border hover:border-white">
        {/* Optimised background image */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-3xl"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-lg rounded-3xl"></div>
        <div className="absolute top-0 left-0 ml-6 mt-6">
          {renderIcon(title)}
        </div>
        <div className="p-6 text-white mt-24 z-50 space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(TeamCommitteeCard);

