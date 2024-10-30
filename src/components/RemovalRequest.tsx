import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Image from 'next/image';

const RemovalRequest: React.FC = () => {
  const { data: session, status } = useSession(); // Fetch session data
  const [statusFilter, setStatusFilter] = useState<string>('all'); // Default filter state

  // Fetch removal requests
  const { data: removalRequests, isLoading: requestsLoading, isError: requestsError } =
    api.removalrequest.getAll.useQuery();

  // Set default filter based on session role when session is loaded
  useEffect(() => {
    if (session?.user?.role === 'editor') {
      setStatusFilter('pending');
    } else {
      setStatusFilter('all');
    }
  }, [session]);

  // Filter requests based on the selected status
  const filteredRequests = removalRequests?.filter((request) => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-center">Removal Requests</h1>
        {/* Select Dropdown for Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block max-w-xs sm:max-w-full bg-gray-700 border border-gray-600 text-white p-2 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 w-52"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
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
                <th className="text-black border border-gray-300 p-2">Description</th>
                <th className="text-black border border-gray-300 p-2">Image</th>
                <th className="text-black border border-gray-300 p-2">Document</th>
                <th className="text-black border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {request.name}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {request.description}
                  </td>
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
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {request.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RemovalRequest;
