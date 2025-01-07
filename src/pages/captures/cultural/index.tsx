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

const Cultural = () => {
  const { data: session } = useSession();
  const session_user = session?.user.email || "";
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
  const router = useRouter();
  
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery(
    { cardName: "Cultural" }
  );

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } = api.gallery.getApprovedImagesByCategory.useInfiniteQuery({ category: "cultural", includeDownloadCount: session?.user.role === "admin" }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  },);

  const images = data?.pages.map(page => page.images).flat() || []
  useEffect(() => {
    if (cardState === "inactive") {
      router.push("/captures");
    }
  }, [cardState, router]);

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

  if (isLoading) return <CameraLoading />;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div>
      <TitleDescription
        title="Cultural Program Captures"
        description="Engaging our audience and building community through strategic social media initiatives"
        imagePath="https://utfs.io/f/0yks13NtToBitJchJ4NSCB2X9TSlbJxWYgG6rpN3n8swf4Fz"
      />
      <FallingClipart />
      <ImagesMasonry
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        nextCursor={data?.pages.at(-1)?.nextCursor}
        images={images.map(image => ({
          id: image.id,
          compressed_path: image.compressed_path,
          image_path: image.image_path,
          onClick: () => handleImageClick(image.compressed_path, image.image_path, image.id),
          downloadCount: image._count?.downloadLog,
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

export default Cultural
