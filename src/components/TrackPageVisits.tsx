import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Cookies from "js-cookie";
import { generateUniqueId } from "~/utils/generateUniqueId";

const TrackPageVisits = () => {
  const logVisitMutation = api.analytics.logVisit.useMutation();
  const updateVisitMutation = api.analytics.updateVisit.useMutation();
  const updateNullEntriesMutation = api.analytics.updateNullEntries.useMutation();
  const router = useRouter();
  const timerRef = useRef<number>(0);
  const uniqueIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handlePageVisit = () => {
      const cookieId = Cookies.get("cookieId") || generateUniqueId();
      Cookies.set("cookieId", cookieId, { expires: 365 });

      const uniqueId = generateUniqueId();
      uniqueIdRef.current = uniqueId;

      const routePath = router.asPath;
      if (routePath.startsWith("/admin") || routePath.startsWith("/unauthorised")) return;
      updateNullEntriesMutation.mutate(
        { cookieId },
        {
          onSuccess: () => {
            // After successful null entries update, log the new visit
            logVisitMutation.mutate(
              { cookieId, uniqueId, routePath },
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
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        timerRef.current++;
      }, 1000);
    };

    const handlePageExit = () => {
      if (uniqueIdRef.current) {
        updateVisitMutation.mutate({
          uniqueId: uniqueIdRef.current,
          timer: timerRef.current,
        });
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
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
