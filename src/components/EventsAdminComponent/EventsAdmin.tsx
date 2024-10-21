import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import { Day, EventType } from '@prisma/client';

const EventsAdmin: React.FC = () => {
  const addEvent = api.events.addEvent.useMutation();
  const { data: events, isLoading, isError } = api.events.getAllEvents.useQuery();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // State for the new event form
  const [newEvent, setNewEvent] = useState<{
    name: string;
    description: string;
    type: EventType;
    day: Day;
  }>({
    name: '',
    description: '',
    type: 'core', // Default to first valid designation
    day: 'day1',
  });
  
  const [uploadUrl, setUploadUrl] = useState<string>('');

  const handleUploadComplete = (url: string) => {
    setUploadUrl(url);
  };
  
  const handleAddEventClick = () => {
    setIsPopupOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate required fields
    if (!uploadUrl) {
      console.log('No URL to submit');
      return; // Exit early if no URL
    }

    // Check for required fields
    if (!newEvent.name || !newEvent.description || !newEvent.type || !newEvent.day) {
      alert("Please fill in all required fields.");
      return; // Exit early if required fields are not filled
    }

    try {
      const result = await addEvent.mutateAsync({ ...newEvent, uploadKey: uploadUrl }); // Ensure uploadKey is included
      console.log('Event added:', result);
      setIsPopupOpen(false);
      setNewEvent({ name: '', description: '', type: 'core', day: 'day1' }); // Reset form
      setUploadUrl(''); // Reset upload URL after adding event
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Filter events based on searchTerm, selectedEventType, and selectedDay
  const filteredEvents = events?.filter(event => {
    const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = selectedEventType === 'all' || event.type === selectedEventType;
    const matchesDay = selectedDay === 'all' || event.day === selectedDay;

    return matchesSearchTerm && matchesEventType && matchesDay;
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Events</h1>
      
      {/* Search Bar */}
      <div className="mb-4 flex gap-2">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search..."
            className="text-white p-2 pl-10 border border-slate-700 w-full rounded focus:outline-none focus:ring-2 focus:ring-white h-12 bg-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-600">
            <FaSearch />
          </div>
        </div>

        <select
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value)}
          className="p-2 rounded-none bg-black h-12"
        >
          <option value="all">All</option>
          <option value="core">Core</option>
          <option value="technical">Technical</option>
          <option value="nontechnical">Non Technical</option>
          <option value="special">Special</option>
        </select>

        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 rounded-none bg-black h-12"
        >
          <option value="all">All</option>
          <option value="day1">Day 1</option>
          <option value="day2">Day 2</option>
          <option value="day3">Day 3</option>
        </select>

        <button
          onClick={handleAddEventClick}
          className="bg-blue-500 text-white p-2 rounded-r"
        >
          Add Event
        </button>
      </div>

      {/* Events Table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading events. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white">
              <tr>
                <th className="text-black border border-gray-300 p-2">ID</th>
                <th className="text-black border border-gray-300 p-2">Name</th>
                <th className="text-black border border-gray-300 p-2">Description</th>
                <th className="text-black border border-gray-300 p-2">Image</th>
                <th className="text-black border border-gray-300 p-2">Type</th>
                <th className="text-black border border-gray-300 p-2">Day</th>
                <th className="text-black border border-gray-300 p-2">Visibility</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents?.map((event) => (
                <tr key={event.id}>
                  <td className="border border-gray-300 p-2">{event.id}</td>
                  <td className="border border-gray-300 p-2">{event.name}</td>
                  <td className="border border-gray-300 p-2">{event.description}</td>
                  <td className="border border-gray-300 p-2">
                    <img src={event.image} alt={event.name} className="h-16 w-16 object-cover" />
                  </td>
                  <td className="border border-gray-300 p-2">{event.type}</td>
                  <td className="border border-gray-300 p-2">{event.day}</td>
                  <td className="border border-gray-300 p-2">{event.visibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Event Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-6 rounded w-80 relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Add Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleFormChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block">Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleFormChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <UploadComponent onUploadComplete={handleUploadComplete} />
              <div className="mb-2">
                <label className="block">Type</label>
                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleFormChange}
                  className="border p-2 w-full"
                >
                  <option value="core">Core</option>
                  <option value="technical">Technical</option>
                  <option value="nontechnical">Non Technical</option>
                  <option value="special">Special</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block">Day</label>
                <select
                  name="day"
                  value={newEvent.day}
                  onChange={handleFormChange}
                  className="border p-2 w-full"
                >
                  <option value="day1">Day 1</option>
                  <option value="day2">Day 2</option>
                  <option value="day3">Day 3</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAdmin;
