import { api } from '~/utils/api';
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

  // Sort team members by designation priority
  const sortedTeamMembers = teamMembers
  .filter(member => member.committee === 'developer')
  .sort((a, b) => {
    const aDesignation = a.designation.toLowerCase();
    const bDesignation = b.designation.toLowerCase();


    const designationPriority = (designation: string) => {
      if (designation.includes('lead')) {
        return 1; 
      }
      if (designation.includes('full')) {
        return 2; 
      }
      if (designation.includes('front')) {
        return 3; 
      }
      if (designation.includes('back')) {
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
    <div className="flex flex-col items-center bg-neutral-950 z-20">
      <FallingClipart />
      {/* Title Section */}
      <TitleSection 
        title="Capture Incridea Developers"
        description="Developing for your convinience"
        backgroundImage="https://utfs.io/f/0yks13NtToBiNX5DnCjzD2wWm5AylYHcVfipk40e8O9RubFS"
      />
      {/* Cards Section */}
      <div className="py-6 md:py-12 container-size flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {sortedTeamMembers.map((member, index) => (
          <TeamCard
            key={index}
            imageSrc={member.image}
            name={member.name}
            designation={member.designation}
            say={member.say}
stats={[
        {
          title: "Experience",
          bigText: "5 years",
          regularText: "In software development",
        }
          />
        ))}
      </div>
    </div>
  );
};

export default MediaCommittee;
