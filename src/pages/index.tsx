import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Reel from "~/components/reel";

const reelImags = [
  { src: "/images/gallery/g-1.png" },
  { src: "/images/gallery/g-2.png" },
  { src: "/images/gallery/g-3.png" },
  { src: "/images/gallery/g-4.png" },
  { src: "/images/gallery/g-5.png" },
  { src: "/images/gallery/g-6.png" },
  { src: "/images/gallery/g-7.png" },
]

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component only renders on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.clientHeight);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Capture Incridea</title>
      </Head>

      <div className="snap-y snap-mandatory h-screen overflow-y-scroll no-scrollbar ">
        
        {/* Section 1: Main Hero Section */}
        <section className="relative h-screen snap-start ">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/VidCom.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Overlay for darkening the video */}
          <div className="absolute inset-0 bg-black bg-opacity-50"  />
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-40">
            {/* Tagline and Description */}
            <div className="flex flex-col text-white w-full text-center gap-2 px-6">
              <h1 className="text-6xl md:text-7xl font-ClubHouse mb-4 w-full">
                Your Memories, Our Passion
              </h1>
              <p className="text-sm md:text-base text-md px-10">
                Get your event photos and story-worthy moments.<br/> Experience them the same day!
                <span className="font-bold"> captures.incridea.in</span> has it all!
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Experience Animation Section */}
        <section
          className="relative h-screen snap-start bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg-10.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center"
          style={{ height: `calc(100vh - ${headerHeight}px)` }}>
            <h2 className="text-4xl md:text-6xl text-white font-Finish mb-8 animate-bounce">
              Experience captures.incridea.in
            </h2>
            <button
              onClick={() => void router.push("/captures")}
              className="px-8 font-BebasNeue py-4 text-2xl text-white rounded-lg transition transform bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 hover:-translate-y-1 dark:from-red-600 dark:to-red-800"
            >
              Go to Captures
            </button>
          </div>
        </section>

        {/* Section 2: Experience Animation Section */}
        <div
          className="relative h-screen snap-start bg-cover bg-center"
          // style={{ backgroundImage: "url('/images/img-2.png')" }}
        >
          {/* <div className="absolute inset-0 bg-black bg-opacity-50" /> */}

          
          <div className="absolute w-full items-center">
            <h3 className="text-white text-center text-2xl">Incridea 2023</h3>
          </div>


          <div className="min-w-full max-w-7xl xl:mx-auto min-h-[30vh] sm:min-h-[70vh] lg:min-h-auto items-center flex overflow-hidden">
          <div className="w-full xl:mx-auto flex justify-center mb-20 sm:mb-24 md:mb-64 lg:mb-72 2xl:hidden relative z-10">
            <Reel classes="blur-sm opacity-[0.47] md:opacity-100" baseVelocity={0.5} direction={1} angle={12} reelImg={reelImags} />
            <Reel classes="relative z-5" baseVelocity={-0.75} angle={-12} direction={1} reelImg={reelImags} />
          </div>
          <div className="w-full xl:mx-auto hidden justify-center 2xl:flex">
            <Reel classes="" baseVelocity={-1.5} angle={0} direction={1} reelImg={reelImags} />
          </div>
        </div>


        <div className="absolute w-full items-center">
          <h3 className="text-white text-center text-2xl">Incridea 2024</h3>
        </div>


        <div className="min-w-full max-w-7xl xl:mx-auto min-h-[30vh] sm:min-h-[70vh] lg:min-h-auto items-center flex overflow-hidden ">
          <div className="w-full xl:mx-auto flex justify-center mb-20 sm:mb-24 md:mb-64 lg:mb-72 2xl:hidden relative z-10">
            <Reel classes="blur-sm opacity-[0.47] md:opacity-100" baseVelocity={0.5} direction={-1} angle={12} reelImg={reelImags} />
            <Reel classes="relative z-5" baseVelocity={-0.75} angle={-12} direction={-1} reelImg={reelImags} />
          </div>
          <div className="w-full xl:mx-auto hidden justify-center 2xl:flex">
            <Reel classes="" baseVelocity={-1.5} angle={0} direction={-1} reelImg={reelImags} />
          </div>
        </div>

          <div className="absolute w-full items-center">
            <h3 className="text-white text-center text-2xl">Incridea 2023</h3>
          </div>

          <div className="min-w-full max-w-7xl xl:mx-auto min-h-[30vh] sm:min-h-[70vh] lg:min-h-auto items-center flex overflow-hidden">
          <div className="w-full xl:mx-auto flex justify-center mb-20 sm:mb-24 md:mb-64 lg:mb-72 2xl:hidden relative z-10">
            <Reel classes="blur-sm opacity-[0.47] md:opacity-100" baseVelocity={0.5} direction={1} angle={12} reelImg={reelImags} />
            <Reel classes="relative z-5" baseVelocity={-0.75} angle={-12} direction={1} reelImg={reelImags} />
          </div>
          <div className="w-full xl:mx-auto hidden justify-center 2xl:flex">
            <Reel classes="" baseVelocity={-1.5} angle={0} direction={1} reelImg={reelImags} />
          </div>
        </div>          
        </div>
      </div>      
    </>
  );
}
