import { api } from '~/utils/api';
import React from 'react';
import TeamCard from '~/components/TeamPage/TeamCard';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';
import TitleSection from '~/components/TeamPage/TeamTitle';
import CameraLoading from '~/components/LoadingAnimation/CameraLoading';

const SocialMediaPage: React.FC = () => {
  const { data: teamMembers, isLoading, error } = api.team.getAllTeams.useQuery();

  if (isLoading) {
    return <CameraLoading />;
  }
  if (error) {
    return <div className="text-red-500">Error loading media teams: {error.message}</div>;
  }
  if (!teamMembers || teamMembers.length === 0) {
    return <div className="text-white">No media team members found.</div>;
  }


  const sortedTeamMembers = teamMembers
  .filter(member => member.committee === 'socialmedia')
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
    <div className="flex flex-col items-center bg-neutral-950">
      <FallingClipart />
      {/* Title Section */}
      <TitleSection 
        title="Social Media Team"
        description="Engaging our audience and building community through strategic social media initiatives"
        backgroundImage="https://utfs.io/f/0yks13NtToBiNScub3pjzD2wWm5AylYHcVfipk40e8O9RubF"
      />
      {/* Cards Section */}
      <div className="text-white py-6 md:py-12 container-size flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {/* Render Card components for each team member */}
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

export default SocialMediaPage;
