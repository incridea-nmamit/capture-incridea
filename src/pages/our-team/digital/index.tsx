import { api } from '~/utils/api';
import React, { useEffect, useRef, useCallback } from 'react';
import TeamCard from '~/components/TeamPage/TeamCard'; // Adjust path if needed
import FallingClipart from '~/components/FallingClipart';
import TitleSection from '~/components/TeamPage/TeamTitle';

const DigitalPage: React.FC = () => {
  const { data: teamMembers, isLoading, error } = api.team.getAllTeams.useQuery(); // Fetch data with tRPC
  if (isLoading) {
    return <div className="text-white">Loading...</div>;
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
    digitalhead: "Digital Head",
    digitalcohead: "Digital Co-Head",
    digitalteam: "Digital Team",
    none: ""
  };

  return (
  
    <div className="flex flex-col min-h-screen">
      <FallingClipart />
      {/* Title Section */}
      {/* Title Section */}
      <TitleSection
        title="Digital Team"
        description="Driving our digital presence with innovative marketing strategies and campaigns."
        backgroundImage="/images/digital-bg.png"
      />

      {/* Cards Section */}
      <div className="z-40 py-6 md:py-12 px-4 md:px-6 flex flex-col items-center md:flex-row flex-wrap justify-center gap-6 md:gap-8 flex-grow">
        {/* Render Card components for each team member */}
        {teamMembers.map((member, index) => (
          member.committee === 'digital' && (
            <TeamCard
              key={index}
              imageSrc={member.image} // Assuming 'image' is the correct field from your database
              name={member.name}
              designation={designationMapping[member.designation] || member.designation}
              say={member.say}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default DigitalPage;
