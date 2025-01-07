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
      <div className="max-w-[80vw] max-h-[90vh] w-full h-full grid grid-cols-1 md:grid-cols-2 bg-primary-900 gap-4 rounded-lg" onClick={e=>e.stopPropagation()}>
        <div className="bg-slate-800 h-full grid place-content-center rounded-lg overflow-hidden m-4">
          <Image
            src={selectedImage || "/images/fallback.jpg"}
            alt="Selected"
            width={200}
            height={200}
            layout="responsive"
          />  
        </div>

        <div className="flex flex-col justify-between">
          <div className="m-4">
            <div>
              <h4 className="font-Teknaf text-4xl text-center mb-6">Category name</h4>
              <div className="flex flex-row gap-2 items-center border-2 border-white rounded-full w-3/4 h-20">
                <div className="rounded-full border-2 border-white overflow-hidden h-20 aspect-square">
                  <Image
                    src={selectedImage || "/images/fallback.jpg"}
                    className="w-full !h-full object-cover"
                    alt="Selected"
                    width={70}
                    height={70}
                    layout="responsive"
                  />
                </div>
                <div className=" flex-grow flex flex-col text-center font-Trap-Regular">
                  <span className="text-xs text-gray-400">Captured by</span>
                  <span className="text-xl">Member Name</span>
                  <span className="text-gray-400 text-sm">Member Designation</span>
                </div>
              </div>
            </div>
          </div>
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
              <span className="flex items-center">{totalLikes !== null ? totalLikes : "..."}</span>
              <button>
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
        </div >
      </div >
    </div >
  );
};

export default CapturePopup;
