"use client"

import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button";
import { ArrowUpDown, } from "lucide-react";
import DeleteComponent from "../_components/delete-component";



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
export const activeCapturecolumns: ColumnDef<Capture>[] = [
    {
        accessorKey: "event_name",
        header: "Event Name",
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
                className="w-24 h-24 object-cover rounded-md"
            />
        ),
    },
    {
        id: "actions",
        header: "Delete",
        cell: ({ row }) => (
            <DeleteComponent id={row.original.id!} />
        )
    },
];

