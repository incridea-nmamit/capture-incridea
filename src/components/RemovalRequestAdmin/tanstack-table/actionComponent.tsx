import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import UseRefetch from '~/hooks/use-refetch';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

/**
 * ActionComponent Props
 */
type Props = {
    id: number;      // Request ID
    email: string;   // User email for notifications
}

/**
 * ActionComponent
 * Handles approval/decline actions for removal requests
 * Includes email notifications and audit logging
 */
const ActionComponent = ({ id, email }: Props) => {
    // State management
    const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isFinalOpen, setIsFinalOpen] = useState(false);

    // Hooks and API mutations
    const refetch = UseRefetch();
    const { data: session } = useSession();
    const clearRequest = api.request.clearRequest.useMutation();
    const auditLogMutation = api.audit.log.useMutation();

    /**
     * Handles initial action button click
     */
    const handleActionClick = (action: 'approve' | 'decline') => {
        setActionType(action);
        setIsOpen(true);
        
    };

    const handleConfirmFirstDialog = () => {
        setIsOpen(false);
        setIsFinalOpen(true);
    };

    /**
     * Processes the final confirmation and sends notifications
     */
    const handleFinalConfirm = async () => {
        if (actionType === 'approve') {
            await clearRequest.mutateAsync({ id: id!, status: "approved" }, {

                onSuccess: async () => {
                    toast.success('Approved And Mailing response');
                     refetch();
                    try {
                        const response = await fetch('/api/sendApprovedMail', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email,
                            }),
                        });
                        if (!response.ok) {
                            toast.error('Failed to send Mail');
                        }
                        toast.success('Response Mail Sent Successfully');
                      
                        await auditLogMutation.mutateAsync({
                            sessionUser: session?.user.name || "Invalid User",
                            description: `Approved mail sent to ${email} for capture ID#${id}`,
                            audit:'RemovalManagementAudit'
                        });
                    } catch (error) {
                        toast.error('An error occurred while sending the Mail.');
                    }
                    refetch();
                },
                onError: () => {
                    toast.error('Failed to approve');
                },
            });

        } else if (actionType === 'decline') {
            await clearRequest.mutateAsync({ id: id, status: "declined" },
                {
                    onSuccess: async () => {
                        toast.success('Declined And Mailing response');
                        try {
                            const response = await fetch('/api/sendDeclineMail', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email,
                                }),
                            });
                            if (!response.ok) {
                                toast.error('Failed to send Mail');
                            }
                            toast.success('Response Mail Sent Successfully');
                         
                            await auditLogMutation.mutateAsync({
                                sessionUser: session?.user.name || "Invalid User",
                                description: `Declined mail sent to ${email} for capture ${id}`,
                                audit:'RemovalManagementAudit'
                            });
                        } catch (error) {
                            toast.error('An error occurred while sending the Mail.');
                        }
                    },
                    onError: () => {
                        toast.error('Failed to decline');
                    }
                }
            );

        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setIsFinalOpen(false);
    };

    return (
        <div className="flex gap-2 items-center justify-center">
            {/* Action Buttons */}
            <div className="flex flex-row gap-2 items-center justify-center">
                <Button
                    className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
                    onClick={() => handleActionClick('approve')}
                >
                    Approve
                </Button>
                <Button
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                    onClick={() => handleActionClick('decline')}
                >
                    Decline
                </Button>
            </div>

            {/* Confirmation Dialogs */}
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Action Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            You can {actionType === 'approve' ? 'approve' : 'decline'} this request upon verification.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>No</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmFirstDialog}>
                            Yes, {actionType === 'approve' ? 'Approve' : 'Decline'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <AlertDialog open={isFinalOpen} onOpenChange={setIsFinalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Confirming will {actionType === 'approve' ? 'approve' : 'decline'} this request.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction  onClick={handleFinalConfirm}>
                            Yes,
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ActionComponent;
