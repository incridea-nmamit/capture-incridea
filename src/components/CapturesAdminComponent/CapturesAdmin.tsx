import React, { useState } from 'react';
import { FaSync } from 'react-icons/fa';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';

const CapturesAdmin: React.FC = () => {
  const addImage = api.gallery.addImage.useMutation();
  const { data: gallery, isLoading: galleryLoading, isError: galleryError, refetch } = api.gallery.getAllGallery.useQuery();
  const { data: events, isLoading: eventsLoading } = api.events.getAllEvents.useQuery();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newImage, setNewImage] = useState<{ event_name: string; event_category: string }>({ event_name: '', event_category: '' });
  const [uploadUrl, setUploadUrl] = useState<string>('');

  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  const handleUploadComplete = (url: string) => {
    setUploadUrl(url);
  };

  const handleAddEventClick = () => {
    setIsPopupOpen(true);
    setNewImage({ event_name: '', event_category: 'events' });
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setNewImage({ event_name: '', event_category: 'events' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'event_category') {
      if (value === 'snaps' || value === 'behindincridea' || value === 'pronight') {
        setNewImage(prev => ({ ...prev, [name]: value, event_name: 'capture' })); // Set default for these categories
      } else {
        setNewImage(prev => ({ ...prev, [name]: value, event_name: '' })); // Reset event_name for other categories
      }
    } else {
      setNewImage(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // If event_category is "events", ensure event_name is not empty
  if (newImage.event_category === 'events' && !newImage.event_name) {
    toast.error('Please select a valid event name.', toastStyle);
    return;
  }

  // If event_category is "pronight", make sure event_name is set to "capture" or another valid value
  if (newImage.event_category === 'pronight' && newImage.event_name === '') {
    toast.error('Event name is required for Pronight category.', toastStyle);
    return;
  }

  // Handle checks for image upload for categories like "snaps" or "behindincridea"
  if ((newImage.event_category === 'snaps' || newImage.event_category === 'behindincridea' || newImage.event_category === 'pronight') && !uploadUrl) {
    toast.error('Please upload an image.', toastStyle);
    return;
  }

  // Ensure event_category is selected
  if (!newImage.event_category) {
    toast.error('Please select a category.', toastStyle);
    return;
  }

  if (!uploadUrl) {
    toast.error('Select and Upload the Image', toastStyle);
    return;
  }

  try {
    const result = await addImage.mutateAsync({ ...newImage, uploadKey: uploadUrl });
    console.log('Image added:', result);
    setIsPopupOpen(false);
    setNewImage({ event_name: 'capture', event_category: 'events' });
    setUploadUrl('');
    void refetch();
    toast.success('Capture Added');
  } catch (error) {
    toast.error('Capture Not Uploaded', toastStyle);
  }
};

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Captures Management</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={handleAddEventClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black font-BebasNeue"
        >
          Add Capture
        </button>
        <button
          onClick={() => refetch()}
          className="ml-2 p-2 border border-slate-700 rounded-xl w-12 h-12 text-white bg-black flex items-center justify-center"
        >
          <FaSync />
        </button>
      </div>

      {galleryLoading ? (
        <div>Loading...</div>
      ) : galleryError ? (
        <div>Error loading gallery. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black border border-gray-300 p-2 ">Event-Name</th>
                <th className="text-black border border-gray-300 p-2">Capture-Category</th>
                <th className="text-black border border-gray-300 p-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {gallery?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_category.charAt(0).toUpperCase() + item.event_category.slice(1)}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                    <Image src={item.image_path} alt={item.event_name} width={32} height={32} className="h-32 w-32 object-cover" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Add Capture</h2>
            <button onClick={handlePopupClose} className="absolute top-6 right-6 text-white p-5">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">Capture:</label>
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />

              <label className="block mt-5 mb-2 text-left text-white">Capture Category:</label>
              <select
                name="event_category"
                value={newImage.event_category}
                onChange={handleFormChange}
                className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="events">Events</option>
                <option value="pronight">Pronight</option>
                <option value="snaps">Snaps</option>
                <option value="behindincridea">Behind Incridea</option>
              </select>

              {newImage.event_category === 'events' && (
                <>
                  <label className="block mt-5 mb-2 text-left text-white">Event Name:</label>
                  {eventsLoading ? (
                    <select className="w-full p-2 rounded" disabled>
                      <option>Loading events...</option>
                    </select>
                  ) : (
                    <select
                      name="event_name"
                      value={newImage.event_name}
                      onChange={handleFormChange}
                      className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
                    >
                      <option value="" disabled>
                        Select an event
                      </option>
                      {events?.map(event => (
                        <option key={event.id} value={event.name}>
                          {event.name}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}

              <button type="submit" className="p-2 bg-white text-black rounded-xl w-full mt-10">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapturesAdmin;
