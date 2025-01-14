import { FaGithub } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import Image from "next/image";

interface CardProps {
  name: string;
  designation: string;
  description: string;
  imageSrc: string;
}

const TeamCard: React.FC<CardProps> = ({
  name,
  designation,
  description,
  imageSrc,
}) => {
  return (
    <div className="relative w-72 md:w-80 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-80000 rounded-3xl p-4 md:p-6 shadow-xl  border">

      <div className="absolute top-4 left-4 z-10 flex flex-col items-start space-y-4 justify-start mb-6 ml-0 bg-neutral-900 p-1 rounded-xl">
          <Image
            src="/images/Logo/capture-main.png"
            alt="Logo"
            width={80}
            height={45}
            className="h-auto w-auto max-w-32"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
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
        <h2 className="text-xl font-bold text-white">{name}</h2>
        <p className="text-sm text-blue-400 mt-2">{designation}</p>
        <p className="text-sm text-neutral-300 mt-4">{description}</p>
      </div>

      <div className="w-full h-[1px] bg-neutral-700 mt-4"></div>
      <div className="flex justify-center gap-4 mt-4">
        <IoLogoInstagram size={20} className="text-neutral-300 hover:text-blue-400" />
        <FaGithub size={20} className="text-neutral-300 hover:text-blue-400" />
      </div>
    </div>

  );
};

export default TeamCard;

