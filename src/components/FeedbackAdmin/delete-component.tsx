import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '../ui/dialog';
import { Button } from '../ui/button';
import { api } from '~/utils/api';
import UseRefetch from '~/hooks/use-refetch';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

/**
 * DeleteComponent
 * Handles deletion of active captures.
 * Features:
 * - Delete confirmation modal
 * - Visual feedback
 */

const toastStyle = {
    style: {
        borderRadius: '10px',
        background: 'black',
        color: 'white'
    }
};

type Props = {
    id: number; // ID of the capture to delete
};

const DeleteComponent = ({ id }: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const refetch = UseRefetch();
    const { data: session } = useSession();

    const deleteFeedback = api.feedback.deleteFeedback.useMutation();
    const auditLogMutation = api.audit.log.useMutation();

    const handleDeleteClick = () => {
        setOpen(true);
    };

    const confirmDelete = async () => {
        if (id) {
            try {
                setLoading(true);
                await deleteFeedback.mutateAsync({ id });
                refetch();
                await auditLogMutation.mutateAsync({
                    sessionUser: session?.user.name || 'Invalid User',
                    description: `Deleted an Feedback with id ${id}`,
                    audit: 'FeedbackAudit'
                });

                toast.success('Successfully deleted the Feedback', toastStyle);
            } catch (error) {
                toast.error('Error deleting feedback', toastStyle);
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
        <div>
            <button
                onClick={handleDeleteClick}
                className="text-red-500 hover:underline"
            >
                <Trash className="h-6 w-6" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Confirmation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this feedback?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end mt-4 space-x-4">
                        <Button
                            disabled={loading}
                            onClick={confirmDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
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
                                'Delete'
                            )}
                        </Button>
                        <Button
                            onClick={cancelDelete}
                            className="bg-gray-300 text-black px-4 py-2 rounded"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DeleteComponent;
