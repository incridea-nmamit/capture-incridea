// components/CaptureCard.tsx
import Image from "next/image";

interface CaptureCardProps {
  imagePath: string;
  altText: string;
}

const CaptureCard: React.FC<CaptureCardProps> = ({ imagePath, altText }) => (
  <div
    className="relative rounded-lg shadow-md overflow-hidden border border-gray-700"
    style={{ width: '100%', maxWidth: '300px' }} // Optional: Limit max width
  >
    <Image
      src={imagePath}
      alt={altText}
      width={300}
      height={300}
      className="object-contain w-full h-auto" // Ensure full display
    />
  </div>
);

export default CaptureCard;
