import React, { useState } from 'react'
import { DeleteCapturePopUpModel } from '../popups/delete-capture-popup'
import { Trash } from 'lucide-react'


/**
 * DeleteComponent
 * Handles deletion of active captures.
 * Features:
 * - Delete confirmation modal
 * - Visual feedback
 */

type Props = {
    id: number; // ID of the capture to delete
}
const DeleteComponent = ({
    id
}: Props) => {
    const [openDeleteCaptureModel, setopenDeleteCaptureModel] = useState(false)
    const [captureIdToDelete,] = useState<number>(id);

    const handleDeleteClick = () => {
        setopenDeleteCaptureModel(true);

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
                openDeleteCaptureModel && (
                    <DeleteCapturePopUpModel isOpen={openDeleteCaptureModel} setOpen={setopenDeleteCaptureModel} captureId={captureIdToDelete!} />
                )
            }
        </div>
    )
}

export default DeleteComponent
