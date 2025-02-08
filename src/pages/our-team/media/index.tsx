import { api } from "~/utils/api";
import React from "react";
import TeamCard from "~/components/TeamPage/TeamCard";
import TitleSection from "~/components/TeamPage/TeamTitle";

import CameraLoading from "~/components/LoadingAnimation/CameraLoading";

const MediaCommittee: React.FC = () => {
  const {
    data: teamMembers,
    isLoading,
    error,
  } = api.team.getAllTeams.useQuery();

  if (isLoading) {
    return <CameraLoading />;
  }
  if (error) {
    return (
      <div className="text-red-500">
        Error loading media teams: {error.message}
      </div>
    );
  }
  if (!teamMembers || teamMembers.length === 0) {
    return <div className="text-white">No media team members found.</div>;
  }

  // Sort team members by designation priority
  const sortedTeamMembers = teamMembers
    .filter((member) => member.committee === "media")
    .sort((a, b) => {
      const aDesignation = a.designation.toLowerCase();
      const bDesignation = b.designation.toLowerCase();

      const designationPriority = (designation: string) => {
        if (designation.includes("co-head")) {
          return 2;
        }
        if (designation.includes("head")) {
          return 1;
        }
        if (designation.includes("multimedia")) {
          return 3;
        }
        if (
          designation.includes("video") ||
          designation.includes("videography")
        ) {
          return 4;
        }
        if (
          designation.includes("photo") ||
          designation.includes("photography")
        ) {
          return 5;
        }
        return 6;
      };

      const priorityA = designationPriority(aDesignation);
      const priorityB = designationPriority(bDesignation);

      if (priorityA === priorityB) {
        return a.id - b.id;
      }

      return priorityA - priorityB;
    });

  return (
    <div className="gradient-bg z-20 flex flex-col items-center">
      {/* Title Section */}
      <TitleSection
        title="Media Committee"
        description="Capturing the spirit of our fest through stunning visuals. Our media team is dedicated to delivering high-quality content."
        backgroundImage="https://utfs.io/f/0yks13NtToBi9i0lf2ogikwWxTSynjh8EY7rbsRV6vKmQGft"
      />
      {/* Cards Section */}
      <div className="container-size z-20 flex flex-col flex-wrap justify-center gap-6 py-6 md:flex-row md:gap-8 md:py-12">
        {sortedTeamMembers.map((member, index) => (
          <TeamCard
            key={index}
            imageSrc={member.image}
            name={member.name}
            designation={member.designation}
            say={member.say}
            github={member.github!}
            linkedin={member.linkedin!}
            instagram={member.instagram!}
            behance={member.behance!}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaCommittee;