import React, { useState, useCallback } from 'react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import VideoUploadComponent from '../VideoUploadComponent';

const Stories: React.FC = () => {
  const addStories = api.stories.addStories.useMutation();
  const { data: stories, isLoading, isError, refetch } = api.stories.getAllStories.useQuery();
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = api.storycat.getAllCategories.useQuery();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCatPopupOpen, setIsCatPopupOpen] = useState(false); 
  const [description, setDescription] = useState('');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const addCat = api.storycat.addCat.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  
  const resetForm = useCallback(() => {
    setDescription('');
    setUploadUrl('');
    setCategoryName('');
  }, []);

  const handleUploadComplete = (url: string) => setUploadUrl(url);

  const handleAddEventClick = () => {
    setIsPopupOpen(true);
    resetForm();
  };

  const handleAddCategoryClick = () => {
    setIsCatPopupOpen(true); 
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setIsCatPopupOpen(false); 
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!categoryInput.trim()) {  
      toast.error('Please enter a category name', toastStyle);
      return;
    }
    setIsSubmitting(true);
    try {
     
      await addCat.mutateAsync({
        name: categoryInput, 
      });
  
      setCategoryInput(''); 
      setIsCatPopupOpen(false); 
      void refetchCategories(); 
      toast.success('Category added successfully.', toastStyle);
  ;
      
    } catch (error) {
      toast.error('Failed to add category.', toastStyle);
    } finally { 
      setIsSubmitting(false);
    }
  };
  
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
  
    if (!categoryName) {
      toast.error('Please select a category', toastStyle);
      return;
    }
    setIsSubmitting(true);
    try {
      
      await addStories.mutateAsync({
        category_name: categoryName,
        uploadKey: uploadUrl,
      });
  
      resetForm();
      setIsPopupOpen(false);
      void refetch();
      toast.success('Story added successfully.', toastStyle);
    } catch (error) {
      toast.error('Failed to upload story.', toastStyle);
    } finally { 
      setIsSubmitting(false);
    }
  };
  

  if (isLoading) return <CameraLoading />;

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center">Stories Uploads</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleAddEventClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-neutral-950 font-BebasNeue"
        >
          Add Video
        </button>
        <button
          onClick={handleAddCategoryClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-neutral-950 font-BebasNeue"
        >
          Add Category
        </button>
      </div>

      {isError ? (
        <div>Error loading uploads. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto flex flex-col gap-10">
          <table className="min-w-full border border-gray-300 bg-neutral-950 font-Trap-Regular text-sm">
            <thead className="bg-white">
              <tr>
                <th className="text-black py-2 px-4 border-b text-center">Category</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((option) => (
                <tr key={option.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b text-center">{option.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="min-w-full border border-gray-300 bg-neutral-950 font-Trap-Regular text-sm">
            <thead className="bg-white">
              <tr>
                <th className="text-black py-2 px-4 border-b text-center">Category</th>
                <th className="text-black py-2 px-4 border-b text-center">Video</th>
              </tr>
            </thead>
            <tbody>
              {stories?.map((story) => (
                <tr key={story.id} className="hover:bg-gray-800/90">
                  <td className="py-2 px-4 border-b text-center">{story.category_name}</td>
                  <td className="py-2 px-4 border-b text-center flex justify-center">
                    <video src={story.video_path} width={120} height={80} controls />
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
            <h2 className="text-2xl font-bold text-white mb-4">Add Story</h2>
            <button
              onClick={handlePopupClose}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <VideoUploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />
              <label className="block mt-5 mb-2 text-left text-white">Category Name:</label>
              {categoriesLoading ? (
                <select className="w-full p-2 rounded" disabled>
                  <option>Loading categories...</option>
                </select>
              ) : (
                <select
                  name="category_name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories?.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              )}
              <button type="submit" className="p-2 bg-white text-black rounded-xl w-full mt-5">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {isCatPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Add Category</h2>
            <button
              onClick={handlePopupClose}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
            <form onSubmit={handleCategorySubmit}>
              <div className="mt-4">
                <label className="text-white block mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white"
                />
              </div>
              <button type="submit" className="p-2 bg-white text-black rounded-xl w-full mt-5" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
