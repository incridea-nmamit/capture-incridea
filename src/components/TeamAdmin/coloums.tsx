"use client"

import { Status, Teamgroup } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, } from "lucide-react";
import TeamAction from "./actions";



type TeamProps = {
    id?: number;
    name?: string;
    committee?: Teamgroup;
    designation?: string;
    image?: string;
    say?: string;
}


export const Teamcolumns: ColumnDef<TeamProps>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            row.original.name || ""
        ),
    },
    {
        accessorKey: "committee",
        header: "Committee",
        cell: ({ row }) => (
            row.original.committee || ""
        ),
    },
    {
        accessorKey: "designation",
        header: "Position",
        cell: ({ row }) => (
            row.original.designation || ""
        ),
    },
    {
        accessorKey: "say",
        header: "Say",
        cell: ({ row }) => (
            row.original.say || ""
        ),
    },
    {
        accessorKey: "Profile",
        header: "image",
        cell: ({ row }) => (
            <img src={row.original.image} alt={row.original.name} className="w-10 h-10 rounded-md object-cover" />
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <TeamAction id={row.original.id!} name={row.original.name!} />
        )
    },
];

