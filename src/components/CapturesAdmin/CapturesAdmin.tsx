import React, { useState } from 'react';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { FaTrash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import useUserRole from '~/hooks/useUserRole';
import GalleryBatchUpload from './BatchUpload';
import { BsDashCircleFill } from "react-icons/bs";
const CapturesAdmin: React.FC = () => {
  const addImage = api.gallery.addImage.useMutation();
  const { data: gallery, isLoading: galleryLoading, isError: galleryError, refetch } = api.gallery.getAllGallery.useQuery();
  const { data: events, isLoading: eventsLoading } = api.events.getAllEvents.useQuery();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filteredGallery, setFilteredGallery] = useState(gallery || []);
  const [filters, setFilters] = useState({ state: '', event_category: '', event_name: '' });
  const [newImage, setNewImage] = useState<{ event_name: string; event_category: string }>({ event_name: '', event_category: '' });
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [state, setState] = useState<string>('');
  const deleteImage = api.gallery.deleteImage.useMutation();
  const [captureToDelete, setCaptureToDelete] = useState<{ id: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auditLogMutation = api.audit.log.useMutation();
  const { data: session } = useSession();
  const userRole = useUserRole();
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
  const handleDeleteClick = (eventId: number) => {
    setIsDeletePopupOpen(true);
    setCaptureToDelete({ id: eventId});
  };
  const handleAddCaptureClick = () => {
    setIsPopupOpen(true);
    setNewImage({ event_name: '', event_category: 'events' });
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setNewImage({ event_name: '', event_category: 'events' });
  };

  const confirmDelete = async () => {
    if (captureToDelete) {
      try {
        await deleteImage.mutateAsync({ id: captureToDelete.id });
        void refetch();
        await auditLogMutation.mutateAsync({
          sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
          description: `CaptureManagementAudit - Deleted a capture with id ${captureToDelete.id} as disagreement`,
        });
        toast.success('Successfully deleted the capture');
      } catch (error) {
        toast.error('Error deleting capture');
      } finally {
        setIsDeletePopupOpen(false);
        setCaptureToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    toast.error('Event not deleted.');
    setIsDeletePopupOpen(false);
    setCaptureToDelete(null);
  };

  
  const applyFilters = () => {
    const filtered = gallery?.filter((item) => {
      return (
        (!filters.state || item.state === filters.state) &&
        (!filters.event_category || item.event_category === filters.event_category) &&
        (!filters.event_name || item.event_name === filters.event_name)
      );
    });
    setFilteredGallery(filtered || []);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'event_category') {
      const newState = value === 'events' ? newImage.event_name : value;
      setState(newState);
      setNewImage((prev) => ({ ...prev, [name]: value, event_name: value === 'events' ? '' : '' }));
    } else if (name === 'event_name') {
      const newState = newImage.event_category === 'events' ? value : state;
      setState(newState);
      setNewImage((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleUploadTypeChange = (selectedCategory: string, selectedUploadType: string) => {
    let newState = "pending"; // Default state
  
    if (selectedCategory === "events") {
      if (selectedUploadType === "direct") {
        setState("direct");
      } else if (selectedUploadType === "batch") {
        setState(newImage.event_name || ""); // Use event name for batch upload under events
      }
    } else {
      if (selectedUploadType === "direct") {
        setState("direct");
      } else if (selectedUploadType === "batch") {
        setState(selectedCategory); // Use event category for batch upload
      }
    }
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validation
    if (newImage.event_category === "events" && !newImage.event_name) {
      toast.error("Please select a valid event name.", toastStyle);
      return;
    }
  
    if (!newImage.event_category || !uploadUrl) {
      toast.error("Please complete all required fields.", toastStyle);
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const uploadType = state; // Already dynamically set
      const submissionState = "pending"; // Always pending for submissions
  
      await addImage.mutateAsync({
        ...newImage,
        uploadKey: uploadUrl,
        upload_type: uploadType,
        state: submissionState,
      });
  
      setIsPopupOpen(false);
      setNewImage({ event_name: "", event_category: "events" });
      setUploadUrl("");
      void refetch();
  
      toast.success("Capture Added");
  
      await auditLogMutation.mutateAsync({
        sessionUser: session?.user.name || "Invalid User",
        description: `CaptureManagementAudit - Added a capture to ${newImage.event_name} in ${newImage.event_category} category with uploadUrl ${uploadUrl}`,
      });
    } catch (error) {
      toast.error("Capture Not Uploaded", toastStyle);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

React.useEffect(() => {
  if (gallery) {
    const filtered = gallery.filter((item) => {
      return (
        (!filters.state || item.state === filters.state) &&
        (!filters.event_category || item.event_category === filters.event_category) &&
        (!filters.event_name || item.event_name === filters.event_name)
      );
    });
    setFilteredGallery(filtered);
  }
}, [filters, gallery]);


if (eventsLoading || galleryLoading) return <CameraLoading/>;

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Captures Management</h1>
      <div className="mb-4 flex gap-2 flex-wrap">
        {(userRole === 'admin' || userRole === 'editor') && (
          <button
            onClick={handleAddCaptureClick}
            className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-primary-950/50 font-BebasNeue"
          >
            Add Capture
          </button>
        )}

        <select
          name="event_category"
          value={filters.event_category}
          onChange={(e) => {
            handleFilterChange(e);
            applyFilters(); // Apply filters dynamically
          }}
          className="p-2 border border-slate-700 rounded-xl bg-primary-950/50 text-white font-BebasNeue"
        >
          <option value="">Filter by Category</option>
          <option value="events">Events</option>
          <option value="pronight">Pronight</option>
          <option value="snaps">Snaps</option>
          <option value="behindincridea">Behind Incridea</option>
          <option value="cultural">Cultural</option>
        </select>

        {/* Show Event Name filter if Event Category is "events" or default */}
        {(filters.event_category === "events" || filters.event_category === "") && (
          <>
            {eventsLoading ? (
              <select className="w-full p-2 rounded" disabled>
                <option>Loading events...</option>
              </select>
            ) : (
              <select
                name="event_name"
                value={filters.event_name}
                onChange={(e) => {
                  handleFilterChange(e);
                  applyFilters();
                }}
                className="p-2 border border-slate-700 rounded-xl bg-primary-950/50 text-white font-BebasNeue"
              >
                <option value="">Filter by Event</option>
                {events?.map((event) => (
                  <option key={event.id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>
      {galleryLoading ? (
        <div>Loading...</div>
      ) : galleryError ? (
        <div>Error loading gallery. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <table className="min-w-full border border-gray-300 bg-primary-950/50">
            <thead className="bg-white">
              <tr>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center ">Event-Name</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Capture-Category</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Image</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredGallery?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_name || <BsDashCircleFill />}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_category.charAt(0).toUpperCase() + item.event_category.slice(1)}</td>

                  <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                    <Image src={item.image_path} alt={item.event_name||""} width={20} height={20} className="h-20 w-20 object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center" onClick={() => handleDeleteClick(item.id)}>
                    <button onClick={() => handleDeleteClick(item.id)}>
                      <FaTrash className="text-red-600 hover:text-red-800" />
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
              <label className="block mt-5 mb-2 text-left text-white">Upload Type:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    name="upload_type"
                    checked={state === "direct"}
                    onChange={() => handleUploadTypeChange(newImage.event_category, "direct")}
                    className="mr-2"
                  />
                  Direct
                </label>
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    name="upload_type"
                    checked={state === (newImage.event_category === "events" ? newImage.event_name : newImage.event_category)}
                    onChange={() => handleUploadTypeChange(newImage.event_category, "batch")}
                    className="mr-2"
                  />
                  Batch
                </label>
              </div>


              <button
                type="submit"
                className="p-2 bg-white text-black rounded-xl w-full mt-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Delete confirmation popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-black p-6 rounded-md">
            <h2 className="text-lg mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete  ?</p>
            <div className="flex justify-end mt-4 space-x-4">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <GalleryBatchUpload/>
    </div>
  );
};

export default CapturesAdmin;
