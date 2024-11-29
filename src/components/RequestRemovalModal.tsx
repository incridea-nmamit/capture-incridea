import React, { useState } from "react";
import Image from "next/image";
import UploadComponent from "~/components/UploadComponent";

interface RequestRemovalModalProps {
  isOpen: boolean; // Controls whether the modal is visible
  imagePath: string | null; // Path to the image to display
  onClose: () => void; // Function to close the modal
  onSubmit: (data: {
    name: string;
    email: string;
    description: string;
    uploadUrl: string;
    imagePath: string;
  }) => void; // Function to handle form submission
}

const RequestRemovalModal: React.FC<RequestRemovalModalProps> = ({
  isOpen,
  imagePath,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !description) {
      alert("Please fill all fields.");
      return;
    }

    if (!uploadUrl) {
      alert("Please upload an ID card image.");
      return;
    }

    if (!imagePath) {
      alert("No image selected for removal.");
      return;
    }

    // Pass the form data to the parent component
    onSubmit({ name, email, description, uploadUrl, imagePath });

    // Reset the form and close the modal
    setName("");
    setEmail("");
    setDescription("");
    setUploadUrl("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-30"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full z-50">
        <h2 className="text-2xl text-white font-bold text-center mb-4">Request Removal</h2>
        <button onClick={onClose} className="absolute top-1 right-6 text-2xl text-white p-5">
          &times;
        </button>
        <div className="flex justify-center">
          <Image
            src={imagePath || "/images/fallback.jpg"}
            alt="Removal Image"
            width={75}
            height={75}
            className="rounded mb-4"
          />
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
          <UploadComponent onUploadComplete={(url) => setUploadUrl(url)} resetUpload={() => setUploadUrl("")} />
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
  );
};

export default RequestRemovalModal;
