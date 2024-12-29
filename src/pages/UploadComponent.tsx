import React, { useState } from 'react';
import { api } from '~/utils/api';
import { UploadButton } from '~/utils/uploadthing';

const UploadPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<
    { original: string; compressed: string }[]
  >([]);

  const mutation = api.gallery.addImage.useMutation({
    onSuccess: () => {
      alert('Image added successfully!');
    },
    onError: () => {
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

    let originalUrl = res[0]?.url;
    let compressedUrl = res[1]?.url;

    if (res[0]?.size < res[1]?.size) {
      [originalUrl, compressedUrl] = [compressedUrl, originalUrl];
    }

    if (originalUrl && compressedUrl) {
      setUploadedImages((prev) => [
        ...prev,
        { original: originalUrl, compressed: compressedUrl },
      ]);

      mutation.mutate({
        event_name: 'Sample Event',
        event_category: 'Sample Category',
        uploadKeyOg: originalUrl,
        uploadKeyCompressed: compressedUrl,
      });
    } else {
      alert('Could not retrieve upload URLs.');
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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('URL copied to clipboard!');
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
    {/* Left side - Upload section */}
    <div className="w-1/2 p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Upload Your Images</h1>
      <UploadButton
        className="bg-black p-[20px] h-50 ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300"
        endpoint="imageUploader"
        onBeforeUploadBegin={handleBeforeUploadBegin}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>

    {/* Right side - Image viewing section */}
    <div className="w-1/2 bg-white p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Uploaded Images</h2>
      {uploadedImages.length > 0 ? (
        <div className="space-y-8">
          {uploadedImages.map((image, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold mb-3 text-gray-700">Image {index + 1}</p>
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <img
                    src={image.original}
                    alt={`Original ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    onClick={() => copyToClipboard(image.original)}
                    className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                    Copy Original URL
                  </button>
                </div>
                <div className="w-1/2">
                  <img
                    src={image.compressed}
                    alt={`Compressed ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    onClick={() => copyToClipboard(image.compressed)}
                    className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                    Copy Compressed URL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg">No images uploaded yet.</p>
      )}
    </div>
  </div>
  );
};

export default UploadPage;
