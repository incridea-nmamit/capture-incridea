
import Image from "next/image";
import { useState, type FC } from "react";
import toast from "react-hot-toast";
import UseRefetch from "~/hooks/use-refetch";
import { api } from "~/utils/api";
import PopupComponent from "./PopupComponent";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

type ApproveCardProps = {
    id: number;
    eventName: string;
    category: string;
    imageUrl: string;
}

const ApproveCard: FC<ApproveCardProps> = ({ id, eventName, category, imageUrl }) => {
    const [selectedCapture, setSelectedCapture] = useState<{ id: number; action: 'approve' | 'decline' } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for the selected image
    const refetch = UseRefetch();
    const updateState = api.capture.updateState.useMutation();
    const handleRequestDecision = (captureId: number, action: 'approve' | 'decline') => {
        setSelectedCapture({ id: captureId, action });
    };
    const auditLogMutation = api.audit.log.useMutation();
    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: 'black',
            color: 'white',
        },
    };
    const { data: session } = useSession();
    const handleAction = async () => {
        if (selectedCapture) {
            const newState = selectedCapture.action === 'approve' ? 'approved' : 'declined';
            try {
                await updateState.mutateAsync({ id: selectedCapture.id, state: newState });
                toast.success(`Capture ${newState} successfully`, toastStyle);
                await auditLogMutation.mutateAsync({
                    sessionUser: session?.user.name || "Invalid User",
                    description: `Capture with id ${selectedCapture.id} is ${newState}`,
                    audit:'CaptureManagementAudit'
                });
                setSelectedCapture(null);
                void refetch();
            } catch (error) {
                toast.error(`Error ${newState} capture`, toastStyle);
            }
        }
    };

    const handleImageClick = (imagePath: string) => {
        setSelectedImage(imagePath);
    };

    const handleClosePopup = () => {
        setSelectedImage(null);
    };


    return (
        <>

            <div
                className="relative gradient-bg cursor-pointer overflow-hidden w-80 h-full bg-neutral-900 text-gray-50 rounded-lg shadow-md hover:border border-gray-700 hover:shadow-lg hover:border-gray-100 transition duration-300 hover:scale-105 "
            >
                <div className="relative p-2">
                    <Image
                        src={imageUrl}
                        alt={category}
                        width={300}
                        height={80}
                        className="object-cover rounded-xl "
                    />
                </div>


                <div className="p-4 space-y-3 ">
                    <div className=" flex flex-row justify-between items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold text-white font-cursive tracking-wider"> {category}</h2>
                        <span className="border border-gray-200 text-gray-200 px-2 py-1 rounded-md ">
                            {category}
                        </span>
                    </div>


                    <div className="flex items-end justify-end text-sm text-gray-400 ">
                        <span className="bg-black text-gray-200 px-2 py-1 rounded-md">
                            {eventName || category}
                        </span>
                    </div>
                    <hr />


                    <div className="flex flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => handleRequestDecision(id, 'approve')}
                            className="bg-green-500 text-white py-1 px-3 rounded w-28 hover:scale-105"
                        >
                            Approve
                        </Button>
                        <Button
                            onClick={() => handleRequestDecision(id, 'decline')}
                            className="bg-red-500 text-white py-1 px-3 rounded w-28 hover:scale-105"
                        >
                            Decline
                        </Button>
                    </div>
                </div>

            </div>

            {selectedCapture && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                    <div className="bg-black p-6 rounded-md text-center">
                        <h2 className="text-lg text-white mb-4">Confirm Action</h2>
                        <p className="text-white mb-4">
                            Are you sure you want to {selectedCapture.action} this capture?
                        </p>
                        <div className="flex flex-row justify-center gap-4 w-full">
                            <button
                                onClick={handleAction}
                                className={`${selectedCapture.action === 'approve' ? 'bg-green-600' : 'bg-red-600'
                                    } font-BebasNeue text-white px-4 py-2 rounded  hover:scale-105`}
                            >
                                {selectedCapture.action.charAt(0).toUpperCase() + selectedCapture.action.slice(1)}
                            </button>
                            <button
                                onClick={() => setSelectedCapture(null)}
                                className="bg-gray-600 font-BebasNeue text-white px-4 py-2 rounded hover:scale-105"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedImage && (
                <PopupComponent
                    selectedImage={selectedImage}
                    handleClosePopup={handleClosePopup}
                />
            )}
        </>
    );
};

export default ApproveCard;
