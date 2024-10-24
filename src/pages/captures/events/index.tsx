import React, { useEffect } from 'react'
import Events from '~/components/Event'
import { api } from '~/utils/api';

function EventsPage() {
  let isLogged = false; // Static variable to track logging
  const addLog = api.web.addLog.useMutation();

  const logIP = async () => {
    if (isLogged) return; // Exit if already logged

    try {
      const response = await fetch('/api/get-ip');
      const data = await response.json();
      console.log('IP:', data.ip);
      const pageName = window.location.pathname;
      isLogged = true; // Set to true after logging

      // Ensure the IP and pageName are passed as an object if expected
      await addLog.mutateAsync({ ipAddress: data.ip, pageName }); 
      
    } catch (error) {
      console.error('Failed to log IP:', error);
    }
  };

  useEffect(() => {
    logIP(); // Call logIP only once when the component mounts
  }, []) // Runs only once on component mount
  return (
    <div>
      <Events/>
    </div>
  )
}

export default EventsPage
