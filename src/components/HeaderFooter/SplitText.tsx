import React, { useEffect, useState } from "react";

/**
 * SplitText Component Props
 */
type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: React.CSSProperties;
  animationTo?: React.CSSProperties;
  easing?: string;
  threshold?: number;
  rootMargin?: string;
  onLetterAnimationComplete?: () => void;
};

/**
 * SplitText Component
 * Animates text by splitting it into individual characters
 */
const SplitText: React.FC<SplitTextProps> = ({
  text,
  className,
  delay = 100,
  animationFrom = { opacity: 0, transform: "translateY(20px)" },
  animationTo = { opacity: 1, transform: "translateY(0)" },
  onLetterAnimationComplete,
}) => {
  // Animation state management
  const [animated, setAnimated] = useState<boolean[]>(
    new Array(text.length).fill(false),
  );

  useEffect(() => {
    text.split("").forEach((_, index) => {
      setTimeout(() => {
        setAnimated((prev) => {
          const newArr = [...prev];
          newArr[index] = true;
          return newArr;
        });

        if (index === text.length - 1 && onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
      }, delay * index);
    });
  }, [text, delay, onLetterAnimationComplete]);

  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-500 ease-out"
          style={animated[index] ? animationTo : animationFrom}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
