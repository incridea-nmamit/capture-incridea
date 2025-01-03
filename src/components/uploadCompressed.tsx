// UploadComponent.tsx
import React, { useState } from 'react';
import { api } from '~/utils/api';
import { UploadButton } from '~/utils/uploadthing';
import CameraLoading from '~/components/LoadingAnimation/CameraLoading';
import toast from 'react-hot-toast';

interface UploadedImage {
  original: string;
  compressed: string;
}

interface UploadComponentProps {
  name: string; 
  category: string;
  type: string; 
  handleClosePopup: () => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ name, category ,type, handleClosePopup }) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const mutation = api.gallery.addImage.useMutation({
    onSuccess: () => {
      alert('Image added successfully!');
    },
    onError: () => {
      alert('Failed to add image!');
    },
  });

  const compressImage = (file: File, quality: number = 0.25): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Compression failed: Blob is null'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleBeforeUploadBegin = async (files: File[]) => {
    const uploads: File[] = [];
    for (const file of files) {
      uploads.push(file);

      try {
        const compressedBlob = await compressImage(file);
        const compressedFile = new File(
          [compressedBlob],
          `compressed-${file.name}`,
          { type: 'image/jpeg' }
        );
        uploads.push(compressedFile);
      } catch (error) {
        console.error('Error compressing file:', error);
      }
    }
    return uploads;
  };

  const handleUploadComplete = (res: any) => {
    if (!res || res.length < 2) {
      toast.error('Upload incomplete. Please try again.');
      setIsLoading(false);
      return;
    }

    let originalUrl = res[0]?.url;
    let compressedUrl = res[1]?.url;

    if (res[0]?.size < res[1]?.size) {
      [originalUrl, compressedUrl] = [compressedUrl, originalUrl];
    }

    if (originalUrl && compressedUrl) {
      mutation.mutate({
        event_name: name,  
        event_category: category, 
        uploadKeyOg: originalUrl,
        uploadKeyCompressed: compressedUrl,
        upload_type: type,
      });
      setIsLoading(false);
      handleClosePopup();
    } else {
      setIsLoading(false);
      toast.error('Could not retrieve upload URLs.');
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error(`ERROR! ${error.message}`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Upload Your Images</h1>
      <UploadButton
        endpoint="imageUploaderCompressed"
        onBeforeUploadBegin={handleBeforeUploadBegin}
        onUploadProgress={() => setIsLoading(true)}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
      {isLoading && <CameraLoading />}
    </div>
  );
};

export default UploadComponent;
