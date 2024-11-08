// ~/components/TitleSection.tsx
import React from 'react';

interface TitleSectionProps {
  title: string;
  description: string;
  backgroundImage: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title, description, backgroundImage }) => {
  return (
    <div 
      className="relative w-full h-[50vh] md:h-[55vh] bg-cover bg-center  z-20"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-Hunters md:text-7xl text-white text-center">{title}</h1>
        <p className="mt-2 text-base md:text-lg text-gray-300 max-w-2xl text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TitleSection;
