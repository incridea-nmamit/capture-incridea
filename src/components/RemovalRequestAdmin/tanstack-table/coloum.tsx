"use client";

import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { ArrowUpDown } from "lucide-react";
import ActionComponent from "./actionComponent";

export type Request = {
    id: number;
    image_path: string;
    name: string;
    email: string;
    description: string;
    status: Status;
    idcard: string;
};

export const pendingColumns: ColumnDef<Request>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name || "",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
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


export const columns: ColumnDef<Request>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name || "",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
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
            const status = row.original.status;
            const statusClasses =
                status === "approved" ? "bg-green-500 text-white" :
                    status === "declined" ? "bg-red-500 text-white" :
                        "bg-gray-500 text-white"; 

            return (
                <span className={`inline-flex items-center px-2 py-1 text-xs md:text-md font-medium rounded-full 
                    ${statusClasses}  border border-white`}>
                    {status}
                </span>
            );
        },

    },
];
