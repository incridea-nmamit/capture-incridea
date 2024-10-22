// components/Card.tsx
import Image from "next/image";

interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
  say : string;
}

const TeamCard: React.FC<CardProps> = ({ name, designation, imageSrc ,say }) => {
  return (
    <div className="border rounded-md p-4 shadow-md">
      <Image src={imageSrc} alt={name} width={200} height={200} className="rounded-md" />
      <h3 className="text-xl font-semibold mt-2 text-white py-1 text-center">{name}</h3>
      <p className="text-white text-center text-xs">{designation}</p>
      <p className="text-gray-500 text-center">{say}</p>
    </div>
  );
};

export default TeamCard;
