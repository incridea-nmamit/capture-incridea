import React, { useState } from 'react'
import { MoreHorizontal, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import DeleteCapturePopUpModel from '../popups/delete-permanently-popup'
import RestorePopup from '../popups/restore-popup'

type Props = {
    id: number
}
const ActionComponent = ({
    id
}: Props) => {
    const [captureIdToDelete,] = useState<number>(id);
    const [openRestorePopup, setOpenRestorePopup] = useState(false)
    const [openDeleteCaptureModel, setopenDeleteCaptureModel] = useState(false)

    const handlerestoreClick = () => {
        setOpenRestorePopup(true)
    };
    const handledeletedClick = () => {
        setopenDeleteCaptureModel(true);
    }

    console.log(id)
    return (
        <>

            <div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                        <DropdownMenuItem
                            onClick={handlerestoreClick}
                        >
                            restore
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handledeletedClick}
                        >
                            deletedPermanently
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {
                openDeleteCaptureModel && (
                    <DeleteCapturePopUpModel isOpen={openDeleteCaptureModel} setOpen={setopenDeleteCaptureModel} captureId={captureIdToDelete!} />
                )
            }
            {
                openRestorePopup && (
                    <RestorePopup isOpen={openRestorePopup} setOpen={setOpenRestorePopup} captureId={captureIdToDelete!} />
                )
            }
        </>
    )
}

export default ActionComponent 
