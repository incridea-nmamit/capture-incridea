import React from 'react';

interface TitleDescriptionProps {
  title: string;
  description: string;
  imagePath: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({ title, description, imagePath }) => {
  return (
    <div
      className="relative w-full h-[50vh] md:h-[55vh] bg-cover bg-center z-20"
      style={{ backgroundImage: `url('${imagePath}')`}}
    >
       <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="pointer-events-none opac absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/75 to-transparent"></div>


      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 mt-36">
        <h1 className="text-4xl font-cursive md:text-6xl text-white text-center">{title}</h1>
        <p className="mt-2 text-base md:text-lg text-gray-300 max-w-2xl text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TitleDescription;
