import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Image from 'next/image';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import toast from 'react-hot-toast';

const RemovalRequest: React.FC = () => {
  const { data: session, status } = useSession();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const { data: removalRequests, isLoading: requestsLoading, isError: requestsError, refetch } = 
    api.request.getAll.useQuery();

  useEffect(() => {
    if (session?.user?.role === 'editor') {
      setStatusFilter('pending');
    } else {
      setStatusFilter('all');
    }
  }, [session]);

  const filteredRequests = removalRequests?.filter((request) => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  const handleActionButtonClick = (request: any, type: 'approve' | 'decline') => {
    setSelectedRequest(request);
    setActionType(type);
    setIsActionPopupOpen(true);
  };

  const { mutate: approveMutation } = api.request.approve.useMutation();
  const { mutate: declineMutation } = api.request.decline.useMutation();

  const handleConfirmAction = async () => {
    setIsActionInProgress(true);
    if (actionType === 'approve') {
      await approveMutation({ id: selectedRequest.id });
      const email = selectedRequest.email;
      try {
        const response = await fetch('/api/sendApprovedMail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });
        if (!response.ok) {
          toast.error('Failed to send OTP');
        }
          toast.success('Response Mail Sent Successfully');
          setIsActionInProgress(false);
      } catch (error) {
        toast.error('An error occurred while sending the OTP.');
      }
    } else if (actionType === 'decline') {
      await declineMutation({ id: selectedRequest.id });
      const email = selectedRequest.email;
      try {
        const response = await fetch('/api/sendDeclineMail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });
        if (!response.ok) {
          toast.error('Failed to send OTP');
        }
          toast.success('Response Mail Sent Successfully');
          setIsActionInProgress(false);
      } catch (error) {
        toast.error('An error occurred while sending the OTP.');
      }
    }
    setIsActionInProgress(false);
    setIsActionPopupOpen(false);
    setIsConfirmPopupOpen(false);
    await refetch();
  };

  const handleOpenConfirmPopup = () => {
    setIsConfirmPopupOpen(true);
    setIsActionPopupOpen(false);
  };

  if (status === 'loading') {
    return <CameraLoading />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col justify-between items-center mb-8 gap-6">
        <h1 className="text-6xl font-Hunters text-center">Removal Requests</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="font-BebasNeue block max-w-xs sm:max-w-full bg-gray-700 border border-gray-600 text-white p-2 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 w-52"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending Requests</option>
          <option value="approved">Approved Requests</option>
          <option value="declined">Declined Requests</option>
        </select>
      </div>

      {requestsLoading ? (
        <div>Loading requests...</div>
      ) : requestsError ? (
        <div>Error loading requests. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto py-5">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black border border-gray-300 p-2">Name</th>
                <th className="text-black border border-gray-300 p-2">Email</th>
                <th className="text-black border border-gray-300 p-2">Description</th>
                <th className="text-black border border-gray-300 p-2">Image</th>
                <th className="text-black border border-gray-300 p-2">Document</th>
                <th className="text-black border border-gray-300 p-2">Status</th>
                {statusFilter === 'pending' && (
                  <th className="text-black border border-gray-300 p-2">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.email}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.description}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                    <Image
                      src={request.image_path}
                      alt="Event image"
                      width={128}
                      height={128}
                      className="h-32 w-32 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <Image
                      src={request.idcard}
                      alt="ID card"
                      width={128}
                      height={128}
                      className="h-32 w-32 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</td>
                  {statusFilter === 'pending' && (
                    <td className="py-2 px-4 border-b border-slate-700 text-center">
                      <div className='flex flex-col gap-2'>
                        <button
                          onClick={() => handleActionButtonClick(request, 'approve')}
                          className="bg-green-500 text-white py-1 px-3 rounded mr-2 w-28"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleActionButtonClick(request, 'decline')}
                          className="bg-red-500 text-white py-1 px-3 rounded w-28"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isActionPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-4 rounded shadow-md">
            <h2 className="text-lg font-bold">Action Required</h2>
            <p>You can approve/decline this request upon verification.</p>
            <div className="mt-4">
              <button onClick={handleOpenConfirmPopup} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                {actionType === 'approve' ? 'Approve' : 'Decline'}
              </button>
              <button onClick={() => setIsActionPopupOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-4 rounded shadow-md">
            <h2 className="text-lg font-bold">Confirm {actionType === 'approve' ? 'Approval' : 'Decline'}</h2>
            <p>Are you sure you want to {actionType === 'approve' ? 'approve' : 'decline'} this request?</p>
            <div className="mt-4">
              <button
                onClick={handleConfirmAction}
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                disabled={isActionInProgress} // Disable button when action is in progress
              >
                Yes
              </button>
              <button
                onClick={() => setIsConfirmPopupOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
                disabled={isActionInProgress} // Disable button when action is in progress
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RemovalRequest;
