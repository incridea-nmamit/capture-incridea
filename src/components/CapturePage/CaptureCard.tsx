import Image from "next/image";
import { api } from "~/utils/api";
import { FcLike } from "react-icons/fc";
interface CaptureCardProps {
  imageId: number;
  imagePath: string;
  altText: string;
  onClick: () => void;
  prefech: boolean;
}

export const CaptureCard: React.FC<CaptureCardProps> = ({ imageId, imagePath, altText, onClick, prefech = false }) => {

  const { data: totalLikes } = api.like.getTotalLikes.useQuery({ captureId: imageId! })

  return (
    <div
      className="relative rounded-lg shadow-md overflow-hidden w-full max-w-sm cursor-pointer flex flex-col justify-center  "
      onClick={onClick}
    >
      <img
        src={imagePath}
        alt={altText}
        loading="lazy"
        className="object-contain w-full h-auto capture-image"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      {prefech && (
        <link rel="prefetch" href={imagePath} as="image" className="hidden" />
      )}
      <div className="absolute -bottom-1 right-0 text-white bg-slate-900 flex gap-1 px-4 py-2 rounded-tl-3xl" >
        <FcLike size={20}/>{totalLikes}
      </div>
    </div>
  )
};