import React, { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import { FaSearch } from 'react-icons/fa';
import UploadComponent from '../UploadComponent';

type Committee = 'media' | 'digital' | 'socialmedia' | 'developer';
type MediaDesignation = 'mediahead' | 'mediacohead' | 'leadvideographer' | 'leadphotographer' | 'photographer' | 'videographer' | 'aerialvideographer';
type SocialMediaDesignation = 'socialmediahead' | 'socialmediacohead' | 'socialmediateam';
type DeveloperDesignation = 'frontenddev' | 'backenddev' | 'fullstackdev';
type DigitalDesignation = 'digitalhead' | 'digitalcohead' | 'digitalteam';
type Designation = MediaDesignation | SocialMediaDesignation | DeveloperDesignation | DigitalDesignation;

const TeamAdmin: React.FC = () => {
  const { data: teams, isLoading, isError } = api.team.getAllTeams.useQuery();
  const addTeam = api.team.addTeam.useMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string>('');

  const [teamForm, setTeamForm] = useState<{
    name: string;
    committee: Committee;
    designation: Designation;
    say: string;
  }>({
    name: '',
    committee: 'media',
    designation: 'mediahead',
    say: '',
  });

  const designationOptions: Record<Committee, Designation[]> = {
    media: ['mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer', 'photographer', 'videographer', 'aerialvideographer'],
    socialmedia: ['socialmediahead', 'socialmediacohead', 'socialmediateam'],
    digital: ['digitalhead', 'digitalcohead', 'digitalteam'],
    developer: ['frontenddev', 'backenddev', 'fullstackdev'],
  };

  const [filteredDesignations, setFilteredDesignations] = useState<Designation[]>(designationOptions[teamForm.committee]);

  // Update designations whenever the committee changes
  useEffect(() => {
    const newDesignations = designationOptions[teamForm.committee];
    setFilteredDesignations(newDesignations);

    setTeamForm((prev) => ({
      ...prev,
      designation: newDesignations[0] ?? prev.designation,
    }));
  }, [teamForm.committee]);

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
      await addTeam.mutateAsync({ ...teamForm, uploadKey: uploadUrl });
      console.log('Team added successfully.');
      setIsPopupOpen(false);
      setTeamForm({ name: '', committee: 'media', designation: 'mediahead', say: '' });
    } catch (error) {
      console.error('Error adding team:', error);
    }
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
          className="ml-2 p-2 border border-slate-700 rounded-xl text-white h-full bg-black"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All</option>
          {Object.keys(designationOptions).map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>

        <button className="ml-2 p-2 border border-slate-700 rounded-xl w-32 text-white h-full bg-black" onClick={() => setIsPopupOpen(true)}>
          Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-black border border-slate-700">
          <thead>
            <tr className="text-black bg-gray-100">
              <th className="py-2 px-4 border-b border-slate-700 text-center">Name</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Committee</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Position</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Say</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams?.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50 hover:text-black">
                <td className="py-2 px-4 border-b border-slate-700 text-center">{team.name.toUpperCase()}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">{team.committee.toUpperCase()}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">{team.designation.toUpperCase()}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">{team.say.toUpperCase()}</td>
                <td className="py-2 px-4 border-b border-slate-700 flex justify-center">
                  <img src={team.image} alt="Team Member" className="w-16 h-16 object-cover" />
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={5} className="py-2 px-4 border-b border-slate-700 text-center">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-6 rounded-3xl shadow-lg relative">
            <button className="absolute top-2 right-2 text-white" onClick={() => setIsPopupOpen(false)}>X</button>
            {/* Form Content */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAdmin;
