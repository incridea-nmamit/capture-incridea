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
import VideoUploadComponent from "~/components/VideoUploadComponent";
import UseRefetch from "~/hooks/use-refetch";
import { UploadButton } from "~/utils/uploadthing";

const schema = z.object({
    name: z.string().min(1, "Required"),
    uplodeurl: z.string().min(1, "Required"),
    thumbnails: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    id: number;
};

export function EditPlayBacksPopUpModel({ isOpen, setOpen, id }: Props) {
    const { data: defaultValue, isLoading, error } = api.playbacks.getPlaybacksDetailsById.useQuery({ id });
    const editPlayBacks = api.playbacks.editPlaybacks.useMutation();
    const [uploadUrl, setUploadUrl] = useState<string>(defaultValue?.videoPath || "");
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultValue?.thumbnails || "");
    const [edited, setEdited] = useState(false)
    const refetch = UseRefetch();

    const uploadKey = defaultValue?.videoPath.split("/f/")[1];

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            uplodeurl: uploadKey,
            name: defaultValue?.name || "",
            description: defaultValue?.description || "",
            thumbnails: defaultValue?.thumbnails || "",
        },
    });

    function handleUploadComplete(url: string) {
        setUploadUrl(url);
        form.setValue("uplodeurl", url);
        toast.success("Upload successful!");
        setEdited(true)
    }

    function onSubmit(values: FormValues) {
        try {
            if (!uploadUrl) {
                toast.error("Please upload a video first.");
                return;
            }

            editPlayBacks.mutate({
                id: id,
                uploadKey: uploadUrl,
                name: values.name,
                description: values.description,
                thumbnails:values.thumbnails,
            });

            setOpen(false);
            refetch();
            toast.success("Playback updated successfully!");
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    function handleThumbnailUploadComplete(res: { url: string }[]) {
        if (res && res.length > 0) {
            const uploadedUrl = res[0]?.url || "";
            setThumbnailUrl(uploadedUrl);
            form.setValue("thumbnails", uploadedUrl);
            toast.success("Thumbnail uploaded successfully!");
        }
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading playback details.</div>;

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-950">
                <DialogHeader>
                    <DialogTitle className="font-Teknaf text-2xl">Edit PlayBacks</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="flex flex-row space-x-4 items-center justify-center">
                        {defaultValue?.videoPath && (
                            <ReactPlayer
                                url={`https://utfs.io/f/${uploadUrl || uploadKey}`}
                                controls
                                width={350}
                                height={180}
                            />
                        )}
                        {thumbnailUrl && (
                            <img
                                src={thumbnailUrl}
                                alt="Thumbnail"
                                className="w-32 h-44 object-cover rounded-md border border-gray-500"
                            />
                        )}
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 max-w-3xl mx-auto py-10"
                        >
                            <FormField
                                control={form.control}
                                name="uplodeurl"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <VideoUploadComponent
                                                endpoint='playbackUploader'
                                                onUploadComplete={handleUploadComplete}
                                                resetUpload={() => setUploadUrl("")}
                                            />

                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="thumbnails"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <UploadButton
                                                endpoint='imageUploader'
                                                onClientUploadComplete={handleThumbnailUploadComplete}
                                                onUploadError={() => {
                                                    toast.error("Failed to upload thumbnail. Please try again.");
                                                }}
                                            />
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

                            <Button type="submit">Save Changes</Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
