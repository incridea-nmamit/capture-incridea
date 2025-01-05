// import React, { useState } from 'react';
// import { FaSearch, FaTrash } from 'react-icons/fa';
// import UploadComponent from '../UploadComponent';
// import { api } from '~/utils/api';
// import type { Day, EventType } from '@prisma/client';
// import Image from 'next/image';
// import toast from 'react-hot-toast';
// import CameraLoading from '../LoadingAnimation/CameraLoading';
// import { useSession } from 'next-auth/react';

// const EventsAdmin: React.FC = () => {
//   const addEvent = api.events.addEvent.useMutation();
//   const updateVisibility = api.events.updateEventVisibility.useMutation();
//   const { data: events, isLoading, isError, refetch } = api.events.getAllEvents.useQuery();
//   const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
//   const [eventToDelete, setEventToDelete] = useState<{ id: number; name: string } | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedEventType, setSelectedEventType] = useState('all');
//   const [selectedDay, setSelectedDay] = useState('all');
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const deleteEvent = api.events.deleteEvent.useMutation();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const auditLogMutation = api.audit.log.useMutation();
//   const { data: session } = useSession();

//   const [newEvent, setNewEvent] = useState<{
//     name: string;
//     description: string;
//     shortDescription: string;
//     type: EventType;
//     day: Day;
//   }>({
//     name: '',
//     description: '',
//     shortDescription: '',
//     type: 'core',
//     day: 'day1',
//   });

//   const [uploadUrl, setUploadUrl] = useState<string>('');
//   const handleDeleteClick = (eventId: number, eventName: string) => {
//     setIsDeletePopupOpen(true);
//     setEventToDelete({ id: eventId, name: eventName });
//   };
//   const handleUploadComplete = (url: string) => {
//     setUploadUrl(url);
//   };

//   const handleAddEventClick = () => {
//     setIsPopupOpen(true);
//   };

//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setNewEvent(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const trimmedName = newEvent.name.trim();

//     if (!uploadUrl) {
//       alert('No URL to submit');
//       return;
//     }

//     if (!trimmedName || !newEvent.description || !newEvent.type || !newEvent.day) {
//       alert("Please fill in all required fields.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const result = await addEvent.mutateAsync({ ...newEvent, name: trimmedName, uploadKey: uploadUrl });
//       setIsPopupOpen(false);
//       setNewEvent({ name: '', description: '', shortDescription: '', type: 'core', day: 'day1' });
//       setUploadUrl('');
//       await auditLogMutation.mutateAsync({
//         sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
//         description: `EventManagementAudit - Added a new event ${trimmedName} having uploadKey ${uploadUrl}`,
//       });
//       toast.success(`Added a new event ${trimmedName} having uploadKey ${uploadUrl}`);
//       void refetch(); // Refetch events after adding
//     } catch (error) {
//       toast.error(`Error adding event ${trimmedName}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const confirmDelete = async () => {
//     if (eventToDelete) {
//       try {
//         await deleteEvent.mutateAsync({ id: eventToDelete.id });
//         toast.success(`${eventToDelete.name} deleted successfully.`);
//         void refetch();
//         await auditLogMutation.mutateAsync({
//           sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
//           description: `EventManagementAudit - Deleted a event ${eventToDelete.name} having eventId ${eventToDelete.id}`,
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
//   const filteredEvents = events?.filter(event => {
//     const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesEventType = selectedEventType === 'all' || event.type === selectedEventType;
//     const matchesDay = selectedDay === 'all' || event.day === selectedDay;

//     return matchesSearchTerm && matchesEventType && matchesDay;
//   });

//   return (
//     <div className="p-4">
//       <h1 className='flex justify-center text-6xl font-Hunters mb-8 py-5 text-center'>Event Data and Management</h1>
//       <div className="mb-4 flex gap-2 flex-wrap">
//         <div className="relative w-1/2">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="font-BebasNeue text-white p-2 pl-10 border border-slate-700 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-white h-12 bg-primary-950/50"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <div className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-600">
//             <FaSearch />
//           </div>
//         </div>

//         <select
//           value={selectedEventType}
//           onChange={(e) => setSelectedEventType(e.target.value)}
//           className="p-2 border-slate-700 rounded-xl bg-primary-950/50 h-12 font-BebasNeue border"
//         >
//           <option className='' value="all">All Category</option>
//           <option className='' value="core">Core</option>
//           <option className='' value="technical">Technical</option>
//           <option className='' value="nontechnical">Non Technical</option>
//           <option className='' value="special">Special</option>
//         </select>

//         <select
//           value={selectedDay}
//           onChange={(e) => setSelectedDay(e.target.value)}
//           className="p-2 border-slate-700 rounded-xl bg-primary-950/50 h-12 font-BebasNeue border"
//         >
//           <option className='' value="all">All Days</option>
//           <option className='' value="day1">Day 1</option>
//           <option className='' value="day2">Day 2</option>
//           <option className='' value="day3">Day 3</option>
//         </select>

//         <button
//           onClick={handleAddEventClick}
//           className="p-2 border-slate-700 rounded-xl w-32 text-white h-12 bg-primary-950/50 font-BebasNeue border"
//         >
//           Add Event
//         </button>
//       </div>

//       {/* Events Table */}
//       {isLoading ? (
//         <CameraLoading />
//       ) : isError ? (
//         <div className=''>Error loading events. Please try again later.</div>
//       ) : (
//         <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
//           <table className="min-w-full bg-primary-950/50 border border-slate-700">
//             <thead>
//               <tr className='text-black bg-gray-100'>
//                 <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Name</th>
//                 <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Description</th>
//                 <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Category</th>
//                 <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Day</th>
//                 <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">BG Image</th>
//                 <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Delete</th>
//                 <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Visibility</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEvents?.map((event) => (
//                 <tr key={event.id} className='hover:bg-gray-50 hover:text-black'>
//                   <td className=" py-2 px-4 border-b border-slate-700 text-center  text-xs">{event.name}</td>
//                   <td className=" py-2 px-4 w-56 border-b border-slate-700 text-center text-xs">{event.description}</td>
//                   <td className=" py-2 px-4 border-b border-slate-700 text-center text-xs">{{
//                     core: "Core",
//                     technical: "Technical",
//                     nontechnical: "Non-Technical",
//                     special: "Special",
//                   }[event.type] || event.type}
//                   </td>
//                   <td className=" py-2 px-4 border-b border-slate-700 text-center text-xs">
//                     {{
//                       day1: "Day-1",
//                       day2: "Day-2",
//                       day3: "Day-3",
//                     }[event.day] || event.day}
//                   </td>
//                   <td className="py-2 px-4 border-b border-slate-700 text-center w-16">
//                     <Image src={event.image} alt="Team Member" width={16} height={16} className="w-16 h-16 object-cover" />

//                   </td>
//                   <td className="py-2 px-4 border-b border-slate-700 text-center" onClick={() => handleDeleteClick(event.id, event.name)}>
//                     <button onClick={() => handleDeleteClick(event.id, event.name)}>
//                       <FaTrash className="text-red-600 hover:text-red-800" />
//                     </button>
//                   </td>
//                   <td
//                     className="py-2 px-4 border-b border-slate-700 text-center cursor-pointer"
//                   >
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={event.visibility === 'active'}
//                         onChange={async () => {
//                           const newValue = event.visibility === 'active' ? 'inactive' : 'active';
//                           const id = event.id;
//                           const name = event.name;
//                           await updateVisibility.mutateAsync({ id });
//                           await auditLogMutation.mutateAsync({
//                             sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
//                             description: `EventManagementAudit - ${name} visibility set to ${newValue}`,
//                           });
//                           toast.success(`${name} visibility set to ${newValue}`);
//                           refetch();
//                         }}
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-red-500 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 transition"></div>
//                       <div className="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
//                     </label>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Popup for Adding Event */}
//       {isPopupOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
//           <div className="bg-black p-10 rounded-3xl shadow-lg relative text-cen w-96">
//             <h2 className="text-2xl font-bold text-white mb-4 " >Add Event</h2>
//             <button onClick={() => setIsPopupOpen(false)} className="absolute top-6 right-6 text-white p-5">&times;</button>
//             <form onSubmit={handleSubmit}>

//               <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />


//               <div className="mt-4">
//                 <label className="text-white block mb-1">Name</label>
//                 <textarea
//                   name="name"
//                   value={newEvent.name}
//                   onChange={handleFormChange}
//                   className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white"
//                 />
//               </div>


//               <div className="mt-4">
//                 <label className="text-white block mb-1">Description</label>
//                 <textarea
//                   name="description"
//                   value={newEvent.description}
//                   onChange={handleFormChange}
//                   className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
//                 />


//               </div>
//               <div className="mt-4">
//                 <label className="text-white block mb-1"> Short Description</label>
//                 <textarea
//                   name="shortDescription"
//                   value={newEvent.shortDescription}
//                   onChange={handleFormChange}
//                   className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white"
//                 />
//               </div>
//               <div className="mt-4">
//                 <select
//                   name="type"
//                   value={newEvent.type}
//                   onChange={handleFormChange}
//                   required
//                   className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
//                 >
//                   <option value="core">Core</option>
//                   <option value="technical">Technical</option>
//                   <option value="nontechnical">Non Technical</option>
//                   <option value="special">Special</option>
//                 </select>
//               </div>
//               <div className="mt-4">
//                 <select
//                   name="day"
//                   value={newEvent.day}
//                   onChange={handleFormChange}
//                   required
//                   className="p-2 w-full border border-slate-700 rounded-xl bg-black text-white"
//                 >
//                   <option value="day1">Day 1</option>
//                   <option value="day2">Day 2</option>
//                   <option value="day3">Day 3</option>
//                 </select>
//               </div>

//               <button type="submit"
//                 className="mt-4 p-2 bg-white text-black rounded-xl w-full"
//                 disabled={isSubmitting}>
//                 {isSubmitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </form>

//           </div>
//         </div>
//       )}

//       {/* Delete confirmation popup */}
//       {isDeletePopupOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
//           <div className="bg-black p-6 rounded-md">
//             <h2 className="text-lg mb-4">Delete Confirmation</h2>
//             <p>Are you sure you want to delete {eventToDelete?.name}?</p>
//             <div className="flex justify-end mt-4 space-x-4">
//               <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
//               <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventsAdmin;

"use client"
import styled from 'styled-components';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  shortDescription: z.string().min(1, { message: "Short Description is required." }),
  type: z.enum(["core", "technical", "nontechnical", "special"], { message: "Type is required." }),
  day: z.enum(["day1", "day2", "day3"], { message: "Day is required." }),
  uploadUrl: z.string().min(1, { message: "Upload URL is required." }),
});


import React, { useState } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { ScrollArea } from "../ui/scroll-area"
import { eventDays, eventTypes } from '~/utils/constants';

const EventsAdmin: React.FC = () => {
  const addEvent = api.events.addEvent.useMutation();
  const updateVisibility = api.events.updateEventVisibility.useMutation();
  const { data: events, isLoading, isError, refetch } = api.events.getAllEvents.useQuery();
  const deleteEvent = api.events.deleteEvent.useMutation();
  const auditLogMutation = api.audit.log.useMutation();
  const { data: session } = useSession();


  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{ id: number; name: string } | null>(null);

  const ScrollableDiv = styled.div`
  max-height: 60vh;
  overflow-y: scroll;

  /* Hide scrollbar in WebKit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox: hide scrollbar */
  scrollbar-width: none;
`;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      type: "core",
      day: "day1",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const result = await addEvent.mutateAsync({ ...values, uploadKey: values.uploadUrl });
      setUploadUrl('');
      await auditLogMutation.mutateAsync({
        sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
        description: `EventManagementAudit - Added a new event ${values.name} having uploadKey ${uploadUrl}`,
      });
      toast.success(`Added a new event ${values.name} having uploadKey ${uploadUrl}`);
      void refetch(); // Refetch events after adding
    } catch (error) {
      toast.error(`Error adding event ${values.name}`);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  }

  const handleUploadComplete = (url: string) => {
    setUploading(false);
    setUploadUrl(url);
  };

  const handleDeleteClick = (eventId: number, eventName: string) => {
    setIsDeletePopupOpen(true);
    setEventToDelete({ id: eventId, name: eventName });
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent.mutateAsync({ id: eventToDelete.id });
        toast.success(`${eventToDelete.name} deleted successfully.`);
        void refetch();
        await auditLogMutation.mutateAsync({
          sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
          description: `EventManagementAudit - Deleted a event ${eventToDelete.name} having eventId ${eventToDelete.id}`,
        });
        toast.success(`Deleted a event ${eventToDelete.name} having eventId ${eventToDelete.id}`);
      } catch (error) {
        toast.error('Error deleting event');
      } finally {
        setIsDeletePopupOpen(false);
        setEventToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    toast.error('Event not deleted.');
    setIsDeletePopupOpen(false);
    setEventToDelete(null);
  };
  const filteredEvents = events?.filter(event => {
    const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = selectedEventType === 'all' || event.type === selectedEventType;
    const matchesDay = selectedDay === 'all' || event.day === selectedDay;

    return matchesSearchTerm && matchesEventType && matchesDay;
  });

  return (
    <div className="p-4">
      <h1 className='flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center'>Event Data and Management</h1>
      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search..."
            className="font-Trap-Regular text-white p-2 pl-10 border border-slate-700 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-white h-12 bg-primary-950/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-600">
            <FaSearch />
          </div>
        </div>

        <Select onValueChange={(value) => setSelectedDay(value)} value={selectedDay} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all" defaultChecked>All Days</SelectItem>
              {Object.entries(eventDays).map(([key, val]) => <SelectItem value={key} key={key}>{val}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedEventType(value)} value={selectedEventType} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all" defaultChecked>All Category</SelectItem>
              {Object.entries(eventTypes).map(([key, val]) => <SelectItem value={key} key={key}>{val}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger>
            <Button
            >
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle><h2 className="text-2xl font-bold text-white" >Add Event</h2></DialogTitle>
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
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="p-2 w-full border border-slate-700 rounded-xl h-12 bg-black text-white" value={uploadUrl} hidden />
                            {/* <UploadComponent
                              onUploadComplete={handleUploadComplete}
                              resetUpload={() => setUploadUrl('')}
                              onUploadBegin={() => setUploading(true)}
                            /> */}
                          </FormControl>
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

                          <Select  {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {Object.entries(eventTypes).map(([key, val]) => {
                                  return <SelectItem value={key} key={key} className="cursor-pointer hover:bg-accent">{val}</SelectItem>
                                })}
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
                            <Select  {...field}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {Object.entries(eventDays).map(([key, val]) => {
                                    return <SelectItem value={key} key={key} className="cursor-pointer hover:bg-accent">{val}</SelectItem>
                                  })}
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
      </div>

      {/* Events Table */}
      {isLoading ? (
        <CameraLoading />
      ) : isError ? (
        <div className=''>Error loading events. Please try again later.</div>
      ) : (
          <ScrollableDiv>
          <table className="min-w-full bg-primary-950/50 border border-slate-700 my-5 font-Trap-Regular text-sm">
            <thead>
              <tr className='text-black bg-gray-100 font-Trap-Regular'>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Name</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Description</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Category</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Day</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Background</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Delete</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Visibility</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents?.map((event) => (
                <tr key={event.id} className='hover:bg-gray-50 hover:text-black font-Trap-Regular'>
                  <td className=" py-2 px-4 border-b border-slate-700 text-center  text-xs">{event.name}</td>
                  <td className=" py-2 px-4 w-56 border-b border-slate-700 text-center text-xs">{event.description}</td>
                  <td className=" py-2 px-4 border-b border-slate-700 text-center text-xs">{eventTypes[event.type]}
                  </td>
                  <td className=" py-2 px-4 border-b border-slate-700 text-center text-xs">
                    {eventDays[event.day]}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center w-16">
                    <Image src={event.image} alt="Team Member" width={16} height={16} className="w-16 h-16 object-cover" />

                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <button onClick={() => handleDeleteClick(event.id, event.name)}>
                      <FaTrash className="text-red-600 hover:text-red-800" />
                    </button>
                  </td>
                  <td
                    className="py-2 px-4 border-b border-slate-700 text-center cursor-pointer"
                  >
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={event.visibility === 'active'}
                        onChange={async () => {
                          const newValue = event.visibility === 'active' ? 'inactive' : 'active';
                          const id = event.id;
                          const name = event.name;
                          await updateVisibility.mutateAsync({ id });
                          await auditLogMutation.mutateAsync({
                            sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
                            description: `EventManagementAudit - ${name} visibility set to ${newValue}`,
                          });
                          toast.success(`${name} visibility set to ${newValue}`);
                          refetch();
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-red-500 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 transition"></div>
                      <div className="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </ScrollableDiv>
      )}

      <Dialog open={isDeletePopupOpen} onOpenChange={setIsDeletePopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><h2 className="text-lg mb-4">Delete Confirmation</h2></DialogTitle>
            <DialogDescription>
              <div className="bg-black p-6 rounded-md">
                <p>Are you sure you want to delete {eventToDelete?.name}?</p>
                <div className="flex justify-end mt-4 space-x-4">
                  <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                  <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsAdmin;