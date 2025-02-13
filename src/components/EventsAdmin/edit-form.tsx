"use client";

import { useEffect, useState } from "react";
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
import Image from "next/image";

import { Dialog, DialogContent } from "../ui/dialog";
import UploadComponent from "../UploadComponent";
import { ScrollArea } from "../ui/scroll-area";
import { useSession } from "next-auth/react";

// Form validation schema for editing events
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    shortDescription: z
        .string()
        .min(1, "Short description is required")
        .max(200, "Short description must be less than 200 characters"),
    type: z.enum(["core", "technical", "nontechnical", "special"]),
    day: z.enum(["day1", "day2", "day3"]),
    uploadKey: z.string().optional(),
});

// Props interface for EditForm component
type Props = {
    id: number;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function EditForm({ id, open, setOpen }: Props) {
    const [loading, setLoading] = useState(false)
    if (!id) {
        setLoading(true)
    }
    const refetch = UseRefetch();
    const { data: event, isLoading } = api.events.getEventById.useQuery({ id });
    const editEvent = api.events.editEvent.useMutation();
    const auditLogMutation = api.audit.log.useMutation();
    const {data: session} = useSession();
    const [uploadUrl, setUploadUrl] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            shortDescription: "",
            type: undefined,
            day: undefined,
            uploadKey: undefined,
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (event) {
            const uploadKey = event.image ? event.image.split("https://utfs.io/f/")[1] : "";
            reset({
                name: event.name || "",
                description: event.description || "",
                shortDescription: event.shortDescription || "",
                type: event.type || undefined,
                day: event.day || undefined,
                uploadKey: uploadKey,
            });
            setUploadUrl(uploadKey || "");
        }
    }, [event, reset]);

    function handleUploadComplete(uploadKey: string) {
        setUploadUrl(uploadKey);
        form.setValue("uploadKey", uploadKey);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        editEvent.mutate(
            {
                id,
                ...values,
            },
            {
                onSuccess: () => {
                    toast.success("Event updated successfully");
                    refetch();
                    setOpen(false)
                     auditLogMutation.mutateAsync({
                        sessionUser: session?.user.name || 'Invalid User',
                        description: `Edited a  event ${values.name} having uploadKey ${values.uploadKey}`,
                        audit: 'EventManagementAudit',
                    });

                },
                onError: (error) => {
                    console.error("Error updating the event:", error);
                    setOpen(false)
                },
            }
        );
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden">
                <p className="text-center justify-center items-center text-xl">Edit Events</p>
                {loading && <div>Loading...</div>}
                <ScrollArea className="h-[calc(85vh-4rem)] pr-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 py-4"
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
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
                                                <SelectItem value="nontechnical">Non-Technical</SelectItem>
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

                            <FormField
                                control={form.control}
                                name="uploadKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload</FormLabel>
                                        {uploadUrl && (
                                            <div className="flex justify-center items-center w-full h-full">
                                                <Image
                                                    src={`https://utfs.io/f/${uploadUrl}`}
                                                    alt="Uploaded Image"
                                                    width={100}
                                                    height={200}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <UploadComponent
                                            onUploadComplete={handleUploadComplete}
                                            resetUpload={() => setUploadUrl("")}
                                            onUploadBegin={() => setUploading(true)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="w-full" type="submit">Edit</Button>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

