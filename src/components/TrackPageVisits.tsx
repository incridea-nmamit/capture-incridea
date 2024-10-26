import { useRouter } from "next/router";
import { api } from "~/utils/api"; // Import API instance
import { useEffect, useRef, useState } from "react";

const TrackPageVisits = () => {
  const router = useRouter();
  const { mutate: logPageVisit } = api.web.addLog.useMutation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // To track timer
  const [ipAddress, setIpAddress] = useState<string>("");

  const fetchIpAddress = async () => {
    try {
      const response = await fetch("/api/get-ip");
      const data = await response.json();
      setIpAddress(data.ip);
    } catch (error) {
      console.error("Failed to fetch IP address", error);
    }
  };

  useEffect(() => {
    fetchIpAddress();
    const handleRouteChange = (url: string) => {
      // Clear any previous timer when the route changes
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Start a 4-second timer to log the page visit
      timeoutRef.current = setTimeout(() => {
        logPageVisit({
          ipAddress, // Replace this dynamically
          pageName: url,
        });
      }, 4000);
    };

    // Listen to route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    // Log the first page load
    handleRouteChange(router.pathname);

    // Cleanup: Remove event listener and clear any active timer
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [logPageVisit, router]);

  return null; // This component doesn't render anything
};

export default TrackPageVisits;
