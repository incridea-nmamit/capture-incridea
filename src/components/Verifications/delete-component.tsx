import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import { DeleteVerificationsPopUpModel } from './remove-verfication';

/**
 * DeleteComponent
 * Handles deletion of verification emails.
 * Features:
 * - Delete confirmation modal
 * - Visual feedback
 */

type Props = {
    id: number; // ID of the email to delete
};

const DeleteComponent = ({ id }: Props) => {
    const [openDeleteVerificationModel, setOpenDeleteVerificationModel] = useState(false);
    const [verificationIdToDelete] = useState<number>(id);

    const handleDeleteClick = () => {
        setOpenDeleteVerificationModel(true);
    };

    return (
        <div>
            <button
                onClick={handleDeleteClick}
                className="text-red-500 hover:underline"
            >
                <Trash className="h-6 w-6" />
            </button>
            {
                openDeleteVerificationModel && (
                    <DeleteVerificationsPopUpModel 
                        isOpen={openDeleteVerificationModel} 
                        setOpen={setOpenDeleteVerificationModel} 
                        Id={verificationIdToDelete} 
                    />
                )
            }
        </div>
    );
};

export default DeleteComponent;
