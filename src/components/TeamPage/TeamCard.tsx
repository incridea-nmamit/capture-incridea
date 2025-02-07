import { Github, InstagramIcon, Linkedin } from "lucide-react";
import Image from "next/image";
import { FaBehance } from "react-icons/fa";

interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
  say: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  behance?: string;
}

const TeamCard: React.FC<CardProps> = ({
  name,
  designation,
  imageSrc,
  say,
  github,
  linkedin,
  instagram,
  behance,
}) => {
  const hasSocialLinks = github || linkedin || instagram || behance
  return (
    <div className="relative w-72 md:w-80 gradient-bg rounded-3xl p-4 md:p-6 border hover:shadow-xl transform transition-transform duration-300 hover:scale-105 bg-neutral-800">
      {/* Image Section */}
      <div className="relative w-full h-60 overflow-hidden rounded-tr-2xl">
        <Image
          src={imageSrc}
          alt={name}
          width={300}
          height={300}
          objectFit="cover"
          className="rounded-tr-2xl"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* Content Section */}
      <div className="mt-4 text-center">
        <h2 className="text-xl font-bold text-white tracking-wider">{name}</h2>
        <p className="text-sm text-blue-400 mt-1">{designation}</p>
      </div>

     
      <div className="w-full h-[1px] bg-neutral-400 mt-4"></div>

      
      <div className="mt-4">
        <p className="text-md text-white text-center italic">❝ {say} ❞</p>
      </div>

      {hasSocialLinks && (
      <div className="flex items-center justify-center gap-4 p-2 mt-4 rounded-xl ">
        {github && (
          <a href={github} target="_blank" rel="noreferrer">
            <Github className="text-white hover:text-blue-400 transition-colors duration-200" />
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer">
            <Linkedin className="text-white hover:text-blue-400 transition-colors duration-200" />
          </a>
        )}
        {instagram && (
          <a href={instagram} target="_blank" rel="noreferrer">
            <InstagramIcon className="text-white hover:text-pink-400 transition-colors duration-200" />
          </a>
        )}
        {behance && (
          <a href={behance} target="_blank" rel="noreferrer">
            <FaBehance className=" w-7 h-7 text-white hover:text-blue-500 transition-colors duration-200" />
          </a>
        )}
      </div>
       )}
    </div>
  );
};

export default TeamCard;
