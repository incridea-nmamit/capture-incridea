import React, { useState } from 'react';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';

const ApproveCaptures: React.FC = () => {
  // Fetch only pending gallery items
  const { data: gallery, isLoading, isError, refetch } = api.gallery.getAllGallery.useQuery();
  const updateState = api.gallery.updateState.useMutation();
  
  const [selectedCapture, setSelectedCapture] = useState<{ id: number; state: string } | null>(null);

  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  // Filter only pending gallery items
  const pendingCaptures = gallery?.filter(item => item.state === 'pending');

  const handleDoubleClick = (captureId: number) => {
    const capture = gallery?.find(item => item.id === captureId);
    if (capture && capture.state === 'pending') {
      setSelectedCapture({ id: capture.id, state: 'pending' });
    }
  };

  const handleApprove = async () => {
    if (selectedCapture) {
      try {
        await updateState.mutateAsync({ id: selectedCapture.id, state: 'approved' });
        toast.success('Capture approved successfully', toastStyle);
        setSelectedCapture(null);
        void refetch();
      } catch (error) {
        toast.error('Error approving capture', toastStyle);
      }
    }
  };

  const handleDecline = async () => {
    if (selectedCapture) {
      try {
        await updateState.mutateAsync({ id: selectedCapture.id, state: 'declined' });
        toast.success('Capture declined successfully', toastStyle);
        setSelectedCapture(null);
        void refetch();
      } catch (error) {
        toast.error('Error declining capture', toastStyle);
      }
    }
  };

  if (isLoading) return <CameraLoading />;
  if (isError) return <div>Error loading gallery. Please try again later.</div>;

  return (
    <div className="p-4">
      <h1 className="text-6xl font-Hunters mb-8 py-5 text-center">Approve Captures</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-black">
          <thead className="bg-white">
            <tr>
              <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Event Name</th>
              <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Capture Category</th>
              <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Status</th>
              <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Image</th>
            </tr>
          </thead>
          <tbody>
            {pendingCaptures?.map(item => (
              <tr key={item.id} onDoubleClick={() => handleDoubleClick(item.id)} className="hover:bg-gray-50 hover:text-black">
                <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_name}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">{item.event_category.charAt(0).toUpperCase() + item.event_category.slice(1)}</td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-yellow-500"></span> Pending
                  </span>
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                  <Image src={item.image_path} alt={item.event_name||""} width={32} height={32} className="h-32 w-32 object-cover" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCapture && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-black p-6 rounded-md text-center">
            <h2 className="text-lg text-white mb-4">Change Status</h2>
            <p className="text-white mb-4">Do you want to approve or decline this capture?</p>
            <div className="flex justify-center gap-4 w-full">
              <button onClick={handleApprove} className="bg-green-600 font-BebasNeue text-white px-4 py-2 rounded">
                Approve
              </button>
              <button onClick={handleDecline} className="bg-red-600 font-BebasNeue text-white px-4 py-2 rounded">
                Decline
              </button>
            </div>
            <div className="mt-4">
              <button onClick={() => setSelectedCapture(null)} className="bg-gray-600 font-BebasNeue text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveCaptures;
