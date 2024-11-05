import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import VideoComponent from "~/components/VideoComponent";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component only renders on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>

      <div className="flex flex-col min-h-screen">
        {/* Section 1: Main Hero Section */}
        <div
          className="relative h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg-10.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          <div className="relative z-10 h-3/4 flex items-center justify-between md:p-20">
            {/* Conditionally render the video only on the client */}
            <div className="flex-shrink-0 px-8 md:px-40">
            </div>
            {/* Tagline and Description */}
            <div className="flex flex-col text-white max-w-2xl text-left gap-8">
              <h1 className="text-7xl font-ClubHouse mb-4">
                Your Memories,<br/> Our Passion
              </h1>
              <p className="text-md ">
                Get your event photos and story-worthy moments.<br/> Experience them the same day!
                <span className="font-bold"> captures.incridea.in</span> has it all!
              </p>
            </div>
          </div>
        </div>
        {/* Section 2: Experience Animation Section */}
        <div
          className="relative h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('./images/img-2.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-4xl md:text-6xl text-white font-Finish mb-8 animate-bounce">
              Experience captures.incridea.in
            </h2>
            <button
              onClick={() => void router.push("/captures")}
              className="px-8 py-4 text-lg font-bold text-white rounded-lg transition transform bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 hover:-translate-y-1 dark:from-red-600 dark:to-red-800"
            >
              Go to Captures
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
