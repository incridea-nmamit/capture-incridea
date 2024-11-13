import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api"; // Import API instance

const TrackPageVisits = () => {
  const router = useRouter();
  const { mutate: logPageVisit } = api.web.addLog.useMutation();
  const [cookieId, setCookieId] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // To track timeouts

  // Function to generate a unique cookie ID if not present
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  };

  const createCookie = () => {
    const newCookieId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    document.cookie = `cookieId=${newCookieId}; path=/; samesite=strict;`;
    return newCookieId;
  };

  // Check for an existing cookie or create a new one
  useEffect(() => {
    const existingCookie = getCookie("cookieId");
    if (existingCookie) {
      setCookieId(existingCookie);
    } else {
      const newCookieId = createCookie();
      setCookieId(newCookieId);
    }
  }, []);

  // Track time spent on page using session storage
  useEffect(() => {
    if (!cookieId) return;

    const timeKey = "timeSpent"; // Key for session storage

    // Initialize time spent in session storage if not already set
    if (!sessionStorage.getItem(timeKey)) {
      sessionStorage.setItem(timeKey, "0");
    }

    // Start counting the time when the user is active
    const startTimer = () => {
      timeoutRef.current = setInterval(() => {
        const currentTime = parseInt(sessionStorage.getItem(timeKey) || "0", 10);
        sessionStorage.setItem(timeKey, (currentTime + 1).toString());
        setTimeSpent(currentTime + 1); // Update local time spent state
      }, 1000);
    };

    // Stop the timer and log the time when the page is hidden or inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timeoutRef.current) {
          clearInterval(timeoutRef.current);
          timeoutRef.current = null;
        }
        logPageVisit({
          cookieId,
          pageName: router.asPath,
          timeSpent,
        });
      } else {
        // When the page becomes visible again, reset the timer
        sessionStorage.setItem(timeKey, "0");
        setTimeSpent(0);
        startTimer();
      }
    };

    startTimer(); // Start the timer when the component mounts
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup when the user leaves or the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cookieId, timeSpent, logPageVisit, router]);

  // Log the time spent when the user switches to another page
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (cookieId) {
        // Log the current page's time spent when switching to another page
        logPageVisit({
          cookieId,
          pageName: router.asPath,
          timeSpent: parseInt(sessionStorage.getItem("timeSpent") || "0", 10),
        });
        // Reset the session storage timer for the new page
        sessionStorage.setItem("timeSpent", "0");
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // Cleanup event listener
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [cookieId, logPageVisit, router]);

  return null; // This component doesn't render anything
};

export default TrackPageVisits;
