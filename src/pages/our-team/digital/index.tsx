import { api } from '~/utils/api';
import React from 'react';
import TeamCard from '~/components/TeamCard'; // Adjust path if needed

const DigitalPage: React.FC = () => {
  const { data: teamMembers, isLoading, error } = api.team.getDigitalTeams.useQuery(); // Fetch data with tRPC

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
      <div className="relative w-full h-[50vh] md:h-[40vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/digital-bg.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 ">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center">Digital Team</h1>
          <p className="mt-2 text-base md:text-lg text-gray-300 max-w-2xl text-center">
            Driving our digital presence with innovative marketing strategies and campaigns.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="py-6 md:py-12 px-4 md:px-6 flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {/* Render Card components for each team member */}
        {teamMembers.map((member, index) => (
          <TeamCard
            key={index}
            imageSrc={member.image} // Replace with actual image path
            name={member.name.toUpperCase()}
            designation={member.designation.toUpperCase()}
            say={member.say}
          />
        ))}
      </div>
    </div>
  );
};

export default DigitalPage;
