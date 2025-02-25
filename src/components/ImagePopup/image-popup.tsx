import { Share2, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaHeart, FaShareSquare } from "react-icons/fa";

import UseRefetch from "~/hooks/use-refetch";
import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { MoreInfo } from "../MoreInfoDrawer/more-infoPopup";
import QRCode from "react-qr-code";
import downloadImage from "~/utils/downloadUtils";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

/**
 * ImagePopup Props Interface
 */
interface ImagePopupProps {
  selectedImage: string | null;
  selectedImageOg: string | null;
  selectedImageId: number | null;
  handleClosePopup: () => void;
  openRemovalPopup: (imageUrl: string) => void;
  session_user: string;
  session_role: string;
  sessionId: string;
}

/**
 * ImagePopup Component
 * Displays a modal with image details, download options, and social features
 */
const ImagePopup: React.FC<ImagePopupProps> = ({
  selectedImage,
  selectedImageOg,
  selectedImageId,
  handleClosePopup,
  openRemovalPopup,
  session_user,
  session_role,
  sessionId,
}) => {
  // State management for likes and UI
  const refetch = UseRefetch();
  const [isLandscape, setIsLandscape] = useState(true);
  const [isLoadings, setIsLoading] = useState(true);
  const [openMoreInfo, setOpenMoreInfor] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { data: session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean | null>(null);
  const { data: totalLikesData, isLoading: totalLikesLoading } = api.like.getTotalLikes.useQuery(
    { captureId: selectedImageId! },
    { enabled: !!selectedImageId }
  );
  const { data: response, isLoading: haslikedLoading, error } = api.like.hasLiked.useQuery(
    { captureId: selectedImageId! },
    { enabled: !!selectedImageId }
  );
  const { data: author } = api.capture.getAuthorDetails.useQuery({ id: selectedImageId! });
  const toggleLike = api.like.toggleLike.useMutation();
  const logDownload = api.download.logDownload.useMutation();

  useEffect(() => {
    if (response !== undefined) {
      setHasLiked(response);
    }
    if (totalLikesData !== undefined) {
      setTotalLikes(totalLikesData);
    }
  }, [response, totalLikesData]);

  // Add this useEffect hook after other useEffects
  useEffect(() => {
    // Push a new state when popup opens
    window.history.pushState(null, '', window.location.pathname);

    // Handle back button press
    const handlePopstate = () => {
      handleClosePopup();
    };

    window.addEventListener('popstate', handlePopstate);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []); // Empty dependency array as we only want this to run once when mounted

  const handleToggleLike = async () => {
    if (selectedImageId && hasLiked !== null) {
      const newLikeStatus = !hasLiked;
      setHasLiked(newLikeStatus);
      setTotalLikes((prevLikes) => prevLikes + (newLikeStatus ? 1 : -1));
      setAnimating(true);

      try {
        await toggleLike.mutateAsync({
          galleryId: selectedImageId,
          toggle: newLikeStatus,
        });
        refetch();
      } catch (error) {
        console.error("Error toggling like:", error);
        setHasLiked(hasLiked);
        setTotalLikes((prevLikes) => prevLikes + (newLikeStatus ? -1 : 1));
      } finally {
        setTimeout(() => setAnimating(false), 300);
      }
    }
  };


  const QrLink = `${process.env.NEXT_PUBLIC_QRCODELINK}/${selectedImageId}`;
  const handleShare = async () => {
    if (navigator.share && selectedImageOg) {
      try {
        const response = await fetch(selectedImageOg);
        const blob = await response.blob();
        const file = new File([blob], "shared-image.png", { type: blob.type });

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

  const handleDownload = async (imagePathOg: string) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      await downloadImage(
        imagePathOg,
        "capture-incridea.webp",
        (progress) => setDownloadProgress(progress)
      );
      await logDownload.mutateAsync({ image_id: selectedImageId || 0, session_user });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  if (!selectedImage) return null;
  const handleImageLoad = (event: any) => {
    const { naturalWidth, naturalHeight } = event.target;
    setIsLandscape(naturalWidth > naturalHeight);
    setIsLoading(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col  items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        onClick={handleClosePopup}
      >
        <div
          className="max-h-[98vh] w-[90%] md:w-[60%] h-auto space-y-10 gradient-bg grid grid-cols-1 gap-4 rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row w-full h-full">
            <div className="relative flex justify-center items-center w-full md:w-1/2 aspect-square rounded-l-3xl p-2 md:p-0">
              <Image
                src={selectedImage || "/images/fallback.webp"}
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
                    <FaShareSquare  className="text-white w-6 h-6" />
                  </Button>

                  {session?.user?.role === "admin" && (
                    <Button onClick={() => setOpenMoreInfor(true)} className="flex items-center">
                      <Info className="text-white w-6 h-6" />
                    </Button>
                  )}

                </div>
              </div>
              <div className="flex flex-col justify-center items-center h-full w-full  space-y-5 md:space-y-6 font-Trap-Regular gap-5 text-white text-md md:text-xl tracking-widest text-center px-4 ">
                <div className="flex justify-center items-center">
                  <div className="hidden md:flex justify-center items-center m-5 w-[200px] rounded-2xl relative group">
                    <div className="w-2/3 flex justify-center items-center">
                      <div className="bg-white rounded-2xl p-4">
                        <QRCode
                          size={100}
                          style={{ height: "auto", width: "100%" }}
                          value={QrLink}
                          viewBox="0 0 150 150"
                        />
                      </div>
                    </div>
                    <div className=" absolute w-full top-32 border left-24 transform shadow-2xl -translate-x-1/2 bg-black text-white text-xs rounded-xl px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      You can scan this to download the image on your phone
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 items-center">
                  <button onClick={handleToggleLike} aria-label="Like Button" disabled={haslikedLoading}>
                    <FaHeart size={28} color={hasLiked ? "red" : "white"} className={`${animating ? "animate-pop" : ""}`} />
                  </button>
                  <span className="text-white text-lg  font-Trap-Regular">
                    {totalLikesLoading ? "..." : totalLikes !== null ? totalLikes : "Loading..."}
                  </span>

                  <Button
                    className="bg-white rounded-xl text-black px-7 py-2 mx-5 font-Trap-Regular text-xs hover:scale-105 transition-all flex items-center justify-center gap-2"
                    onClick={() => handleDownload(selectedImageOg || selectedImage)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <Spinner />
                        <span>Downloading... {downloadProgress}%</span>
                      </>
                    ) : (
                      "Download Original"
                    )}
                  </Button>
                </div>


                <div className="flex items-center justify-center w-full text-center font-Trap-Regular text-xs">
                  <span>
                    If you prefer this capture not to be public or have any issues,&nbsp;
                    <button
                      className="underline hover:no-underline text-blue-400 hover:text-blue-500 transition duration-200"
                      onClick={() => {
                        handleClosePopup();
                        openRemovalPopup(selectedImage);
                      }}
                    >
                      Request Removal
                    </button>
                    &nbsp;We’ll verify your request and work on it soon.
                  </span>
                </div>

                <a href="/our-team">
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <span>{author?.name ? "Captured By" : ""}</span>
                    <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center overflow-hidden">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={author?.image || ""} alt={author?.name || "User"} />
                      </Avatar>
                    </div>
                    <span>{author?.name || ""}</span>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
      {
        openMoreInfo && (
          <MoreInfo
            isOpen={openMoreInfo}
            setOpen={setOpenMoreInfor}
            id={selectedImageId!}
            apiTobeCalled="capture"
          />
        )
      }

    </>
  );
};

export default ImagePopup;
