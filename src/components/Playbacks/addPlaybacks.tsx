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
import { UploadButton } from "~/utils/uploadthing";

const schema = z.object({
    thumbnail: z.string().min(1, "Required"),
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
    const [isthumbnail, setThumbnail] = useState<boolean>(false);
    const refetch = UseRefetch()
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            thumbnail: "",
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
                thumbnails: values.thumbnail,
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
                                                    height="200px"
                                                />
                                            ) : (
                                                <VideoUploadComponent
                                                    endpoint="playbackUploader"
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
                                name="thumbnail"
                                render={() => (
                                    <FormItem>
                                                                                 
                                          {isthumbnail && (
                                                <img
                                                    src={form.watch("thumbnail")}
                                                    alt="Thumbnail Preview"
                                                    className="w-full h-40 object-cover mb-4 rounded-lg border border-gray-500"
                                                />
                                            )}

                                        <FormControl>
                                            <UploadButton
                                                endpoint="imageUploaderCompressed"
                                                onClientUploadComplete={(res) => {
                                                    if (res && res.length > 0) {
                                                        const uploadedUrl = res && res[0] ? res[0].url : "";
                                                        setThumbnail(true)
                                                        form.setValue("thumbnail", uploadedUrl);
                                                        toast.success("Thumbnail uploaded successfully!");
                                                    }
                                                }}
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

                            <Button type="submit">Add</Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

