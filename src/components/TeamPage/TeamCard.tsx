import { FaGithub } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
  say: string;
}

const TeamCard: React.FC<CardProps> = ({
  name,
  designation,
  imageSrc,
  say,
}) => {
  return (
    <div className="w-56 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950
        rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
      {/* Top Section */}
      <div className="relative h-64 rounded-t-lg overflow-hidden">
        {/* Image fills the gradient background */}
        <img
          src={imageSrc}
          alt={name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 h-8 w-32 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950
          transform -skew-x-12 shadow-md"></div>
        <div className="absolute top-0 flex justify-between items-center w-full px-4 py-2">
          {/* Placeholder for logo */}
          <div className="flex gap-5">
            <IoLogoInstagram size={20}/>
            <FaGithub size={20}/>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-gray-400">{designation}</p>
        <p className="py-2 text-xs text-gray-300">{say}</p>
        <div className="flex justify-between mt-4"></div>
      </div>
    </div>
  );
};

export default TeamCard;
