import React, { useEffect, useRef, useCallback } from 'react';
import OurTeam from '~/components/OurTeam';
import { api } from '~/utils/api';

function OurTeamPage() {
  const isLogged = useRef(false); // Use a ref to persist the logged state
  const addLog = api.web.addLog.useMutation();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const logIP = useCallback(async () => {
    if (isLogged.current) return; // Exit if already logged
    try {
      const initialPage = window.location.pathname; // Capture initial page name

      const response = await fetch('/api/get-ip');
      const data = await response.json() as { ip: string }; // Ensure data has the correct type
      console.log('IP:', data.ip);

      await delay(2000); // 2-second delay

      // Check if user is still on the same page
      const currentPage = window.location.pathname;
      if (initialPage === currentPage) {
        await addLog.mutateAsync({ ipAddress: data.ip, pageName: initialPage });
        console.log('IP logged successfully');
        isLogged.current = true; // Set to true after logging
      } else {
        console.log('User navigated to a different page. Logging aborted.');
      }
    } catch (error) {
      console.error('Failed to log IP:', error);
    }
  }, [addLog]);

  useEffect(() => {
    logIP().catch(console.error); // Handle promise to avoid no-floating-promises error
  }, [logIP]);

  return (
    <div>
      <OurTeam />
    </div>
  );
}

export default OurTeamPage;
