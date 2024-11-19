// pages/index.tsx
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Reel = dynamic(() => import("~/components/reel"), { ssr: false });

const reelImags = [
  { src: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3" },
  { src: "https://utfs.io/f/0yks13NtToBiRytYFqGmqjGOIgx47y3cAJSCbQ1V82Nitrsf" },
  { src: "https://utfs.io/f/0yks13NtToBi6HmZQ4hUy9ofa2RpzAV7ldXGwM4xgSure8sE" },
  { src: "https://utfs.io/f/0yks13NtToBiJ9b4q7w4BLygFdW15xChAKiDEleRHcja6tkI" },
  { src: "https://utfs.io/f/0yks13NtToBipWkLivmnEQxj9Ckq6tA4uGeavWLzMV5woYHP" },
  { src: "https://utfs.io/f/0yks13NtToBidkGYwLhfcvGemo1qIhyiPK56u3ZrnLzJUQRW" },
  { src: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4" },
];

export default function Home() {
  const router = useRouter();
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

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

      <div className="snap-y snap-mandatory h-screen overflow-y-scroll no-scrollbar">
        {/* Section 1: Main Hero Section */}
        <section className="relative h-screen snap-start">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/VidCom.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-40">
            <div className="flex flex-col text-white w-full text-center gap-2 px-6">
              <h1 className="text-6xl md:text-7xl font-ClubHouse mb-4 w-full">
                Your Memories, Our Passion
              </h1>
              <p className="text-sm md:text-base px-10">
                Get your event photos and story-worthy moments.
                <br />
                Experience them the same day!{" "}
                <strong>captures.incridea.in</strong> has it all!
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Experience Animation Section */}
        <section
          className="relative h-screen snap-start bg-cover bg-center"
          style={{ backgroundImage: "url('https://utfs.io/f/0yks13NtToBib378ksJ8B3sc1wrJXDKH6FoRyAaOq4jCidVG')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div
            className="relative z-10 flex flex-col items-center justify-center h-full text-center"
            style={{ height: headerHeight ? `calc(100vh - ${headerHeight}px)` : "100vh" }}
          >
            <h2 className="text-4xl md:text-6xl text-white font-Finish mb-8 animate-bounce">
              Experience captures.incridea.in
            </h2>
            <button
              onClick={() => void router.push("/captures")}
              className="px-8 py-4 text-2xl text-white rounded-lg transition transform bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 hover:-translate-y-1 dark:from-red-600 dark:to-red-800"
            >
              Go to Captures
            </button>
          </div>
        </section>

        {/* Section 3: Reel Section */}
        <section className="relative h-screen snap-start bg-black">
          <div className="relative w-full max-w-7xl xl:mx-auto min-h-[70vh] flex items-center overflow-hidden">
            <div className="w-full xl:mx-auto flex justify-center sm:mb-24 md:mb-64 lg:mb-72 2xl:hidden relative z-10">
              <Reel
                classes="blur-sm opacity-[0.47] md:opacity-100"
                baseVelocity={0.5}
                direction={1}
                angle={12}
                reelImg={reelImags}
              />
              <Reel
                classes="relative z-5"
                baseVelocity={-0.75}
                angle={-12}
                direction={1}
                reelImg={reelImags}
              />
            </div>

            <div className="w-full xl:mx-auto hidden justify-center 2xl:flex">
              <Reel classes="" baseVelocity={-1.5} angle={0} direction={1} reelImg={reelImags} />
            </div>
          </div>
          <div className="absolute inset-x-0 top-0 items-center">
            <h3 className="text-white text-center text-2xl">Incridea 2024</h3>
          </div>
        </section>
      </div>
    </>
  );
}
