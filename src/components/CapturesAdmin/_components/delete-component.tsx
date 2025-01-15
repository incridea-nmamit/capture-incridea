import React, { useState } from 'react'
import { DeleteCapturePopUpModel } from '../popups/delete-capture-popup'
import { Trash } from 'lucide-react'


type Props = {
    id: number
}
const DeleteComponent = ({
    id
}: Props) => {
    const [openDeleteCaptureModel, setopenDeleteCaptureModel] = useState(false)
    const [captureIdToDelete,] = useState<number>(id);

    const handleDeleteClick = () => {
        setopenDeleteCaptureModel(true);

    };

    console.log(id)
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
