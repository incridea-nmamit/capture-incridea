/**
 * ApproveCaptures Component
 * Main component for displaying and managing capture approvals
 * Features:
 * - Displays pending captures that need approval
 * - Loading state handling
 * - Error state handling
 */
import React from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import ApproveCard from './approve-card';

const ApproveCaptures: React.FC = () => {
  // Query hook for fetching pending captures with loading and error states
  const { data: pendingCaptures, isLoading, isError, } = api.capture.getApproveCaptures.useQuery();
  if (isLoading) return <CameraLoading />;
  if (isError) return <div>Error loading gallery. Please try again later.</div>;

  return (


    <div className="p-4">
      <h1 className="text-4xl font-Teknaf mb-8 py-5 text-center">Approve Captures</h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-4">
        {pendingCaptures && pendingCaptures.length > 0 ? (
          pendingCaptures.map((item: any) => (
            <ApproveCard
              key={item.id}
              id={item.id}
              eventName={item.event_name || ''}
              category={item.event_category}
              imageUrl={item.image_path}
            />
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-40 bg-gray-700 border border-gray-300 rounded-lg">
            <p className="text-gray-500">No captures to approve for now.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ApproveCaptures;
