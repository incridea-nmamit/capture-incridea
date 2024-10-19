
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
      <Head>
        <title>Capture Incridea</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/images/favicon/favicon.ico" />
      </Head>
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"> */}
        <div className="flex flex-col min-h-screen">
        {/* Section 1: Main Hero Section */}
        <div
          className="relative h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />

          <div className="relative z-10 h-full flex items-center justify-between p-10">
            {/* Conditionally render the video only on the client */}
            <div className="flex-shrink-0 px-8">
              {isMounted && <VideoComponent />}
            </div>

            {/* Tagline and Description */}
            <div className="flex flex-col text-white max-w-2xl text-left gap-8">
              <h1 className="font-silkscreen text-5xl font-extrabold mb-4">
                Your Memories, Our Passion
              </h1>
              <p className="text-lg">
                Get your event photos and story-worthy moments. Experience them the same day! <br />
                <span className="font-bold">captures.incridea.in</span> has it all !
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Experience Animation Section */}
        <div
          className="relative h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('./images/experience-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-4xl md:text-6xl text-white font-extrabold mb-8 animate-bounce">
              Experience captures.incridea.in
            </h2>
            <button
              onClick={() => router.push("/captures")}
              className="px-8 py-4 text-lg bg-white text-black font-bold rounded hover:bg-gray-200 transition"
            >
              Go to Captures
            </button>
          </div>
        </div>
      </div>
        
      {/* </main> */}

    </>
  );
}
