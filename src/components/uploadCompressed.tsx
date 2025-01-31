// UploadComponent.tsx
import React, { useState } from 'react';
import { api } from '~/utils/api';
import { UploadButton } from '~/utils/uploadthing';
import CameraLoading from '~/components/LoadingAnimation/CameraLoading';
import toast from 'react-hot-toast';

type UploadedImage = {
  original: string;
  compressed: string;
}

type UploadComponentProps = {
  name: string;
  category: string;
  type: string;
  authorid: number;
  handleClosePopup: () => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ name, category, type, authorid, handleClosePopup }) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const mutation = api.capture.addImage.useMutation({
    onSuccess: () => {
      toast.success('Image added successfully!');

    },
    onError: () => {
      alert('Failed to add image!');
    },
  });

  const compressImage = (file: File, quality: number = 0.25,  maxWidth: number = 600): Promise<Blob> => {
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
          const aspectRatio = img.height / img.width;
          canvas.width = maxWidth;
          canvas.height = maxWidth * aspectRatio;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
        author_id: authorid
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
    <div className="flex flex-col items-center justify-center p-6 bg-neutral-900 rounded-lg shadow-md">
      <h1 className="text-4xl font-cursive leading-5 font-semibold mb-4 text-white">
        Upload Your Images
      </h1>
      <p className="mb-6 font-Trap-Regular text-gray-400 text-sm text-center">
        Choose and upload high-quality images. Supported formats: JPEG, webp.
      </p>
      <div className="w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg bg-neutral-950 hover:border-blue-400 transition-colors space-y-6">
        <UploadButton
          endpoint="imageUploaderCompressed"
          onBeforeUploadBegin={handleBeforeUploadBegin}
          onUploadProgress={() => setIsLoading(true)}
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
        <span className="flex flex-col items-center justify-center">

          <span className="text-sm text-gray-500">
            Click to upload
          </span>
        </span>
     
    </div>
    { isLoading && <CameraLoading /> }
  </div >
  );
};

export default UploadComponent;
