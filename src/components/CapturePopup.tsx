import { Heart, Share2 } from "lucide-react";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { api } from "~/utils/api";

interface CapturePopupProps {
  selectedImage: string | null;
  selectedImageOg: string | null;
  selectedImageId: number | null;
  handleClosePopup: () => void;
  handleDownload: (imageUrl: string) => void;
  openRemovalPopup: (imageUrl: string) => void;
  session_user: string;
  session_role: string;
  sessionId: string;
}

const CapturePopup: React.FC<CapturePopupProps> = ({
  selectedImage,
  selectedImageOg,
  selectedImageId,
  handleClosePopup,
  handleDownload,
  openRemovalPopup,
  session_user,
  session_role,
  sessionId,
}) => {
  const { data: allDownloadLogs, isLoading: isDownloadLogLoading } = api.download.getAllLogs.useQuery();

  const downloadCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    if (allDownloadLogs) {
      allDownloadLogs.forEach((log: any) => {
        counts[log.image_id] = (counts[log.image_id] || 0) + 1;
      });
    }
    return counts;
  }, [allDownloadLogs]);

const handleShare = async () => {
  if (navigator.share && selectedImageOg) {
    try {
      await navigator.share({
        title: "Check out this capture!",
        text: "Here's an amazing image I wanted to share with you.",
        url: selectedImageOg, // Ensure this URL is accessible
      });
      console.log("Content shared successfully");
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  } else {
    alert("Sharing is not supported on your device.");
  }
};
  const getDownloadCount = (image_id: number): string => {
    if (isDownloadLogLoading) return "...";
    return downloadCounts[image_id] ? `${downloadCounts[image_id]}` : "0";
  };

  const [totalLikes, setTotalLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState<boolean | null>(null);

  // API Mutations
  const getTotalLikes = api.like.getTotalLikes.useMutation();
  const checkHasLiked = api.like.hasLiked.useMutation();
  const toggleLike = api.like.toggleLike.useMutation();

  // Fetch likes and user's like status when the popup opens
  const fetchInitialData = async () => {
    if (selectedImageId) {
      try {
        const likes = await getTotalLikes.mutateAsync({ captureId: selectedImageId });
        setTotalLikes(likes);

        const userLikeStatus = await checkHasLiked.mutateAsync({
          galleryId: selectedImageId,
          userId: session_user,
        });

        setHasLiked(userLikeStatus || false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [selectedImageId]);

  // Toggle like status
  const handleToggleLike = async () => {
    if (selectedImageId && hasLiked !== null) {
      try {
        await toggleLike.mutateAsync({
          galleryId: selectedImageId,
          userId: sessionId,
          toggle: !hasLiked,
        });

        // Optimistic update
        setHasLiked(!hasLiked);
        setTotalLikes((prev) => (prev !== null ? prev + (hasLiked ? -1 : 1) : prev));
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    }
  };

  if (!selectedImage) return null;

  return (
    <div
  className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
  role="dialog"
  aria-modal="true"
  onClick={handleClosePopup}
>
  <div
    className="max-w-[80vw] max-h-[90vh] w-full h-full grid grid-cols-1 md:grid-cols-2 bg-neutral-950 gap-4 rounded-3xl overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Image Section */}
    <div className="flex items-center">
      <Image
        src={selectedImage || "/images/fallback.jpg"}
        alt="Selected"
        className=""
        width={200}
        height={200}
        layout="responsive"
      />
      </div>

    {/* Content Section */}
    <div className="flex flex-col justify-between">
      <div className="m-4">
        <div>
          <h4 className="font-Teknaf text-4xl text-center mb-6">Category name</h4>

          {/* Profile Section */}
          <div className="flex flex-row gap-2 items-center rounded-full w-full h-20">
            <div className="flex items-center justify-between border-2 border-white rounded-full w-full h-20 bg-black">
              {/* Left Section */}
              <div className="flex items-center text-black text-xs text-wrap h-20 text-center bg-white rounded-tl-full rounded-bl-full px-4 py-2 w-[35%]">
                Captured By
              </div>

              {/* Middle Circle (Profile Image) */}
              <div className="relative -ml-10 w-20 h-20">
                <div className="rounded-full overflow-hidden w-20 h-20 border-2 border-white bg-black">
                  <Image
                    src={selectedImage || "/images/fallback.jpg"}
                    className="object-cover"
                    alt="Selected"
                    width={96}
                    height={96}
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-center justify-center mx-4 text-white w-[65%]">
                <div className="text-md font-Cursive text-center w-full">
                  Team Member Name
                </div>
                <div className="text-white text-xs text-center w-full">
                  Team Member Name
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div>
        <div className="text-center py-5 m-4">
          <p className="text-xs mx-auto max-w-lg mb-4 w-full">
            Note: If you prefer this capture not to be public or have any issues. We’ll verify your request and work
            on it soon.
          </p>
          <button
            className="flex-grow bg-white rounded-2xl text-black p-2 px-5 hover:scale-105 transition-all"
            onClick={() => {
              handleClosePopup();
              openRemovalPopup(selectedImage);
            }}
          >
            Request Removal
          </button>
        </div>

        <div className="flex gap-4 w-full rounded-lg p-5">
          <button onClick={handleToggleLike} aria-label="Like Button">
            <FaHeart size={30} color={hasLiked ? "red" : "white"} />
          </button>
          <span className="flex items-center">
            {totalLikes !== null ? totalLikes : "..."}
          </span>
          <button onClick={handleShare}>
  <Share2 />
</button>
          <button
            className="flex-grow bg-white rounded-2xl text-black mx-10 p-2 px-6 hover:scale-[101%] transition-all"
            onClick={() => handleDownload(selectedImageOg || selectedImage)}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default CapturePopup;
