import React, { useState } from 'react';
import { api } from '~/utils/api';
import { FaTrash } from 'react-icons/fa';

import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { styled } from 'styled-components';
import { Button } from '../ui/button';
import SearchInput from '../ui/search-input';
import Image from 'next/image';
import AddTeamPopUpModel from './add-team-popup';

type Committee = 'media' | 'socialmedia' | 'developer';

const TeamAdmin: React.FC = () => {

  const ScrollableDiv = styled.div`
  max-height: 60vh;
  overflow-y: scroll;

  /* Hide scrollbar in WebKit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox: hide scrollbar */
  scrollbar-width: none;
`;

  const [openAddModel, setOpenAddModel] = useState(false);
  const { data: teams, isLoading, isError, refetch } = api.team.getAllTeams.useQuery();
  const deleteTeam = api.team.deleteTeam.useMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const auditLogMutation = api.audit.log.useMutation();
  const { data: session } = useSession();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{ id: number; name: string } | null>(null);

  const hadelOpenAddTeamModel = () => {
    setOpenAddModel(true)

  };

  const handleDeleteClick = (teamId: number, teamName: string) => {
    setIsDeletePopupOpen(true);
    setTeamToDelete({ id: teamId, name: teamName });
  };

  const confirmDelete = async () => {
    if (teamToDelete) {
      try {
        await deleteTeam.mutateAsync({ id: teamToDelete.id });
        toast.success(`${teamToDelete.name} deleted successfully.`);
        void refetch();
        await auditLogMutation.mutateAsync({
          sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
          description: `TeamManagementAudit - Deleted a team member ${teamToDelete.name}`,
        });
      } catch (error) {
        toast.error(`Error deleting team member ${teamToDelete.name}`);
      } finally {
        setIsDeletePopupOpen(false);
        setTeamToDelete(null);
      }
    }
  };
  const cancelDelete = () => {
    setIsDeletePopupOpen(false);
    setTeamToDelete(null);
  };

  const filteredTeams = teams?.filter((team) => {
    const matchesFilter = selectedFilter === 'all' || team.committee === selectedFilter;
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) return <CameraLoading />;
  if (isError) return <div>Error loading teams. Please try again later.</div>;



  return (
    <div className="relative md:p-0 p-3">
      <h1 className="flex justify-center text-center text-4xl font-Teknaf mb-8 py-5">Team Data and Management</h1>
      <div className="dashboard-grid">
        <SearchInput
          type="text"
          placeholder="Search..."
          className="dashboard-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className='dashboard-controls justify-start items-center flex gap-2'>
          <Select onValueChange={(value) => setSelectedFilter(value)} value={selectedFilter} >
            <SelectTrigger className='select'>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all" defaultChecked>All Days</SelectItem>
                {['media', 'socialmedia', 'developer'].map((option) => <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            className='w-full text-black bg-white'
            onClick={hadelOpenAddTeamModel}
          >
            Add Event
          </Button>
        </div>

        <ScrollableDiv className="dashboard-table" >
          <table className="min-w-full bg-neutral-950 border border-slate-700 scrollable-table font-Trap-Regular text-sm">
            <thead className='sticky top-0  z-10'>
              <tr className="text-black bg-gray-100">
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Name</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Committee</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Position</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Say</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Image</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams?.map((team) => (
                <tr key={team.id} className="hover:bg-gray-800/90">
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">{team.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">{team.committee}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-xs truncate">{team.designation}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-xs truncate ">{team.say}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <Image
                      src={team.image}
                      alt="Team Member"
                      width={16}
                      height={16}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center" onClick={() => handleDeleteClick(team.id, team.name)}>
                    <button onClick={() => handleDeleteClick(team.id, team.name)}>
                      <FaTrash className="text-red-600 hover:text-red-800" />
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredTeams?.length && (
                <tr>
                  <td colSpan={6} className="py-2 px-4 border-b border-slate-700 text-center">No teams found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollableDiv>
      </div>



      {/* Delete confirmation popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-black p-6 rounded-md">
            <h2 className="text-lg mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete {teamToDelete?.name}?</p>
            <div className="flex justify-end mt-4 space-x-4">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {
        openAddModel && (
          <AddTeamPopUpModel
            isPopupOpen={openAddModel}
            setIsPopupOpen={setOpenAddModel} />
        )
      }
    </div>
  );
};


export default TeamAdmin;
