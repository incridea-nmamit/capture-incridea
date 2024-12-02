import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
const useUserName = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const session = await getSession();
        if (session) {
          setUserName(session.user.name); 
        } else {
          setUserName(null);
        }
      } catch (error) {
        console.error(error);
        setUserName(null); 
      }
    };

    void fetchUserName();
    const intervalId = setInterval(() => {
      fetchUserName().catch(console.error);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return userName;
};

export default useUserName;
