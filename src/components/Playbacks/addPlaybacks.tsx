import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import ReactPlayer from "react-player"; // Import ReactPlayer
import VideoUploadComponent from "~/components/VideoUploadComponent"; // Replace with your upload component's path
import UseRefetch from "~/hooks/use-refetch";

const schema = z.object({
    name: z.string().min(1, "Required"),
    uplodeurl: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
};

export function AddPlayBacksPopUpModel({ isOpen, setOpen }: Props) {
    const addPlayback = api.playbacks.addPlaybacks.useMutation();
    const [uploadUrl, setUploadUrl] = useState<string>("");
    const refetch = UseRefetch()
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            uplodeurl: "",
            name: "",
            description: "",
        },
    });

    function handleUploadComplete(url: string) {
        setUploadUrl(url);
        form.setValue("uplodeurl", url);
        toast.success("Upload successful!");
    }

    function onSubmit(values: FormValues) {
        try {
            if (!uploadUrl) {
                toast.error("Please upload a video first.");
                return;
            }
            addPlayback.mutate({
                uploadKey: uploadUrl,
                name: values.name,
                description: values.description,
            });
            setOpen(false)
            refetch()
            toast.success("Playback added successfully!");
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-950">
                <DialogHeader>
                    <DialogTitle className="font-Teknaf text-2xl">Add PlayBacks</DialogTitle>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 max-w-3xl mx-auto py-10"
                        >

                            <FormField
                                control={form.control}
                                name="uplodeurl"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            {uploadUrl ? (
                                                <ReactPlayer
                                                    url={`https://utfs.io/f/${uploadUrl}`}
                                                    controls
                                                    width="100%"
                                                    height="360px"
                                                />
                                            ) : (
                                                <VideoUploadComponent
                                                    onUploadComplete={handleUploadComplete}
                                                    resetUpload={() => setUploadUrl("")}
                                                />
                                            )}
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Playback Title"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Description"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Add</Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

