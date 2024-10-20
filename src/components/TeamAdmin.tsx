import React, { useState } from 'react';
import { api } from '~/utils/api';
import { FaSearch } from 'react-icons/fa';
import UploadComponent from './UploadComponent';

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

  const [teamForm, setTeamForm] = useState<{
    name: string;
    committee1: Committee;
    committee2?: Committee;
    designation1: Designation;
    designation2?: Designation;
    designation3?: Designation;
    say: string;
  }>({
    name: '',
    committee1: 'media', // Default to first valid committee
    designation1: 'mediahead', // Default to first valid designation
    say: '',
  });

  const filterOptions = ['all', 'digital', 'media', 'socialmedia', 'developer'];

  const filteredTeams =
    teams?.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === 'all' ||
        team.committee1 === selectedFilter ||
        team.committee2 === selectedFilter;
      return matchesSearch && matchesFilter;
    }) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value as any })); // Type assertion needed here
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async (uploadKey: string) => {
    // Validation: Check required fields
    if (!teamForm.name || !teamForm.committee1 || !teamForm.designation1 || !uploadKey || !teamForm.say) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const result = await addTeam.mutateAsync({ ...teamForm, uploadKey }); // Pass uploadKey here
      console.log('Team added:', result);
      setIsPopupOpen(false);
      setTeamForm({
        name: '',
        committee1: 'media', // Reset to first valid committee
        designation1: 'mediahead', // Reset to first valid designation
        say: '',
      });
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const getDesignationOptions = () => {
    switch (teamForm.committee1) {
      case 'media':
        return ['mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer', 'photographer', 'videographer', 'aerialvideographer'];
      case 'socialmedia':
        return ['socialmediahead', 'socialmediacohead', 'socialmediateam'];
      case 'developer':
        return ['frontenddev', 'backenddev', 'fullstackdev'];
      case 'digital':
        return ['digitalhead', 'digitalcohead', 'digitalteam'];
      default:
        return [];
    }
  };

  const designationOptions = [
    'mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer',
    'photographer', 'videographer', 'aerialvideographer',
    'socialmediahead', 'socialmediacohead', 'socialmediateam',
    'frontenddev', 'backenddev', 'fullstackdev',
    'digitalhead', 'digitalcohead', 'digitalteam',
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading teams. Please try again later.</div>;

  return (
    <div className="relative">
      {/* Search and Filter */}
      <div className="flex items-center mb-4 space-x-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 pl-10 border border-slate-700 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
            <FaSearch />
          </div>
        </div>

        <select
          className="ml-2 p-2 border border-slate-700 rounded text-black h-full"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>

        <button
          className="m-2 p-2  bg-blue-600 text-white rounded "
          onClick={() => setIsPopupOpen(true)}
        >
          Add Team
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black border border-slate-700">
          <thead>
            <tr className="text-black bg-gray-100">
              <th className="py-2 px-4 border-b border-slate-700">Name</th>
              <th className="py-2 px-4 border-b border-slate-700">Committee 1</th>
              <th className="py-2 px-4 border-b border-slate-700">Committee 2</th>
              <th className="py-2 px-4 border-b border-slate-700">Position 1</th>
              <th className="py-2 px-4 border-b border-slate-700">Postion 2</th>
              <th className="py-2 px-4 border-b border-slate-700">Position 3</th>
              <th className="py-2 px-4 border-b border-slate-700">Say</th>
              <th className="py-2 px-4 border-b border-slate-700">Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700">{team.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700">{team.committee1}</td>
                  <td className="py-2 px-4 border-b border-slate-700">{team.committee2}</td>
                  <td className="py-2 px-4 border-b border-slate-700">{team.designation1}</td>
                  <td className="py-2 px-4 border-b border-slate-700">{team.designation2}</td>
                  <td className="py-2 px-4 border-b border-slate-700">{team.designation3}</td>
                  <td className="py-2 px-4 border-b border-slate-700">{team.say}</td>
                  <td className="py-2 px-4 border-b border-slate-700">
                  <img src={team.image} alt={`${team.name}'s Image`} className="w-16 h-16 object-cover" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 border-b border-slate-700 text-center">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-6 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-black text-lg"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-center text-xl mb-4">Add Team Member</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="mb-4 p-2 border border-slate-700 rounded w-full"
              value={teamForm.name}
              onChange={handleInputChange}
            />
            <div className="flex items-center mb-4">
              <select
                name="committee1"
                className="p-2 border border-slate-700 rounded w-full"
                value={teamForm.committee1}
                onChange={handleSelectChange}
              >
                <option value="media">Media</option>
                <option value="digital">Digital</option>
                <option value="socialmedia">Social Media</option>
                <option value="developer">Developer</option>
              </select>
              <button
                className="ml-2 p-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  setTeamForm((prev) => ({ ...prev, committee2: teamForm.committee1 }));
                }}
              >
                +
              </button>
            </div>

            {teamForm.committee2 && (
              <select
                name="committee2"
                className="mb-4 p-2 border border-slate-700 rounded w-full"
                value={teamForm.committee2}
                onChange={handleSelectChange}
              >
                <option value="media">Media</option>
                <option value="digital">Digital</option>
                <option value="socialmedia">Social Media</option>
                <option value="developer">Developer</option>
              </select>
            )}

            <div className="flex items-center mb-4">
              <select
                name="designation1"
                className="mb-4 p-2 border border-slate-700 rounded w-full"
                value={teamForm.designation1}
                onChange={handleSelectChange}
              >
                <option value="">Select Designation 1</option>
                {designationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <button
                className="ml-2 p-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  setTeamForm((prev) => ({ ...prev, designation2: teamForm.designation1 }));
                }}
              >
                +
              </button>
            </div>

            {teamForm.designation2 && (
              <div className="flex items-center mb-4">
                <select
                  name="designation2"
                  className="mb-4 p-2 border border-slate-700 rounded w-full"
                  value={teamForm.designation2}
                  onChange={handleSelectChange}
                >
                  <option value="">Select Designation 2</option>
                  {designationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  className="ml-2 p-2 bg-blue-600 text-white rounded"
                  onClick={() => {
                    setTeamForm((prev) => ({ ...prev, designation3: teamForm.designation2 }));
                  }}
                >
                  +
                </button>
              </div>
            )}

            {teamForm.designation3 && (
              <select
                name="designation3"
                className="mb-4 p-2 border border-slate-700 rounded w-full"
                value={teamForm.designation3}
                onChange={handleSelectChange}
              >
                <option value="">Select Designation 3</option>
                {designationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            )}

            <textarea
              name="say"
              placeholder="Say something about the team member..."
              className="mb-4 p-2 border border-slate-700 rounded w-full"
              value={teamForm.say}
              onChange={handleInputChange}
            />

            <UploadComponent onUploadComplete={(url) => handleSubmit(url)} />

            <button
              className="mt-4 w-full p-2 bg-green-600 text-white rounded"
              onClick={() => handleSubmit('')} // Replace '' with the actual upload key when available
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAdmin;
