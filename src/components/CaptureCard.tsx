// components/CaptureCard.tsx
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
    <Image
      src={imagePath}
      alt={altText}
      width={300}
      height={300}
      className="object-contain w-full h-auto"
    />
  </div>
);

export default CaptureCard;
