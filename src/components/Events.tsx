"use client";

import { FC, useState, useEffect, useRef } from "react";
import EventCard from "./EventCard";
import { AiOutlineSearch } from "react-icons/ai";
import { FaFilter, FaTimes } from "react-icons/fa";

const eventsData = [
  { name: "Pronight 1", type: "Special", description: "Experience an unforgettable night with top artists.", day: 2, background: "/images/pronight1.jpg" },
  { name: "Pronight 2", type: "Special", description: "Another thrilling night of spectacular acts.", day: 3, background: "/images/pronight2.jpg" },
  { name: "Escape Room", type: "Technical", description: "Solve puzzles in this immersive escape room.", day: 2, background: "/images/escaperoom.jpg" },
  { name: "Vibe", type: "Core", description: "Show off your dance skills and groove to the beat!", day: 3, background: "/images/vibe.jpg" },
  { name: "Animeverse", type: "Non Technical", description: "Explore your passion for anime with fun competitions.", day: 2, background: "/images/animeverse.jpg" },
  { name: "Battle of Bands", type: "Core", description: "Witness musical talents battle it out for the top spot.", day: 2, background: "/images/battleofbands.jpg" },
  { name: "RoboRace", type: "Technical", description: "Watch robots compete in a thrilling race.", day: 3, background: "/images/roborace.jpg" },
  { name: "Hogathon", type: "Core", description: "Compete in the fastest eating challenge!", day: 3, background: "/images/hogathon.jpg" },
  { name: "Meme War", type: "Non Technical", description: "Create hilarious memes and compete for the crown.", day: 2, background: "/images/memewar.jpg" },
  { name: "Couture", type: "Core", description: "Strut your style on the runway in a fashion contest.", day: 2, background: "/images/couture.jpg" },
];

const Events: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const filterOptions = ["Day 1", "Day 2", "Day 3", "Technical", "Non Technical", "Core", "Special"];

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filter || filter === `Day ${event.day}` || filter === event.type;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 bg-black">
      <h1 className="text-center text-4xl font-bold mb-8 text-white">Events</h1>

      <div className="relative flex flex-col md:flex-row items-center gap-4 mb-8">
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
        <button
          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg"
          onClick={() => setFilterMenuOpen(!filterMenuOpen)}
        >
          <FaFilter className="mr-2" />
          Filter
        </button>
      </div>

      {filterMenuOpen && (
        <div
          ref={filterMenuRef}
          className="absolute top-[230px] left-0 w-full bg-black p-4 shadow-lg rounded-lg z-50 transition-all"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-lg font-semibold">Filter Events</span>
            <div className="flex items-center gap-4">
              <button
                className="text-white underline"
                onClick={() => setFilter(null)}
              >
                Clear Filters
              </button>
              <FaTimes
                className="text-white text-2xl cursor-pointer"
                onClick={() => setFilterMenuOpen(false)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                className={`py-2 px-4 rounded-lg ${
                  filter === option ? "bg-blue-500" : "bg-gray-700"
                } text-white`}
                onClick={() => {
                  setFilter(option === filter ? null : option);
                  setFilterMenuOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={`flex flex-wrap justify-center gap-6 mt-6 transition-all ${
          filterMenuOpen ? "blur-sm opacity-50" : ""
        }`}
      >
        {filteredEvents.map((event, index) => (
          <div key={index} className="flex justify-center items-center">
            <div
              className="bg-black rounded-lg shadow-lg overflow-hidden flex flex-col justify-between aspect-square"
              style={{ height: "300px", width: "300px" }}
            >
              <EventCard
                name={event.name}
                description={event.description}
                day={event.day}
                background={event.background}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events
