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
  const { data: teams, isLoading, isError, refetch } = api.team.getAllTeams.useQuery();
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
        await addTeam.mutateAsync({ ...teamForm, uploadKey: uploadUrl }, {
            onSuccess: () => {
                // Refetch the teams after adding a new one
                refetch();
                console.log('Team added successfully.');
                setIsPopupOpen(false);
                setTeamForm({ name: '', committee: 'media', designation: 'mediahead', say: '' });
            },
        });
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
      <h1 className='flex justify-center text-3xl font-extrabold mb-8 py-5'>Team Data and Management</h1>
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
        <button
            className="ml-2 p-2 border border-slate-700 rounded-xl w-12 h-12 text-white bg-black flex items-center justify-center"
            onClick={(e) => {
                e.preventDefault(); // Prevent default button action
                refetch(); // Call refetch
            }}
        >
            {/* reload icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bootstrap-reboot" viewBox="0 0 16 16">
            <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.8 6.8 0 0 0 1.16 8z"/>
            <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324z"/>
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto  py-5">
        <table className="min-w-full bg-black border border-slate-700">
          <thead>
            <tr className="text-black bg-gray-100">
              <th className="py-2 px-4 border-b border-slate-700 text-center">NAME</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">COMMITEEE</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">POSITION</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">SAY</th>
              <th className="py-2 px-4 border-b border-slate-700 text-center">IMAGE</th>
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
          <div className="bg-black p-6 rounded-3xl shadow-lg relative text-cen">
            <button className="absolute top-2 right-2 text-white p-5" onClick={() => setIsPopupOpen(false)}>
              X
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Add Team Member</h2>

            <UploadComponent onUploadComplete={handleUploadComplete} />
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
