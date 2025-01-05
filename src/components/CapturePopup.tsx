import { Heart, Share2 } from "lucide-react";
import Image from "next/image";

interface CapturePopupProps {
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

const CapturePopup: React.FC<CapturePopupProps> = ({
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

  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onClick={handleClosePopup}
    >


      <div className="max-w-[80vw] max-h-[90vh] w-full h-full grid grid-cols-1 md:grid-cols-2 bg-primary-900 gap-4 rounded-lg" >
        <div className="bg-slate-800 h-full grid place-content-center rounded-lg border-white border-2 overflow-hidden m-4">
          <Image src={selectedImage || "/images/fallback.jpg"}
            alt="Selected"
            width={200}
            height={200}
            layout="responsive" />
        </div>

        <div className="flex flex-col justify-between">
          <div className="m-4">
            <div>
              <h4 className="font-Teknaf text-4xl text-center mb-6">Category name</h4>
              <div className="flex flex-row gap-2 items-center border-2 border-white rounded-lg p-4">
                <div className="rounded-full border-2 border-white overflow-hidden h-24 aspect-square">
                  <Image src={selectedImage || "/images/fallback.jpg"}
                    className="w-full !h-full object-cover"
                    alt="Selected"
                    width={100}
                    height={100}
                    layout="responsive" />
                </div>
                <div className="space-y-2 flex-grow flex flex-col text-center font-Trap-Regular">
                  <span className="text-sm text-gray-400">Captured by</span>
                  <span className="text-lg">
                    member name
                  </span>
                  <span className="text-gray-400 text-sm">team name</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-center py-5 m-4">
              <p className="text-xs mx-auto max-w-lg mb-4 w-full"> Note: If you prefer this capture not to be public or have any
                issues.We’ll verify your request and work on it soon.</p>
              <button className="flex-grow bg-white rounded-lg text-black p-2 hover:scale-105 transition-all" onClick={() => {
                handleClosePopup();
                openRemovalPopup(selectedImage);
              }}>
                Request Removal
              </button>
            </div>

            <div className="flex gap-4 border-2 border-white p-2 w-full rounded-lg">
              <button>
                <Heart />
              </button>
              <button>
                <Share2 />
              </button>
              <button className="flex-grow bg-white rounded-lg text-black p-2 px-6 hover:scale-[101%] transition-all" onClick={() => handleDownload(selectedImageOg || selectedImage)}>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturePopup;
