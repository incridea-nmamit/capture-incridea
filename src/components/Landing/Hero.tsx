import React from 'react'

function Hero() {
    return (
        <section className="mx-auto flex h-[calc(100vh-6rem)] w-full container-size items-center justify-center overflow-hidden">
            <div className="relative mx-4 sm:mx-8 w-full h-full rounded-2xl overflow-hidden flex justify-center items-center">
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
                <div className="relative z-10 w-full max-w-5xl px-6 text-center text-white">
                    <h1 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        Your Memories, Our Passion
                    </h1>
                    <p className="mt-4 text-sm sm:text-base md:text-lg">
                        Get your event photos and story-worthy moments.
                        <br />
                        Experience them the same day! <strong>
                            captures.incridea.in
                        </strong>{" "}
                        has it all!
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Hero