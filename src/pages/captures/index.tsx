import { useEffect, useRef } from "react"; // Import useRef from React
import Link from "next/link"; // Import Link from Next.js
import { api } from "~/utils/api";

const Captures = () => {
  const isLogged = useRef(false); // Use a ref to persist the logged state
  const addLog = api.web.addLog.useMutation();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const logIP = async () => {
    if (isLogged.current) return; // Exit if already logged

    try {
      const initialPage = window.location.pathname; // Capture initial page name
  
      const response = await fetch('/api/get-ip');
      const data = await response.json();
      console.log('IP:', data.ip);
  
      await delay(2000); // 2-second delay
  
      // Check if user is still on the same page
      const currentPage = window.location.pathname;
      if (initialPage === currentPage) {
        await addLog.mutateAsync({ ipAddress: data.ip, pageName: initialPage });
        console.log('IP logged successfully');
        isLogged.current = true; // Set to true after logging
      } else {
        console.log('User navigated to a different page. Logging aborted.');
      }
    } catch (error) {
      console.error('Failed to log IP:', error);
    }
  };

  useEffect(() => {
    logIP(); // Call logIP only once when the component mounts
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start p-8"
      style={{ backgroundImage: "url('/images/capture-bg.png')" }}
    >
      <h1 className="text-5xl text-white font-extrabold mb-12 p-8">Captures</h1>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Events Card with Link */}
        <Link href="/captures/events" passHref>
          <div className="relative group w-80 h-80 rounded-3xl overflow-hidden cursor-pointer">
            {/* Shadow behind the card */}
            <div className="absolute inset-0 -z-10 bg-black rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition" />

            {/* Card content */}
            <div
              className="relative w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
              style={{ backgroundImage: "url('/images/event-bg.png')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center h-full text-white text-3xl font-bold">
                Events
              </div>
            </div>
          </div>
        </Link>

        {/* General Card with Link */}
        <Link href="/captures/general" passHref>
          <div className="relative group w-80 h-80 rounded-3xl overflow-hidden cursor-pointer">
            {/* Shadow behind the card */}
            <div className="absolute inset-0 -z-10 bg-black rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition" />

            {/* Card content */}
            <div
              className="relative w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
              style={{ backgroundImage: "url('/images/general-bg.png')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center h-full text-white text-3xl font-bold">
                General
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Captures;
