import React, { useState } from 'react';
import { FaSearch, FaSync, FaTrash } from 'react-icons/fa';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';

const CapturesAdmin: React.FC = () => {
  const addImage = api.gallery.addImage.useMutation();
  const deleteImage = api.gallery.deleteImage.useMutation();
  const { data: gallery, isLoading: galleryLoading, isError: galleryError, refetch } = api.gallery.getAllGallery.useQuery();
  const { data: events, isLoading: eventsLoading } = api.events.getAllEvents.useQuery();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [isSliderActive, setIsSliderActive] = useState(false);

  const [newImage, setNewImage] = useState<{ event_name: string; }>({ event_name: '' });
  const [uploadUrl, setUploadUrl] = useState<string>('');

  const handleUploadComplete = (url: string) => {
    setUploadUrl(url);
  };

  const handleAddEventClick = () => {
    setIsPopupOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewImage(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteClick = (id: number) => {
    setDeleteImageId(id);
    setIsDeletePopupOpen(true);
  };
  const handleSliderChange = () => {
    if (isSliderActive) {
      handleDeleteConfirm(); // Call the delete function when slider is slid
    }
    setIsSliderActive(!isSliderActive); // Toggle slider state
  };

  const handleDeleteConfirm = async () => {
    if (deleteImageId !== null && isSliderActive) {
      try {
        await deleteImage.mutateAsync({ id: deleteImageId });
        console.log('Image deleted:', deleteImageId);
        setIsDeletePopupOpen(false);
        setDeleteImageId(null);
        setIsSliderActive(false);
        refetch();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadUrl) {
      console.log('No URL to submit');
      return;
    }

    if (!newImage.event_name) {
      alert("Please select an event name.");
      return;
    }

    try {
      const result = await addImage.mutateAsync({ ...newImage, uploadKey: uploadUrl });
      console.log('Event added:', result);
      setIsPopupOpen(false);
      setNewImage({ event_name: '' });
      setUploadUrl('');
      setIsSliderActive(false); // Resetting the slider state here
      refetch(); // Refetch gallery after adding
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={handleAddEventClick}
          className="bg-black text-white p-2 rounded-xl h-12 font-silkscreen"
        >
          Add
        </button>
        <button
          onClick={() => refetch()}
          className="flex items-center bg-black text-white p-2 rounded-xl font-silkscreen"
        >
          <FaSync />
        </button>
      </div>

      {galleryLoading ? (
        <div>Loading...</div>
      ) : galleryError ? (
        <div className='font-silkscreen'>Error loading events. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="font-silkscreen text-black border border-gray-300 p-2">Event-Name</th>
                <th className="font-silkscreen text-black border border-gray-300 p-2">Image</th>
                <th className="font-silkscreen text-black border border-gray-300 p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {gallery?.map((item) => (
                <tr key={item.id} className='hover:bg-gray-50 hover:text-black'>
                  <td className="font-silkscreen py-2 px-4 border-b border-slate-700 text-center">{item.event_name}</td>
                  <td className="font-silkscreen py-2 px-4 border-b border-slate-700 text-center">
                    <img src={item.image_path} alt={item.event_name} className="h-32 w-32 object-cover" />
                  </td>
                  <td className="font-silkscreen py-2 px-4 border-b border-slate-700 text-center">
                    <button onClick={() => handleDeleteClick(item.id)}>
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-4 rounded shadow-lg w-96">
            <div className='flex justify-end'>
              <h2 className="text-lg font-bold mb-2 text-center px-10">Add Event</h2>
              <button onClick={() => setIsPopupOpen(false)} className="mb-2 text-white px-10 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-white">Event Name:</label>
              {eventsLoading ? (
                <select className="w-full p-2 rounded" disabled>
                  <option>Loading events...</option>
                </select>
              ) : (
                <select
                  name="event_name"
                  value={newImage.event_name}
                  onChange={handleFormChange}
                  className="w-full p-2 rounded"
                >
                  <option value="" disabled>Select an event</option>
                  {events?.map(event => (
                    <option key={event.id} value={event.name}>{event.name}</option>
                  ))}
                </select>
              )}
              <UploadComponent onUploadComplete={handleUploadComplete} />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">Submit</button>
            </form>
          </div>
        </div>
      )}

      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-4 rounded shadow-lg w-96">
            <div className='flex justify-between'>
              <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
              <button onClick={() => setIsDeletePopupOpen(false)} className="mb-2 text-white text-2xl">&times;</button>
            </div>
            <p className="text-white">Do you want to delete the image from {gallery?.find(item => item.id === deleteImageId)?.event_name}?</p>
             <div className="flex items-center mt-4">
              <span className="text-white mr-2">Slide to confirm:</span>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={isSliderActive ? 1 : 0}
                onChange={handleSliderChange} // Call the handler on change
                className="slider w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapturesAdmin;
