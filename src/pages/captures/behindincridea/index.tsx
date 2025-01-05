import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import downloadImage from "~/utils/downloadUtils";
import TitleDescription from "~/components/TitleDescription";
import FallingClipart from "~/components/BackgroundFallAnimation/FallingClipart";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import { useRouter } from "next/router";
import RequestRemovalModal from "~/components/RequestRemovalModal";
import CapturePopup from "~/components/CapturePopup";
import { useSession } from "next-auth/react";
import ImagesMasonry from "~/components/ImagesMasonry";
import { FaDownload } from "react-icons/fa";



const behindincridea = () => {
  const { data: session } = useSession();
  const { data: images = [], isLoading, error } = api.gallery.getApprovedImagesByCategory.useQuery({ category: "behindincridea", includeDownloadCount: session?.user.role === "admin" });
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const router = useRouter();
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery(
    { cardName: "Behind Incridea" }
  );
  const session_user = session?.user.email || "";
  useEffect(() => {
    if (cardState === "inactive") {
      router.push("/captures");
    }
  }, [cardState, router]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
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
    // refetch();

  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openRemovalPopup = (imagePath: string) => {
    setRemovalImage(imagePath);
    setIsModalOpen(true);
  };
  // const { data: allDownloadLogs, isLoading: isDownloadLogLoading, refetch } = 
  // api.download.getAllLogs.useQuery();


  //   const downloadCounts = useMemo(() => {
  //     const counts: Record<number, number> = {};
  //     if (allDownloadLogs) {
  //       allDownloadLogs.forEach((log : any) => {
  //         counts[log.image_id] = (counts[log.image_id] || 0) + 1;
  //       });
  //     }
  //     return counts;
  //   }, [allDownloadLogs]);

  // const getDownloadCount = (image_id: number): string => {
  //   if (isDownloadLogLoading) return "...";
  //   return downloadCounts[image_id] ? `${downloadCounts[image_id]}` : "0";
  // };

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
  if (isLoading) return <CameraLoading />;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div>
      <TitleDescription
        title="Behind Incridea"
        description="Engaging our audience and building community through strategic social media initiatives"
        imagePath="https://utfs.io/f/0yks13NtToBiR2RImlGmqjGOIgx47y3cAJSCbQ1V82Nitrsf"
      />
      <FallingClipart />
      <ImagesMasonry images={images.map(image => ({
        id: image.id,
        compressed_path: image.compressed_path,
        image_path: image.image_path,
        onClick: () => handleImageClick(image.compressed_path, image.image_path, image.id),
        downloadCount: image._count.downloadLog
      }))} />

      <CapturePopup
        selectedImage={selectedImage}
        selectedImageOg={selectedImageOg}
        selectedImageId={selectedImageId}
        handleClosePopup={handleClosePopup}
        handleDownload={handleDownload}
        openRemovalPopup={openRemovalPopup}
        session_user={session_user}
        session_role={session?.user.role || 'user'}
        sessionId={session?.user.id || ""}
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
