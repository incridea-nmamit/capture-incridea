import Image from "next/image";

interface CaptureCardProps {
  imagePath: string;
  altText: string;
  onClick: () => void;
  prefech: boolean;
}

const CaptureCard: React.FC<CaptureCardProps> = ({ imagePath, altText, onClick, prefech = false }) => {

  const imageUrl = `${imagePath}?w=248&fit=crop&auto=format`;

  return (
    <div
      className="relative rounded-lg shadow-md overflow-hidden w-full max-w-sm cursor-pointer flex flex-col justify-center"
      onClick={onClick}
    >
      <Image
        src={imageUrl}
        alt={altText}
        width={300}
        height={300}
        loading="lazy"
        quality={20}
        className="object-contain w-full h-auto"
      />
      {prefech && (
        <link rel="prefetch" href={imageUrl} as="image" className="hidden" />
      )}
    </div>
  )
};

export default CaptureCard;
