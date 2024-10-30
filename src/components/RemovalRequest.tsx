import React, { useState } from 'react';
import UploadComponent from '~/components/UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';

const RemovalRequest: React.FC = () => {
  // Mutation to submit removal requests
  const submitRequest = api.removalrequest.submit.useMutation();
  
  // Fetch removal requests
  const { data: removalRequests, isLoading: requestsLoading, isError: requestsError, refetch } =
    api.removalrequest.getAll.useQuery();
  
  // Fetch events (if needed)
  const { data: events, isLoading: eventsLoading } = api.events.getAllEvents.useQuery();

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-3xl font-extrabold mb-8 py-5 text-center">
        Removal Requests
      </h1>

      {requestsLoading ? (
        <div>Loading...</div>
      ) : requestsError ? (
        <div>Error loading requests. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
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
              {removalRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {request.name}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {request.description}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
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
