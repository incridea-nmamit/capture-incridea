"use client"

/**
 * Column definitions for events table
 * Includes name, description, type, and delete action
 */

import { Day, EventType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import ToggleVisibilityButton from "./visibility";
import DeleteComponent from "./delete-component";
import Image from "next/image"
import EditComponent from "./edit-components";
type EventProps = {
    id: number;
    name: string;
    description: string;
    shortDescription: string;
    image: string;
    type: EventType;
    day: Day;
    visibility: boolean;
};

export const eventColumns: ColumnDef<EventProps>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name || "",
    },
    {
        accessorKey: "shortDescription",
        header: "Short Description",
        cell: ({ row }) => row.original.shortDescription || "",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => row.original.type || "",
    },
    {
        accessorKey: "day",
        header: "Day",
        cell: ({ row }) => (
            row.original.day ? (
                <Image
                    src={row.original.image}
                    alt="Day Image"
                    width={50} 
                    height={50} 
                    className="rounded-md"
                />
            ) : (
                ""
            )
        ),
    },
    
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => (
            <ToggleVisibilityButton
                id={row.original.id}
                name={row.original.name}
                visibility={row.original.visibility}
            />
        ),
    },

    {
        id: "actions",
        header: "Delete",
        cell: ({ row }) => <DeleteComponent id={row.original.id} />,
    },
    {
        id: "actions",
        header: "Edit",
        cell: ({ row }) => <EditComponent id={row.original.id} />,
    },
];