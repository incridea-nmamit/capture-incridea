import { api } from '~/utils/api';
import React from 'react';
import TeamCard from '~/components/TeamPage/TeamCard';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';
import TitleSection from '~/components/TeamPage/TeamTitle';
import CameraLoading from '~/components/LoadingAnimation/CameraLoading';

const SocialMediaPage: React.FC = () => {
  const { data: teamMembers, isLoading, error } = api.team.getAllTeams.useQuery();

  if (isLoading) {
    return <CameraLoading/>;
  }
  if (error) {
    return <div className="text-red-500">Error loading media teams: {error.message}</div>;
  }
  if (!teamMembers || teamMembers.length === 0) {
    return <div className="text-white">No media team members found.</div>;
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
    frontenddev: "Front End Developer",
    backenddev: "Back End Developer",
    fullstackdev: "Full Stack Developer",
    teamleadfrontenddev: "Team Lead | Front End Developer",
    teamleadbackenddev: "Team Lead | Back End Developer",
    teamleadfullstackdev: "Team Lead | Full Stack Developer",
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
    .filter(member => member.committee === 'media') 
    .sort((a, b) => designationPriority.indexOf(a.designation) - designationPriority.indexOf(b.designation));


  return (
    <div className="flex flex-col items-center bg-black">
      <FallingClipart />
      {/* Title Section */}
      <TitleSection 
        title="Social Media Team"
        description="Engaging our audience and building community through strategic social media initiatives"
        backgroundImage="https://utfs.io/f/0yks13NtToBiNScub3pjzD2wWm5AylYHcVfipk40e8O9RubF"
      />
      {/* Cards Section */}
      <div className=" z-20 text-white py-6 md:py-12 px-4 md:px-6 flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {/* Render Card components for each team member */}
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

export default SocialMediaPage;
