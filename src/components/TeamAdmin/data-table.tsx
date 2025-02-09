/**
 * DataTable Component
 * Generic table component supporting sorting, filtering, and pagination
 */
import {
    ColumnDef,
    flexRender,
    ColumnFiltersState,
    getFilteredRowModel,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    VisibilityState,
    getSortedRowModel,
} from "@tanstack/react-table";
import React, { useState, useMemo, use } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import AddTeamPopUpModel from "./add-team-popup";

// Component props interface
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

/**
 * Generic DataTable component
 * @template TData - Type of data being displayed
 * @template TValue - Type of column values
 */
export function DataTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    // Table state management
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [selectedCommittee, setSelectedCommittee] = useState<string | null>(null);
    const [open, setOpen] = useState(false)

    // Memoized committee filtering
    const committeeTypes = useMemo(() => Array.from(new Set(data.map((item) => item.committee))), [data]);

    const filteredData = useMemo(() => {
        return selectedCommittee ? data.filter((item) => item.committee === selectedCommittee) : data;
    }, [data, selectedCommittee]);

    // Table configuration and features
    const table = useReactTable({
        data: filteredData,
        columns,
        state: { sorting, columnFilters, globalFilter, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
    });

    return (
        <>
            <div>
                <div className="p-4 space-y-2">
                    <Input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Global search"
                        className="border px-4 py-2 rounded-md w-fit md:w-full mb-2"
                    />

                    <div className="flex md:flex-row flex-col-reverse items-start md:items-center md:justify-between gap-4">
                        <div className="flex flex-row items-center gap-5">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {selectedCommittee ?? "Filter by Committee"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setSelectedCommittee(null)}>
                                        All Committees
                                    </DropdownMenuItem>
                                    {committeeTypes.map((type) => (
                                        <DropdownMenuItem key={type} onClick={() => setSelectedCommittee(type)}>
                                            {type}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex flex-row items-start md:items-center md:justify-end justify-between gap-5">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Columns
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                onClick={() => setOpen(true)}
                            >
                                Add TeamMember
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border">
                    <ScrollArea className="w-screen md:w-full ">
                        <ScrollBar orientation="horizontal" />
                        <Table>
                            <TableHeader className="bg-gray-600 text-neutral-950">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                    </ScrollArea>
                </div>

                <div className="flex items-center justify-start space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                    <span className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                </div>
            </div>
            {
                open && (
                    <AddTeamPopUpModel
                        isPopupOpen={open}
                        setIsPopupOpen={setOpen} />
                )
            }
        </>
    );
}
