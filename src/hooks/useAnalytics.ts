// hooks/useAnalytics.ts
import { useEffect } from 'react';
import { api } from '~/utils/trpc'; // Adjust based on your TRPC setup

const useAnalytics = (pageName: string) => {
  const addLog = api.web.addLog.useMutation();

  useEffect(() => {
    const logVisit = async () => {
      const ipAddress = await fetch('/api/get-ip').then(res => res.text()); // Fetch the IP address from your API
      await addLog.mutateAsync({ ipAddress, pageName });
    };

    logVisit();
  }, [addLog, pageName]);
};

export default useAnalytics;
