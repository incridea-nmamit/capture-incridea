import React, { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import { FaSearch, FaTrash } from 'react-icons/fa';
import UploadComponent from '../UploadComponent';

import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { styled } from 'styled-components';
import { Button } from '../ui/button';
import SearchInput from '../ui/search-input';

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

  const { data: teams, isLoading, isError, refetch } = api.team.getAllTeams.useQuery();
  const addTeam = api.team.addTeam.useMutation();
  const deleteTeam = api.team.deleteTeam.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const auditLogMutation = api.audit.log.useMutation();
  const { data: session } = useSession();
  const [teamForm, setTeamForm] = useState({
    name: '',
    committee: 'media' as Committee,
    designation: '',  // This will be a text input field
    say: '',
  });
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{ id: number; name: string } | null>(null);
  const resetUpload = () => setUploadUrl('');

  useEffect(() => {
    setTeamForm((prev) => ({
      ...prev,
      designation: '',  // Reset designation field when committee changes
    }));
  }, [teamForm.committee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value as Committee }));
  };

  const handleUploadComplete = (url: string) => {
    setUploadUrl(url);
  };

  const handleSubmit = async () => {
    if (!uploadUrl || !teamForm.committee || !teamForm.designation || !teamForm.say) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addTeam.mutateAsync({ ...teamForm, uploadKey: uploadUrl }, {
        onSuccess: () => {
          void refetch();
          setIsPopupOpen(false);
          setTeamForm({ name: '', committee: 'media', designation: '', say: '' });
          setUploadUrl('');
        },
      });
      await auditLogMutation.mutateAsync({
        sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
        description: `TeamManagementAudit - Added a team member ${teamForm.name} for ${teamForm.committee} as ${teamForm.designation} with say ${teamForm.say}`,
      });
      toast.success(`Added a team member ${teamForm.name} as ${teamForm.designation} for ${teamForm.committee}`);
    } catch (error) {
      toast.error(`Error adding team: ${teamForm.name}`);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="relative">
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
            onClick={() => setIsPopupOpen(true)}
          >
            Add Event
          </Button>
        </div>

        <ScrollableDiv className="dashboard-table" >
          <table className="min-w-full bg-primary-950/50 border border-slate-700 scrollable-table font-Trap-Regular text-sm">
            <thead  className='sticky top-0  z-10'>
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
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">{team.designation}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">{team.say}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <img
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

      {/* Add team member popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-cen w-96">
            <button onClick={() => setIsPopupOpen(false)} className="absolute top-6 right-6 text-white p-5">&times;</button>
            <h2 className="text-2xl font-bold text-white mb-4">Add Team Member</h2>

            <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />

            <div className="mt-4">
              <label className="text-white block mb-1">Name</label>
              <textarea
                name="name"
                value={teamForm.name}
                onChange={handleInputChange}
                className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white"
              />
            </div>

            <div className="mt-4">
              <label className="text-white block mb-1">Say</label>
              <textarea
                name="say"
                value={teamForm.say}
                onChange={handleInputChange}
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              />
            </div>

            <div className="mt-4">
              <label className="text-white block mb-1">Committee</label>
              <select
                name="committee"
                value={teamForm.committee}
                onChange={handleSelectChange}
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              >
                {['media', 'socialmedia', 'developer'].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-white block mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={teamForm.designation}
                onChange={handleInputChange}
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              />
            </div>

            <button
              className="mt-4 p-2 bg-white text-black rounded-xl w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAdmin;
