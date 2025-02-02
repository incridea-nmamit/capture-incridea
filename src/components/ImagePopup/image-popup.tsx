import { Share2, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

import UseRefetch from "~/hooks/use-refetch";
import { api } from "~/utils/api";
import { Button } from 'react-bootstrap';
import { Avatar, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { MoreInfo } from "../MoreInfoDrawer/more-infoPopup";

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
    const refetch = UseRefetch();
    const [isLandscape, setIsLandscape] = useState(true);
    const [isLoadings, setIsLoading] = useState(true);
    const [openMoreInfo, setOpenMoreInfor] = useState(false);
    const { data: session } = useSession();
    const { data: totalLikes, isLoading } = api.like.getTotalLikes.useQuery({ captureId: selectedImageId! });
    const { data: hasLiked } = api.like.hasLiked.useQuery({ captureId: selectedImageId! });
    const { data: acthor } = api.capture.getAuthorDetails.useQuery({ id: selectedImageId! });
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


    const handleImageLoad = (event: any) => {
        const { naturalWidth, naturalHeight } = event.target;
        setIsLandscape(naturalWidth > naturalHeight);
        setIsLoading(false);
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
                onClick={handleClosePopup}
            >

                <div
                    className="   md:w-auto max-h-[98vh]  w-full h-fit  md:h-full bg-gradient-to-tl from-neutral-950/90 via-neutral-800 to-neutral-950/90 grid grid-cols-1 gap-4 rounded-3xl  p-4 md:p-5 border-[4px] border-gray-600"
                    onClick={(e) => e.stopPropagation()}
                >



                    <div className="flex flex-col sm:flex-row items-center gap-1 w-full m-2  ">
                        <div className="flex items-center justify-between border border-white rounded-full  w-full bg-neutral-950 p-1">
                            <div className="flex flex-col  bg-neutral-700 rounded-2xl p-2 items-center shadow-2xl w-full md:w-[40%]">
                                <div className="text-white  text-[10px] sm:text-xs px-2 py-0.5">
                                    Captured By
                                </div>
                            </div>


                            <div className="relative border border-gray-700 p-1 rounded-full ">
                                <Avatar>
                                    <AvatarImage src={acthor?.image} alt="@shadcn" />
                                </Avatar>
                            </div>

                            <div className="text-white bg-neutral-700 rounded-2xl text-[10px] sm:text-xs p-2 w-full shadow-2xl md:w-[45%] text-center sm:text-left">
                                <span className="text-white  text-[10px] sm:text-xs px-2 py-0.5">{acthor?.name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        {isLoadings && (
                            <Skeleton
                                className={`rounded-lg border-[3px] border-gray-700 shadow-2xl ${isLandscape ? "w-[500px] h-[350px]" : "w-[300px] h-[400px]"
                                    }`}
                            />
                        )}

                        <Image
                            src={selectedImage || "/images/fallback.webp"}
                            alt="Selected"
                            className={`rounded-lg border-[3px] border-gray-700 shadow-2xl transition-opacity ${isLoading ? "opacity-0" : "opacity-100"
                                }`}
                            width={isLandscape ? 500 : 300}
                            height={isLandscape ? 350 : 400}
                            layout="intrinsic"
                            onLoad={handleImageLoad}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-xs sm:text-sm mx-auto max-w-lg  text-white">
                            Note: If you prefer this capture not to be public or have any issues. We’ll verify your request and work on it soon.Press on Request Removal
                        </p>

                    </div>


                    <div className="flex justify-center gap-2  items-center">
                        <button onClick={handleToggleLike} aria-label="Like Button">
                            <FaHeart size={24} color={hasLiked ? "red" : "white"} />
                        </button>

                        <span className="flex items-center text-white text-sm">
                            {isLoading ? "..." : totalLikes !== null ? totalLikes : "..."}
                        </span>

                        <Button onClick={handleShare} className="flex items-center">
                            <Share2 className="text-white w-5 h-5" />
                        </Button>

                        <Button
                            className="bg-white rounded-xl text-black p-3 text-sm hover:scale-105 transition-all"
                            onClick={() => handleDownload(selectedImageOg || selectedImage)}
                        >
                            Download
                        </Button>
                        <Button
                            className="bg-white rounded-xl  text-bold text-black p-3 text-sm hover:scale-105 transition-all"
                            onClick={() => {
                                handleClosePopup();
                                openRemovalPopup(selectedImage);
                            }}
                        >
                            Request Removal
                        </Button>
                        <button
                        onClick={() => setOpenMoreInfor(true)}
                        >
                            <Info className="text-white" />
                        </button>

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
