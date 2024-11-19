import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';

const getOrCreateCookieId = () => {
  let cookieId = Cookies.get('cookieId');
  if (!cookieId) {
    cookieId = uuidv4();
    Cookies.set('cookieId', cookieId, { expires: 365 });
  }
  return cookieId;
};

const ViewerLogger = () => {
  const upsertViewMutation = api.viewer.upsertView.useMutation();
  const router = useRouter();

  const logUserActivity = (routePath: string) => {
    const cookieId = getOrCreateCookieId();
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 1000);

    upsertViewMutation.mutate({
      cookie_id: cookieId,
      routePath: routePath,
      lastPing: now,
      expiry: expiry,
    });
  };

  useEffect(() => {
    // Log initial route
    logUserActivity(router.pathname);

    // Listen for route changes
    const handleRouteChange = (url: string) => {
      logUserActivity(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Set up interval for periodic updates
    const interval = setInterval(() => logUserActivity(router.pathname), 30 * 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.pathname]);

  return null;
};

export default ViewerLogger;
