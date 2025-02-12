// "use client"
// import styled from 'styled-components';
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import UploadComponent from '../UploadComponent';

// import { Button } from "~/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/components/ui/form"
// import { Input } from "~/components/ui/input"
// import { Textarea } from '../ui/textarea';

// // Form validation schema for event creation/editing
// const formSchema = z.object({
//   name: z.string().min(1, { message: "Name is required." }),
//   description: z.string().min(1, { message: "Description is required." }),
//   shortDescription: z.string().min(1, { message: "Short Description is required." }),
//   type: z.enum(["core", "technical", "nontechnical", "special"], { message: "Type is required." }),
//   day: z.enum(["day1", "day2", "day3"], { message: "Day is required." }),
//   uploadUrl: z.string().min(1, { message: "Upload URL is required." }),
// });


// import React, { useState } from 'react';
// import { FaSearch, FaTrash } from 'react-icons/fa';
// import { api } from '~/utils/api';

// import toast from 'react-hot-toast';
// import CameraLoading from '../LoadingAnimation/CameraLoading';
// import { useSession } from 'next-auth/react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "~/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select"
// import { ScrollArea } from "../ui/scroll-area"
// import { eventDays, eventTypes } from '~/utils/constants';
// import ScrollableContainer from '../ScrollableDiv';
// import SearchInput from '../ui/search-input';
// import Image from 'next/image';
// import EditForm from './edit-form';

// const EventsAdmin: React.FC = () => {
//   // API mutations and queries
//   const addEvent = api.events.addEvent.useMutation();
//   const updateVisibility = api.events.updateEventVisibility.useMutation();
//   const { data: events, isLoading, isError, refetch } = api.events.getAllEvents.useQuery();
//   const deleteEvent = api.events.deleteEvent.useMutation();
//   const auditLogMutation = api.audit.log.useMutation();
//   const { data: session } = useSession();

//   // State management
//   const [uploading, setUploading] = useState(false);
//   const [uploadUrl, setUploadUrl] = useState<string>('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
// const [selectedEventType, setSelectedEventType] = useState('all');
// const [selectedDay, setSelectedDay] = useState('all');
//   const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
//   const [eventToDelete, setEventToDelete] = useState<{ id: number; name: string } | null>(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedEventId, setSelectedEventId] = useState<number>();

//   // Form initialization with validation schema
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       shortDescription: "",
//       type: "core",
//       day: "day1",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true);

//     try {
//       const result = await addEvent.mutateAsync({ ...values, uploadKey: values.uploadUrl , visibility: false });
//       setUploadUrl('');
//       await auditLogMutation.mutateAsync({
//         sessionUser: session?.user.name || "Invalid User", 
//         description: `Added a new event ${values.name} having uploadKey ${uploadUrl}`,
//         audit:'EventManagementAudit'
//       });
//       toast.success(`Added a new event ${values.name} having uploadKey ${uploadUrl}`);
//       void refetch(); // Refetch events after adding
//     } catch (error) {
//       toast.error(`Error adding event ${values.name}`);
//     } finally {
//       setIsSubmitting(false);
//       form.reset();
//     }
//   }

//   const handleUploadComplete = (url: string) => {
//     setUploading(false);
//     setUploadUrl(url);
//   };

//   const handleDeleteClick = (eventId: number, eventName: string) => {
//     setIsDeletePopupOpen(true);
//     setEventToDelete({ id: eventId, name: eventName });
//   };

//   const confirmDelete = async () => {
//     if (eventToDelete) {
//       try {
//         await deleteEvent.mutateAsync({ id: eventToDelete.id });
//         toast.success(`${eventToDelete.name} deleted successfully.`);
//         void refetch();
//         await auditLogMutation.mutateAsync({
//           sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
//           description: `Deleted a event ${eventToDelete.name} having eventId ${eventToDelete.id}`,
//           audit:'EventManagementAudit'
//         });
//         toast.success(`Deleted a event ${eventToDelete.name} having eventId ${eventToDelete.id}`);
//       } catch (error) {
//         toast.error('Error deleting event');
//       } finally {
//         setIsDeletePopupOpen(false);
//         setEventToDelete(null);
//       }
//     }
//   };

//   const cancelDelete = () => {
//     toast.error('Event not deleted.');
//     setIsDeletePopupOpen(false);
//     setEventToDelete(null);
//   };
// const filteredEvents = events?.filter(event => {
//   const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
//   const matchesEventType = selectedEventType === 'all' || event.type === selectedEventType;
//   const matchesDay = selectedDay === 'all' || event.day === selectedDay;

//   return matchesSearchTerm && matchesEventType && matchesDay;
// });

//   return (
//     <div className="p-4">
//       <h1 className='flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center'>Event Data and Management</h1>
//       <div className='dashboard-grid'>
//         <SearchInput
//           type="text"
//           placeholder="Search..."
//           className="dashboard-search"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className='dashboard-controls flex gap-2 w-full justify-start items-center'>
// <Select onValueChange={(value) => setSelectedDay(value)} value={selectedDay} >
//   <SelectTrigger className='select'>
//     <SelectValue placeholder="Select day" />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectGroup>
//       <SelectItem value="all" defaultChecked>All Days</SelectItem>
//       {Object.entries(eventDays).map(([key, val]) => <SelectItem value={key} key={key}>{val}</SelectItem>)}
//     </SelectGroup>
//   </SelectContent>
// </Select>

// <Select onValueChange={(value) => setSelectedEventType(value)} value={selectedEventType} >
//   <SelectTrigger className='select'>
//     <SelectValue placeholder="Select Event" />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectGroup>
//       <SelectItem value="all" defaultChecked>All Category</SelectItem>
//       {Object.entries(eventTypes).map(([key, val]) => <SelectItem value={key} key={key}>{val}</SelectItem>)}
//     </SelectGroup>
//   </SelectContent>
// </Select>


//           <Dialog>
//             <DialogTrigger>
//               <Button
//                 className='w-full'
//               >
//                 Add Event
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogTitle><h2 className="text-2xl font-bold text-white" >Add Event</h2></DialogTitle>
//               <ScrollArea className="h-[60vh]">
//                 <DialogDescription>

//                   <Form {...form}>


//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
//                       <FormField
//                         control={form.control}
//                         name="name"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Name</FormLabel>
//                             <FormControl>
//                               <Input {...field} className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="uploadUrl"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Name</FormLabel>
//                             <FormControl>
//                               <Input {...field} className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white" value={uploadUrl} hidden />

//                             </FormControl>
//                             <UploadComponent
//                               onUploadComplete={handleUploadComplete}
//                               resetUpload={() => setUploadUrl('')}
//                               onUploadBegin={() => setUploading(true)}
//                             />
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="description"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Description</FormLabel>
//                             <FormControl>
//                               <Textarea {...field} className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="shortDescription"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Short Description</FormLabel>
//                             <FormControl>
//                               <textarea {...field} className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="type"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Type</FormLabel>

//                             <Select  {...field}
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                               value={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select day" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 <SelectGroup>
//                                   {Object.entries(eventTypes).map(([key, val]) => {
//                                     return <SelectItem value={key} key={key} className="cursor-pointer hover:bg-accent">{val}</SelectItem>
//                                   })}
//                                 </SelectGroup>
//                               </SelectContent>
//                             </Select>

//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="day"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Day</FormLabel>
//                             <FormControl>
//                               <Select  {...field}>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select day" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectGroup>
//                                     {Object.entries(eventDays).map(([key, val]) => {
//                                       return <SelectItem value={key} key={key} className="cursor-pointer hover:bg-accent">{val}</SelectItem>
//                                     })}
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <Button type="submit" className="mt-4 p-2 bg-white text-black rounded-xl w-full" disabled={isSubmitting || uploading}>
//                         {isSubmitting ? 'Submitting...' : 'Submit'}
//                       </Button>
//                     </form>

//                   </Form>

//                 </DialogDescription>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Events Table */}
//         {isLoading ? (
//           <CameraLoading />
//         ) : isError ? (
//           <div className=''>Error loading events. Please try again later.</div>
//         ) : (
//           <ScrollableContainer className='dashboard-table'>
//             <table className="min-w-full bg-neutral-950 border border-slate-700 font-Trap-Regular text-sm rounded-2xl">
//               <thead className='sticky top-0  z-10'>
//                 <tr className='text-black bg-gray-100 font-Trap-Regular'>
//                   <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Name</th>
//                   <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Description</th>
//                   <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Category</th>
//                   <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Day</th>
//                   <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Background</th>
//                   <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Delete</th>
//                   <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Visibility</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredEvents?.map((event) => (
//                   <tr
//                     onClick={() => {
//                       setSelectedEventId(event.id);
//                       setIsEditDialogOpen(true);
//                     }}
//                     key={event.id} className='hover:bg-gray-800/90'>
//                     <td className=" py-2 px-4 border-b border-slate-700 text-center  text-xs">{event.name}</td>
//                     <td className=" py-2 px-4 border-b border-slate-700 text-center  text-xs max-w-12 lg:whitespace-normal truncate">
//                       {event.description}
//                     </td>
//                     <td className=" py-2 px-4 border-b border-slate-700 text-center text-xs">{eventTypes[event.type]}
//                     </td>
//                     <td className=" py-2 px-4 border-b border-slate-700 text-center text-xs">
//                       {eventDays[event.day]}
//                     </td>
//                     <td className="py-2 px-4 border-b border-slate-700 text-center w-16">
//                       <Image src={event.image} alt="Team Member" width={16} height={16} className="w-16 h-16 object-cover" />

//                     </td>
//                     <td className="py-2 px-4 border-b border-slate-700 text-center">
//                       <button onClick={() => handleDeleteClick(event.id, event.name)}>
//                         <FaTrash className="text-red-600 hover:text-red-800" />
//                       </button>
//                     </td>
//                     <td
//                       className="py-2 px-4 border-b border-slate-700 text-center cursor-pointer"
//                     >
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={event.visibility === true}
//                           onChange={async () => {
//                             const newValue = event.visibility === true ? false : true;
//                             const id = event.id;
//                             const name = event.name;
//                             await updateVisibility.mutateAsync({ id });
//                             await auditLogMutation.mutateAsync({
//                               sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
//                               description: `${name} visibility set to ${newValue}`,
//                               audit:'EventManagementAudit'
//                             });
//                             toast.success(`${name} visibility set to ${newValue}`);
//                             refetch();
//                           }}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-red-500 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 transition"></div>
//                         <div className="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
//                       </label>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </ScrollableContainer>
//         )}
//       </div>

//       <div className='dashboard-blank'></div>

//       <Dialog open={isDeletePopupOpen} onOpenChange={setIsDeletePopupOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle><h2 className="text-lg mb-4">Delete Confirmation</h2></DialogTitle>
//             <DialogDescription>
//               <div className="bg-black p-6 rounded-md">
//                 <p>Are you sure you want to delete {eventToDelete?.name}?</p>
//                 <div className="flex justify-end mt-4 space-x-4">
//                   <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
//                   <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
//                 </div>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//       {isEditDialogOpen && (
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Edit Event</DialogTitle>
//               <DialogDescription>
//                 Modify the details for the selected event.
//               </DialogDescription>
//             </DialogHeader>
//             <EditForm id={selectedEventId!} closeDialog={() => setIsEditDialogOpen(false)}/>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default EventsAdmin;

import React, { useState } from 'react'
import Loading from '~/pages/Loading'
import { api } from '~/utils/api'

import { DataTable } from './data-table'
import { eventColumns } from './coloums'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem  } from '../ui/select'
import { Day ,EventType } from '@prisma/client'

/**
 * AdminPlayBacks Component
 * Main component for managing playback videos in admin panel
 * Displays a table of all playbacks with management options
 */
const EmailVerifications = () => {
  // Fetch playbacks data
  const { data: events = [], isLoading, } = api.events.getAllEvents.useQuery();
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  if (isLoading) return <Loading />;
  const filteredEvents = events?.filter(event => {
    const matchesEventType = selectedEventType === 'all' || event.type === selectedEventType;
    const matchesDay = selectedDay === 'all' || event.day === selectedDay;

    return matchesEventType && matchesDay;
  });
  return (
    <div className="p-4">
      <h1 className="flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center">
        Event Management
      </h1>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">

       {/* Filters - Right side on large screens, top on small screens */}
       <div className="col-span-12 lg:col-span-2 flex md:flex-col gap-4 order-1 lg:order-2">
         
         {/* Select Day */}
         <Select onValueChange={(value) => setSelectedDay(value)} value={selectedDay}>
           <SelectTrigger className="select">
             <SelectValue placeholder="Select Day" />
           </SelectTrigger>
           <SelectContent>
             <SelectGroup>
               <SelectItem value="all" defaultChecked>All Days</SelectItem>
               {Object.entries(Day).map(([key, val]) => (
                 <SelectItem value={key} key={key}>{val}</SelectItem>
               ))}
             </SelectGroup>
           </SelectContent>
         </Select>
 
         {/* Select Event Type */}
         <Select onValueChange={(value) => setSelectedEventType(value)} value={selectedEventType}>
           <SelectTrigger className="select">
             <SelectValue placeholder="Select Event" />
           </SelectTrigger>
           <SelectContent>
             <SelectGroup>
               <SelectItem value="all" defaultChecked>All Categories</SelectItem>
               {Object.entries(EventType).map(([key, val]) => (
                 <SelectItem value={key} key={key}>{val}</SelectItem>
               ))}
             </SelectGroup>
           </SelectContent>
         </Select>
 
       </div>
 
       {/* DataTable - Left side on large screens, bottom on small screens */}
       <div className="col-span-12 lg:col-span-10 order-2 lg:order-1">
         <DataTable columns={eventColumns} data={filteredEvents} />
       </div>
 
     </div>
    </div>
  )
}

export default EmailVerifications
