import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

/**
 * Custom hook to get and monitor the user's name
 * @returns {string | null} The current user's name or null if not authenticated
 */
const useUserName = () => {
  // State to store the user's name
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches the user's name from the session
     * @async
     */
    const fetchUserName = async () => {
      try {
        const session = await getSession();
        setUserName(session ? session.user.name : null);
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName(null);
      }
    };

    // Initial fetch
    void fetchUserName();

    // Set up polling interval
    const intervalId = setInterval(() => {
      void fetchUserName();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return userName;
};

export default useUserName;
