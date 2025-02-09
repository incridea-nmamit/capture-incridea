import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';
import BatchCard from './batch-card';
import { ScrollArea } from "~/components/ui/scroll-area"

type GalleryItem = {
  id: number;
  event_name: string | null;
  event_category: string;
  upload_type: string;
  state: 'pending' | 'declined' | 'approved';
  image_path: string;
  date_time: Date;
}

const GalleryBatchUpload = () => {
  const {
    data: gallery,
    isLoading: galleryLoading,
    isError: galleryError,
    refetch,
  } = api.capture.getAllcaptures.useQuery();
  const batchUpload = api.capture.batchUpload.useMutation();
  const deleteGalleryItem = api.capture.batchUpload.useMutation();

  const [selectedBatch, setSelectedBatch] = useState('');
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  useEffect(() => {
    const storedBatch = sessionStorage.getItem('selectedBatch');
    if (storedBatch) {
      setSelectedBatch(storedBatch);
    }
  }, []);
  useEffect(() => {
    if (gallery && selectedBatch) {
      setFilteredGallery(
        gallery.filter((item: GalleryItem) => item.upload_type === selectedBatch)
      );
    } else {
      setFilteredGallery([]);
    }
  }, [gallery, selectedBatch]);

  const handleBatchUpload = async () => {
    if (filteredGallery.some((item) => item.state !== 'approved')) {
      toast.error('There are unapproved captures. Please request approval.', {
        position: 'top-center',
      });
      return;
    }

    try {
      await Promise.all(
        filteredGallery.map((item) =>
          batchUpload.mutateAsync({
            id: item.id,
            upload_type: 'direct',
            state: 'approved',
          })
        )
      );

      toast.success('Batch uploaded successfully!', { position: 'top-center' });
      refetch();
      setSelectedBatch('');
      sessionStorage.removeItem('selectedBatch'); 
    } catch {
      toast.error('Failed to upload batch. Please try again.', {
        position: 'top-center',
      });
    }
  };
  useEffect(() => {
    if (selectedBatch) {
      sessionStorage.setItem('selectedBatch', selectedBatch);
    }
  }, [selectedBatch]);

  if (galleryLoading) return <p>Loading...</p>;
  if (galleryError) return <p>Error loading gallery data.</p>;

  const eventNames = Array.from(new Set(gallery?.map((item: GalleryItem) => item.event_name) || []));

  return (
    <div className="p-4 bg-neutral-950 rounded-lg shadow-md border items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-white text-center">Batch Management</h1>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4 w-full">
  <div className="w-full md:w-1/2">
    <select
      id="batch"
      value={selectedBatch}
      onChange={(e) => setSelectedBatch(e.target.value)}
      className="block w-full p-2 border rounded-md bg-neutral-950 text-white"
    >
      <option value="" disabled>Select a batch</option>
      {eventNames
        .filter((name): name is string => typeof name === "string")
        .map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      {/* Static options */}
      <option value="shaan">Shaan</option>
      <option value="masalacoffee">Masala Coffee</option>
      <option value="snaps">Snaps</option>
      <option value="behindincridea">Behind Incridea</option>
      <option value="accolades">Accolades</option>
      <option value="faculty">Faculty</option>
      <option value="cultural">Cultural</option>
    </select>
  </div>

  <div className="w-full md:w-auto flex justify-center">
    {selectedBatch && (
      <button
        onClick={handleBatchUpload}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 w-full md:w-auto"
      >
        Upload Batch
      </button>
    )}
  </div>
</div>
      {/* Render filtered gallery cards if a batch is selected */}
      {selectedBatch && (
         <ScrollArea className=" h-full md:h-[1135px] w-full rounded-md ">
        <div className="flex flex-wrap gap-4 mt-4 w-full mx-auto justify-center">
        {filteredGallery.length > 0 ? (
  filteredGallery.map((item) => (
    <BatchCard
      key={item.id}
      id={item.id}
      event_name={item.event_name}
      event_category={item.event_category}
      upload_type={item.upload_type}
      state={item.state}
      image_path={item.image_path}
    />
  ))
) : (
  <div className="flex items-center justify-center h-64 w-full border border-dashed rounded-lg">
    <p className="text-gray-500">Nothing much here for now</p>
  </div>
)}

        </div>
        </ScrollArea>
      )}
    </div>

  );
};

export default GalleryBatchUpload;
