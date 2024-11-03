import { api } from '~/utils/api';
import React, { useEffect, useRef, useCallback } from 'react';
import TeamCard from '~/components/TeamCard'; // Adjust path if needed

const SocialMediaPage: React.FC = () => {
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

  return (
    <div className="flex flex-col items-center bg-black">
      {/* Title Section */}
      <div className="relative w-full h-[50vh] md:h-[55vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/socialmedia-bg.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-Hunters md:text-7xl text-white text-center">Social Media Team</h1>
          <p className="mt-2 text-base md:text-lg text-gray-300 max-w-2xl text-center">
            Engaging our audience and building community through strategic social media initiatives.
          </p>
        </div>
      </div>
      {/* Cards Section */}
      <div className="text-white py-6 md:py-12 px-4 md:px-6 flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {/* Render Card components for each team member */}
        {teamMembers.map((member, index) => (
          member.committee === 'socialmedia' && ( // Check if the committee is media
            <TeamCard
              key={index}
              imageSrc={member.image} // Assuming 'image' is the correct field from your database
              name={member.name.toUpperCase()}
              designation={member.designation.toUpperCase()}
              say={member.say}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default SocialMediaPage;
