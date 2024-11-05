"use client";

import Link from "next/link"; // Import Link from Next.js

const OurTeam = () => {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-black text-white flex flex-col items-center py-12 px-6">
      {/* Page Title */}
      <h1 className="text-8xl font-Hunters mb-8">Our Team</h1>

      {/* Small Description */}
      <p className="text-lg text-center max-w-3xl text-gray-400 mb-12">
        Our committees have been the backbone of Incridea, working tirelessly 
        to ensure a seamless and creative experience. From capturing the essence of the 
        event to engaging with audiences online and managing digital platforms, each committee 
        has contributed immensely toward making the fest a grand success!
      </p>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-center">
        {/* Media Committee Card */}
        <Link href="/our-team/media" passHref>
          <div
            className="relative w-64 h-64 md:w-72 md:h-72 bg-cover bg-center rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            style={{ backgroundImage: "url('/images/media-bg.png')" }}  // Ensure the image path is correct
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div className="relative flex flex-col items-center justify-center h-full text-white text-2xl font-bold">
              Media Committee
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
            style={{ backgroundImage: "url('/images/smc-bg.png')" }}  // Ensure the image path is correct
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div className="relative flex flex-col items-center justify-center h-full text-center text-white text-2xl font-bold">
              Social Media Committee
              <p className="mt-2 text-center text-base text-gray-300">
                Engaging audiences and sharing updates with creativity.
              </p>
            </div>
          </div>
        </Link>

        {/* Digital Committee Card */}
        <Link href="/our-team/digital" passHref>
          <div
            className="relative w-64 h-64 md:w-72 md:h-72 bg-cover bg-center rounded-3xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            style={{ backgroundImage: "url('/images/digital-bg.png')" }}  // Ensure the image path is correct
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div className="relative flex flex-col items-center justify-center h-full text-white text-2xl font-bold">
              Digital Committee
              <p className="mt-2 text-center text-base text-gray-300">
                Innovating digital experiences and managing online presence.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OurTeam;
