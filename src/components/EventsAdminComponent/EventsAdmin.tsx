import React, { useState } from 'react';
import { FaSearch, FaSync } from 'react-icons/fa'; // Import the reload icon
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import type { Day, EventType } from '@prisma/client';
import Image from 'next/image';

const EventsAdmin: React.FC = () => {
  const addEvent = api.events.addEvent.useMutation();
  const updateVisibility = api.events.updateEventVisibility.useMutation();
  const { data: events, isLoading, isError, refetch } = api.events.getAllEvents.useQuery(); // Get refetch method

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [visibilityPopup, setVisibilityPopup] = useState<{
    id: number;
    name: string;
    currentVisibility: string;
    newVisibility: string;
  } | null>(null);
  
  const [newEvent, setNewEvent] = useState<{
    name: string;
    description: string;
    shortDescription: string;
    type: EventType;
    day: Day;
  }>({
    name: '',
    description: '',
    shortDescription: '',
    type: 'core',
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
    e.preventDefault();
  
    // Trim spaces from the name field
    const trimmedName = newEvent.name.trim();
  
    if (!uploadUrl) {
      console.log('No URL to submit');
      return;
    }
  
    if (!trimmedName || !newEvent.description || !newEvent.type || !newEvent.day) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const result = await addEvent.mutateAsync({ ...newEvent, name: trimmedName, uploadKey: uploadUrl });
      console.log('Event added:', result);
      setIsPopupOpen(false);
      setNewEvent({ name: '', description: '', shortDescription: '', type: 'core', day: 'day1' });
      setUploadUrl('');
      void refetch(); // Refetch events after adding
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };
  interface EventData {
    id: number; // or number, depending on your ID type
    name: string;
    visibility: 'active' | 'inactive';
  }
  
  const handleDoubleClickVisibility = (event: EventData) => {
    setVisibilityPopup({
      id: event.id,
      name: event.name,
      currentVisibility: event.visibility,
      newVisibility: event.visibility === 'active' ? 'inactive' : 'active',
    });
  };
  

  const handleVisibilityChange = async (id: number, name: string, currentState: string) => {
    const newState = currentState === "active" ? "inactive" : "active";    
      try {
        await updateVisibility.mutateAsync({ id });
        console.log(`Visibility updated to ${newState}`);
        setVisibilityPopup(null)
        void refetch(); // Refetch events after visibility change
      } catch (error) {
        console.error('Error updating visibility:', error);
      }
  };
  const filteredEvents = events?.filter(event => {
    const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = selectedEventType === 'all' || event.type === selectedEventType;
    const matchesDay = selectedDay === 'all' || event.day === selectedDay;

    return matchesSearchTerm && matchesEventType && matchesDay;
  });

  return (
    <div className="p-4">  
    <h1 className='flex justify-center text-6xl font-Hunters mb-8 py-5 text-center'>Event Data and Management</h1> 
      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search..."
            className=" text-white p-2 pl-10 border border-slate-700 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-white h-12 bg-black"
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
          className="p-2 border-slate-700 rounded-xl bg-black h-12 "
        >
          <option className='' value="all">All Category</option>
          <option className='' value="core">Core</option>
          <option className='' value="technical">Technical</option>
          <option className='' value="nontechnical">Non Technical</option>
          <option className='' value="special">Special</option>
        </select>

        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 border-slate-700 rounded-xl bg-black h-12 "
        >
          <option className='' value="all">All Days</option>
          <option className='' value="day1">Day 1</option>
          <option className='' value="day2">Day 2</option>
          <option className='' value="day3">Day 3</option>
        </select>

        <button
          onClick={handleAddEventClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black" 
        >
          Add Event
        </button>

        {/* Reload Button */}
        <button
          onClick={() => refetch()} // Wrap refetch in an arrow function
          className="ml-2 p-2 border border-slate-700 rounded-xl w-12 h-12 text-white bg-black flex items-center justify-center"
        >
          <FaSync />
        </button>

      </div>

      {/* Events Table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className=''>Error loading events. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black border border-slate-700">
            <thead>
              <tr className='text-black bg-gray-100'>
                <th className="py-2 px-4 border-b border-slate-700 text-center">Name</th>
                <th className="py-2 px-4 border-b border-slate-700 text-center">Description</th>                
                <th className="py-2 px-4 border-b border-slate-700 text-center">Category</th>
                <th className="py-2 px-4 border-b border-slate-700 text-center">Day</th>
                <th className="py-2 px-4 border-b border-slate-700 text-center">Visibility</th>
                <th className="py-2 px-4 border-b border-slate-700 text-center">BG Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents?.map((event) => (
                <tr key={event.id} className='hover:bg-gray-50 hover:text-black'>
                  <td className=" py-2 px-4 border-b border-slate-700 text-center">{event.name.toUpperCase()}</td>
                  <td className=" py-2 px-4 border-b border-slate-700 text-center">{event.description.toUpperCase()}</td>                  
                  <td className=" py-2 px-4 border-b border-slate-700 text-center">{event.type.toUpperCase()}</td>
                  <td className=" py-2 px-4 border-b border-slate-700 text-center">{event.day.toUpperCase()}</td>
                  <td
                    className=" py-2 px-4 border-b border-slate-700 text-center cursor-pointer"
                    onDoubleClick={() => handleDoubleClickVisibility(event)}
                  >
                    {event.visibility.toUpperCase()}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                  <div className="relative h-16 w-16">
                  <Image src={event.image} alt="Team Member" width={16} height={16} className="w-16 h-16 object-cover" />
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup for Adding Event */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-cen w-96">
              <h2 className="text-2xl font-bold text-white mb-4 " >Add Event</h2>
              <button onClick={() => setIsPopupOpen(false)} className="absolute top-6 right-6 text-white p-5">&times;</button>
            <form onSubmit={handleSubmit}>

              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />


              <div className="mt-4">
                <label className="text-white block mb-1">Name</label>
                <textarea
                  name="name"
                  value={newEvent.name}
                  onChange={handleFormChange}
                  className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white"
                />
              </div>


            <div className="mt-4">
              <label className="text-white block mb-1">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleFormChange}
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              />


            </div>
            <div className="mt-4">
              <label className="text-white block mb-1"> Short Description</label>
              <textarea
                name="shortDescription" // Ensure this matches the state key
                value={newEvent.shortDescription} // Bind to shortDescription state
                onChange={handleFormChange}
                className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white"
              />
            </div>
            <div className="mt-4">
              <select
                name="type"
                value={newEvent.type}
                onChange={handleFormChange}
                required
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              >
                <option value="core">Core</option>
                <option value="technical">Technical</option>
                <option value="nontechnical">Non Technical</option>
                <option value="special">Special</option>
              </select>
            </div>
            <div className="mt-4">
              <select
                name="day"
                value={newEvent.day}
                onChange={handleFormChange}
                required
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              >
                <option value="day1">Day 1</option>
                <option value="day2">Day 2</option>
                <option value="day3">Day 3</option>
              </select>
            </div>
              
              <button type="submit" className="mt-4 p-2 bg-white text-black rounded-xl w-full">Submit</button>
            </form>
            
          </div>
        </div>
      )}

      {/* Popup for Visibility Change */}
      {visibilityPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="flex-col justify-center bg-black p-14 rounded-3xl shadow-lg w-[40vw] h-auto ">
            <h2 className="text-lg font-bold mb-2 text-center">Change Visibility</h2>
            <div>
              <p className='text-center'>CURRENT : {visibilityPopup.currentVisibility.toUpperCase()}</p>
              <p className='text-center'>ARE YOU SURE YO WANT TO CHANGE IT TO {visibilityPopup.newVisibility.toUpperCase()} ?</p>
              <div className='flex justify-center gap-5 p-5'>
                <button onClick={() => handleVisibilityChange(visibilityPopup.id, visibilityPopup.name, visibilityPopup.currentVisibility)} className="  bg-white text-black p-2 rounded mt-2">Confirm ✓</button>
                <button onClick={() => setVisibilityPopup(null)} className="  bg-white text-black p-2 rounded mt-2">Cancel ✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAdmin;
