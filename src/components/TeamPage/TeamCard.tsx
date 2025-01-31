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
    <div className="  relative w-72 md:w-80 bg-gradient-to-b from-[#0d1115] to-[#0d1115] rounded-3xl p-4 md:p-6  border hover:shadow-xl transform transition-transform duration-300 hover:scale-105  ">
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
        <h2 className="text-xl font-Teknaf leading-relaxed font-bold text-white tracking-wider">{name}</h2>
        <p className="text-sm text-blue-400  mt-2">{designation}</p>
      </div>

      <div className="w-full h-[1px] bg-neutral-400 mt-4"></div>
      <div>
        <p className="text-md text-white mt-4 text-center font-Trap-Regular">❝ {say} ❞</p>
      </div>
    </div>

  );
};

export default TeamCard;

