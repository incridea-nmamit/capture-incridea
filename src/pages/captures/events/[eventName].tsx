import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import downloadImage from "~/utils/downloadUtils";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import RequestRemovalModal from "~/components/RequestRemovalModal";
import { useSession } from "next-auth/react";
import ImagesGrid from "~/components/Image-grid/image-grid";
import ImagePopup from "~/components/ImagePopup/image-popup";


const EventCaptures = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { eventName } = router.query;
  const safeEventName = Array.isArray(eventName) ? eventName[0] : eventName || "Event";
  const formattedEventName = (safeEventName || "").replace(/-/g, " ");

  const { data: event } = api.events.getEventByName.useQuery({ name: formattedEventName });
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } = api.capture.getApprovedImagesByEventName.useInfiniteQuery({ eventName: formattedEventName, includeDownloadCount: session?.user.role === "admin" }, {
    getNextPageParam: (lastPage:any) => lastPage.nextCursor,
  },);

  const images = data?.pages.map((page:any) => page.images).flat() || []

  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const { data: cardState } = api.capturecard.getCardStateByName.useQuery({ cardName: "Events" });
  const session_user = session?.user.email || "";

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageOg, setSelectedImageOg] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [removalImage, setRemovalImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (imagePath: string, imagePathOg: string, imageId: number) => {
    setSelectedImage(imagePath);
    setSelectedImageOg(imagePathOg);
    setSelectedImageId(imageId);
  };

  const handleClosePopup = () => setSelectedImage(null);

  const handleDownload = async (imagePathOg: string) => {
    await downloadImage(imagePathOg, "capture-incridea.webp");
    await logDownload.mutateAsync({ image_id: selectedImageId || 0, session_user });
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
    if (cardState === false) {
      router.push("/captures");
    }
  }, [cardState, router]);

  if (isLoading) return <CameraLoading />;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="mt-32 gradient-bg">
      <div className="mt-20">
        <h1 className="text-3xl md:text-6xl font-cursive text-white text-center mb-8 mt-4 md:mb-4 md:mt-8">
          {formattedEventName} Captures
        </h1>
        <div className="flex   justify-center mb-10 ">
          {event?.description && <p className=" text-justify md:text-center text-gray-400 mb-5 w-3/4">{event.description}</p>}
        </div>
      </div>

      <ImagesGrid
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        nextCursor={data?.pages.at(-1)?.nextCursor}
        isLoading={isLoading}
        images={images.map((image:any) => ({
          id: image.id,
          compressed_path: image.compressed_path,
          image_path: image.image_path,
          onClick: () => handleImageClick(image.compressed_path, image.image_path, image.id),
          downloadCount: image._count?.downloadLog,
        }))} />

      <ImagePopup
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
  );
};

export default EventCaptures;
