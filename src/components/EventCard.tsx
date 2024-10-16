// app/components/EventCard.tsx
import { FC } from "react";

interface EventCardProps {
  name: string;
  description: string;
  day: number;
  background: string;
}

const EventCard: FC<EventCardProps> = ({ name, description, background }) => {
  return (
    <div
      className="relative h-80 w-64 rounded-lg shadow-lg overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay to dim background */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="absolute bottom-0 p-4 bg-black bg-opacity-75 text-white w-full">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
