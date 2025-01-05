import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { isMobile, isTablet, isDesktop } from 'react-device-detect';
import downloadImage from "~/utils/downloadUtils";
import Image from "next/image";
import { Box, ImageList, ImageListItem } from "@mui/material";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import RequestRemovalModal from "~/components/RequestRemovalModal";
import CapturePopup from "~/components/CapturePopup";
import { useSession } from "next-auth/react";
import CaptureCard from "~/components/CapturePage/CaptureCard";
import ImagesMasonry from "~/components/ImagesMasonry";

const EventCaptures = () => {
  const router = useRouter();
  const { eventName } = router.query;
  const safeEventName = Array.isArray(eventName) ? eventName[0] : eventName || "Event";
  const formattedEventName = (safeEventName || "").replace(/-/g, " ");
  const { data: event } = api.events.getEventByName.useQuery({ name: formattedEventName });
  const { data: images = [], isLoading, error } = api.gallery.getApprovedImagesByEventName.useQuery({ eventName: formattedEventName });
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery({ cardName: "Events" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
  const { data: session } = useSession();
  const session_user = session?.user.email || "";
  const handleImageClick = (imagePath: string) => setSelectedImage(imagePath);
  const handleClosePopup = () => setSelectedImage(null);
  const handleDownload = async (imagePath: string) => {
    await downloadImage(imagePath, "capture-incridea.png");
    await logDownload.mutateAsync({ file_path: imagePath, session_user });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openRemovalPopup = (imagePath: string) => {
    setRemovalImage(imagePath);
    setIsModalOpen(true);
  };
  const closeRemovalPopup = () => {
    setRemovalImage(null);
    setIsModalOpen(false);
  };
  const handleRemovalSubmit = async (data: {
    name: string;
    email: string;
    description: string;
    uploadUrl: string;
    imagePath: string;
  }) => {
    try {
      await submitRemovalRequest.mutateAsync({
        name: data.name,
        email: data.email,
        description: data.description,
        idcard: data.uploadUrl,
        image_path: data.imagePath,
      });
    } catch (error) {
      console.error("Error submitting removal request:", error);
    }
  };
  const devicecol = isMobile ? 3 : isTablet ? 3 : isDesktop ? 5 : 5;
  useEffect(() => {
    if (cardState === "inactive") {
      router.push("/captures");
    }
  }, [cardState, router]);

  if (isLoading) return <CameraLoading />;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="mt-32">
      <div className="container-size mt-20">
        <h1 className="text-3xl md:text-6xl font-Teknaf text-white text-center mb-8 mt-4 md:mb-4 md:mt-8">
          {formattedEventName} Captures
        </h1>
        <div className="flex justify-center mb-10 font-Trap-Regular">
          {event?.description && <p className="text-center text-gray-400 mb-16 w-3/4">{event.description}</p>}
        </div>
      </div>
      <ImagesMasonry images={images.map(image => ({
        id: image.id,
        compressed_path: image.compressed_path,
        image_path: image.image_path,
        onClick: () => handleImageClick(image.compressed_path || image.image_path)
      }))} />

      <CapturePopup
        selectedImage={selectedImage}
        handleClosePopup={handleClosePopup}
        handleDownload={handleDownload}
        openRemovalPopup={openRemovalPopup}
        session_user={session_user}
      />

      <RequestRemovalModal
        isOpen={isModalOpen}
        imagePath={removalImage}
        onClose={closeRemovalPopup}
        onSubmit={handleRemovalSubmit}
      />
    </div>
  );
};

export default EventCaptures;
