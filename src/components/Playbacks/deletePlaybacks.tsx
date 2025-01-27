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
import UseRefetch from "~/hooks/use-refetch";

import { api } from "~/utils/api";

type Props = {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    id: number;
}

export function DeletePlayBacksPopUpModel({ isOpen, setOpen, id }: Props) {
    const deletePlayback = api.playbacks.deletePlaybacks.useMutation();
    const auditLogMutation = api.audit.log.useMutation();
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession();
    const refetch = UseRefetch()
    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: 'black',
            color: 'white',
        },
    };
    const confirmDelete = async () => {
        if (id) {
            try {
                setLoading(true);
                await deletePlayback.mutateAsync({ id: id! }, {
                    onSuccess: async () => {
                        try {
                            await auditLogMutation.mutateAsync({
                                sessionUser: session?.user.name || "Invalid User",
                                description: `playbacksAudit - Deleted a PlayBack with id ${id} as disagreement`,
                            });
                            refetch();
                            toast.success('Successfully deleted the PlayBack', toastStyle);
                        } catch (error) {
                            toast.error('Error logging audit information', toastStyle);
                        }
                    },
                });

            } catch (error) {
                toast.error('Error deleting PlayBack', toastStyle);
            } finally {
                setLoading(false);
                setOpen(false);
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
