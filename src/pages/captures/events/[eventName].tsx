import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import CaptureCard from "~/components/CaptureCard";
import downloadImage from "~/utils/downloadUtils";

interface ImageData {
  id: number;
  event_name: string;
  event_category: string;
  image_path: string;
  date_time: Date;
}

const EventCaptures = () => {
  const router = useRouter();
  const { eventName } = router.query;
  const safeEventName = Array.isArray(eventName) ? eventName[0] : eventName || "Event";
  const formattedEventName = (safeEventName || "").replace(/-/g, " ");
  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  const logDownload = api.download.logDownload.useMutation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = images?.filter((image) => image.event_name === formattedEventName) || [];

  const handleImageClick = (imagePath: string) => setSelectedImage(imagePath);
  const handleClosePopup = () => setSelectedImage(null);

  const handleDownload = async (imagePath: string) => {
    await downloadImage(imagePath, "capture-incridea.png");
    await logDownload.mutateAsync({ file_path: imagePath });
  };

  if (isLoading) return <p className="text-white text-center">Loading images...</p>;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-16">
        {formattedEventName} Captures
      </h1>
      <main
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gridAutoRows: "auto",
        }}
      >
        {filteredImages.map((image) => (
          <div key={image.id} className="relative overflow-hidden rounded-lg">
            <CaptureCard
              imagePath={image.image_path}
              altText={formattedEventName ?? "Event image"}
              onClick={() => handleImageClick(image.image_path)}
            />
          </div>
        ))}
      </main>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full">
            <div className="flex justify-center">
              <img src={selectedImage} alt="Selected" className="w-full h-auto rounded mb-4" />
            </div>
            <div className="flex justify-center items-center space-x-4 py-5">
              <button
                className="bg-white hover:bg-black hover:text-white text-black px-2 py-2 rounded flex items-center transition-all"
                onClick={() => handleDownload(selectedImage)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v12m8-8l-8 8-8-8"
                  />
                </svg>
                Download
              </button>
            </div>
            <p className="text-xs text-center py-5 w-full">
              Note: If you prefer this picture not to be Public,
              Please feel free to <a className="font-blue">Request Removal</a>.
              We’ll verify and take care of it promptly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCaptures;
