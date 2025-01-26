import React, { useState, useEffect } from "react";
import CapturesComponent from "~/components/Captures/CapturePageComponent";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import ReleaseOverlay from "~/components/ReleasingOverlay/ReleaseOverlay";
import { api } from "~/utils/api";

const Captures: React.FC = () => {
  const [isReleased, setIsReleased] = useState<boolean>(false);
  const { data, isLoading, error } = api.variables.getVariable.useQuery({
    key: "CountDown-Capture",
  });

  const handleRelease = () => {
    setIsReleased(true);
  };

  const checkReleaseDate = (releaseDate: string | undefined) => {
    if (!releaseDate) return false; // No release date available yet
    const releaseDateTime = new Date(releaseDate).getTime();
    const currentTime = Date.now();
    return releaseDateTime > currentTime;
  };

  if (isLoading) {
    return <CameraLoading />; // Show a loading state while fetching data
  }

  if (error || !data?.value) {
    return <div>Error loading release date.</div>; // Handle errors or missing data
  }

  const releaseDate = data.value; // The fetched release date

  return (
    <main className="mt-20">
      {checkReleaseDate(releaseDate) && !isReleased ? (
        <ReleaseOverlay releaseDate={releaseDate} onRelease={handleRelease} />
      ) : (
        <CapturesComponent />
      )}
    </main>
  );
};

export default Captures;
