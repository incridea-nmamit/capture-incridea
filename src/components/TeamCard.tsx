// components/Card.tsx
import Image from "next/image";

interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
  say: string;
}

const TeamCard: React.FC<CardProps> = ({ name, designation, imageSrc, say }) => {
  return (
    <div className="border border-gray-600 rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl h-72 w-52 bg-gradient-to-b from-blue-800 to-purple-950"> {/* Gradient background */}
      <div className="relative w-40 h-40 overflow-hidden rounded-md mx-auto mb-4"> {/* Square frame */}
        <Image 
          src={imageSrc} 
          alt={name} 
          layout="fill" // Use layout fill to fill the square
          objectFit="cover" // Ensures the image covers the square without distortion
          className="rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110" 
        />
      </div>
      <h3 className="text-2xl font-bold text-white text-center mb-1">{name}</h3>
      <p className="text-white text-center text-sm">{designation}</p> {/* Yellow color for designation */}
      <p className="text-gray-200 text-center text-xs py-2 flex flex-wrap justify-center">{say}</p>
    </div>
  );
};

export default TeamCard;
