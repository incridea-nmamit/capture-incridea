import React, { useState } from "react";
import { api } from "~/utils/api";
import { FcLike } from "react-icons/fc";
import Image from "next/image";
import { ImageListItem } from "@mui/material";
import { FaHeart } from "react-icons/fa";

/**
 * GridCard Component Props
 */
interface GridCardProps {
  imageId: number;
  imagePath: string;
  altText: string;
  onClick: () => void;
  prefech?: boolean;
}

/**
 * GridCard Component
 * Displays individual image cards with like count and loading states
 */
export const GridCard: React.FC<GridCardProps> = ({
  imageId,
  imagePath,
  altText,
  onClick,
  prefech = false,
}) => {
  // API query for likes
  const { data: totalLikes } = api.like.getTotalLikes.useQuery({
    captureId: imageId!,
  });

  // Loading state management
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ImageListItem
      className={`grid place-content-center place-items-center rounded-lg  p-1 ${isLoading ? "bg-gradient-to-b from-[#343434] to-[#0d1115]" : "bg-transparent"}`}
    >
      <div className="relative h-fit w-fit">
        <div
          className={`relative flex w-full max-w-sm cursor-pointer flex-col justify-center overflow-hidden rounded-lg shadow-md`}
          onClick={onClick}
        >
          <Image
            width={300}
            height={300}
            src={imagePath}
            alt={altText}
            loading="lazy"
            className="capture-image h-auto w-full object-contain"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onLoad={() => setIsLoading(true)}
          />
          {prefech && (
            <link rel="prefetch" href={imagePath} as="image" className="hidden" />
          )}
          <div className="absolute -bottom-1 justify-center items-center right-0 flex gap-1 rounded-tl-3xl bg-gradient-to-b from-[#343434] to-[#0d1115] px-4 py-1 text-white text-xs">
          <div><FaHeart  size={14} /></div>
            {totalLikes}
          </div>
        </div>
      </div>
    </ImageListItem>
  );
};


