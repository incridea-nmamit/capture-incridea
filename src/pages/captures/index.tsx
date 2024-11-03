// ~/pages/Captures.tsx
import React, { useEffect, useState } from 'react';
import CapturesComponent from '~/components/CaptureComponent';
import ReleaseOverlay from '~/components/ReleaseOverlay';

const Captures: React.FC = () => {
  const [isReleased, setIsReleased] = useState<boolean>(false);
  const [releaseDate, setReleaseDate] = useState<string>(process.env.NEXT_PUBLIC_WEBRELEASE as string); // Use state for release date

  const handleRelease = () => {
    setIsReleased(true);
  };

  // Check if the release date has already passed
  const checkReleaseDate = () => {
    const releaseDateTime = new Date(releaseDate).getTime();
    const currentTime = Date.now();
    return releaseDateTime > currentTime;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newReleaseDate = process.env.NEXT_PUBLIC_WEBRELEASE as string; // Get the latest release date
      if (newReleaseDate !== releaseDate) {
        setReleaseDate(newReleaseDate); // Update the state if it has changed
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [releaseDate]);

  return (
    <>
      {checkReleaseDate() && !isReleased ? (
        <ReleaseOverlay releaseDate={releaseDate} onRelease={handleRelease} />
      ) : (
        <CapturesComponent />
      )}
    </>
  );
};

export default Captures;
