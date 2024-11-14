import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import CaptureCard from "~/components/CapturePage/CaptureCard";
import downloadImage from "~/utils/downloadUtils";
import Image from "next/image";
import UploadComponent from "~/components/UploadComponent";

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

  const { data: event } = api.events.getEventByName.useQuery({ name: formattedEventName });
  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const filteredImages = images?.filter((image) => image.event_name === formattedEventName) || [];

  const handleImageClick = (imagePath: string) => setSelectedImage(imagePath);
  const handleClosePopup = () => setSelectedImage(null);

  const handleDownload = async (imagePath: string) => {
    await downloadImage(imagePath, "capture-incridea.png");
    await logDownload.mutateAsync({ file_path: imagePath });
  };

  const openRemovalPopup = (imagePath: string) => setRemovalImage(imagePath);
  const closeRemovalPopup = () => setRemovalImage(null);

  const handleUploadComplete = (url: string) => setUploadUrl(url);

  const handleSubmit = async () => {
    if (!name || !email || !description) {
      alert("Please fill all the fields and upload the ID card image.");
      return;
    }

    if (!uploadUrl) {
      alert("Select Upload Image after selecting the Image");
      return;
    }

    if (!removalImage) {
      alert("No Selected image to submit");
      return;
    }

    try {
      await submitRemovalRequest.mutateAsync({
        name,
        idcard: uploadUrl,
        description,
        image_path: removalImage || "",
        email,
      });
      closeRemovalPopup(); 
    
      // Reset form fields
      setName("");
      setDescription("");
      setEmail("");
      setUploadUrl("");
      setRemovalImage(null);
    } catch (error) {
      console.error("Error submitting removal request:", error);
    }
  };

  if (isLoading) return <p className="text-white text-center">Loading images...</p>;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl md:text-7xl font-Hunters text-white text-center mb-8 mt-4 md:mb-4 md:mt-8 z-20">
        {formattedEventName}Captures
      </h1>
      {/* Display event description if it exists */}
      <div className="flex justify-center z-20">
        {event?.description && <p className="text-center text-gray-400 mb-16 w-3/4">{event.description}</p>}
      </div>
      <main
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gridAutoRows: "auto",
        }}
      >
        {filteredImages.map((image) => (
          <div key={image.id} className="relative overflow-hidden rounded-lg z-20">
            <CaptureCard
              imagePath={image.image_path}
              altText={formattedEventName ?? "Event image"}
              onClick={() => handleImageClick(image.image_path)}
            />
          </div>
        ))}
      </main>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-30" role="dialog" aria-modal="true">
          <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full z-30">
            <div className="flex">
              <h2 className="text-2xl w-full text-center font-bold text-white">Add Capture</h2>
              <button onClick={handleClosePopup} className="absolute top-0 right-5 text-white text-4xl p-5">&times;</button>
            </div>
            <div className="flex justify-center py-8">
              <Image src={selectedImage} alt="Selected" width={200} height={200} className="rounded mb-4" />
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
            <p className="text-xs text-center py-5 w-full z-30">
              Note: If you prefer this capture not to be public or have any issues.<br /> Please {" "}
              <a
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setSelectedImage(null);
                    openRemovalPopup(selectedImage);
                  }}
                >
                click here to Request Removal
              </a>.<br />
              We’ll verify your request and work on it soon.
            </p>
          </div>
        </div>
      )}
      {removalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-30" role="dialog" aria-modal="true">
          <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full z-30">
            <h2 className="text-2xl text-white font-bold text-center mb-4 z-30">Request Removal</h2>
            <button onClick={closeRemovalPopup} className="absolute top-1 right-6 text-2xl text-white p-5">&times;</button>
            <div className="flex justify-center z-30">
              <Image src={removalImage} alt="Removal Image" width={90} height={90} className="rounded mb-4" />
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white"
              />
              <input
                type="email"
                placeholder="Preferred College Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white"
              />
              <input
                type="description"
                placeholder="Describe your issue with this image"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white"
              />
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl("")} />
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded z-40"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCaptures;
