
import { useRouter } from "next/router";
import { type FC } from "react";

interface EventCardProps {
  name: string;
  description: string;
  day: string;
  background: string;
}

const EventCard: FC<EventCardProps> = ({ name, description, background }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/captures/events/${name.replace(/\s+/g, '-')}`);
  };

  return (
    <div
      className="relative w-72 h-72 rounded-lg overflow-hidden border border-gray-700 shadow-md transition-transform duration-300 transform hover:scale-105"
      onClick={handleCardClick}
    >
      <img
        src={background}
        alt={name}
        // fill
        // quality={20}
        className="object-cover w-72 h-72"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end">
        <h2 className="text-lg font-bold text-yellow-400 text-center font-Trap-Black">{name}</h2>
        <p className="text-sm text-white line-clamp-4 text-center font-Trap-Regular">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
