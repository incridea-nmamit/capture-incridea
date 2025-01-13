
import Image from "next/image";
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
      className="relative group cursor-pointer overflow-hidden w-72 h-80 bg-zinc-800 text-gray-50 p-2 hover:border hover:border-s-zinc-50"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-64 group-hover:scale-110 duration-500">
        <Image
          src={background}
          alt={name}
          layout="fill"
          quality={20}
          className="object-cover w-full h-full group-hover:opacity-70 duration-500"
        />
      </div>
      <div className="absolute w-56 left-0 p-5 -bottom-10 group-hover:text-center group-hover:items-center group-hover:justify-center duration-500 group-hover:-translate-y-12">
        <div className="absolute -z-10 left-0 w-72 h-28 opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-gray-300 group-hover:rounded-t-md"></div>
        <h2 className=" group-hover:ml-12 text-xl font-bold text-white group-hover:text-white group-hover:bg-neutral-900 group-hover:mt-1 group-hover:items-center group-hover:text-center group-hover:justify-center group-hover:mb-1  rounded-md p-2">{name}</h2>
        <p className="group-hover:opacity-100 w-56 duration-500 group-hover:text-center opacity-0  text-sm text-white line-clamp-4">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
