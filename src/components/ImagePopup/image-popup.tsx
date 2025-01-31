// import { Heart, Share2 } from "lucide-react";

// import Image from "next/image";
// import { useEffect, useMemo, useState } from "react";
// import { FaHeart } from "react-icons/fa";
// import { IoInformationCircle } from "react-icons/io5";
// import UseRefetch from "~/hooks/use-refetch";
// import { api } from "~/utils/api";

// interface ImagePopupProps {
//   selectedImage: string | null;
//   selectedImageOg: string | null;
//   selectedImageId: number | null;
//   handleClosePopup: () => void;
//   handleDownload: (imageUrl: string) => void;
//   openRemovalPopup: (imageUrl: string) => void;
//   session_user: string;
//   session_role: string;
//   sessionId: string;
// }

// const ImagePopup: React.FC<ImagePopupProps> = ({
//   selectedImage,
//   selectedImageOg,
//   selectedImageId,
//   handleClosePopup,
//   handleDownload,
//   openRemovalPopup,
//   session_user,
//   session_role,
//   sessionId,
// }) => {
//   const { data: allDownloadLogs, isLoading: isDownloadLogLoading } = api.download.getAllLogs.useQuery();
//   const refetch = UseRefetch()
//   const downloadCounts = useMemo(() => {
//     const counts: Record<number, number> = {};
//     if (allDownloadLogs) {
//       allDownloadLogs.forEach((log: any) => {
//         counts[log.image_id] = (counts[log.image_id] || 0) + 1;
//       });
//     }
//     return counts;
//   }, [allDownloadLogs]);

//   const handleShare = async () => {
//     if (navigator.share && selectedImage) {
//       try {
//         const response = await fetch(selectedImage); // Fetch the image
//         const blob = await response.blob();
//         const file = new File([blob], "shared-image.webp", { type: blob.type }); // Create a File object

//         await navigator.share({
//           files: [file]
//         });
//         console.log("Image shared successfully");
//       } catch (error) {
//         console.error("Error sharing image:", error);
//       }
//     } else {
//       alert("Sharing files is not supported on your device.");
//     }
//   };

//   const getDownloadCount = (image_id: number): string => {
//     if (isDownloadLogLoading) return "...";
//     return downloadCounts[image_id] ? `${downloadCounts[image_id]}` : "0";
//   };

//   const { data: totalikes, isLoading, } = api.like.getTotalLikes.useQuery({ captureId: selectedImageId! })
//   const { data: hasLiked } = api.like.hasLiked.useQuery({ captureId: selectedImageId! })
//   const toogleLike = api.like.toggleLike.useMutation()

//   const handleToggleLike = async () => {
//     if (selectedImageId && hasLiked !== null) {
//       try {
//         await toogleLike.mutateAsync({
//           galleryId: selectedImageId,
//           toggle: !hasLiked,
//         });
//         refetch()

//       } catch (error) {
//         console.error("Error toggling like:", error);
//       }
//     }
//   };

//   if (!selectedImage) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
//       role="dialog"
//       aria-modal="true"
//       onClick={handleClosePopup}
//     >
//       <div
//         className="max-w-[90vw] max-h-[98vh] w-full h-full grid grid-cols-1  bg-neutral-950 gap-4 rounded-3xl overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="md:hidden flex flex-row items-center gap-4 justify-between w-full p-2 ">
//           <div className="flex-grow text-center">
//             <h4 className="font-Teknaf text-3xl md:text-4xl bg-white  rounded-md text-neutral-900">Category name</h4>
//           </div>
//           <div className="">
//             <IoInformationCircle size={25} />
//           </div>
//         </div>

//         <div className="flex items-center justify-center p-0 md:p-4">
//           <Image
//             src={selectedImage || "/images/fallback.webp"}
//             alt="Selected"
//             className="rounded-lg"
//             width={450}
//             height={200}
//             layout="intrinsic"
//             onContextMenu={(e) => e.preventDefault()}
//             onDragStart={(e) => e.preventDefault()}
//           />
//         </div>

//         {/* Content Section */}
//         <div className="flex flex-col justify-between p-4">
//           <div className="m-4">
//             <h4 className=" md:flex hidden font-Teknaf text-3xl md:text-4xl text-center mb-6">Category name</h4>

//             {/* Profile Section */}
//             <div className="flex flex-col sm:flex-row gap-2 items-center rounded-full  w-full  h-auto">
//               <div className="flex items-center justify-between border-2 border-white rounded-full w-full bg-black">
//                 {/* Left Section */}
//                 <div className="flex items-center text-black text-xs sm:text-sm h-20 text-center bg-white rounded-tl-full rounded-bl-full px-4 py-2 w-full md:w-[35%]">
//                   Captured By
//                 </div>

//                 {/* Middle Circle (Profile Image) */}
//                 <div className="relative -ml-10 w-16 h-16 sm:w-20 sm:h-20">
//                   <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 border-2 border-white bg-black">
//                     <Image
//                       src={selectedImage || "/images/fallback.webp"}
//                       className="object-cover"
//                       alt="Selected"
//                       width={96}
//                       height={96}
//                     />
//                   </div>
//                 </div>

//                 {/* Right Section */}
//                 <div className="flex flex-col items-center justify-center mx-4 text-white w-[65%]">
//                   <div className="text-md font-Cursive text-center w-full">
//                     Member Name
//                   </div>
//                   <div className="text-white text-xs sm:text-sm text-center w-full">
//                     Role
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer Section */}
//           <div>
//             <div className="text-center py-1 md:py-5 m-4">
//               <p className="text-xs sm:text-sm mx-auto max-w-lg mb-4 w-full">
//                 Note: If you prefer this capture not to be public or have any issues. We’ll verify your request and work on it soon.
//               </p>
//               <button
//                 className="flex-grow bg-white rounded-2xl text-black p-2 px-5 hover:scale-105 transition-all"
//                 onClick={() => {
//                   handleClosePopup();
//                   openRemovalPopup(selectedImage);
//                 }}
//               >
//                 Request Removal
//               </button>
//             </div>

//             {/* Footer Buttons */}
//             <div className="flex  flex-row gap-4 w-full rounded-lg p-5">
//               <button onClick={handleToggleLike} aria-label="Like Button">
//                 <FaHeart size={30} color={hasLiked ? "red" : "white"} />
//               </button>
//               <span className="flex items-center">
//                 {isLoading ? "..." : (<>{ totalikes !== null ? totalikes : "..."}</>)}

//               </span>
//               <button onClick={handleShare}>
//                 <Share2 />
//               </button>
//               <button
//                 className="flex-grow bg-white rounded-2xl text-black mx-10 p-2 px-6 hover:scale-[101%] transition-all"
//                 onClick={() => handleDownload(selectedImageOg || selectedImage)}
//               >
//                 Download
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default ImagePopup;

import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import UseRefetch from "~/hooks/use-refetch";
import { api } from "~/utils/api";

interface ImagePopupProps {
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

const ImagePopup: React.FC<ImagePopupProps> = ({
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
  const { data: allDownloadLogs, isLoading: isDownloadLogLoading } =
    api.download.getAllLogs.useQuery();
  const refetch = UseRefetch();

  const downloadCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    if (allDownloadLogs) {
      allDownloadLogs.forEach((log: any) => {
        counts[log.image_id] = (counts[log.image_id] || 0) + 1;
      });
    }
    return counts;
  }, [allDownloadLogs]);

  const { data: totalLikes, isLoading } = api.like.getTotalLikes.useQuery({
    captureId: selectedImageId!,
  });
  const { data: hasLiked } = api.like.hasLiked.useQuery({
    captureId: selectedImageId!,
  });
  const toggleLike = api.like.toggleLike.useMutation();

  const handleToggleLike = async () => {
    if (selectedImageId && hasLiked !== null) {
      try {
        await toggleLike.mutateAsync({
          galleryId: selectedImageId,
          toggle: !hasLiked,
        });
        refetch();
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && selectedImage) {
      try {
        const response = await fetch(selectedImage);
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

  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={handleClosePopup}
    >
      <div
        className="grid h-full max-h-[98vh] w-full grid-cols-1 gap-4 overflow-scroll rounded-3xl bg-neutral-950 p-4 md:w-auto md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category Name Block */}

        {/* Image Section */}
        <div className="flex items-center justify-center">
          <Image
            src={selectedImage || "/images/fallback.webp"}
            alt="Selected"
            className="rounded-lg"
            width={450}
            height={200}
            layout="intrinsic"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {/* Captured By Section */}
        <div className="flex h-auto w-full flex-col items-center gap-2 rounded-full sm:flex-row">
          <div className="text-center text-sm text-white sm:text-base">
            Captured By <span className="font-semibold"></span>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center">
          <p className="mx-auto mb-4 max-w-lg text-xs text-white sm:text-sm">
            Note: If you prefer this capture not to be public or have any
            issues. We’ll verify your request and work on it soon.
          </p>
          <button
            className="rounded-2xl bg-white px-6 py-2 text-black transition-all hover:scale-105"
            onClick={() => {
              handleClosePopup();
              openRemovalPopup(selectedImage);
            }}
          >
            Request Removal
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={handleToggleLike} aria-label="Like Button">
            <FaHeart size={30} color={hasLiked ? "red" : "white"} />
          </button>
          <span className="flex items-center text-white">
            {isLoading ? "..." : totalLikes !== null ? totalLikes : "..."}
          </span>
          <button onClick={handleShare}>
            <Share2 className="text-white" />
          </button>
          <button
            className="rounded-2xl bg-white px-6 py-2 text-black transition-all hover:scale-105"
            onClick={() => handleDownload(selectedImageOg || selectedImage)}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
