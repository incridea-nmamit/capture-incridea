
import React from 'react';
import toast from 'react-hot-toast';
import { UploadDropzone } from "tailwind.config";

interface UploadComponentProps {
  onUploadComplete: (uploadKey: string) => void; // Define the prop type
  resetUpload: () => void; 
  onUploadBegin?: () => void;
  onUploadProgress?: (p:number) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ 
  onUploadComplete,
  onUploadBegin,
  onUploadProgress
}) => {
  return (
    <div>
      <UploadDropzone
        className="bg-black p-[20px] h-50 ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300"
        endpoint="imageUploader"
        onUploadBegin={onUploadBegin}
        onUploadProgress={onUploadProgress}
        onClientUploadComplete={(res) => {
          const uploadKey = res?.[0]?.key;
          if (uploadKey) {
            onUploadComplete(uploadKey);
          } else {
            toast.error("Upload failed or no key received.");
          }
        }}
        onUploadError={(error: Error) => {
          toast.error("Upload failed or no key received.");
        }}
      />
    </div>
  );
};

export default UploadComponent;
