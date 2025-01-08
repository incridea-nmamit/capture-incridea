import Image from "next/image";

interface CaptureCardProps {
  imagePath: string;
  altText: string;
  onClick: () => void;
  prefech: boolean;
}

export const CaptureCard: React.FC<CaptureCardProps> = ({ imagePath, altText, onClick, prefech = false }) => {
  return (
    <div
      className="relative rounded-lg shadow-md overflow-hidden w-full max-w-sm cursor-pointer flex flex-col justify-center "
      onClick={onClick}
    >
      <Image
        src={imagePath}
        alt={altText}
        loading="lazy"
        width={200}
        height={200}
        className="object-contain w-full h-auto capture-image"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      {prefech && (
        <link rel="prefetch" href={imagePath} as="image" className="hidden" />
      )}
    </div>
  )
};