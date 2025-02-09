/**
 * Add Team Member Modal
 * Form component for adding new team members with image upload
 */
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
import { Github, Linkedin, Instagram } from 'lucide-react';
import Image from "next/image"
import UploadComponent from "../UploadComponent"
import toast from "react-hot-toast"
import { Teamgroup } from "@prisma/client"
import { Textarea } from "../ui/textarea"
import { FaBehance } from "react-icons/fa"

// Form validation schema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    committee: z.nativeEnum(Teamgroup),
    designation: z.string().min(1, "Designation is required"),
    say: z.string().min(1, "Say is required"),
    uploadKey: z.string().min(1, "Please upload an image"),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    behance: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface AddTeamProps {
    isPopupOpen: boolean;
    setIsPopupOpen: (open: boolean) => void;
}

const AddTeamPopUpModel = ({ isPopupOpen, setIsPopupOpen }: AddTeamProps) => {
    // State and API hooks
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
            uploadKey: uploadUrl,
            github: "",
            linkedin: "",
            instagram: "",
            behance: "",
        },
    })

    /**
     * Handle image upload completion
     * @param url - Uploaded image URL
     */
    const handleUploadComplete = (url: string) => {
        setUploadUrl(url)
        setValue("uploadKey", url)
        console.log("your url", url)
    }

    /**
     * Form submission handler
     * Processes form data and creates new team member
     */
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
                audit: 'TeamManagementAudit'
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
            <DialogContent className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-lg text-center w-[95%] md:w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white text-lg md:text-xl">Add Team Member</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex md:flex-row flex-col justify-between gap-4 md:gap-6 mt-4 md:mt-6">

                    <div className="md:w-1/2 w-full space-y-4 text-left">
                        <div>
                            <Input
                                {...register("name")}
                                className="bg-black text-white"
                                placeholder="Enter team member name"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Textarea
                                {...register("say")}
                                className="bg-black text-white"
                                placeholder="Enter a quote or saying"
                            />
                            {errors.say && <p className="text-red-500 text-sm">{errors.say.message}</p>}
                        </div>

                        <div>
                            <Input
                                {...register("designation")}
                                className="bg-black text-white"
                                placeholder="Enter designation"
                            />
                            {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
                        </div>

                        <div>
                            <select {...register("committee")} className="w-full p-2 bg-black">
                                <option value="media">Media</option>
                                <option value="socialmedia">Social Media</option>
                                <option value="developer">Developer</option>
                            </select>
                            {errors.committee && <p className="text-red-500 text-sm">{errors.committee.message}</p>}
                        </div>
                        <div className="relative">
                            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                            <Input
                                {...register("github")}
                                className="bg-black text-white pl-10"
                                placeholder="Enter GitHub URL"
                            />
                            {errors.github && <p className="text-red-500 text-sm">{errors.github.message}</p>}
                        </div>

                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                            <Input
                                {...register("linkedin")}
                                className="bg-black text-white pl-10"
                                placeholder="Enter LinkedIn URL"
                            />
                            {errors.linkedin && <p className="text-red-500 text-sm">{errors.linkedin.message}</p>}
                        </div>

                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                            <Input
                                {...register("instagram")}
                                className="bg-black text-white pl-10"
                                placeholder="Enter Instagram URL"
                            />
                            {errors.instagram && <p className="text-red-500 text-sm">{errors.instagram.message}</p>}
                        </div>

                        <div className="relative">
                            <FaBehance className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                            <Input
                                {...register("behance")}
                                className="bg-black text-white pl-10"
                                placeholder="Enter Behance URL"
                            />
                            {errors.behance && <p className="text-red-500 text-sm">{errors.behance.message}</p>}
                        </div>
                    </div>

                    <div className="md:w-1/2 w-full flex flex-col items-center justify-center space-y-4">
                        {uploadUrl ? (
                            <>
                                <Label className="text-white">Uploaded Image</Label>
                                <Image
                                    src={`https://utfs.io/f/${uploadUrl}`}
                                    alt="Uploaded Image"
                                    width={300}
                                    height={150}
                                    className="object-cover rounded-xl"
                                />
                                <Button variant="outline" onClick={() => setUploadUrl("")} className="mt-2 text-white">
                                    Remove Image
                                </Button>
                            </>
                        ) : (
                            <>
                                <Label className="text-white">Upload Image</Label>
                                <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl("")} />
                            </>
                        )}
                    </div>

                </form>

                <DialogFooter className="mt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-black text-xl rounded-xl font-Trap-Regular font-bold"
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddTeamPopUpModel

