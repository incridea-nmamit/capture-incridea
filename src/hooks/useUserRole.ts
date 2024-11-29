import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const session = await getSession();
        if (session) {
          setUserRole(session.user.role); 
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error(error);
        setUserRole(null); 
      }
    };

    void fetchUserRole();
    const intervalId = setInterval(() => {
      fetchUserRole().catch(console.error);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return userRole;
};

export default useUserRole;
