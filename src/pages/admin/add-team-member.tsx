import TeamMemberForm from "../../components/TeamMemberForm";

const AddTeamMemberPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Add New Team Member</h1>
        <TeamMemberForm />
      </div>
    </div>
  );
};

export default AddTeamMemberPage;
