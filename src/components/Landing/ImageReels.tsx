import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

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


function ImageReels() {

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
            <section
                className="relative h-screen snap-start bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://utfs.io/f/0yks13NtToBib378ksJ8B3sc1wrJXDKH6FoRyAaOq4jCidVG')",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div
                    className="relative z-10 flex h-full flex-col items-center justify-center text-center"
                    style={{
                        height: headerHeight
                            ? `calc(100vh - ${headerHeight}px)`
                            : "100vh",
                    }}
                >
                    <h2 className="mb-8 animate-bounce font-Finish text-4xl text-white md:text-6xl">
                        Experience captures.incridea.in
                    </h2>
                    <button
                        onClick={() => void router.push("/captures")}
                        className="transform rounded-lg bg-gradient-to-r from-red-500 to-red-700 px-8 py-4 text-2xl text-white transition hover:-translate-y-1 hover:scale-105 dark:from-red-600 dark:to-red-800"
                    >
                        Go to Captures
                    </button>
                </div>
            </section>

            <section className="relative h-screen snap-start bg-black">
                <div className="relative flex min-h-[70vh] w-full max-w-7xl items-center overflow-hidden xl:mx-auto">
                    <div className="relative z-10 flex w-full justify-center sm:mb-24 md:mb-64 lg:mb-72 xl:mx-auto 2xl:hidden">
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

                    <div className="hidden w-full justify-center xl:mx-auto 2xl:flex">
                        <Reel
                            classes=""
                            baseVelocity={-1.5}
                            angle={0}
                            direction={1}
                            reelImg={reelImags}
                        />
                    </div>
                </div>
                <div className="absolute inset-x-0 top-0 items-center">
                    <h3 className="text-center text-2xl text-white">Incridea 2024</h3>
                </div>
            </section>
        </>
    )
}

export default Reel