import React, { useState } from 'react';
import { api } from '~/utils/api';

import { DataTable } from './capture-data-table';
import { deletedCapturecolumns } from './columns/deleted-capture-columns';
import { activeCapturecolumns } from './columns/active-capture-columns';
import GalleryBatchUpload from './BatchUpload';
import UseRefetch from '~/hooks/use-refetch';

const CapturesAdmin: React.FC = () => {
  const refetch = UseRefetch();

  const initialState = sessionStorage.getItem('capture') || 'active';
  const [captureState, setCaptureState] = useState<string>(initialState);

  const { data: activeGalleryData = [], refetch: refetchActive } = 
    api.capture.getAllActivecapturesforAdmin.useQuery(undefined, {
      enabled: captureState === 'active',
    });

  const { data: deletedGalleryData = [], refetch: refetchDeleted } = 
    api.capture.getAllDeletedcapturesforAdmin.useQuery(undefined, {
      enabled: captureState === 'deleted',
    });

  const toggleCaptureState = () => {
    const newState = captureState === 'active' ? 'deleted' : 'active';
    sessionStorage.setItem('capture', newState);
    setCaptureState(newState);

    if (newState === 'active') {
      refetchActive();
    } else {
      refetchDeleted();
    }

    refetch();
  };


  const galleryData = captureState === 'active' ? activeGalleryData : deletedGalleryData;
  const columns = captureState === 'active' ? activeCapturecolumns : deletedCapturecolumns;

  return (
    <div className='p-3'>
      <div className="mb-4">
        <button
          onClick={toggleCaptureState}
          className={`px-4 py-2 rounded-md ${captureState === 'active' ? 'bg-blue-500 text-white' : 'bg-red-500'}`}
        >
          {captureState === 'active' ? 'Active Captures' : 'Deleted Captures'}
        </button>
      </div>

      <DataTable columns={columns} data={galleryData} />

      <GalleryBatchUpload />
    </div>
  );
};

export default CapturesAdmin;
