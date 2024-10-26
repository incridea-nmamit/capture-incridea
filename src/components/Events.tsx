"use client";
import { type FC, useState } from "react";
import EventCard from "./EventCard";
import { AiOutlineSearch } from "react-icons/ai";
import { api } from "~/utils/api";

const Events: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");

  // Fetch events data using tRPC query on the client side.
  const { data: eventsData = [], isLoading } = api.events.getAllEvents.useQuery();

  const filteredEvents = eventsData
    .filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedEventType === "all" || event.type.toLowerCase() === selectedEventType;
      // Correct day comparison logic
      const matchesDay = selectedDay === "all" || event.day === selectedDay;
      return matchesSearch && matchesType && matchesDay;
    })
    .sort((a, b) => a.day.localeCompare(b.day));

  if (isLoading) return <p className="text-white text-center">Loading events...</p>;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-center text-4xl font-bold mb-8 text-white">Events</h1>
      <div className="flex flex-row md:flex-row items-center gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search events by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-700 rounded-lg py-2 pl-10 pr-4 w-full bg-black text-white"
          />
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        {/* Event Type Filter */}
        <select
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value.toLowerCase())}
          className="p-2 border-slate-700 rounded-xl bg-black h-12 text-white"
        >
          <option value="all">All Categories</option>
          <option value="core">Core</option>
          <option value="technical">Technical</option>
          <option value="nontechnical">Non Technical</option>
          <option value="special">Special</option>
        </select>
        {/* Day Filter */}
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 border-slate-700 rounded-xl bg-black h-12 text-white"
        >
          <option value="all">All Days</option>
          <option value="day1">Day 1</option>
          <option value="day2">Day 2</option>
          <option value="day3">Day 3</option>
        </select>
      </div>
      {/* Events Grid */}
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className="flex justify-center items-center">
              <div
                className="bg-black rounded-lg shadow-lg overflow-hidden flex flex-col justify-between aspect-square"
                style={{ height: "300px", width: "300px" }}
              >
                <EventCard
                  name={event.name}
                  description={event.description}
                  day={event.day}
                  background={event.image}
                />
              </div>
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
