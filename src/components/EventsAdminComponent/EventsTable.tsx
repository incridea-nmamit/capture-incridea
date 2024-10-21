import React from 'react';
import { api } from '~/utils/api';

interface EventsTableProps {
  searchTerm: string;
  selectedEventType: string;
  selectedDay: string;
}

const EventsTable: React.FC<EventsTableProps> = ({ searchTerm, selectedEventType, selectedDay }) => {
  // Use tRPC query to fetch all events
  const { data: events, isLoading, isError } = api.events.getAllEvents.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading events. Please try again later.</div>;
  }

  // Filter events based on searchTerm, selectedEventType, and selectedDay
  const filteredEvents = events?.filter(event => {
    const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = selectedEventType === 'all' || event.type === selectedEventType;
    const matchesDay = selectedDay === 'all' || event.day === selectedDay;

    return matchesSearchTerm && matchesEventType && matchesDay;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-white">
          <tr>
            <th className="text-black border border-gray-300 p-2">ID</th>
            <th className="text-black border border-gray-300 p-2">Name</th>
            <th className="text-black border border-gray-300 p-2">Description</th>
            <th className="text-black border border-gray-300 p-2">Image</th>
            <th className="text-black border border-gray-300 p-2">Type</th>
            <th className="text-black border border-gray-300 p-2">Day</th>
            <th className="text-black border border-gray-300 p-2">Visibility</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents?.map((event) => (
            <tr key={event.id}>
              <td className="border border-gray-300 p-2">{event.id}</td>
              <td className="border border-gray-300 p-2">{event.name}</td>
              <td className="border border-gray-300 p-2">{event.description}</td>
              <td className="border border-gray-300 p-2">
                <img src={event.image} alt={event.name} className="h-16 w-16 object-cover" />
              </td>
              <td className="border border-gray-300 p-2">{event.type}</td>
              <td className="border border-gray-300 p-2">{event.day}</td>
              <td className="border border-gray-300 p-2">{event.visibility}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
