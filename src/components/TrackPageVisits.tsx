import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { generateUniqueId } from "~/utils/generateUniqueId";
import { useSession } from "next-auth/react";

const TrackPageVisits = () => {
  const logVisitMutation = api.analytics.logVisit.useMutation();
  const updateVisitMutation = api.analytics.updateVisit.useMutation();
  const updateNullEntriesMutation = api.analytics.updateNullEntries.useMutation();
  const syncTimerMutation = api.analytics.updateVisit.useMutation();
  const router = useRouter();
  const timerRef = useRef<number>(0);
  const uniqueIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session } = useSession();
  const session_user = session?.user.email || ""; //Not reachable code
  useEffect(() => {
    const handlePageVisit = () => {

      const uniqueId = generateUniqueId();
      uniqueIdRef.current = uniqueId;

      const routePath = router.asPath;
      if (routePath.startsWith("/admin") || routePath.startsWith("/unauthorised")) return;

      updateNullEntriesMutation.mutate(
        { session_user },
        {
          onSuccess: () => {
            logVisitMutation.mutate(
              { session_user, uniqueId, routePath },
              {
                onError: (error) => {
                  console.error("Error logging visit:", error);
                },
              }
            );
          },
          onError: (error) => {
            console.error("Error updating null entries:", error);
          },
        }
      );

      timerRef.current = 0;

      // Clear existing intervals to avoid duplicates
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);

      // Start timer
      intervalRef.current = setInterval(() => {
        timerRef.current++;
      }, 1000);

      // Start 20-second sync interval
      syncIntervalRef.current = setInterval(() => {
        if (uniqueIdRef.current) {
          syncTimerMutation.mutate({
            uniqueId: uniqueIdRef.current,
            timer: timerRef.current,
          });
        }
      }, 20000); // Sync every 20 seconds
    };

    const handlePageExit = () => {
      if (uniqueIdRef.current) {
        updateVisitMutation.mutate({
          uniqueId: uniqueIdRef.current,
          timer: timerRef.current,
        });
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };

    if (document.readyState === "complete") {
      handlePageVisit();
    } else {
      window.addEventListener("load", handlePageVisit);
    }

    window.addEventListener("beforeunload", handlePageExit);
    return () => {
      handlePageExit();
      window.removeEventListener("load", handlePageVisit);
      window.removeEventListener("beforeunload", handlePageExit);
    };
  }, [router.asPath]);

  return null;
};

export default TrackPageVisits;
