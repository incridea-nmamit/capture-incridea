import React, { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
}

const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.animated-letter {
  display: inline-block;
  opacity: 0;
  transform: translate3d(0, 40px, 0);
  animation: fadeInUp 0.6s ease-out forwards;
}
`;

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <>
      {/* Inject animation styles globally */}
      <style>{styles}</style>

      <p
        ref={ref}
        className={`split-text inline overflow-hidden ${className}`}
        style={{ textAlign, whiteSpace: "normal", wordWrap: "break-word" }}
      >
        {text.split(" ").map((word, wordIndex) => (
          <span
            key={wordIndex}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.split("").map((letter, letterIndex) => {
              const index =
                text
                  .split(" ")
                  .slice(0, wordIndex)
                  .reduce((acc, w) => acc + w.length, 0) + letterIndex;

              return (
                <span
                  key={index}
                  className="animated-letter"
                  style={{
                    animationDelay: inView ? `${index * delay}ms` : "0ms",
                  }}
                >
                  {letter}
                </span>
              );
            })}
            <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
          </span>
        ))}
      </p>
    </>
  );
};

export default SplitText;
