import React from "react";

function Hero() {
  return (
    <section className="container-size mx-auto !mt-20 flex h-[calc(100vh-6rem)] w-full items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 sm:pb-28 md:pb-32">
          <div className="flex w-full flex-col gap-2 px-6 text-center text-white">
            <h1 className="mb-4 w-full font-Teknaf text-5xl md:text-6xl lg:text-6xl">
              Your Memories, Our Passion
            </h1>
            <p className="px-4 font-Trap-Regular text-xs sm:text-sm md:text-base">
              Get your event photos and story-worthy moments.
              <br />
              See them the same day! <br />
              <strong>captures.incridea.in</strong> is where it’s at!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
