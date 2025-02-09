"use client";

import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { ArrowUpDown } from "lucide-react";
import ActionComponent from "./actionComponent";

/**
 * Type definition for removal request data
 */
export type Request = {
    id: number;
    image_path: string;
    name: string;
    email: string;
    description: string;
    status: Status;
    idcard: string;
};

/**
 * Column definitions for pending requests
 * Includes special handling for actions and status display
 */
export const pendingColumns: ColumnDef<Request>[] = [
    // Name Column
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name || "",
    },
    // Email Column with sorting
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "",
    },
    {
        accessorKey: "image_path",
        header: "Image",
        cell: ({ row }) => (
            <img
                src={row.original.image_path}
                alt="Capture"
                className="w-20 h-20 md:h-24 md:w-24 object-cover rounded-md"
            />
        ),
    },
    {
        accessorKey: "idcard",
        header: "Document",
        cell: ({ row }) => (
            <img
                src={row.original.idcard}
                alt="Capture"
                className="w-20 h-20 md:h-24 md:w-24 object-cover rounded-md"
            />
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <span className={`inline-flex items-center px-2 py-1 text-xs md:text-md font-medium rounded-full 
                    bg-gray-500 text-white  border border-white`}>
                   {row.original.status}
                </span>
            );
        },
    },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <ActionComponent id={row.original.id!} email={row.original.email!} />
        )

    },
];

/**
 * Column definitions for all requests
 * Includes status-based styling and formatting
 */
export const columns: ColumnDef<Request>[] = [
    // Name Column
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name || "",
    },
    // Email Column with sorting
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "",
    },
    {
        accessorKey: "image_path",
        header: "Image",
        cell: ({ row }) => (
            <img
                src={row.original.image_path}
                alt="Capture"
                className="w-20 h-20 md:h-24 md:w-24 object-cover rounded-md"
            />
        ),
    },
    {
        accessorKey: "idcard",
        header: "Document",
        cell: ({ row }) => (
            <img
                src={row.original.idcard}
                alt="Capture"
                className="w-20 h-20 md:h-24 md:w-24 object-cover rounded-md"
            />
        ),
    },
    // Status Column with conditional styling
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusClasses = status === "approved" ? "bg-green-500 text-white" :
                                status === "declined" ? "bg-red-500 text-white" :
                                "bg-gray-500 text-white";

            return (
                <span className={`inline-flex items-center px-2 py-1 text-xs md:text-md font-medium rounded-full 
                    ${statusClasses} border border-white`}>
                    {status}
                </span>
            );
        },
    },
];
