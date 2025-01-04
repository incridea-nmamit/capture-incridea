import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import downloadImage from "~/utils/downloadUtils";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import RequestRemovalModal from "~/components/RequestRemovalModal";
import CapturePopup from "~/components/CapturePopup";
import { useSession } from "next-auth/react";
import { FaDownload } from "react-icons/fa6";
import CaptureCard from "~/components/CapturePage/CaptureCard";

const EventCaptures = () => {
  const router = useRouter();
  const { eventName } = router.query;
  const safeEventName = Array.isArray(eventName) ? eventName[0] : eventName || "Event";
  const formattedEventName = (safeEventName || "").replace(/-/g, " ");
  
  const { data: event } = api.events.getEventByName.useQuery({ name: formattedEventName });
  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery({ cardName: "Events" });
  const { data: session } = useSession();
  const session_user = session?.user.email || "";

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageOg, setSelectedImageOg] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredImages =
    images?.filter(
      (image) =>
        image.event_name === formattedEventName &&
        image.upload_type === "direct" &&
        image.state === "approved"
    ) || [];


  const { data: allDownloadLogs, isLoading: isDownloadLogLoading ,refetch } = 
    api.download.getAllLogs.useQuery();

  const downloadCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    if (allDownloadLogs) {
      allDownloadLogs.forEach((log : any) => {
        counts[log.image_id] = (counts[log.image_id] || 0) + 1;
      });
    }
    return counts;
  }, [allDownloadLogs]);

  const getDownloadCount = (image_id: number): string => {
    if (isDownloadLogLoading) return "...";
    return downloadCounts[image_id] ? `${downloadCounts[image_id]}` : "0";
  };

  const handleImageClick = (imagePath: string, imagePathOg: string, imageId: number) => {
    setSelectedImage(imagePath);
    setSelectedImageOg(imagePathOg);
    setSelectedImageId(imageId);
  };

  const handleClosePopup = () => setSelectedImage(null);

  const handleDownload = async (imagePathOg: string) => {
    await downloadImage(imagePathOg, "capture-incridea.png");
    await logDownload.mutateAsync({ image_id: selectedImageId || 0, session_user });
    refetch();
  };

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

  useEffect(() => {
    if (cardState === "inactive") {
      router.push("/captures");
    }
  }, [cardState, router]);

  useEffect(() => {
    filteredImages.forEach((image) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = `${image.image_path}?w=248&fit=crop&auto=format`;
      link.as = "image";
      document.head.appendChild(link);
    });

    return () => {
      const links = document.querySelectorAll("link[rel='prefetch']");
      links.forEach((link) => link.remove());
    };
  }, [filteredImages]);

  if (isLoading) return <CameraLoading />;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="p-6 bg-primary-950/50 min-h-screen">
      <h1 className="text-3xl md:text-6xl font-Teknaf text-white text-center mb-8 mt-4 md:mb-4 md:mt-8 z-20">
        {formattedEventName} Captures
      </h1>
      <div className="flex justify-center z-20 mb-10 font-Trap-Regular">
        {event?.description && <p className="text-center text-gray-400 mb-16 w-3/4">{event.description}</p>}
      </div>
      <main         className="grid gap-4 p-10"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gridAutoRows: "auto",
        }}>
            {filteredImages.map((image) => (
              <div className="relative" key={image.id}>
              <CaptureCard
                imagePath={image.compressed_path ||image.image_path}
                altText="Snaps image"
                onClick={() => handleImageClick(image.compressed_path, image.image_path, image.id)}
              />
               {session?.user.role === "admin" && (
                  <div className="absolute inset-0 flex items-end justify-end text-white font-bold text-sm pointer-events-none">
                    <FaDownload /> {getDownloadCount(image.id)}
                  </div>
                )}
              </div>
            ))}
      </main>

      <CapturePopup
        selectedImage={selectedImage}
        selectedImageOg={selectedImageOg}
        selectedImageId={selectedImageId}
        handleClosePopup={handleClosePopup}
        handleDownload={handleDownload}
        openRemovalPopup={openRemovalPopup}
        session_user={session_user}
        session_role={session?.user.role || 'user'}
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
