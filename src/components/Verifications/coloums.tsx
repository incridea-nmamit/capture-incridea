"use client"

/**
 * Column definitions for verifications table
 * Includes name, college, email, and delete action
 */

import { CollegeType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DeleteComponent from "./delete-component";

/**
 * Type definition for verification data structure
 */
export type Verfications = {
    id: number;
    email: string;
    name: string;
    phone_number: string;
    college: CollegeType;
}

/**
 * Column configurations for verifications
 * Includes sortable columns and delete action
 */
export const verficationcolumns: ColumnDef<Verfications>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            row.original.name || ""
        ),
    },
    {
        accessorKey: "college",
        header: "College",
        cell: ({ row }) => (
            row.original.college || ""
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            row.original.email || ""
        ),
    },
    {
        id: "actions",
        header: "Delete",
        cell: ({ row }) => (
            <DeleteComponent  id={row.original.id!} />
        )
    },
];
