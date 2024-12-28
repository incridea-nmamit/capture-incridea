import React, { useState } from 'react';
import { UploadDropzone } from 'tailwind.config';

const UploadPage: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);

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

          // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Compress the image
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
    console.log('Upload completed. Response:', res);
    alert('Upload completed successfully!');
  };

  const handleUploadError = (error: Error) => {
    alert(`ERROR! ${error.message}`);
  };

  const handleBeforeUploadBegin = async (files: File[]) => {
    const uploads: File[] = [];
    for (const file of files) {
      // Add original file to uploads
      uploads.push(file);

      // Compress the image and add it to uploads
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
