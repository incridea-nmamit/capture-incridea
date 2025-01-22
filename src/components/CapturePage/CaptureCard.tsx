import React from "react";
import { api } from "~/utils/api";
import { FcLike } from "react-icons/fc";

interface CaptureCardProps {
  imageId: number;
  imagePath: string;
  altText: string;
  onClick: () => void;
  prefech?: boolean; // Made it optional by adding a question mark
}

export const CaptureCard: React.FC<CaptureCardProps> = ({
  imageId,
  imagePath,
  altText,
  onClick,
  prefech = false,
}) => {
  const { data: totalLikes } = api.like.getTotalLikes.useQuery({
    captureId: imageId!,
  });

  return (
    <div
      className="relative flex w-full max-w-sm cursor-pointer flex-col justify-center overflow-hidden rounded-lg shadow-md"
      onClick={onClick}
    >
      <img
        src={imagePath}
        alt={altText}
        loading="lazy"
        className="capture-image h-auto w-full object-contain"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      {prefech && (
        <link rel="prefetch" href={imagePath} as="image" className="hidden" />
      )}
      <div className="absolute -bottom-1 right-0 flex gap-1 rounded-tl-3xl bg-slate-900 px-4 py-2 text-white">
        <FcLike size={20} />
        {totalLikes}
      </div>
    </div>
  );
};
