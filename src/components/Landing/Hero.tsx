import React from "react";

function Hero() {
  return (
    <section className="container-size mx-auto flex h-[calc(100vh-6rem)] w-full items-center justify-center overflow-hidden">
      <div className="relative mx-2 flex h-full w-full max-w-[1600px] items-center justify-center overflow-hidden rounded-2xl sm:mx-4">
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
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-40">
          <div className="flex w-full flex-col gap-2 px-6 text-center text-white">
            <h1 className="mb-4 w-full font-ClubHouse text-6xl md:text-7xl">
              Your Memories, Our Passion
            </h1>
            <p className="px-10 text-sm md:text-base">
              Get your event photos and story-worthy moments.
              <br />
              Experience them the same day!{" "}
              <strong>captures.incridea.in</strong> has it all!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
