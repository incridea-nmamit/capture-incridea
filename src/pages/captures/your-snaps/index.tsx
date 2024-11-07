import { useState } from "react";
import { api } from "~/utils/api";
import CaptureCard from "~/components/CapturePage/CaptureCard";
import downloadImage from "~/utils/downloadUtils";
import Image from "next/image";
import UploadComponent from "~/components/UploadComponent"; // Ensure this component exists.
import TitleDescription from "~/components/TitleDescription";
import FallingClipart from "~/components/FallingClipart";


const YourSnapsPage: React.FC = () => {
  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>(""); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const filteredImages = images?.filter((image) => image.event_category === 'snaps') || [];

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
      closeRemovalPopup(); // Close the popup after submission
    
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
    <div className="flex flex-col">
      <TitleDescription 
        title="Your Snaps" 
        description="Engaging our audience and building community through strategic social media initiatives."
        imagePath="/images/admin-bg.png"
      />
      <FallingClipart />

      <div
        className="grid gap-4 p-10"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gridAutoRows: "auto",
        }}
      >
        {filteredImages.map((image) => {
          return (
            <div key={image.id} className="relative overflow-hidden rounded-lg z-40">
              <CaptureCard
                imagePath={image.image_path}
                altText="Snaps image"
                onClick={() => handleImageClick(image.image_path)}
              />
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full">
            <div className="flex">
              <h2 className="text-2xl w-full text-center font-bold text-white">Add Capture</h2>
              <button onClick={handleClosePopup} className="absolute top-0 right-5 text-white text-4xl p-5">&times;</button>
            </div>
            <div className="flex justify-center py-8">
              <Image 
                src={selectedImage || '/images/fallback.jpg'} 
                alt="Selected"
                width={200}
                height={200}
                layout="responsive"
                className="rounded mb-4"
              />
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
              Note: If you prefer this capture not to be public or have any issues.<br /> Please {" "}
              <a
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setSelectedImage(null); // Close the image popup
                  openRemovalPopup(selectedImage); // Open the removal popup
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
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full z-50">
            <h2 className="text-2xl text-white font-bold text-center mb-4">Request Removal</h2>
            <button onClick={closeRemovalPopup} className="absolute top-1 right-6 text-2xl text-white p-5">&times;</button>
            <div className="flex justify-center">
              <Image src={removalImage || '/images/fallback.jpg'} alt="Removal Image" width={75} height={75} className="rounded mb-4" />
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
                type="text"
                placeholder="Please give a brief Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white"
              />
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl("")} />
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
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

export default YourSnapsPage;
