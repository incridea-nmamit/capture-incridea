import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Parallax from "parallax-js";
import {  useLayoutEffect, useRef, } from "react";
import Layer1 from "public/images/layers/camera.png"
import lastLayer from "public/images/layers/floor.png"
import layer2 from "public/images/layers/ring.png"
import Background from "public/images/layers/background.png"


export const HomeUi = () => {
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
                <div data-depth="1.0" className="absolute h-screen w-screen">
                    <Image
                        src={Background}
                        alt="Background Gradient"
                        layout="fill"
                        className="h-screen w-screen object-cover"
                    />
                </div>

                
                <div data-depth="0.5" className="absolute h-screen w-screen">
                    <Image
                        src={Layer1}
                        alt="Layer 1"
                        layout="fill"
                        className="h-screen w-screen object-cover object-center"
                    />
                </div>

                
                <div
                    data-depth="0.4"
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

 
                <div className="absolute bottom-0 h-screen w-screen ">
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
