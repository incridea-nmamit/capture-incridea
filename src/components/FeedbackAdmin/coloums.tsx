"use client"

/**
 * Column definitions for events table
 * Includes name, description, type, and delete action
 */

import { ColumnDef } from "@tanstack/react-table";
import DeleteComponent from "./delete-component";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

type FeedbackList = inferRouterOutputs<AppRouter>["feedback"]["getAllFeedback"];
type FeedbackItem = FeedbackList[number];

export const eventColumns: ColumnDef<FeedbackItem>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.user.email || "",
    },
    {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => row.original.description || "No comment",
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => row.original.rating,
    },
    {
        id: "actions",
        header: "Delete",
        cell: ({ row }) => <DeleteComponent id={row.original.id} />,
    },
];