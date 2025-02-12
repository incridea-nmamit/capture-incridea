import { Pen } from 'lucide-react';
import React, { useState } from 'react'
import EditForm from './edit-form';

const EditComponent = ({ id }: { id: number }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setOpen(true)}>
                <Pen size={20} />
            </button>
            {
                open && (
                    <EditForm open={open} setOpen={setOpen} id={id} />
                )
            }
        </div>
    )
}

export default EditComponent
