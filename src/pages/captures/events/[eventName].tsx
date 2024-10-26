// pages/event-captures.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import CaptureCard from "~/components/CaptureCard";
import { downloadImage } from "~/utils/downloadUtils";

const EventCaptures = () => {
  const router = useRouter();
  const { eventName } = router.query;
  const safeEventName = Array.isArray(eventName) ? eventName[0] : eventName || "Event";
  const formattedEventName = (safeEventName || "").replace(/-/g, " ");

  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  let downloadName = selectedImage?.replace("https://utfs.io/f/", "") + ".png";

  const filteredImages = images?.filter((image) => image.event_name === formattedEventName) || [];

  const handleImageClick = (imagePath: string) => setSelectedImage(imagePath);
  const handleClosePopup = () => setSelectedImage(null);

  if (isLoading) return <p className="text-white text-center">Loading images...</p>;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-16">
        {formattedEventName} Captures
      </h1>

      {filteredImages.length === 0 ? (
        <p className="text-white text-center mt-8">No images available for this event.</p>
      ) : (
        <div className="grid gap-4 mt-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredImages.map((image) => (
            <CaptureCard
              key={image.id}
              imagePath={image.image_path}
              altText={formattedEventName ?? "Event image"}
              onClick={() => handleImageClick(image.image_path)}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full">
            <div className="flex justify-center">
              <img src={selectedImage} alt="Selected" className="w-full h-auto rounded mb-4" />
            </div>
            <div className="flex justify-between items-center space-x-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
                onClick={() => alert("Request for removal sent!")}
              >
                Request Removal
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center transition-all" 
              onClick={() => downloadImage(selectedImage,"capture-incridea.png")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m8-8l-8 8-8-8" />
                </svg>
                Download
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCaptures;
