/**
 * Our Team Section Component
 * Displays all committee teams with their descriptions
 */
"use client";

import TeamCommitteeCard from "./TeamCommitteeCard";

const OurTeam = () => {
  // Team data configuration
  const teams = [
    {
      title: "Capture Incridea Developers",
      description: "Developing for your convenience.",
      imageUrl:
        "/images/CapturePage/dev-bg.webp",
      href: "/our-team/developers",
    },
    {
      title: "Media Team",
      description: "Capturing the spirit of our fest through stunning visuals.",
      imageUrl:
        "/images/CapturePage/media-bg.webp",
      href: "/our-team/media",
    },
    {
      title: "Social Media Team",
      description: "Engaging audiences and sharing updates with creativity.",
      imageUrl:
        "/images/CapturePage/smc-bg.webp",
      href: "/our-team/socialmedia",
    },
    {
      title: "Documentation Team",
      description: "Preserving every detail with clarity and precision",
      imageUrl:
        "/images/CapturePage/doc-1.webp",
      href: "/our-team/documentation",
    },
  ];

  return (
    <div className="mt-16 lg:mt-20">
      {/* Section header */}
      <div className="max-w-screen-xl mx-auto text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-20">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-center font-Trap-Black  mb-8">
          Our Elite Teams
        </h1>

        {/* Small Description */}
        <p className="text-base sm:text-lg md:text-xl text-justify md:text-center  max-w-3xl text-gray-400 mb-12">
          Our committees have been the backbone of Incridea, working tirelessly
          to ensure a seamless and creative experience. From capturing the essence of the
          event to engaging with audiences online and managing digital platforms, each committee
          has contributed immensely toward making the fest a grand success!
        </p>
      </div>

      {/* Team cards grid */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 mb-20">
        {teams.map((team, index) => (
          <TeamCommitteeCard
            key={index}
            {...team}
          />
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
