import { Heart, Share2 } from "lucide-react";
import Image from "next/image";

interface CapturePopupProps {
  selectedImage: string | null;
  handleClosePopup: () => void;
  handleDownload: (imageUrl: string) => void;
  openRemovalPopup: (imageUrl: string) => void;
  session_user: string;
}

const CapturePopup: React.FC<CapturePopupProps> = ({
  selectedImage,
  handleClosePopup,
  handleDownload,
  openRemovalPopup,
}) => {
  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onClick={handleClosePopup}
    >


      <div className="max-w-[80vw] max-h-[90vh] w-full h-full grid grid-cols-1 md:grid-cols-2 bg-primary-900 gap-4 sm:p-2 md:p-4 lg:p-6" >
        <div className="bg-green-900 h-full grid place-content-center rounded-lg border-white border-2 overflow-hidden">
          <Image src={selectedImage || "/images/fallback.jpg"}
            alt="Selected"
            width={200}
            height={200}
            layout="responsive" />
        </div>

        <div>
          <div className="">
            <div>
              <h4>Category name</h4>
              <div className="flex flex-row gap-2 items-center">
                <div className="rounded-full border-2 border-white overflow-hidden">
                  <Image src={selectedImage || "/images/fallback.jpg"}
                    className="aspect-square h-6 object-cover"
                    alt="Selected"
                    width={100}
                    height={100}
                    layout="responsive" />
                </div>
                <div className="space-y-2 flex-grow">
                  <span>Captured by</span>
                  <span>
                    name
                  </span>
                  <span>team member name</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 ">
            <button>
              <Heart />
            </button>
            <button>
              <Share2 />
            </button>
            <button className="flex-grow">
              Download
            </button>
          </div>
        </div>
      </div>
      {/* <div className="relative bg-black p-6 rounded-3xl shadow-lg font-Trap-Regular max-w-xs sm:max-w-md w-full z-30">
        <div className="flex justify-center py-8">
          <Image
            src={selectedImage || "/images/fallback.jpg"}
            alt="Selected"
            width={200}
            height={200}
            layout="responsive"
            className="rounded mb-4"
          />
        </div>
        <div className="flex justify-center items-center space-x-4 py-5">
          <button
            className="bg-white hover:bg-black hover:text-white w-52 justify-center text-black px-2 py-2 rounded-full flex items-center transition-all"
            onClick={() => handleDownload(selectedImage)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v12m8-8l-8 8-8-8"
              />
            </svg>
            Download
          </button>
        </div>
        <p className="text-xs text-center py-5 w-full">
          Note: If you prefer this capture not to be public or have any
          issues.
          <br />
          Please{" "}
          <a
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              handleClosePopup();
              openRemovalPopup(selectedImage);
            }}
          >
            click here to Request Removal
          </a>
          .
          <br />
          We’ll verify your request and work on it soon.
        </p>
      </div> */}
    </div>
  );
};

export default CapturePopup;
