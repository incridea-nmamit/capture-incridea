import Image from "next/image";
import toast from "react-hot-toast";

/**
 * Props interface for BatchCard component
 */
type CardProps = {
    id: number;             // Unique identifier
    event_name: string | null; // Name of the event
    event_category: string; // Category of the event
    upload_type: string;    // Type of upload
    state: "pending" | "declined" | "approved"; // Current state
    image_path: string;     // Path to image
};

const BatchCard = ({ id, event_name, event_category, upload_type, state, image_path }: CardProps) => {

  return (
    <div className="relative bg-gradient-to-tr from-neutral-800 to-neutral-900 shadow-lg rounded-lg p-3 w-64 flex flex-col items-center">
      <div className="text-sm font-bold text-gray-300 ">{state}</div>
      <div className="w-full h-40 rounded-md overflow-hidden  border-neutral-600 mt-2">
        <Image
          src={image_path}
          alt={event_name || "Image"}
          width={200}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="text-sm text-left text-gray-300 mt-2 bg-neutral-950 px-3 py-2 rounded-xl">
        {event_category === 'event' ? event_name : event_category}
      </div>


    </div>
  );
};

export default BatchCard;
