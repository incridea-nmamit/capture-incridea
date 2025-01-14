import React, { useState } from 'react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { FaTrash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import useUserRole from '~/hooks/useUserRole';
import GalleryBatchUpload from './BatchUpload';
import { BsDashCircleFill } from "react-icons/bs";
import Image from 'next/image';
import { AddCapturePopUpModel } from './add-capture-popup';
import { DeleteCapturePopUpModel } from './delete-capture-popup';
const CapturesAdmin: React.FC = () => {
  const { data: gallery, isLoading: galleryLoading, isError: galleryError, refetch } = api.gallery.getAllGallery.useQuery();
  const { data: events, isLoading: eventsLoading } = api.events.getAllEvents.useQuery();
  const [filteredGallery, setFilteredGallery] = useState(gallery || []);
  const [filters, setFilters] = useState({ state: '', event_category: '', event_name: '' });
  const [captureIdToDelete, setCaptureIdToDelete] = useState<number>();

  const userRole = useUserRole();
 

  const [openAddCaptureModel, setOpenAddCaptureModel] = useState(false);
  const [openDeleteCaptureModel, setopenDeleteCaptureModel] = useState(false)

  const handleDeleteClick = (eventId: number) => {
    setopenDeleteCaptureModel(true);
    setCaptureIdToDelete(eventId);
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

  const handleAddCaptureClick = () => {
    setOpenAddCaptureModel(true);
  };

  React.useEffect(() => {
    if (gallery) {
      const filtered = gallery.filter((item) => {
        return (
          item.upload_type !== "deleted" &&
          (!filters.state || item.state === filters.state) &&
          (!filters.event_category || item.event_category === filters.event_category) &&
          (!filters.event_name || item.event_name === filters.event_name)
        );
      });
      setFilteredGallery(filtered);
    }
  }, [filters, gallery]);


  if (eventsLoading || galleryLoading) return <CameraLoading />;

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center">Captures Management</h1>
      <div className="mb-4 flex gap-2 flex-wrap">
        {(userRole === 'admin' || userRole === 'editor') && (
          <button
            onClick={handleAddCaptureClick}
            className="p-2 border border-slate-700 rounded-xl cursor-pointer w-32 text-white h-12 bg-neutral-950 font-BebasNeue"
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
          className="p-2 border cursor-pointer border-slate-700 rounded-xl bg-neutral-950 text-white font-BebasNeue"
        >
          <option value="">Filter by Category</option>
          <option value="events">Events</option>
          <option value="pronite">pronite</option>
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
                className="p-2 border cursor-pointer border-slate-700 rounded-xl bg-neutral-950 text-white font-BebasNeue"
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
          <table className="min-w-full border border-gray-300 bg-neutral-950 font-Trap-Regular text-sm">
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
                <tr key={item.id} className="hover:bg-gray-800/90">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_name || <BsDashCircleFill />}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_category.charAt(0).toUpperCase() + item.event_category.slice(1)}</td>

                  <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                    <Image src={item.image_path} alt={item.event_name || ""} width={20} height={20} className="h-20 w-20 object-cover" />
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

      {
        openAddCaptureModel && (
          <AddCapturePopUpModel isOpen={openAddCaptureModel} setOpen={setOpenAddCaptureModel} />
        )
      }
      {
        openDeleteCaptureModel && (
          <DeleteCapturePopUpModel isOpen={openDeleteCaptureModel} setOpen={setopenDeleteCaptureModel} captureId={captureIdToDelete!} />
        )
      }
      <GalleryBatchUpload />
    </div>
  );
};

export default CapturesAdmin;
