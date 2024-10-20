// UploadComponent.tsx
import { UploadButton } from "~/utils/uploadthing";
import React from 'react';

interface UploadComponentProps {
  onUploadComplete: (uploadKey: string) => void; // Define the prop type
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onUploadComplete }) => {
  return (
    <div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const uploadKey = res?.[0]?.key; // Safely access 'key'
          if (uploadKey) {
            onUploadComplete(uploadKey); // Call the prop function with the key
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
