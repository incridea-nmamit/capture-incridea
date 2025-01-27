"use client"

import { ColumnDef } from "@tanstack/react-table"
import ReactPlayer from "react-player";
import PlaybacksAction from "./action";




export type Playbacks = {
    id?: number;
    name?: string | null;
    videoPath?: string;
    description?: string
}
export const Playbackscolumns: ColumnDef<Playbacks>[] = [
    {
        accessorKey: "name",
        header: "Title",
        cell: ({ row }) => (
            row.original.name || "mkc"
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div
                className="truncate max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden"
                title={row.original.description} 
            >
                {row.original.description || "mkc"}
            </div>
        ),
    },

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
    {
        id: "actions",
        header: "Delete",
        cell: ({ row }) => (
            <PlaybacksAction id={row.original.id!} />
        )
    },
];

