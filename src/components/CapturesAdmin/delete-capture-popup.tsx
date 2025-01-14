import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"

import { api } from "~/utils/api";

type Props = {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    captureId: number;
}

export function DeleteCapturePopUpModel({ isOpen, setOpen, captureId }: Props) {
    const deleteImage = api.gallery.deleteImage.useMutation();
    const auditLogMutation = api.audit.log.useMutation();
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession();
    const { refetch } = api.gallery.getAllGallery.useQuery();
    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: 'black',
            color: 'white',
        },
    };

    const confirmDelete = async () => {
        if (captureId) {
            try {
                setLoading(true)
                await deleteImage.mutateAsync({ id: captureId! });
                refetch();
                await auditLogMutation.mutateAsync({
                    sessionUser: session?.user.name || "Invalid User",
                    description: `CaptureManagementAudit - Deleted a capture with id ${captureId} as disagreement`,
                });
                toast.success('Successfully deleted the capture', toastStyle);
                setLoading(false)
            } catch (error) {
                toast.error('Error deleting capture', toastStyle);
                setLoading(false)
            } finally {
                setOpen(false);
                setLoading(false)
            }
        }
    };

    const cancelDelete = () => {
        toast.error('Event not deleted.', toastStyle);
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete  ?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-4 space-x-4">
                    <Button disabled={loading} onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                        {loading ? (
                            <svg
                                className="w-5 h-5 text-white animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        ) : (
                            "Delete"
                        )}</Button>
                    <Button onClick={cancelDelete} className="bg-gray-300  text-black px-4 py-2 rounded">Cancel</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
