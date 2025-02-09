"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

/**
 * Props interface for BlurFade component
 */
type BlurFadeProps = {
  children: React.ReactNode;      // Child elements to animate
  className?: string;            // Optional CSS classes
  variant?: {                    // Custom animation variants
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;             // Animation duration in seconds
  delay?: number;                // Animation delay in seconds
  yOffset?: number;              // Vertical offset for animation
  inView?: boolean;              // Whether to trigger on viewport entry
  blur?: string;                 // Blur amount for animation
};

/**
 * BlurFade Component
 * Adds fade and blur animation effects to child elements
 */
export default function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  blur = "6px",
}: BlurFadeProps) {
  // Reference for intersection observer
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: "-50px" });
  const isInView = !inView || inViewResult;

  // Default animation variants
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };

  // Use custom variants if provided, otherwise use defaults
  const combinedVariants = variant ?? defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: "easeOut",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}