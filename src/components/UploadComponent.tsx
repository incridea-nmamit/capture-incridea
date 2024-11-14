
import React from 'react';
import { UploadDropzone } from "tailwind.config";

interface UploadComponentProps {
  onUploadComplete: (uploadKey: string) => void; // Define the prop type
  resetUpload: () => void; 
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onUploadComplete }) => {
  return (
    <div>
      <UploadDropzone
        className="bg-black p-[20px] h-50 ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const uploadKey = res?.[0]?.key;
          if (uploadKey) {
            onUploadComplete(uploadKey);
          } else {
            alert("Upload failed or no key received.");
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default UploadComponent;
