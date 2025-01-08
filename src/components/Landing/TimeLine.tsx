import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

export const TimeLine = () => {
  const years = [
    {
      title: 2022,
      image1: "/images/2022/DSC08909.png",
      image2: "/images/2022/IMG_0373.png",
      image3: "/images/2022/IMG_2204.png",
      image4: "/images/2022/IMG_9452.png",
    },
    {
      title: 2023,
      image1: "/images/2023/IMG_7455.png",
      image2: "/images/2023/DSC_0300.png",
      image3: "/images/2023/DSC_1080.png",
      image4: "/images/2023/IMG_6193.png",
    },
    {
      title: 2024,
      image1: "/images/2024/MVB03544.png",
      image2: "/images/2024/IMG_0162.png",
      image3: "/images/2024/DSC05653.png",
      image4: "/images/2024/MVB04911.png",
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineHighlightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 20%",
        end: "bottom 50%",
        scrub: true,
      },
    });

    tl.fromTo(
      timelineHighlightRef.current,
      {
        height: 0,
      },
      {
        height: "100%",
      },
    );
  });

  return (
    <section className="container-size mx-auto my-20 mt-20">
      <h3 className="mb-16 mt-10 w-full text-center font-Teknaf text-5xl md:text-6xl lg:text-6xl">
        Explore the past memory
      </h3>
      <div
        className="relative grid gap-8"
        style={{
          gridTemplateColumns: "20% auto",
        }}
        ref={containerRef}
      >
        {years.map((year) => {
          return (
            <>
              <div className="h-full w-full">
                <div className="sticky top-1/2 flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-4 border-gray-600 bg-black"></div>
                  <span>{year.title}</span>
                </div>
              </div>

              <div>
                <div className="mb-32 h-full max-h-[80vh] w-full overflow-hidden">
                  <div className="columns-2">
                    <Image
                      src={year.image3}
                      alt="Past-Year Images"
                      width={600}
                      height={400}
                      className="m-2"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <Image
                      src={year.image1}
                      alt="Past-Year Images"
                      width={600}
                      height={400}
                      className="m-2"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <Image
                      src={year.image2}
                      alt="Past-Year Images"
                      width={600}
                      height={400}
                      className="m-2"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <Image
                      src={year.image4}
                      alt="Past-Year Images"
                      width={600}
                      height={400}
                      className="m-2"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              </div>
            </>
          );
        })}

        <div
          className="timeline-highlight absolute left-[6px] top-0 -z-10 w-1 rounded-full bg-gradient-to-t from-purple-500 from-[0%] via-blue-500 via-[10%] to-transparent"
          ref={timelineHighlightRef}
        ></div>
      </div>
    </section>
  );
};

export default TimeLine;
