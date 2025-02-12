import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import UseRefetch from "~/hooks/use-refetch";

import { api } from "~/utils/api";

/**
 * DeleteVerificationsPopUpModel Component
 * Modal dialog for deleting verifications with audit logging
 * Features:
 * - Confirmation dialog
 * - Loading state
 * - Audit logging
 * - Success/Error notifications
 * - Session user tracking
 */

type Props = {
    isOpen: boolean;          // Controls dialog visibility
    setOpen: (open: boolean) => void;  // Dialog state setter
    Id: number;               // ID of verification to delete
}

export function DeleteVerificationsPopUpModel({ isOpen, setOpen, Id }: Props) {
    // Mutation hooks for delete operation and audit logging
    const deleteVerification = api.verfication.deleteVerfication.useMutation();
    const auditLogMutation = api.audit.log.useMutation();
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const refetch = UseRefetch();
    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: 'black',
            color: 'white',
        },
    };

    /**
     * Handles the deletion confirmation process
     * Includes audit logging and error handling
     */
    const confirmDelete = async () => {
        if (Id) {
            try {
                setLoading(true);
                await deleteVerification.mutateAsync({ id: Id });
                refetch();
                await auditLogMutation.mutateAsync({
                    sessionUser: session?.user.name || "Invalid User",
                    description: `Deleted verification with ID ${Id}`,
                    audit: 'VerificationManagementAudit',
                });
                toast.success('Successfully deleted the verification', toastStyle);
            } catch (error) {
                toast.error('Error deleting verification', toastStyle);
            } finally {
                setLoading(false);
                setOpen(false);
            }
        }
    };

    const cancelDelete = () => {
        toast.error('Verification not deleted.', toastStyle);
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this verification?
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
                            "Delete"
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
    );
}
