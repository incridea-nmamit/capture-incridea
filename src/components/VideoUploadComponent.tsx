
import React from 'react';
import { UploadDropzone } from "tailwind.config";

interface VideoUploadComponentProps {
  onUploadComplete: (uploadKey: string) => void; // Define the prop type
  resetUpload: () => void; 
}

const VideoUploadComponent: React.FC<VideoUploadComponentProps> = ({ onUploadComplete }) => {
  return (
    <div>
      <UploadDropzone
        className="bg-black p-[20px] h-50 ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300"
        endpoint="videoUploader"
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

export default VideoUploadComponent;
