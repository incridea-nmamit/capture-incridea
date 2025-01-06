import { api } from '~/utils/api';
import React from 'react';
import TeamCard from '~/components/TeamPage/TeamCard';
import TitleSection from '~/components/TeamPage/TeamTitle';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';
import CameraLoading from '~/components/LoadingAnimation/CameraLoading';

const MediaCommittee: React.FC = () => {
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

  // Sort team members by designation priority
  const sortedTeamMembers = teamMembers
  .filter(member => member.committee === 'media')
  .sort((a, b) => {
    const aDesignation = a.designation.toLowerCase();
    const bDesignation = b.designation.toLowerCase();


    const designationPriority = (designation: string) => {
      if (designation.includes('co-head')) {
        return 2; 
      }
      if (designation.includes('head')) {
        return 1; 
      }
      if (designation.includes('video') || designation.includes('videography')) {
        return 3; 
      }
      if (designation.includes('photo') || designation.includes('photography')) {
        return 4; 
      }
      return 5; 
    };

    const priorityA = designationPriority(aDesignation);
    const priorityB = designationPriority(bDesignation);


    if (priorityA === priorityB) {
      return a.id - b.id; 
    }

    return priorityA - priorityB;
  });

  return (
    <div className="flex flex-col items-center bg-primary-950/50 z-20">
      <FallingClipart />
      {/* Title Section */}
      <TitleSection 
        title="Media Committee"
        description="Capturing the spirit of our fest through stunning visuals. Our media team is dedicated to delivering high-quality content."
        backgroundImage="https://utfs.io/f/0yks13NtToBi9i0lf2ogikwWxTSynjh8EY7rbsRV6vKmQGft"
      />
      {/* Cards Section */}
      <div className=" z-20 py-6 md:py-12 container-size flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {sortedTeamMembers.map((member, index) => (
          <TeamCard
            key={index}
            imageSrc={member.image} 
            name={member.name}
            designation={member.designation}
            say={member.say}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaCommittee;
