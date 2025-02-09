/**
 * Team Actions Component
 * Provides action buttons and handlers for team member management
 * @module TeamActions
 */

import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { DeleteTeamPopUpModel } from './delete'
import EditTeamPopupModel from './edit'

/**
 * Props interface for TeamAction component
 */
interface ActionProps {
    id: number;
    name: string;
}

/**
 * TeamAction Component
 * Renders dropdown menu with edit and delete actions
 * @param {ActionProps} props Component properties
 * @returns {JSX.Element} Action buttons and modals
 */
const TeamAction = ({
    id,
    name
}: ActionProps) => {
    // Modal visibility state
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
                    <DeleteTeamPopUpModel isOpen={isDelete} setOpen={setIsDelete} id={id} name={name} />
                )
            }
            {
                isEdit && (
                    <EditTeamPopupModel isPopupOpen={isEdit} setIsPopupOpen={setIsEdit} id={id} />
                )
            }
        </>
    )
}

export default TeamAction
