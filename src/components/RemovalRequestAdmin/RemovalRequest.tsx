import React, { useState } from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { DataTable } from './tanstack-table/data-table';
import { columns, pendingColumns,  } from './tanstack-table/coloum';
const RemovalRequest: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const { data: removalRequests = [], } =
    api.request.getAll.useQuery();

  const filteredRequests = removalRequests?.filter((request) => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

 


  if (status === 'loading') {
    return <CameraLoading />;
  }


  return (
    <>
      <div className="p-4 relative">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center justify-start items-start mb-8 gap-4">
          <h1 className="text-2xl sm:text-4xl font-Teknaf text-center sm:text-left w-fit md:w-auto">
            Removal Requests
          </h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-BebasNeue block w-full md:w-fit bg-gray-700 border border-gray-600 text-white p-2 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Requests</option>
            <option value="approved">Approved Requests</option>
            <option value="declined">Declined Requests</option>
          </select>
        </div>
        {
          statusFilter === 'pending' ?
            (
              <DataTable columns={pendingColumns} data={filteredRequests!} />
            ) : (
              <DataTable columns={columns} data={filteredRequests!} />
            )

        }

      </div>
    </>
  );
};

export default RemovalRequest;
