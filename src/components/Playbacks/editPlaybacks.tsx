import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
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

/**
 * Form validation schema for playback editing
 */
const schema = z.object({
    name: z.string().min(1, "Required"),
    uplodeurl: z.string().min(1, "Required"),
    thumbnails: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

/**
 * Props interface for EditPlayBacksPopUpModel
 */
type Props = {
    isOpen: boolean;           // Controls dialog visibility
    setOpen: (open: boolean) => void;  // Dialog state setter
    id: number;               // ID of playback to edit
};

/**
 * EditPlayBacksPopUpModel Component
 * Modal dialog for editing existing playback entries
 * Handles video upload, thumbnail management, and metadata updates
 */
export function EditPlayBacksPopUpModel({ isOpen, setOpen, id }: Props) {
    // State and API hooks
    const { data: defaultValue, isLoading, error } = api.playbacks.getPlaybacksDetailsById.useQuery({ id });
    const editPlayBacks = api.playbacks.editPlaybacks.useMutation();
    const [uploadUrl, setUploadUrl] = useState<string>(defaultValue?.videoPath || "");
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(defaultValue?.thumbnails || "");
    const [edited, setEdited] = useState(false);
    const refetch = UseRefetch();

    // Extract upload key from video path
    const uploadKey = defaultValue?.videoPath.split("/f/")[1];

    // Form initialization with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            uplodeurl: uploadKey,
            name: defaultValue?.name || "",
            description: defaultValue?.description || "",
            thumbnails: defaultValue?.thumbnails || "",
        },
    });

    /**
     * Handlers for file uploads and form submission
     */
    function handleUploadComplete(url: string) {
        setUploadUrl(url);
        form.setValue("uplodeurl", url);
        toast.success("Upload successful!");
        setEdited(true)
    }

    function handleThumbnailUploadComplete(res: { url: string }[]) {
        if (res && res.length > 0) {
            const uploadedUrl = res[0]?.url || "";
            setThumbnailUrl(uploadedUrl);
            form.setValue("thumbnails", uploadedUrl);
            toast.success("Thumbnail uploaded successfully!");
        }
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading playback details.</div>;

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-950">
                {/* Dialog Header */}
                <DialogHeader>
                    <DialogTitle className="font-Teknaf text-2xl">Edit PlayBacks</DialogTitle>
                </DialogHeader>

                {/* Form Content */}
                <div>
                    {/* Preview Section */}
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

                    {/* Edit Form */}
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
