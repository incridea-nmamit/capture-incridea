import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import UploadComponent from "../../uploadCompressed";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

/**
 * Zod schema for form validation
 */
const schema = z.object({
    event_category: z.string().nonempty("Please select a category"),
    event_name: z.string().optional(),
    author_id: z.preprocess((val) => Number(val), z.number().positive("Please select a valid author")),
    upload_type: z.string().nonempty("Please select a category"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
    isOpen: boolean;          // Controls dialog visibility
    setOpen: (open: boolean) => void;  // Dialog state setter
};

export function AddCapturePopUpModel({ isOpen, setOpen }: Props) {
    const {  refetch } = api.capture.getAllcaptures.useQuery();
    const { data: events, isLoading: eventsLoading } = api.events.getAllEvents.useQuery();
    const { data: team, isLoading: teamsLoading } = api.team.getAllTeams.useQuery();
    const [step, setStep] = useState(1);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            event_category: "events",
            event_name: "",
            author_id: 1,
            upload_type: "direct",
        },
    });

    /**
     * Handles form progression to upload step
     * Validates required fields based on category
     */
    const handleNextStep = (data: FormValues) => {
        if (data.event_category === "events" && !data.event_name?.trim()) {
            form.setError("event_name", {
                type: "manual",
                message: "Please select an event name",
            });
            return;
        }    
        if (step !== 2) {
            const adjustedData: FormValues = {
                ...data,
                event_name: data.event_name, 
    
                event_category: data.event_category, 
    
                upload_type:
                    data.upload_type === "batch" && data.event_category === "events"
                        ? data.event_name || ""
                        : data.upload_type === "batch" && data.event_category !== "events"
                        ? data.event_category 
                        : "direct", 
            };
    
            console.log("Modified Data:", adjustedData);
            form.reset(adjustedData);
            setStep(2);
        }
    };    

    /**
     * Resets form state and closes popup
     */
    const handlePopupClose = () => {
        setStep(1);
        form.reset();
        refetch();
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-950">
                <DialogHeader>
                    <DialogTitle className="font-Teknaf text-2xl">Add Capture</DialogTitle>
                </DialogHeader>

                {step === 1 ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleNextStep)}
                            className="space-y-4"
                        >
                            <FormField
                                name="event_category"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capture Category:</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="p-2 w-full border border-slate-700 rounded-md bg-black text-white"
                                            >
                                                <option value="" disabled>
                                                    Select a category
                                                </option>
                                                <option value="events">Events</option>
                                                <option value="shaan">Shaan</option>
                                                <option value="masalacoffee">Masala Coffee</option>
                                                <option value="snaps">Snaps</option>
                                                <option value="accolades">Accolades</option>
                                                <option value="faculty">Faculty</option>
                                                <option value="behindincridea">Behind Incridea</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch("event_category") === "events" && (
                                <FormField
                                    name="event_name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Name:</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="p-2 w-full border border-slate-700 rounded-md bg-black text-white"
                                                    disabled={eventsLoading}
                                                >
                                                    <option value="" disabled>
                                                        {eventsLoading
                                                            ? "Loading events..."
                                                            : "Select an event"}
                                                    </option>
                                                    {events?.map((event) => (
                                                        <option key={event.id} value={event.name}>
                                                            {event.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                name="author_id"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Author Name:</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="p-2 w-full border border-slate-700 rounded-md bg-black text-white"
                                                disabled={teamsLoading}
                                            >
                                                <option value="" disabled>
                                                    {teamsLoading
                                                        ? "Loading Team..."
                                                        : "Select an Author"}
                                                </option>
                                                {team?.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                            

                            <FormField
                                name="upload_type"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Type:</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-4">
                                                <Label className="flex items-center text-white">
                                                    <Input
                                                        type="radio"
                                                        {...field}
                                                        checked={field.value === "direct"}
                                                        onChange={() => field.onChange("direct")}
                                                        className="mr-2"
                                                    />
                                                    Direct
                                                </Label>
                                                <Label className="flex items-center text-white">
                                                    <Input
                                                        type="radio"
                                                        {...field}
                                                        checked={field.value === "batch"}
                                                        onChange={() => field.onChange("batch")}
                                                    />
                                                    Batch
                                                </Label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="p-2 bg-white text-black rounded-md w-full mt-10"
                            >
                                Submit and Upload
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <UploadComponent
                        name={form.getValues("event_name")!}
                        category={form.getValues("event_category")}
                        authorid={form.getValues("author_id")}
                        type={form.getValues("upload_type")}
                        handleClosePopup={handlePopupClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
