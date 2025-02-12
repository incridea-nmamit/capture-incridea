import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

/**
 * TimelineEntry interface defining the structure of timeline items
 */
type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

/**
 * TimelineLayout Component
 * Creates an animated timeline with scroll-based progress indicators
 * @param data Array of timeline entries to display
 */
export const TimelineLayout = ({ data }: { data: TimelineEntry[] }) => {
  // Refs for scroll animation
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Height state for animation calculations
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full md:px-10" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8 lg:px-10">
        <h2 className="mb-4 line-clamp-1 w-fit max-w-4xl mt-20 rounded-md p-2 font-Trap-Black text-3xl font-semibold text-white shadow-md md:text-4xl">
          Incridea Timeline
        </h2>
        <p className="text-md max-w-sm space-x-3 text-neutral-500 md:text-base">
          Capturing the essence of the olden days through nostalgic and timeless
          images for Incredia, preserving cherished memories and history in a
          beautifully artistic frame.{" "}
        </p>
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:gap-10 md:pt-40"
          >
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 dark:bg-black md:left-5">
                <div className="h-4 w-4 rounded-full border border-neutral-300 bg-neutral-400 p-2 dark:border-neutral-700 dark:bg-neutral-800" />
              </div>
              <h3 className="hidden font-Teknaf text-xl font-bold text-neutral-400 dark:text-neutral-200 md:block md:pl-20 md:text-3xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="relative bottom-1 right-5 mb-4 block text-left font-Teknaf text-xl font-bold text-neutral-400 dark:text-neutral-200 md:hidden">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
            <div
              style={{
                height: height + "px",
              }}
              className="absolute left-8 top-0 h-full w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700 md:left-8"
            >
              <motion.div
                style={{
                  height: heightTransform,
                  opacity: opacityTransform,
                }}
                className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-purple-500 from-[0%] via-blue-500 via-[10%] to-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
