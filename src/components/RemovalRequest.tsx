import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Image from 'next/image';

const RemovalRequest: React.FC = () => {
  const { data: session, status } = useSession();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);

  const { data: removalRequests, isLoading: requestsLoading, isError: requestsError } =
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
    if (actionType === 'approve') {
      await approveMutation({ id: selectedRequest.id });
    } else if (actionType === 'decline') {
      await declineMutation({ id: selectedRequest.id });
    }
    setIsActionPopupOpen(false);
    setIsConfirmPopupOpen(false);
    // Refresh requests or update local state as needed
  };

  const handleOpenConfirmPopup = () => {
    setIsConfirmPopupOpen(true);
  };

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-center">Removal Requests</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block max-w-xs sm:max-w-full bg-gray-700 border border-gray-600 text-white p-2 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 w-52"
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
        <div className="overflow-x-auto py-10">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black border border-gray-300 p-2">Name</th>
                <th className="text-black border border-gray-300 p-2">Email</th>
                <th className="text-black border border-gray-300 p-2">Description</th>
                <th className="text-black border border-gray-300 p-2">Image</th>
                <th className="text-black border border-gray-300 p-2">Document</th>
                <th className="text-black border border-gray-300 p-2">Status</th>
                {statusFilter === 'pending' && ( // Only show Action column for pending requests
                  <th className="text-black border border-gray-300 p-2">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.name.toUpperCase()}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.email.toUpperCase()}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.description.toUpperCase()}</td>
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
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{request.status.toUpperCase()}</td>
                  {statusFilter === 'pending' && ( // Only show action buttons for pending requests
                    <td className="py-2 px-4 border-b border-slate-700 text-center">
                      <div className='flex  flex-col gap-2'>
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
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold">Confirm {actionType === 'approve' ? 'Approval' : 'Decline'}</h2>
            <p>Are you sure you want to {actionType === 'approve' ? 'approve' : 'decline'} this request?</p>
            <div className="mt-4">
              <button onClick={handleConfirmAction} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                Yes
              </button>
              <button onClick={() => setIsConfirmPopupOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
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
