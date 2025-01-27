import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { DeletePlayBacksPopUpModel } from './deletePlaybacks'
import { EditPlayBacksPopUpModel } from './editPlaybacks'

type Props = {
    id: number
}
const PlaybacksAction = ({
    id
}: Props) => {

    const [isDelete, setIsDelete] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

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
                            onClick={() => setIsDelete(true)}
                        >
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setIsEdit(true)}
                        >
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {
                isDelete && (
                    <DeletePlayBacksPopUpModel isOpen={isDelete} setOpen={setIsDelete} id={id} />
                )
            }
            {
                isEdit && (
                    <EditPlayBacksPopUpModel isOpen={isEdit} setOpen={setIsEdit} id={id} />
                )
            }
        </>
    )
}

export default PlaybacksAction 
