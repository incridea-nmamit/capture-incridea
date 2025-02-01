import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

// Define types for your logs
export type DownlodeLog = {
  id: number;
  session_user: string;
  date_time: Date;
  image_id: number;
};

export type PlayBacksLog = {
  id: number;
  session_user: string;
  date_time: Date;
  playback_id: number;
};

export type StoryLog = {
  id: number;
  session_user: string;
  date_time: Date;
  story_id: number;
};

// Column definitions
export const StoryLogColumns: ColumnDef<StoryLog>[] = [
  {
    accessorKey: "session_user",
    header: "User Name",
    cell: ({ row }) => <span className="text-sm">{row.original.session_user}</span>,
  },
  {
    accessorKey: "date_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc" ? false : true)}
      >
        Date Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formattedDate = new Date(row.original.date_time).toLocaleString();
      return <span className="text-sm">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "story_id",
    header: "StoryID",
    cell: ({ row }) => <span className="text-sm">{row.original.story_id}</span>,
  },
];

export const PlayBacksLogColumns: ColumnDef<PlayBacksLog>[] = [
  {
    accessorKey: "session_user",
    header: "User Name",
    cell: ({ row }) => <span className="text-sm">{row.original.session_user}</span>,
  },
  {
    accessorKey: "date_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc" ? false : true)}
      >
        Date Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formattedDate = new Date(row.original.date_time).toLocaleString();
      return <span className="text-sm">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "playback_id",
    header: "PlayBack ID",
    cell: ({ row }) => <span className="text-sm">{row.original.playback_id}</span>,
  },
];

export const downlodeLogColumns: ColumnDef<DownlodeLog>[] = [
  {
    accessorKey: "session_user",
    header: "User Name",
    cell: ({ row }) => <span className="text-sm">{row.original.session_user}</span>,
  },
  {
    accessorKey: "date_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc" ? false : true)}
      >
        Date Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formattedDate = new Date(row.original.date_time).toLocaleString();
      return <span className="text-sm">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "image_id",
    header: "Image ID",
    cell: ({ row }) => <span className="text-sm">{row.original.image_id}</span>,
  },
];
