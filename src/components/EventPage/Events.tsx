import { type FC, useEffect, useState } from "react";
import EventCard from "./EventCard";
import { AiOutlineSearch } from "react-icons/ai";
import { api } from "~/utils/api";
import CameraLoading from "../LoadingAnimation/CameraLoading";
import { useRouter } from "next/router";
import { eventDays, eventTypes } from "~/utils/constants";

const Events: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const { data: eventsData = [], isLoading } = api.events.getAllEvents.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const router = useRouter();
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery(
    { cardName: "Events" }
  );
  useEffect(() => {
    if (cardState === false) {
      router.push("/captures");
    }
  }, [cardState, router]);

  const filteredEvents = eventsData
    .filter((event) => {
      const matchesVisibility = event.visibility === true;
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedEventType === "all" || event.type.toLowerCase() === selectedEventType;
      const matchesDay = selectedDay === "all" || event.day === selectedDay;
      return matchesVisibility && matchesSearch && matchesType && matchesDay;
    })
    .sort((a, b) => a.day.localeCompare(b.day));

  if (isLoading) return <CameraLoading />;

  return (
    <div className=" min-h-screen container-size">
      <div className="flex flex-col md:flex-row items-center gap-4 font-Trap-Regular mt-10">
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Search events by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-100 rounded-lg py-2 pl-10 pr-4 w-full bg-transparent text-white"
          />
          <AiOutlineSearch className=" text-white absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="flex flex-row gap-4 w-fit md:w-auto">
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value.toLowerCase())}
            className="p-2 border-slate-100 rounded-xl bg-transparent h-12 text-white w-fit md:w-auto"
          >
            <option className="text-white bg-neutral-950" value="all">
              All Categories
            </option>
            {Object.entries(eventTypes).map((type) => (
              <option
                key={type[0]}
                className="text-white bg-neutral-950"
                value={type[0]}
              >
                {type[1]}
              </option>
            ))}
          </select>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="p-2 border-slate-100 rounded-xl bg-transparent h-12 text-white w-full md:w-auto"
          >
            <option className="text-white bg-neutral-950" value="all">
              All Days
            </option>
            {Object.entries(eventDays).map((type) => (
              <option
                key={type[0]}
                className="text-white bg-neutral-950"
                value={type[0]}
              >
                {type[1]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-10 mb-20">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div
              key={index}
              className="rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              <EventCard
                name={event.name}
                type={event.type}
                description={event.shortDescription}
                day={event.day}
                background={event.image}
              />
            </div>
          ))
        ) : (
          <p className="text-white text-center">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
