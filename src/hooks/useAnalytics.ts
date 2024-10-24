// hooks/useAnalytics.ts
import { useEffect } from 'react';
import { api } from '~/utils/trpc'; // Adjust based on your TRPC setup

const useAnalytics = (pageName: string) => {
  const addLog = api.web.addLog.useMutation();

  useEffect(() => {
    const logVisit = async () => {
      const ipAddress = await fetch('/api/get-ip').then(res => res.text()); // Retrive data from the page api 
      const pageName = window.location.pathname;// Fetch the IP address from your API
      await addLog.mutateAsync({ ipAddress, pageName }); //Enter data to the database
    };

    logVisit();
  }, [addLog, pageName]);
};

export default useAnalytics;
