/**
 * Team Table Columns Configuration
 * Defines the structure and rendering of team data table columns
 * @module TeamColumns
 */

"use client"

import { Teamgroup } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import TeamAction from "./actions";
import { Github, Linkedin, Instagram } from "lucide-react";
import { FaBehance } from "react-icons/fa";

/**
 * Team member data interface
 */
type TeamProps = {
    id?: number;
    name?: string;
    committee?: Teamgroup;
    designation?: string;
    image?: string;
    github?    :  string;
    linkedin?  :  string;
    instagram?  : string;
    behance?   :  string;
    say?: string;
}

/**
 * Column definitions for team data table
 * Includes sorting, filtering, and custom cell rendering
 */
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
    // Social links column with custom rendering
    {
        accessorKey: "socialLinks",
        header: "Social Links",
        cell: ({ row }) => {
            const { github, linkedin, instagram ,behance } = row.original as TeamProps;
    
            return (
                <div className="flex space-x-2">
                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-5 h-5 text-gray-600 " />
                        </a>
                    )}
                    {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-5 h-5 text-blue-600 " />
                        </a>
                    )}
                    {instagram && (
                        <a href={instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="w-5 h-5 text-pink-600 " />
                        </a>
                    )}
                
                    {behance&& (
                        <a href={behance} target="_blank" rel="noopener noreferrer">
                            <FaBehance  className="w-6 h-5 text-blue-500 " />
                        </a>
                    )}
                </div>
            );
        },
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

