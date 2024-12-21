import React, { useState } from 'react';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { BsDashCircleFill } from 'react-icons/bs';// Adjust the import path as needed
import CapturePopup from '../CapturePopup';
import PopupComponent from './PopupComponent';

const ApproveCaptures: React.FC = () => {
  const { data: gallery, isLoading, isError, refetch } = api.gallery.getAllGallery.useQuery();
  const updateState = api.gallery.updateState.useMutation();
  const [selectedCapture, setSelectedCapture] = useState<{ id: number; action: 'approve' | 'decline' } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for the selected image

  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  const pendingCaptures = gallery?.filter(item => item.state === 'pending' && item.upload_type !== 'deleted');

  const handleRequestDecision = (captureId: number, action: 'approve' | 'decline') => {
    setSelectedCapture({ id: captureId, action });
  };

  const handleAction = async () => {
    if (selectedCapture) {
      const newState = selectedCapture.action === 'approve' ? 'approved' : 'declined';
      try {
        await updateState.mutateAsync({ id: selectedCapture.id, state: newState });
        toast.success(`Capture ${newState} successfully`, toastStyle);
        setSelectedCapture(null);
        void refetch();
      } catch (error) {
        toast.error(`Error ${newState} capture`, toastStyle);
      }
    }
  };

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  if (isLoading) return <CameraLoading />;
  if (isError) return <div>Error loading gallery. Please try again later.</div>;

  return (
    <div className="p-4">
      <h1 className="text-6xl font-Hunters mb-8 py-5 text-center">Approve Captures</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-primary-950/50">
          <thead className="bg-white">
            <tr>
              <th className="text-black py-2 px-4 border-b border-slate-700 text-center">Event Name</th>
              <th className="text-black py-2 px-4 border-b border-slate-700 text-center">Capture Category</th>
              <th className="text-black py-2 px-4 border-b border-slate-700 text-center">Image</th>
              <th className="text-black py-2 px-4 border-b border-slate-700 text-center">Decision</th>
            </tr>
          </thead>
          <tbody>
            {pendingCaptures?.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 hover:text-black">
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  {item.event_name || <BsDashCircleFill />}
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  {item.event_category.charAt(0).toUpperCase() + item.event_category.slice(1)}
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                  <Image
                    src={item.image_path}
                    alt={item.event_name || ''}
                    width={128}
                    height={128}
                    className="h-32 w-32 object-cover cursor-pointer"
                    onClick={() => handleImageClick(item.image_path)}
                  />
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRequestDecision(item.id, 'approve')}
                      className="bg-green-500 text-white py-1 px-3 rounded mr-2 w-28"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequestDecision(item.id, 'decline')}
                      className="bg-red-500 text-white py-1 px-3 rounded w-28"
                    >
                      Decline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCapture && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-black p-6 rounded-md text-center">
            <h2 className="text-lg text-white mb-4">Confirm Action</h2>
            <p className="text-white mb-4">
              Are you sure you want to {selectedCapture.action} this capture?
            </p>
            <div className="flex justify-center gap-4 w-full">
              <button
                onClick={handleAction}
                className={`${
                  selectedCapture.action === 'approve' ? 'bg-green-600' : 'bg-red-600'
                } font-BebasNeue text-white px-4 py-2 rounded`}
              >
                {selectedCapture.action.charAt(0).toUpperCase() + selectedCapture.action.slice(1)}
              </button>
              <button
                onClick={() => setSelectedCapture(null)}
                className="bg-gray-600 font-BebasNeue text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <PopupComponent
          selectedImage={selectedImage}
          handleClosePopup={handleClosePopup}
        />
      )}
    </div>
  );
};

export default ApproveCaptures;
