import React, { useState } from 'react';
import { UploadDropzone } from 'tailwind.config';
import { api } from '~/utils/api';

const UploadPage: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);

  const mutation = api.gallery.addImage.useMutation({
    onSuccess: (data) => {
      alert('Image added successfully!');
    },
    onError: (error) => {
      alert('Failed to add image!');
    },
  });

  const compressImage = (file: File, quality: number = 0.7): Promise<Blob> => {
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

  const handleUploadComplete = (res: any) => {
    if (!res || res.length < 2) {
      alert('Upload incomplete. Please try again.');
      return;
    }

    // TODO : check the order 
    const originalKey = res[0]?.key || null;
    const compressedKey = res[1]?.key || null;

    if (originalKey && compressedKey) {
      setOriginalImage(originalKey);
      setCompressedImage(compressedKey);

      mutation.mutate({
        event_name: 'Sample Event',
        event_category: 'Sample Category', 
        uploadKeyOg: originalKey,
        uploadKeyCompressed: compressedKey,
      });
    } else {
      alert('Could not retrieve upload keys.');
    }
  };

  const handleUploadError = (error: Error) => {
    alert(`ERROR! ${error.message}`);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Your File</h1>

      <UploadDropzone
        className="bg-black p-[20px] h-50 ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300"
        endpoint="imageUploader"
        onBeforeUploadBegin={handleBeforeUploadBegin}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
};

export default UploadPage;
