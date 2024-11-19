import React, { useMemo } from 'react';
import { api } from '~/utils/api';
import CameraLoading from './LoadingAnimation/CameraLoading';

const RoutePathTable = () => {
  // Fetch all viewers for counting route occurrences
  const { data: viewers, isLoading: viewersLoading } = api.viewer.getViews.useQuery(undefined, {
    refetchInterval: 5000, // Refetch every 5 seconds
  });
  

  // Fetch all event names for dynamic route tracking
  const { data: events, isLoading: eventsLoading } = api.events.getAllEvents.useQuery();

  // Define the static routes
  const staticRoutes = useMemo(
    () => [
      '/',
      '/captures',
      '/our-team',
      '/captures/events',
      '/captures/pronight',
      '/captures/behindincridea',
      '/captures/cultural',
      '/captures/your-snaps',
      '/about',
      '/admin',
      '/admin/dashboard',
      '/unauthorised',
      '/our-team',
    ],
    []
  );

  // Combine static and dynamic routes
  const allRoutes = useMemo(() => {
    const eventRoutes = events?.map(event => `/captures/events/${event.name}`) || [];
    return [...staticRoutes, ...eventRoutes];
  }, [events, staticRoutes]);

  // Calculate counts for each route
  const routeCounts = useMemo(() => {
    if (viewersLoading || !viewers) return {};

    const now = new Date(); // Current date and time

    return allRoutes.reduce((acc, route) => {
      acc[route] = viewers.filter(
        viewer => viewer.routePath === route && new Date(viewer.expiry) > now
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, [allRoutes, viewers, viewersLoading]);

  if (viewersLoading || eventsLoading) {
    return <CameraLoading/>;
  }

  return (
    <div>
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Live Viewers</h1>
      <table className="min-w-full border border-gray-300 bg-black">
        <thead>
          <tr className='bg-gray-200'>
            <th className="text-black border border-gray-200 px-4 text-center">RoutePath</th>
            <th className="text-black border border-gray-200 px-4 text-center">Count</th>
          </tr>
        </thead>
        <tbody>
          {allRoutes.map(route => (
            <tr key={route} className='text-center'>
              <td className="py-2 px-4 border-b border-slate-700 text-center">{route}</td>
              <td className="py-2 px-4 border-b border-slate-700 text-center">{routeCounts[route] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoutePathTable;
