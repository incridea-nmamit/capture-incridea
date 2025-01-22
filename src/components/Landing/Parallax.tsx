import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Parallax from "parallax-js";
import { useLayoutEffect, useRef } from "react";
import Layer1 from "public/images/layers/Camera.png";
import lastLayer from "public/images/layers/Floor.png";
import layer2 from "public/images/layers/Ring.png";
import Background from "public/images/layers/Background.png";

export const ParallaxHero = () => {
  const sceneRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (sceneRef.current) {
      new Parallax(sceneRef.current, {
        relativeInput: true,
      });
    }
  });

  const Logo = useRef(null);

  useGSAP(() => {
    if (!Logo.current) return;

    gsap.from(Logo.current, {
      delay: 0,
      duration: 0,
      scale: 3,
      opacity: 0.6,
      zIndex: 9999,
    });

    gsap.to(Logo.current, {
      duration: 2,
      scale: 1,
      opacity: 1,
    });
  });

  return (
    <>
      <section ref={sceneRef} className="relative min-h-screen">
        <div className="absolute h-screen w-screen" data-depth="0.4">
          <div className="absolute bottom-0 left-[50%] aspect-video h-[100vh] scale-110 md:left-0 md:h-full md:w-full md:-translate-x-0">
            <Image
              src={Background}
              alt="Gradient"
              width={1920}
              height={1080}
              className="object-coverß h-full w-full object-bottom"
            />
          </div>
        </div>

        <div
          data-depth="0.2"
          className="absolute h-screen w-screen"
          style={{ top: "-15%" }}
        >
          <Image
            src={layer2}
            alt="Layer 2"
            layout="fill"
            className="h-screen w-screen object-cover"
          />
        </div>

        <div data-depth="0.1" className="absolute h-screen w-screen">
          <Image
            src={Layer1}
            alt="Layer 1"
            layout="fill"
            className="h-screen w-screen object-cover object-center"
          />
        </div>

        <div className="absolute bottom-0 h-screen w-screen">
          <Image
            src={lastLayer}
            alt="Last Layer"
            layout="fill"
            className="h-full w-full object-cover object-bottom"
          />
        </div>
      </section>
    </>
  );
};
