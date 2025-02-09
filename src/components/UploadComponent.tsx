/**
 * File upload component with progress tracking
 * Features:
 * - Drag and drop support
 * - Upload progress tracking
 * - Error handling with toast notifications
 * - Customizable upload events
 */

import React from 'react';
import toast from 'react-hot-toast';
import { UploadDropzone } from "tailwind.config";

interface UploadComponentProps {
  onUploadComplete: (uploadKey: string) => void;
  resetUpload: () => void;
  onUploadBegin?: () => void;
  onUploadProgress?: (progress: number) => void;
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
        // Upload event handlers
        onUploadBegin={(files) => {
          onUploadBegin?.();
          console.log("Upload starting", files);
        }}
        onUploadProgress={(progress) => {
          onUploadProgress?.(progress);
          console.log("Upload progress", progress);
        }}
        onClientUploadComplete={(res) => {
          const uploadKey = res?.[0]?.key;
          if (uploadKey) {
            onUploadComplete(uploadKey);
            toast.success("Upload completed");
          } else {
            toast.error("Upload failed or no key received");
          }
        }}
        onUploadError={(error: Error) => {
          toast.error("Upload failed or no key received");
        }}
      />
    </div>
  );
};

export default UploadComponent;
