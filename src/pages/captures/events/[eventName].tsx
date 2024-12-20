import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { isMobile, isTablet, isDesktop } from 'react-device-detect';
import downloadImage from "~/utils/downloadUtils";
import Image from "next/image";
import Cookies from "js-cookie";
import { generateUniqueId } from "~/utils/generateUniqueId";
import { Box, ImageList, ImageListItem } from "@mui/material";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import RequestRemovalModal from "~/components/RequestRemovalModal";
import CapturePopup from "~/components/CapturePopup";

const EventCaptures = () => {
  const router = useRouter();
  const { eventName } = router.query;
  const safeEventName = Array.isArray(eventName) ? eventName[0] : eventName || "Event";
  const formattedEventName = (safeEventName || "").replace(/-/g, " ");

  const { data: event } = api.events.getEventByName.useQuery({ name: formattedEventName });
  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery(
    { cardName: "Events" }
  );
  useEffect(() => {
    if (cardState === "inactive") {
      router.push("/captures"); // Redirect to /capture if inactive
    }
  }, [cardState, router]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);

  const filteredImages = images?.filter((image) => image.event_name === formattedEventName) || [];
  const cookieId = Cookies.get("cookieId") || generateUniqueId();
  Cookies.set("cookieId", cookieId, { expires: 365 });

  const handleImageClick = (imagePath: string) => setSelectedImage(imagePath);
  const handleClosePopup = () => setSelectedImage(null);

  const handleDownload = async (imagePath: string) => {
    await downloadImage(imagePath, "capture-incridea.png");
    await logDownload.mutateAsync({ file_path: imagePath, cookieId });
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
    filteredImages.forEach((image) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = `${image.image_path}?w=248&fit=crop&auto=format`; 
      link.as = "image";
      document.head.appendChild(link); 
    });

   
    return () => {
      const links = document.querySelectorAll('link[rel="prefetch"]');
      links.forEach((link) => link.remove());
    };
  }, [filteredImages]); 

  if (isLoading) return <CameraLoading />;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl md:text-7xl font-Hunters text-white text-center mb-8 mt-4 md:mb-4 md:mt-8 z-20">
        {formattedEventName} Captures
      </h1>
      {/* Display event description if it exists */}
      <div className="flex justify-center z-20">
        {event?.description && <p className="text-center text-gray-400 mb-16 w-3/4">{event.description}</p>}
      </div>
      <main className="flex justify-center items-center">
        <Box
          sx={{
            width: "100vw", 
            overflowY: "visible", 
            scrollbarWidth: "none", 
            "&::-webkit-scrollbar": {
              display: "none",
            },
            WebkitOverflowScrolling: "touch", 
          }}
        >
          <ImageList variant="masonry" cols={devicecol} gap={8}>
            {filteredImages.map((image) => (
              <ImageListItem key={image.id}>
                <Image
                  src={`${image.image_path}?w=248&fit=crop&auto=format`}
                  alt={image.event_name}
                  loading="lazy"
                  width={248}
                  height={0}
                  quality={20}
                  onClick={() => handleImageClick(image.image_path)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </main>

      <CapturePopup
        selectedImage={selectedImage}
        handleClosePopup={handleClosePopup}
        handleDownload={handleDownload}
        openRemovalPopup={openRemovalPopup}
        cookieId={cookieId}
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
