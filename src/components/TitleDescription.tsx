import React from 'react';

interface TitleDescriptionProps {
  title: string;
  description: string;
  imagePath: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({ title, description, imagePath }) => {
  return (
    <div 
      className="z-50 bg-black relative w-full h-[25vh] md:h-[50vh] bg-cover bg-center" 
      style={{ backgroundImage: `url('${imagePath}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-65 flex flex-col items-center justify-center p-4">
        <h1 className="text-6xl font-Hunters md:text-8xl text-white text-center">{title}</h1>
        <p className="text-sm mt-2 md:text-lg text-gray-300 max-w-2xl text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TitleDescription;
