import { FaGithub } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import Image from "next/image";

interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
  say: string
}

const TeamCard: React.FC<CardProps> = ({
  name,
  designation,
  imageSrc,
  say
}) => {
  return (
    <div className="  relative w-72 md:w-80 bg-gradient-to-b from-neutral-900 via-purple-800 to-indigo-950 rounded-3xl p-4 md:p-6  border hover:shadow-xl transform transition-transform duration-300 hover:scale-105  ">

      <div className="flex justify-end items-end gap-4 mb-2 ">
        <IoLogoInstagram size={20} className="text-neutral-300 hover:text-blue-400" />
        <FaGithub size={20} className="text-neutral-300 hover:text-blue-400" />
      </div>


      <div className="relative w-full h-60  ">
        <Image
          src={imageSrc}
          alt={name}
          layout="fill"
          objectFit="cover"
          objectPosition="top left"
          className="rounded-t-2xl"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      <div className="mt-5 text-center">
        <h2 className="text-xl font-lobster leading-relaxed font-bold text-white tracking-wider">{name}</h2>
        <p className="text-sm text-blue-400 font-grotesk mt-2">{designation}</p>
      </div>

      <div className="w-full h-[1px] bg-neutral-400 mt-4"></div>
      <div>
        <p className="text-xl text-white mt-4 text-center font-Hunters">❝ {say} ❞</p>
      </div>
    </div>

  );
};

export default TeamCard;

