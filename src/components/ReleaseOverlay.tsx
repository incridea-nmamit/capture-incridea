// ~/components/ReleaseOverlay.tsx
import React, { useEffect, useState } from 'react';
import FallingClipart from './FallingClipart';

interface ReleaseOverlayProps {
  releaseDate: string; // Expected to be in ISO 8601 format
  onRelease: () => void; // Function to call when the countdown ends
}

const ReleaseOverlay: React.FC<ReleaseOverlayProps> = ({ releaseDate, onRelease }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Start as null to avoid SSR mismatch
  const [isMounted, setIsMounted] = useState<boolean>(false); // Track if the component is mounted

  useEffect(() => {
    setIsMounted(true); // Set to true once the component is mounted
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft(releaseDate);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        onRelease(); // Trigger fade out on countdown end
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [releaseDate, onRelease]);

  function getTimeLeft(releaseDate: string): number {
    const now = new Date();
    const releaseDateTime = new Date(releaseDate);

    // Check if the releaseDateTime is valid
    if (isNaN(releaseDateTime.getTime())) {
      console.error('Invalid release date:', releaseDate);
      return 0; // Return 0 if the date is invalid
    }

    // Calculate the distance between the release date and now
    const distance = releaseDateTime.getTime() - now.getTime();
    return distance > 0 ? distance : 0; // Return 0 if time is up
  }

  const formatTimeLeft = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  // Helper function to format numbers to two digits
  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  // Only render the countdown when the component is mounted
  if (!isMounted) {
    return null; // Prevent rendering until client-side hydration
  }

  const timeDisplay = timeLeft !== null ? formatTimeLeft(timeLeft) : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div>
    <FallingClipart />
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-80 text-white text-center z-20">
      
      <h1 className="mb-8 text-8xl font-Hunters">Captures</h1>
      <p className="mb-8 w-3/4 text-center">
        <p className='font-bold'>Capture Incridea is your ultimate hub for experiencing the vibrant energy of Incridea! </p><br/>
        All the exciting captures from various events and activities happening throughout the day, in your hands on the same day.<br/>
        Relive the highlights and immerse yourself in the spirit of our college community as we celebrate the unforgettable moments that make Incridea truly special!
      </p>
      <div className="flex items-center justify-center space-x-4 mt-8">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105 w-24">
            <span className="text-4xl font-bold">{formatTwoDigits(timeDisplay[label.toLowerCase() as keyof typeof timeDisplay])}</span>
            <div className="text-sm font-semibold">{label}</div>
          </div>
        ))}
      </div>
      <p className='mt-8'>Hold tight while we sift through today’s moments to bring you pure captures like never before!</p>
    </div>

    </div>
  );
};

export default ReleaseOverlay;
