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
import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useUserRole from "~/hooks/useUserRole";
import { AddCapturePopUpModel } from "./popups/add-capture-popup";


/**
 * DataTable Component
 * A reusable table component with advanced filtering and sorting capabilities.
 * Features:
 * - Global search
 * - Column visibility toggle
 * - Category and event filtering
 * - Pagination
 * - Add capture functionality for admin/editor roles
 */

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]; // Column definitions
    data: TData[];                       // Table data
}

export function DataTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    // Filter management
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const userRole = useUserRole();
    const [openAddCaptureModel, setOpenAddCaptureModel] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [selectedEventName, setSelectedEventName] = useState<string | undefined>();


    const uniqueCategories = useMemo(() => {
        return Array.from(new Set(data.map((item) => item.event_category))).filter(Boolean);
    }, [data]);

    const uniqueEventNames = useMemo(() => {
        return Array.from(new Set(data.map((item) => item.event_name))).filter(Boolean);
    }, [data]);

    const table = useReactTable({
        data,
        columns,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
        },
    });

    /**
     * Updates filters based on selected category or event
     * @param filterId - The ID of the filter to update
     * @param value - The new filter value
     */
    const updateFilters = (filterId: string, value: string | undefined) => {
        setColumnFilters((currentFilters) => {
            const filters = currentFilters.filter((filter) => filter.id !== filterId);
            if (value && value !== "All Categories" && value !== "All Events") {
                filters.push({ id: filterId, value });
            }
            return filters;
        });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        updateFilters("event_category", category !== "All Categories" ? category : undefined);

        if (category === "All Categories") {
            setSelectedEventName(undefined);
        } else {
            setSelectedEventName("All Events");
            updateFilters("event_name", undefined);
        }
    };


    const handleEventNameChange = (eventName: string) => {
        setSelectedEventName(eventName);
        updateFilters("event_name", eventName !== "All Events" ? eventName : undefined);
    };
    const handleAddCaptureClick = () => {
        setOpenAddCaptureModel(true);
    };





    return (
        <div>
            <div className="p-4 space-y-2">
                <Input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Global search"
                    className="border px-4 py-2 rounded-md w-fit md:w-full mb-2"
                />

                <div className="flex md:flex-row flex-col-reverse items-start md:items-center md:justify-between gap-4">
                    <div className=" flex flex-row items-center gap-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Filter by Category
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuCheckboxItem
                                    checked={!selectedCategory}
                                    onCheckedChange={() => handleCategoryChange("All Categories")}
                                >
                                    All Categories
                                </DropdownMenuCheckboxItem>
                                {uniqueCategories.map((category) => (
                                    <DropdownMenuCheckboxItem
                                        key={category}
                                        checked={category === selectedCategory}
                                        onCheckedChange={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {selectedCategory == "events" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Filter by Event Name</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {uniqueEventNames.map((eventName) => (
                                        <DropdownMenuCheckboxItem
                                            key={eventName}
                                            checked={eventName === selectedEventName}
                                            onCheckedChange={() => handleEventNameChange(eventName)}
                                        >
                                            {eventName}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                    </div>
                    <div className="flex flex-row items-start md:items-center md:justify-end justify-between gap-5 ">
                        <div >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Columns
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter(
                                            (column) => column.getCanHide()
                                        )
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div>
                            {(userRole === 'admin' || userRole === 'editor') && (
                                <Button
                                    onClick={handleAddCaptureClick}
                                    variant="outline"                        >
                                    Add Capture
                                </Button>
                            )}
                        </div>
                     
                    </div>



                </div>
            </div>

            <div className="rounded-md border ">
                <Table>
                    <TableHeader className="bg-white text-black">
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
                        {table.getRowModel().rows?.length ? (
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
            {
                openAddCaptureModel && (
                    <AddCapturePopUpModel isOpen={openAddCaptureModel} setOpen={setOpenAddCaptureModel} />
                )
            }
        </div>


    );
}
