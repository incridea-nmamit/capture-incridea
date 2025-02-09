import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { DeletePlayBacksPopUpModel } from './deletePlaybacks'
import { EditPlayBacksPopUpModel } from './editPlaybacks'

/**
 * Props interface for PlaybacksAction component
 */
type Props = {
    id: number    // Unique identifier for the playback item
}

/**
 * PlaybacksAction Component
 * Provides a dropdown menu with edit and delete actions for playback items
 */
const PlaybacksAction = ({ id }: Props) => {
    // State for modal visibility
    const [isDelete, setIsDelete] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    return (
        <>
            {/* Dropdown Menu */}
            <div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    {/* Dropdown Items */}
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsDelete(true)}>
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsEdit(true)}>
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Modal Components */}
            {isDelete && (
                <DeletePlayBacksPopUpModel 
                    isOpen={isDelete} 
                    setOpen={setIsDelete} 
                    id={id} 
                />
            )}
            {isEdit && (
                <EditPlayBacksPopUpModel 
                    isOpen={isEdit} 
                    setOpen={setIsEdit} 
                    id={id} 
                />
            )}
        </>
    )
}

export default PlaybacksAction
