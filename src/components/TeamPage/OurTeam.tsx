"use client";

import Link from "next/link";

const OurTeam = () => {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-primary-950/50 text-white flex flex-col items-center py-12 px-6 z-20">
      {/* Page Title */}
      <h1 className="text-8xl text-center font-Hunters mb-8 z-20">Our Elite Teams</h1>

      {/* Small Description */}
      <p className="text-lg text-center max-w-3xl text-gray-400 mb-12 z-20">
        Our committees have been the backbone of Incridea, working tirelessly 
        to ensure a seamless and creative experience. From capturing the essence of the 
        event to engaging with audiences online and managing digital platforms, each committee 
        has contributed immensely toward making the fest a grand success!
      </p>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-center z-20">

        {/* Developers Card */}
        <Link href="/our-team/developers" passHref>
          <div
            className="relative w-64 h-64 md:w-72 md:h-72 bg-cover bg-center rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            style={{ backgroundImage: "url('https://utfs.io/f/0yks13NtToBiNX5DnCjzD2wWm5AylYHcVfipk40e8O9RubFS')" }} 
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div className="relative flex text-center flex-col items-center justify-center h-full text-white text-2xl font-bold">
              Capture Incridea Developers
              <p className="mt-2 text-center text-base text-gray-300">
                Developing for your convinience.
              </p>
            </div>
          </div>
        </Link>
        {/* Media Committee Card */}
        <Link href="/our-team/media" passHref>
          <div
            className="relative w-64 h-64 md:w-72 md:h-72 bg-cover bg-center rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            style={{ backgroundImage: "url('https://utfs.io/f/0yks13NtToBi9i0lf2ogikwWxTSynjh8EY7rbsRV6vKmQGft')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div className="relative flex flex-col items-center justify-center h-full text-white text-2xl font-bold">
              Media Team
              <p className="mt-2 text-center text-base text-gray-300">
                Capturing the spirit of our fest through stunning visuals.
              </p>
            </div>
          </div>
        </Link>

        {/* Social Media Committee Card */}
        <Link href="/our-team/socialmedia" passHref>
          <div
            className="relative w-64 h-64 md:w-72 md:h-72 bg-cover bg-center rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            style={{ backgroundImage: "url('https://utfs.io/f/0yks13NtToBiNScub3pjzD2wWm5AylYHcVfipk40e8O9RubF')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div className="relative flex flex-col items-center justify-center h-full text-center text-white text-2xl font-bold">
              Social Media Team
              <p className="mt-2 text-center text-base text-gray-300">
                Engaging audiences and sharing updates with creativity.
              </p>
            </div>
          </div>
        </Link>        
      </div>
    </div>
  );
};

export default OurTeam;
