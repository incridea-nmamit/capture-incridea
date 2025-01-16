"use client"

import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button";
import { ArrowUpDown,  } from "lucide-react";
import ActionComponent  from "../_components/action-component";



export type Capture = {
    state?: Status;
    id?: number;
    event_name?: string | null;
    event_category: string;
    compressed_path: string;
    upload_type?: string;
    image_path?: string;
    authored_id?: number;
    date_time?: Date;
}

export const deletedCapturecolumns: ColumnDef<Capture>[] = [
    {
        accessorKey: "event_name",
        header: "Event",
        cell: ({ row }) => (
            row.original.event_name || ""
        ),
    },
    {
        accessorKey: "event_category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "compressed_path",
        header: "Image",
        cell: ({ row }) => (
            <img
                src={row.original.compressed_path}
                alt="Capture"
                className="md:w-24 md:h-24 w-20 h-16 object-cover rounded-md"
            />
        ), 
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
            <ActionComponent id={row.original.id!} />
        )
    },

];
