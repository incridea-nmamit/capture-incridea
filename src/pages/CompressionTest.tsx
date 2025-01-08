import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import UploadComponent from '~/components/uploadCompressed';

const UploadPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<
    { original: string; compressed: string }[]
  >([]);


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('URL copied to clipboard!');
    });
  };
  const {data: session} = useSession();
  const name = "Test_Name";
  const category = "Test_Category"; 
  const type = "Test_Type"; 

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Upload section */}
      <div className="w-1/2 p-8">
        <UploadComponent
          name={name} 
          category={category} 
          type ={type}
          handleClosePopup={() => console.log("Popup closed!")}
          authorid={0}
        />
      </div>

      {/* Right side - Image viewing section */}
      <div className="w-1/2 bg-white p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Uploaded Images</h2>
        {uploadedImages.length > 0 ? (
          <div className="space-y-8">
            {uploadedImages.map((image, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-3 text-gray-700">Image {index + 1}</p>
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <img
                      src={image.original}
                      alt={`Original ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      onClick={() => copyToClipboard(image.original)}
                      className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                      Copy Original URL
                    </button>
                  </div>
                  <div className="w-1/2">
                    <img
                      src={image.compressed}
                      alt={`Compressed ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      onClick={() => copyToClipboard(image.compressed)}
                      className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                      Copy Compressed URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
