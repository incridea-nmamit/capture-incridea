


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Adjust the import path according to your setup
; // Adjust the import path according to your setup
import { toast } from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import UploadComponent from '../UploadComponent';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSession } from 'next-auth/react';
import { Day, EventType } from '@prisma/client';
import { api } from '~/utils/api';
import Image from 'next/image';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().min(1, 'Short description is required'),
    type: z.nativeEnum(EventType),
    day: z.nativeEnum(Day),
    uploadUrl: z.string().optional(),
});

type AddEventProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const AddEventPopUp = ({ open, setOpen, }: AddEventProps) => {
    const { data: session } = useSession();
    const [uploadUrl, setUploadUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            shortDescription: '',
            type: EventType.core,
            day: Day.day1,
            uploadUrl: '',
        },
    });

    const addEvent = api.events.addEvent.useMutation();
    const auditLogMutation = api.audit.log.useMutation();

    const handleUploadComplete = (url: string) => {
        setUploading(false);
        setUploadUrl(url);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const result = await addEvent.mutateAsync({ ...values, uploadKey: uploadUrl, visibility: false });
            setUploadUrl('');
            await auditLogMutation.mutateAsync({
                sessionUser: session?.user.name || 'Invalid User',
                description: `Added a new event ${values.name} having uploadKey ${uploadUrl}`,
                audit: 'EventManagementAudit',
            });
            toast.success(`Added a new event ${values.name}`);
            setOpen(false); // Close the dialog after successful submission
        } catch (error) {
            toast.error(`Error adding event ${values.name}`);
        } finally {
            setIsSubmitting(false);
            form.reset();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">Add Event</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    <h2 className="text-2xl font-bold text-white">Add Event</h2>
                </DialogTitle>
                <ScrollArea className="h-[60vh]">
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="uploadUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upload</FormLabel>
                                            {uploadUrl && (
                                                <div className="flex justify-center items-center w-full h-full">
                                                    <Image
                                                        src={`https://utfs.io/f/${uploadUrl}`}
                                                        alt="Uploaded Image"
                                                        width={200}
                                                        height={200}
                                                        className="rounded-lg"
                                                    />
                                                </div>

                                            )}

                                            <UploadComponent
                                                onUploadComplete={handleUploadComplete}
                                                resetUpload={() => setUploadUrl('')}
                                                onUploadBegin={() => setUploading(true)}
                                            />
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
                                                <Textarea {...field} className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white" />
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
                                                <textarea {...field} className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white" />
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
                                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Object.entries(EventType).map(([key, val]) => (
                                                            <SelectItem value={key} key={key} className="cursor-pointer hover:bg-accent">{val}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
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
                                            <FormControl>
                                                <Select {...field}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Day" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.entries(Day).map(([key, val]) => (
                                                                <SelectItem value={key} key={key} className="cursor-pointer hover:bg-accent">{val}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="mt-4 p-2 bg-white text-black rounded-xl w-full" disabled={isSubmitting || uploading}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AddEventPopUp;
