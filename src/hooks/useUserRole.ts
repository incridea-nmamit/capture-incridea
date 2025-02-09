import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

/**
 * Custom hook to get and monitor the user's role
 * @returns {string | null} The current user's role or null if not authenticated
 */
const useUserRole = () => {
  // State to store the user's role
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches the user's role from the session
     * @async
     */
    const fetchUserRole = async () => {
      try {
        const session = await getSession();
        setUserRole(session ? session.user.role : null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      }
    };

    // Initial fetch
    void fetchUserRole();

    // Set up polling interval
    const intervalId = setInterval(() => {
      void fetchUserRole();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return userRole;
};

export default useUserRole;
