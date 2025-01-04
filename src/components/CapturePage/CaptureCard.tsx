import Image from "next/image";

interface CaptureCardProps {
  imagePath: string;
  altText: string;
  onClick: () => void;
}

const CaptureCard: React.FC<CaptureCardProps> = ({ imagePath, altText, onClick }) => (
  <div
    className="relative rounded-lg shadow-md overflow-hidden w-full max-w-sm cursor-pointer flex flex-col justify-center"
    onClick={onClick}
  >
    {/* Transparent overlay */}
    <div
      className="absolute inset-0 bg-transparent z-10"
      style={{ pointerEvents: "none" }} 
    />

    <Image
      src={imagePath}
      alt={altText}
      width={300}
      height={300}
      className="object-contain w-full h-auto"
      onContextMenu={(e) => e.preventDefault()} 
      onDragStart={(e) => e.preventDefault()} 
    />
    
    {/* Disable right-click globally with Tailwind */}
    <div className="absolute inset-0 pointer-events-none" />
  </div>
);

export default CaptureCard;
