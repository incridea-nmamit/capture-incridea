"use client";

import TeamCommitteeCard from "./TeamCommitteeCard";


const OurTeam = () => {
  const teams = [
    {
      title: "Capture Incridea Developers & Team",
      description: "Developing for your convenience.",
      imageUrl:
        "https://utfs.io/f/0yks13NtToBiNX5DnCjzD2wWm5AylYHcVfipk40e8O9RubFS",
      href: "/our-team/developers",
    },
    {
      title: "Media Team",
      description: "Capturing the spirit of our fest through stunning visuals.",
      imageUrl:
        "https://utfs.io/f/0yks13NtToBi9i0lf2ogikwWxTSynjh8EY7rbsRV6vKmQGft",
      href: "/our-team/media",
    },
    {
      title: "Social Media Team",
      description: "Engaging audiences and sharing updates with creativity.",
      imageUrl:
        "https://utfs.io/f/0yks13NtToBiNScub3pjzD2wWm5AylYHcVfipk40e8O9RubF",
      href: "/our-team/socialmedia",
    },
  ];

  return (
    <div className="mt-20">
      <div className="container-size bg-neutral-950 text-white flex flex-col items-center py-12 z-20">
        {/* Page Title */}
        <h1 className="text-6xl text-center font-Teknaf mb-8 z-20">Our Elite Teams</h1>

        {/* Small Description */}
        <p className="text-lg text-center font-Trap-Regular max-w-3xl text-gray-400 mb-12 z-20">
          Our committees have been the backbone of Incridea, working tirelessly
          to ensure a seamless and creative experience. From capturing the essence of the
          event to engaging with audiences online and managing digital platforms, each committee
          has contributed immensely toward making the fest a grand success!
        </p>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-center z-20 m-16">
          {teams.map((team, index) => (
            <TeamCommitteeCard
              key={index}
              title={team.title}
              description={team.description}
              imageUrl={team.imageUrl}
              href={team.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
