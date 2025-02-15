import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { CollegeType } from "@prisma/client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSession } from "next-auth/react";

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().min(1, 'Phone number is required'),
    college: z.nativeEnum(CollegeType),
});

type Props = {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
};

export function AddVerificationsPopUpModel({ isOpen, setOpen }: Props) {
    // Replace with correct query hook
    const [isSubmitting, setIsSubmitting] = useState(false);
    const auditLogMutation = api.audit.log.useMutation();
    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone_number: "",
            college: CollegeType.internal,
        },
    });

    const addVerification = api.verfication.addVerfication.useMutation({
        onSuccess: () => {
            toast.success("User verified successfully!");

            setOpen(false);
        },
        onError: () => {
            toast.error("Failed to verify user. Please try again.");
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await addVerification.mutateAsync(values);
            await auditLogMutation.mutateAsync({
                sessionUser: session?.user.name || "Invalid User",
                description: `Added a verification for user ${values.name} with email ${values.email} and phone number ${values.phone_number}`,
                audit: 'VerificationAudit'
            });
            toast.success(`User ${values.name} verified successfully!`);
            form.reset();
        } catch (error) {
            toast.error("Error verifying user.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handlePopupClose = () => {
        setOpen(false);

    };

    return (
        <Dialog open={isOpen} onOpenChange={handlePopupClose}>
            <DialogContent className="sm:max-w-[500px] bg-neutral-950">
                <DialogHeader>
                    <DialogTitle className="font-Teknaf text-2xl text-white">Verify Emails</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email address" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="college"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>College</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select college type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="internal">Internal</SelectItem>
                                            <SelectItem value="external">External</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                            {isSubmitting ? "Verifying..." : "Verify User"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
