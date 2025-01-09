"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import UseRefetch from "~/hooks/use-refetch";

type Props={
    id:number;
    closeDialog: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    shortDescription: z
        .string()
        .min(1, "Short description is required")
        .max(200, "Short description must be less than 200 characters"),
    type: z.enum(["core", "technical", "nontechnical", "special"]),
    day: z.enum(["day1", "day2", "day3"]),
});

export default function EditForm({ id,closeDialog}:Props) {
    if (!id) {
        return <div className="items-center justify-center mx-auto">Loading</div>;
    }
    const refetch=UseRefetch()
    const { data: event, isLoading } = api.events.getEventById.useQuery({ id });
    const editEvent = api.events.editEvent.useMutation();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            shortDescription: "",
            type: undefined,
            day: undefined,
        },
    });

    const { reset } = form;

    
    useEffect(() => {
        if (event) {
            reset({
                name: event.name || "",
                shortDescription: event.shortDescription || "",
                type: event.type || undefined,
                day: event.day || undefined,
            });
        }
    }, [event, reset]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form Values: ", values);
        editEvent.mutate(
            {
                id,
                ...values,
            },
            {
                onSuccess: () => {
                    toast.success("Event updated successfully");
                    refetch()   
                    closeDialog()
                },
                onError: (error) => {
                    console.error("Error updating the event:", error);
                 
                },
            }
        );
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 py-10"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter event name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter a brief description"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="core">Core</SelectItem>
                                    <SelectItem value="technical">Technical</SelectItem>
                                    <SelectItem value="nontechnical">
                                        Non-Technical
                                    </SelectItem>
                                    <SelectItem value="special">Special</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Day</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select event day" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="day1">Day 1</SelectItem>
                                    <SelectItem value="day2">Day 2</SelectItem>
                                    <SelectItem value="day3">Day 3</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Edit</Button>
            </form>
        </Form>
    );
}
