import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

// Update the ParallaxProps interface to include direction
interface ParallaxProps {
  children: JSX.Element;
  baseVelocity: number;
  angle: number;
  direction?: number; // Add optional direction prop here
}

const ScrollVelocityCarousel = ({
  children,
  baseVelocity = 0.1,
  angle,
  direction = 1,
}: ParallaxProps) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  // directionFactor starts with the given direction prop
  const directionFactor = useRef<number>(direction);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Adjust movement direction based on scroll direction
    if (velocityFactor.get() < 0) {
      // Scrolling up
      directionFactor.current = direction === 1 ? 1 : -1; // Reverse movement logic based on direction
    } else if (velocityFactor.get() > 0) {
      // Scrolling down
      directionFactor.current = direction === 1 ? -1 : 1; // Reverse movement logic based on direction
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // Apply inverse rotation angle when direction is -1
  const rotatedAngle = direction === -1 ? angle : angle;

//   return (
//     <div
//       className="whitespace-nowrap w-[120vw] rotate-6"
//       style={{ transform: `rotate(${rotatedAngle}deg)` }} // Use rotatedAngle here
//     >
//       <motion.div className="w-fit flex whitespace-nowrap font-bold" style={{ x }}>
//         <div>{children}</div>
//         <div>{children}</div>
//         <div>{children}</div>
//         <div>{children}</div>
//       </motion.div>
//     </div>
//   );
// };

  return (
    <div
      className="whitespace-nowrap w-[120vw]"
      style={{ transform: `rotate(${rotatedAngle}deg)`, zIndex: direction === 1 ? 10 : 5 }} // Adjust zIndex based on direction
    >
      <motion.div className="w-fit flex whitespace-nowrap font-bold" style={{ x }}>
        <div>{children}</div>
        <div>{children}</div>
        <div>{children}</div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};


export default ScrollVelocityCarousel;
