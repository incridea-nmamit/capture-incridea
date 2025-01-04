import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import CaptureCard from "~/components/CapturePage/CaptureCard";
import downloadImage from "~/utils/downloadUtils";
import TitleDescription from "~/components/TitleDescription";
import FallingClipart from "~/components/BackgroundFallAnimation/FallingClipart";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import { useRouter } from "next/router";
import RequestRemovalModal from "~/components/RequestRemovalModal";
import CapturePopup from "~/components/CapturePopup";
import { useSession } from "next-auth/react";
import { FaDownload } from "react-icons/fa";



const behindincridea = () => {
  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const router = useRouter();
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery(
    { cardName: "Behind Incridea" }
  );
  const {data: session} = useSession();
  const session_user = session?.user.email || "";
  useEffect(() => {
    if (cardState === "inactive") {
      router.push("/captures"); 
    }
  }, [cardState, router]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
  const filteredImages = images?.filter((image) => image.event_category === 'behindincridea' && image.upload_type === "direct" && image.state === "approved") || [];
  const [selectedImageOg, setSelectedImageOg] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openRemovalPopup = (imagePath: string) => {
    setRemovalImage(imagePath);
    setIsModalOpen(true);
  };
  const { data: allDownloadLogs, isLoading: isDownloadLogLoading, refetch } = 
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
  if (isLoading) return <CameraLoading/>;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div>
    <TitleDescription 
        title="Behind Incridea" 
        description="Engaging our audience and building community through strategic social media initiatives"
        imagePath="https://utfs.io/f/0yks13NtToBiR2RImlGmqjGOIgx47y3cAJSCbQ1V82Nitrsf"
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
            <div key={image.id} className="relative overflow-hidden rounded-lg z-20">
              <CaptureCard
                imagePath={image.compressed_path ||image.image_path}
                altText="Behind Incridea image"
                onClick={() => handleImageClick(image.compressed_path, image.image_path, image.id)}
              />
               {session?.user.role === "admin" && (
                  <div className="absolute inset-0 flex items-end justify-end text-white font-bold text-sm pointer-events-none">
                    <FaDownload /> {getDownloadCount(image.id)}
                  </div>
                )}
            </div>
            
          );
        })}
      </div>

      <CapturePopup
        selectedImage={selectedImage}
        selectedImageId={selectedImageId}
        handleClosePopup={handleClosePopup}
        handleDownload={handleDownload}
        openRemovalPopup={openRemovalPopup}
        session_user = {session_user}
      />

      <RequestRemovalModal
        isOpen={isModalOpen}
        imagePath={removalImage}
        onClose={closeRemovalPopup}
        onSubmit={handleRemovalSubmit}
      />
    </div>
  )
}

export default behindincridea
