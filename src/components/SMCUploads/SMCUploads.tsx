import React, { useState } from 'react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import VideoUploadComponent from '../VideoUploadComponent';
import useUserName from '~/hooks/useUserName';

const SMCUploads: React.FC = () => {
  const userName = useUserName() ?? 'user';
  const addVideo = api.smc.addVideo.useMutation();
  const { data: uploads, isLoading, isError, refetch } = api.smc.getAllUploads.useQuery();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [uploadUrl, setUploadUrl] = useState<string>('');

  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  const handleUploadComplete = (url: string) => setUploadUrl(url);

  const handleAddEventClick = () => {
    setIsPopupOpen(true);
    setDescription('');
    setUploadUrl('');
  };

  const handlePopupClose = () => setIsPopupOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadUrl) {
      toast.error('Please upload the video', toastStyle);
      return;
    }

    if (!description) {
        toast.error('Please enter a description', toastStyle);
        return;
      }

    try {
      await addVideo.mutateAsync({ 
        author: userName, 
        description, 
        uploadKey: uploadUrl 
      });
      setIsPopupOpen(false);
      setDescription('');
      setUploadUrl('');
      void refetch();
      toast.success('Capture added successfully.', toastStyle);
    } catch (error) {
      toast.error('Failed to upload capture.', toastStyle);
    }
  };

  if (isLoading) return <CameraLoading />;

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Captures Management</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleAddEventClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black font-BebasNeue"
        >
          Add Video
        </button>
      </div>

      {isError ? (
        <div>Error loading uploads. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black py-2 px-4 border-b text-center">Author</th>
                <th className="text-black py-2 px-4 border-b text-center">Description</th>
                <th className="text-black py-2 px-4 border-b text-center">Video</th>
              </tr>
            </thead>
            <tbody>
              {uploads?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b text-center">{item.author}</td>
                  <td className="py-2 px-4 border-b text-center">{item.description}</td>
                  <td className="py-2 px-4 border-b text-center flex justify-center">
                    <video src={item.video_path} width={120} height={80} controls />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Add Capture</h2>
            <button
              onClick={handlePopupClose}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <VideoUploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />
              <label className="block mt-4 text-white">Description:</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 w-full border border-slate-700 rounded-xl h-20 bg-black text-white"
              />
              <button type="submit" className="p-2 bg-white text-black rounded-xl w-full mt-5">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMCUploads;
