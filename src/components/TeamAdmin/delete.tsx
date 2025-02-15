/**
 * Delete Team Member Modal
 * Handles team member deletion with confirmation dialog
 */
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

interface DeleteTeamProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    id: number;
    name: string;
}

export function DeleteTeamPopUpModel({ isOpen, setOpen, id, name }: DeleteTeamProps) {
    // Mutation and state hooks
    const deleteTeam = api.team.deleteTeam.useMutation();
    const auditLogMutation = api.audit.log.useMutation();
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const refetch = UseRefetch();

    // Toast configuration
    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: 'black',
            color: 'white',
        },
    };

    /**
     * Handle delete confirmation
     * Deletes team member and logs audit entry
     */
    const confirmDelete = async () => {
        if (id) {
            try {
                setLoading(true);
                await deleteTeam.mutateAsync({ id: id! }, {
                    onSuccess: async () => {
                        try {
                            await auditLogMutation.mutateAsync({
                                sessionUser: session?.user.name || "Invalid User",
                                description: `Deleted a team member ${name}`,
                                audit: 'TeamManagementAudit'
                            });
                            refetch();
                            toast.success('Successfully deleted the team', toastStyle);
                        } catch (error) {
                            toast.error(`Error deleting team member ${name}`);
                        }
                    },
                });

            } catch (error) {
                toast.error(`Error deleting team members ${name}`);
            } finally {
                setLoading(false);
                setOpen(false);
            }
        }
    };

    const cancelDelete = () => {
        toast.error(`Process Deleted ${name}`);
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete !?
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
