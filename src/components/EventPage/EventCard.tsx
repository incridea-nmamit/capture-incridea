
import Image from "next/image";
import { useRouter } from "next/router";
import { type FC } from "react";

interface EventCardProps {
  name: string;
  type: string;
  description: string;
  day: string;
  background: string;
}

const EventCard: FC<EventCardProps> = ({ name, type, description, day, background }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/captures/events/${name.replace(/\s+/g, '-')}`);
  };

  return (
    <div
      className="relative gradient-bg cursor-pointer border border-gray-600 overflow-hidden w-80 h-full bg-neutral-900 text-gray-50 rounded-lg shadow-md hover:border border-gray-700 hover:shadow-lg hover:border-gray-100 transition duration-300 hover:scale-105 "
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative p-2">
        <Image
          src={background}
          alt={name}
          width={300}
          height={80}
          className="object-cover rounded-xl "
        />
      </div>


      <div className="p-4 space-y-3 ">
        <div className=" flex flex-row justify-between items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-white font-cursive tracking-wider">{name}</h2>
          <span className="border border-gray-200 text-gray-200 px-2 py-1 rounded-md ">
            {type}
          </span>
        </div>


        <div className="flex items-end justify-end text-sm text-gray-400 ">
          <span className="bg-black text-gray-200 px-2 py-1 rounded-md">
            {day}
          </span>
        </div>
        <hr/>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-3 ">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
