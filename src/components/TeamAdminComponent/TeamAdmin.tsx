import React, { useState, useEffect, useMemo } from 'react';
import { api } from '~/utils/api';
import { FaSearch, FaSync, FaTrash } from 'react-icons/fa';
import UploadComponent from '../UploadComponent';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Committee = 'media' | 'digital' | 'socialmedia' | 'developer';
type MediaDesignation = 'mediahead' | 'mediacohead' | 'leadvideographer' | 'leadphotographer' | 'photographer' | 'videographer' | 'aerialvideographer';
type SocialMediaDesignation = 'socialmediahead' | 'socialmediacohead' | 'socialmediateam';
type DeveloperDesignation = 'frontenddev' | 'backenddev' | 'fullstackdev';
type DigitalDesignation = 'digitalhead' | 'digitalcohead' | 'digitalteam';
type Designation = MediaDesignation | SocialMediaDesignation | DeveloperDesignation | DigitalDesignation;

const TeamAdmin: React.FC = () => {
  const { data: teams, isLoading, isError, refetch } = api.team.getAllTeams.useQuery();
  const addTeam = api.team.addTeam.useMutation();
  const deleteTeam = api.team.deleteTeam.useMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [teamForm, setTeamForm] = useState({
    name: '',
    committee: 'media' as Committee,
    designation: 'mediahead' as Designation,
    say: '',
  });
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{ id: number; name: string } | null>(null);
  const resetUpload = () => setUploadUrl(''); 
  const designationOptions: Record<Committee, Designation[]> = {
    media: ['mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer', 'photographer', 'videographer', 'aerialvideographer'],
    socialmedia: ['socialmediahead', 'socialmediacohead', 'socialmediateam'],
    digital: ['digitalhead', 'digitalcohead', 'digitalteam'],
    developer: ['frontenddev', 'backenddev', 'fullstackdev'],
  };
  const [filteredDesignations, setFilteredDesignations] = useState<Designation[]>(designationOptions[teamForm.committee]);

  useEffect(() => {
    const newDesignations = designationOptions[teamForm.committee];
    setFilteredDesignations(newDesignations);
    setTeamForm((prev) => ({
      ...prev,
      designation: newDesignations[0] as Designation,  // Add `as Designation`
    }));
  }, [teamForm.committee, designationOptions]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value as Committee | Designation }));
  };

  const handleUploadComplete = (url: string) => {
    setUploadUrl(url);
  };

  const handleSubmit = async () => {
    if (!uploadUrl || !teamForm.committee || !teamForm.designation || !teamForm.say) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await addTeam.mutateAsync({ ...teamForm, uploadKey: uploadUrl }, {
        onSuccess: () => {
          void refetch();
          console.log('Team added successfully.');
          setIsPopupOpen(false);
          setTeamForm({ name: '', committee: 'media', designation: 'mediahead', say: '' });
          setUploadUrl('');
        },
      });
    } catch (error) {
      console.error('Error adding team:', error);
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
      } catch (error) {
        toast.error('Error deleting team');
      } finally {
        setIsDeletePopupOpen(false);
        setTeamToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    toast.error('Member not deleted.');
    setIsDeletePopupOpen(false);
    setTeamToDelete(null);
  };

  const filteredTeams = teams?.filter((team) => {
    const matchesFilter = selectedFilter === 'all' || team.committee === selectedFilter;
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading teams. Please try again later.</div>;

  return (
    <div className="relative">
      <h1 className='flex justify-center text-center text-6xl font-Hunters mb-8 py-5'>Team Data and Management</h1>
      <div className="flex items-center mb-4 space-x-2 h-12">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search..."
            className="text-white p-2 pl-10 border border-slate-700 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-white h-12 bg-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
            <FaSearch />
          </div>
        </div>

        <select
          className="font-BebasNeue ml-2 p-2 border border-slate-700 rounded-xl text-white h-full bg-black"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All Positions</option>
          {Object.keys(designationOptions).map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>

        <button className="font-BebasNeue ml-2 p-2 border border-slate-700 rounded-xl w-32 text-white h-full bg-black" onClick={() => setIsPopupOpen(true)}>
          Add Member
        </button>     
      </div>


      {/* Team data table */}
      <div className="overflow-x-auto py-5">
        <table className="min-w-full bg-black border border-slate-700">
          <thead>
            <tr className="text-black bg-gray-100">
              <th className="py-2 px-4 border-b border-slate-700 text-center">Name</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Committee</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Position</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Say</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Image</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams?.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50 hover:text-black">
                <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">{team.name}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">{team.committee}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">
                  {{
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
                  }[team.designation] || team.designation}
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center text-xs">{team.say}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  <Image src={team.image} alt="Team Member" width={16} height={16} className="w-16 h-16 object-cover" />
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center" onClick={() => handleDeleteClick(team.id, team.name)}>
                  <button onClick={() => handleDeleteClick(team.id, team.name)}>
                    <FaTrash className="text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            )) ?? (
              <tr>
                <td colSpan={6} className="py-2 px-4 border-b border-slate-700 text-center">No teams found.</td>
              </tr>
            )}
          </tbody>
        </table>
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
                {Object.keys(designationOptions).map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-white block mb-1">Designation</label>
              <select
                name="designation"
                value={teamForm.designation}
                onChange={handleSelectChange}
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              >
                {filteredDesignations.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button className="mt-4 p-2 bg-white text-black rounded-xl w-full" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAdmin;
