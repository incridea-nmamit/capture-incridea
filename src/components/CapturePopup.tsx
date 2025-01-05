import Image from "next/image";
import React, { useState, useMemo } from "react";
import { FaDownload, FaHeart, FaShareAlt } from "react-icons/fa";
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

        // Handle the returned status
        setHasLiked(userLikeStatus || false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }
  };

  React.useEffect(() => {
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
        setHasLiked(!hasLiked); // Optimistic update
        setTotalLikes((prev) => (prev !== null ? prev + (hasLiked ? -1 : 1) : prev));
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    }
  };

  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-20"
      role="dialog"
      aria-modal="true"
      onClick={handleClosePopup}
    >
      <div className="relative bg-black p-6 rounded-3xl shadow-lg font-Trap-Regular max-w-xs sm:max-w-md w-full z-30">
        <div className="flex justify-center py-8">
          <Image
            src={selectedImage || "/images/fallback.jpg"}
            alt="Selected"
            width={200}
            height={200}
            layout="responsive"
            className="rounded mb-4"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
        <div className="flex justify-start gap-8 items-center">
          {/* Likes Section */}
          <div className="flex gap-2 items-center">
            <button onClick={handleToggleLike} aria-label="Like Button">
              <FaHeart size={30} color={hasLiked ? "red" : "white"} />
            </button>
            <span>{totalLikes !== null ? totalLikes : "..."}</span>
          </div>
          {/* Share Section */}
          <div className="flex gap-2 items-center">
            <FaShareAlt size={30} />
          </div>
          {/* Download Section */}
          <div className="flex justify-center items-center space-x-4">
            <button
              className="bg-white hover:bg-black hover:text-white w-40 justify-center text-black px-2 py-2 rounded-full flex items-center transition-all"
              onClick={() => handleDownload(selectedImageOg || selectedImage)}
            >
              <FaDownload className="mr-2" />
              Download
            </button>
          </div>
        </div>
        <div>
          {session_role === "admin" && selectedImageId && (
            <div className="text-white flex justify-end">
              <FaDownload className="px-2" />
              {getDownloadCount(selectedImageId)}
            </div>
          )}
        </div>

        <p className="text-xs text-center py-5 w-full">
          Note: If you prefer this capture not to be public or have any issues.
          <br />
          Please{" "}
          <a
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              handleClosePopup();
              openRemovalPopup(selectedImage);
            }}
          >
            click here to Request Removal
          </a>
          .
          <br />
          We’ll verify your request and work on it soon.
        </p>
      </div>
    </div>
  );
};

export default CapturePopup;
