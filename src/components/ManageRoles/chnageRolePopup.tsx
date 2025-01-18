"use client"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"

import {
    toast
} from "react-hot-toast"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "~/components/ui/select"
import { Role } from "@prisma/client"
import { api } from "~/utils/api"
import { useSession } from "next-auth/react"
import UseRefetch from "~/hooks/use-refetch"
import { useState } from "react"

type Props = {
    isOpen: boolean
    onClose: () => void
    userId: string
}

const formSchema = z.object({
    role: z.nativeEnum(Role)
});

export function ChangeRolePopUP({
    isOpen,
    onClose,
    userId
}: Props
) {
    const { data: existingRole } = api.user.getUserRoleById.useQuery({ userId: userId })
    const refetch = UseRefetch()
    const auditLogMutation = api.audit.log.useMutation();
    const changeRole = api.user.changeUserRole.useMutation()
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: existingRole,
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            changeRole.mutate({ userId, role: values.role }, {
                onSuccess: () => {
                    toast.success("Role changed successfully")
                    auditLogMutation.mutateAsync({
                        sessionUser: session?.user.name || 'Invalid User',
                        description: `RoleManagementAudit - Changed the role of ${existingRole} to ${values.role}`,
                    }, {
                        onSuccess: () => {
                            toast.success("Audit logged")
                        }
                    });
                    refetch()
                    setLoading(false)
                    onClose()
                },
            }
            )
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change UserRole</DialogTitle>
                    <DialogDescription>
                        Select the new role for the user
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={existingRole} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin">admin</SelectItem>
                                            <SelectItem value="manager">manager</SelectItem>
                                            <SelectItem value="editor">editor</SelectItem>
                                            <SelectItem value="user">user</SelectItem>
                                            <SelectItem value="smc">smc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>You can manage Users Role here</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row items-center justify-between  ">
                            <Button type="submit" disabled={loading} variant="outline">                        
                            {loading ? (
                            <svg
                                className="w-5 h-5 text-white animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        ) : (
                            "Change"
                        )}</Button>
                            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
