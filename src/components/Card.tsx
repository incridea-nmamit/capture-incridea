// components/Card.tsx
import Image from "next/image";

interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
}

const Card: React.FC<CardProps> = ({ name, designation, imageSrc }) => {
  return (
    <div className="border rounded-md p-4 shadow-md">
      <Image src={imageSrc} alt={name} width={200} height={200} className="rounded-md" />
      <h3 className="text-xl font-semibold mt-2">{name}</h3>
      <p className="text-gray-500">{designation}</p>
    </div>
  );
};

export default Card;
