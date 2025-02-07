import { Share2, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import UseRefetch from "~/hooks/use-refetch";
import { api } from "~/utils/api";
import { Button } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { MoreInfo } from "~/components/MoreInfoDrawer/more-infoPopup";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useRouter } from "next/router";
import downloadImage from "~/utils/downloadUtils";
import RequestRemovalModal from "~/components/RequestRemovalModal";

const ImagePopup = () => {
  const router = useRouter();
  const { id } = router.query;
  const refetch = UseRefetch();
  const [isLandscape, setIsLandscape] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const { data: session } = useSession();
  const session_user = session?.user.email || "";

  const { data: Selectedcapture, isLoading: isCaptureLoading } =
    api.capture.getCaptureDetailsForQrScanById.useQuery({
      id: Number(id),
    });


  const { data: totalLikes, isLoading: likesLoading } = api.like.getTotalLikes.useQuery(
    Selectedcapture ? { captureId: Selectedcapture.id } : { captureId: 0 },
    { enabled: !!Selectedcapture }
  );

  const { data: hasLiked } = api.like.hasLiked.useQuery(
    Selectedcapture ? { captureId: Selectedcapture.id } : { captureId: 0 },
    { enabled: !!Selectedcapture }
  );

  const toggleLike = api.like.toggleLike.useMutation();
  const logDownload = api.download.logDownload.useMutation();
  const submitRemovalRequest = api.request.submit.useMutation();
  const [isModalOpen, setIsModalOpen] = useState(false)
  if (isCaptureLoading || !Selectedcapture) return null;

  const handleToggleLike = async () => {
    if (!Selectedcapture?.id || hasLiked === undefined) return;

    try {
      await toggleLike.mutateAsync({
        galleryId: Selectedcapture.id,
        toggle: !hasLiked,
      });
      refetch();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && Selectedcapture.image_path) {
      try {
        const response = await fetch(Selectedcapture.image_path);
        const blob = await response.blob();
        const file = new File([blob], "shared-image.webp", { type: blob.type });

        await navigator.share({
          files: [file],
        });
        console.log("Image shared successfully");
      } catch (error) {
        console.error("Error sharing image:", error);
      }
    } else {
      alert("Sharing files is not supported on your device.");
    }
  };

  const handleImageLoad = (event: any) => {
    const { naturalWidth, naturalHeight } = event.target;
    setIsLandscape(naturalWidth > naturalHeight);
    setIsLoading(false);
  };
  const handleDownload = async (imagePathOg: string) => {
    await downloadImage(imagePathOg, "capture-incridea.webp");
    await logDownload.mutateAsync({ image_id: Selectedcapture?.id || 0, session_user });

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
  const closeRemovalPopup = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mx-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col  items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="max-h-[98vh] w-full md:w-[60%] h-auto space-y-10 gradient-bg grid grid-cols-1 gap-4 rounded-3xl mx-4 md:mx-0"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="relative flex justify-center items-center w-full md:w-1/2 min-h-[300px] rounded-l-3xl">
              <Image
                src={Selectedcapture?.image_path || "/images/fallback.webp"}
                alt="Selected"
                className="rounded-[10px] shadow-2xl transition-opacity overflow-hidden"
                layout="fill"
                objectFit="cover"
                onLoad={handleImageLoad}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />

            </div>
            <div className="w-full md:w-1/2 h-full p-8">
              <div className="flex justify-between gap-2 items-center">
                <div>
                  <Image
                    src="/images/Logo/capture.webp"
                    alt="Logo"
                    width={150}
                    height={80}
                    className="h-auto w-auto max-w-24"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
                <div className="flex flex-row items-center justify-center gap-5">                  
                  <Button onClick={handleShare} className="flex items-center">
                    <Share2 className="text-white w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center h-full w-full  space-y-5 md:space-y-6 font-cursive text-white text-md md:text-xl tracking-widest text-center px-4 md:py-36">
                <div className="flex justify-center gap-2 items-center">
                  <button onClick={handleToggleLike} aria-label="Like Button">
                    <FaHeart size={20} color={hasLiked ? "red" : "white"} />
                  </button>
                  <span className="text-white text-sm font-Trap-Regular">
                    {isLoading ? "..." : totalLikes !== null ? totalLikes : "Loading..."}
                  </span>

                  <Button
                    className="bg-white rounded-xl text-black px-7 py-2 mx-5 font-Trap-Regular text-xs hover:scale-105 transition-all"
                    onClick={() => handleDownload(Selectedcapture?.image_path)}
                  >
                    Download Original
                  </Button>
                </div>


                <div className="flex items-center justify-center w-full text-center text-xs font-Trap-Regular">
                  <span>
                    Note: If you prefer this capture not to be public or have any issues,
                    <button
                      className="underline hover:no-underline text-blue-400 hover:text-blue-500 transition duration-200"
                      onClick={() => {

                        setIsModalOpen(true);
                      }}
                    >
                      Request Removal
                    </button>
                    , we’ll verify your request and work on it soon.
                  </span>
                </div>

                <a href="/our-team">
                  <div className="flex items-center justify-center gap-4 text-xs font-Trap-Regular">
                    <span>Captured By</span>
                    <div className="w-6 h-6 md:w-8 md:h-8 border border-gray-500 rounded-full flex items-center justify-center overflow-hidden">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={Selectedcapture?.captured_by?.image || "https://github.com/shadcn.png"} alt={Selectedcapture?.captured_by?.name || "User"} />
                      </Avatar>
                    </div>
                    <span>{Selectedcapture?.captured_by?.name || "Loading..."}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <RequestRemovalModal
              isOpen={isModalOpen}
              imagePath={Selectedcapture?.image_path}
              onClose={closeRemovalPopup}
              onSubmit={handleRemovalSubmit}
            />
          </div>
        )}
      </div>
    </div>
    
  );
};

export default ImagePopup;
