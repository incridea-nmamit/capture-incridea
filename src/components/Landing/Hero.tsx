import React from "react";

/**
 * Hero Component
 * Main landing page section with video background and headline
 */
function Hero() {
  return (
    <section className="w-full mx-auto flex h-screen items-center justify-center overflow-hidden">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/VidCom.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 sm:pb-28 md:pb-32">
          <div className="flex w-full flex-col gap-2 px-6 text-left text-white md:text-center">
            <h1 className="mb-4 w-full font-Teknaf text-5xl font-semibold md:text-6xl lg:text-6xl">
              Your Memories, Our Passion
            </h1>
            <p className="px-1 font-Trap-Regular text-xs sm:text-sm md:px-4 md:text-base">
              Get your event photos and story-worthy moments.
              <br />
              See them the same day! <br />
              <strong>captures.incridea.in</strong> is where it{"'"}s at!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
