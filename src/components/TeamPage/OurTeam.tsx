"use client";

import TeamCommitteeCard from "./TeamCommitteeCard";

const OurTeam = () => {
  const teams = [
    {
      title: "Developers Team & Editors",
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
    <div className="mt-16 lg:mt-20 ">
      <div className="max-w-screen-xl mx-auto text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-center font-cursive mb-8">
          Our Elite Teams
        </h1>

        {/* Small Description */}
        <p className="text-base sm:text-lg md:text-xl text-justify md:text-center  max-w-3xl text-gray-400 mb-12">
          Our committees have been the backbone of Incridea, working tirelessly
          to ensure a seamless and creative experience. From capturing the essence of the
          event to engaging with audiences online and managing digital platforms, each committee
          has contributed immensely toward making the fest a grand success!
        </p>

        {/* Cards Container */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 mb-20">
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
