"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { api } from "~/utils/api"
import { useSession } from "next-auth/react"

import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import UploadComponent from "../UploadComponent"
import toast from "react-hot-toast"
import { Teamgroup } from "@prisma/client"
import Image from "next/image"


const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    committee: z.nativeEnum(Teamgroup),
    designation: z.string().min(1, "Designation is required"),
    say: z.string().min(1, "Say is required"),
    uploadKey: z.string().min(1, "Please upload an image") // Added uploadKey validation
})

type FormData = z.infer<typeof formSchema>

type Props = {
    isPopupOpen: boolean
    setIsPopupOpen: (open: boolean) => void
}

const AddTeamPopUpModel = ({ isPopupOpen, setIsPopupOpen }: Props) => {
    const { data: session } = useSession()
    const [uploadUrl, setUploadUrl] = useState<string>("")
    const { refetch } = api.team.getAllTeams.useQuery()
    const addTeam = api.team.addTeam.useMutation()
    const auditLogMutation = api.audit.log.useMutation()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            committee: "none",
            designation: "",
            say: "",
            uploadKey: uploadUrl
        },
    })

    const handleUploadComplete = (url: string) => {
        setUploadUrl(url)
        setValue("uploadKey", url)
        console.log("your url", url)
    }

    const onSubmit = async (data: FormData) => {
        if (!uploadUrl) {
            toast.error("Please upload an image")
            return
        }
        setIsSubmitting(true)
        try {
            await addTeam.mutateAsync({ ...data }, {
                onSuccess: () => {
                    void refetch()
                    reset()
                    setUploadUrl("")
                    setIsPopupOpen(false)
                },
            })

            await auditLogMutation.mutateAsync({
                sessionUser: session?.user.name || "Unknown User",
                description: `Added team member ${data.name} for ${data.committee} as ${data.designation} with say ${data.say}`,
                audit:'TeamManagementAudit'
            })

            toast.success(`Added team member ${data.name}`)
        } catch (error) {
            toast.error("Error adding team member")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <DialogContent className="bg-black p-10 rounded-3xl shadow-lg text-center w-96">
                <DialogHeader>
                    <DialogTitle className="text-white">Add Team Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                   
                    <div>
                        <Label className="text-white">Name</Label>
                        <Input
                            {...register("name")}
                            className="bg-black text-white"
                            placeholder="Enter team member name"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                   
                    <div>
                        <Label className="text-white">Say</Label>
                        <Textarea
                            {...register("say")}
                            className="bg-black text-white"
                            placeholder="Enter a quote or saying"
                        />
                        {errors.say && <p className="text-red-500 text-sm">{errors.say.message}</p>}
                    </div>

               
                    <div>
                        <label htmlFor="committee" className="text-white">Committee</label>
                        <select {...register("committee")} className="w-full p-2  bg-black border border-neutral-700">
                            <option value="" disabled>Select a committee</option>
                            <option value="media">Media</option>
                            <option value="socialmedia">Social Media</option>
                            <option value="developer">Developer</option>
                        </select>
                        {errors.committee && <p className="text-red-500 text-sm">{errors.committee.message}</p>}
                    </div>



                    <div>
                        <Label className="text-white">Designation</Label>
                        <Input
                            {...register("designation")}
                            className="bg-black text-white"
                            placeholder="Enter designation"
                        />
                        {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
                    </div>
                    <div>
                        {uploadUrl ? (
                            <>
                                <Label className="text-white">Uploaded Image</Label>

                                <Image
                                    src={`https://utfs.io/f/${uploadUrl}`}
                                    alt="Uploaded Image"
                                    width={150}
                                    height={150}
                                    className="object-cover"
                                />
                            </>
                        ) : (
                            <>
                                <Label className="text-white">Upload Image</Label>
                                <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl("")} />
                            </>
                        )}
                    </div>          
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black text-xl rounded-xl font-Trap-Regular font-bold"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddTeamPopUpModel
