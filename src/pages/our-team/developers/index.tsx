import { api } from '~/utils/api';
import React, { useEffect, useRef, useCallback } from 'react';
import TeamCard from '~/components/TeamPage/TeamCard'; // Adjust path if needed
import TitleSection from '~/components/TeamPage/TeamTitle';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';
import CameraLoading from '~/components/LoadingAnimation/CameraLoading';

const MediaCommittee: React.FC = () => {
  const { data: teamMembers, isLoading, error } = api.team.getAllTeams.useQuery(); // Fetch data with tRPC

  if (isLoading) {
    return <CameraLoading/>;
  }
  if (error) {
    return <div className="text-red-500">Error loading media teams: {error.message}</div>;
  }
  if (!teamMembers || teamMembers.length === 0) {
    return <div className="text-white">No developers found.</div>;
  }

  const designationMapping = {
    mediahead: "Media Head",
    mediacohead: "Media Co-Head",
    leadvideographer: "Lead Videographer",
    leadphotographer: "Lead Photographer",
    photographer: "Photographer",
    videographer: "Videographer",
    aerialvideographer: "Aerial Videographer",
    socialmediahead: "Social Media Head",
    socialmediacohead: "Social Media Co-Head",
    socialmediateam: "SMC Team",
    teamleadfrontenddev: "Team Lead | Front End Developer",
    teamleadbackenddev: "Team Lead | Back End Developer",
    teamleadfullstackdev: "Team Lead | Full Stack Developer",
    frontenddev: "Front End Developer",
    backenddev: "Back End Developer",
    fullstackdev: "Full Stack Developer",
    digitalhead: "Digital Head",
    digitalcohead: "Digital Co-Head",
    digitalteam: "Digital Team",
    none: ""
  };

  const designationPriority = [
    'mediahead',
    'socialmediahead',
    'digitalhead',
    'mediacohead',
    'socialmediacohead',
    'digitalcohead',
    'leadvideographer',
    'leadphotographer',
    'aerialvideographer',
    'photographer',
    'videographer',
    'socialmediateam',
    'teamleadfullstackdev',
    'teamleadfrontenddev',
    'teamleadbackenddev',
    'fullstackdev',
    'frontenddev',
    'backenddev',
    'digitalteam',
    'none'
  ];

  // Sort team members by designation priority
  const sortedTeamMembers = teamMembers
    .filter(member => member.committee === 'developer')
    .sort((a, b) => designationPriority.indexOf(a.designation) - designationPriority.indexOf(b.designation));

  return (
    <div className="flex flex-col items-center bg-black z-20">
      <FallingClipart />
      {/* Title Section */}
      <TitleSection 
        title="Capture Incridea Developers"
        description="Developing for your convinience"
        backgroundImage="https://utfs.io/f/0yks13NtToBiNX5DnCjzD2wWm5AylYHcVfipk40e8O9RubFS"
      />
      {/* Cards Section */}
      <div className=" z-20 py-6 md:py-12 px-4 md:px-6 flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {sortedTeamMembers.map((member, index) => (
          <TeamCard
            key={index}
            imageSrc={member.image}
            name={member.name}
            designation={designationMapping[member.designation] || member.designation}
            say={member.say}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaCommittee;
