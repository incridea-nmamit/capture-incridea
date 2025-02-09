"use client"

import { ColumnDef } from "@tanstack/react-table"
import ReactPlayer from "react-player";
import PlaybacksAction from "./action";

/**
 * Type definition for Playbacks data structure
 */
export type Playbacks = {
    id?: number;
    thumbnails?: string | null;
    name?: string | null;
    videoPath?: string;
    description?: string
}

/**
 * Column definitions for the Playbacks table
 * Includes title, description, thumbnail, video player, and actions
 */
export const Playbackscolumns: ColumnDef<Playbacks>[] = [
    // Title Column
    {
        accessorKey: "name",
        header: "Title",
        cell: ({ row }) => (row.original.name || "N/A"),
    },
    // Description Column with truncation
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="truncate max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden"
                 title={row.original.description}>
                {row.original.description || "N/A"}
            </div>
        ),
    },
    // Thumbnail Column
    {
        accessorKey: "thumbnails",
        header: "Thumbnail",
        cell: ({ row }) => (
            <img
                src={row.original.thumbnails!}
                alt="Thumbnail"
                width={120}
                height={80}
                className=" rounded-md border border-gray-500"
            />
        ),
    },
    // Video Column
    {
        accessorKey: "videoPath",
        header: "Video",
        cell: ({ row }) => (
            <ReactPlayer
                url={row.original.videoPath}
                controls
                width={120}
                height={80}
                className="rounded-md"
            />
        ),
    },
    // Actions Column
    {
        id: "actions",
        header: "Delete",
        cell: ({ row }) => (
            <PlaybacksAction id={row.original.id!} />
        )
    },
];

