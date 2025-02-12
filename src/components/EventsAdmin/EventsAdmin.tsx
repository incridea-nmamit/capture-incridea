import React, { useState } from 'react'
import Loading from '~/pages/Loading'
import { api } from '~/utils/api'

import { DataTable } from './data-table'
import { eventColumns } from './coloums' 
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectGroup, 
  SelectItem  
} from '../ui/select'
import { Day, EventType } from '@prisma/client'

/**
 * EmailVerifications Component
 * Main component for managing event playback videos in the admin panel.
 * Displays a table of all playbacks with filtering options for event type and day.
 */
const EmailVerifications = () => {
  const { data: events = [], isLoading } = api.events.getAllEvents.useQuery();

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
        <div className="col-span-12 lg:col-span-2 flex md:flex-col gap-4 order-1 lg:order-2">
          
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

        <div className="col-span-12 lg:col-span-10 order-2 lg:order-1">
          <DataTable columns={eventColumns} data={filteredEvents} />
        </div>

      </div>
    </div>
  )
}

export default EmailVerifications
