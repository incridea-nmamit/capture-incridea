/**
 * Video upload component with drag-and-drop functionality
 * Features:
 * - File upload handling
 * - Upload progress tracking
 * - Error handling
 * - Custom styling
 */

import React from 'react';
import { UploadDropzone } from "tailwind.config";

interface VideoUploadComponentProps {
  onUploadComplete: (uploadKey: string) => void;
  resetUpload: () => void; 
  endpoint: string;
}

const VideoUploadComponent: React.FC<VideoUploadComponentProps> = ({
  onUploadComplete,
  endpoint
}) => {
  return (
    <div>
      <UploadDropzone
        className="bg-black p-[20px] h-50 ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300"
        endpoint={endpoint as any}
        onClientUploadComplete={(res) => {
          // Handle successful upload
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
