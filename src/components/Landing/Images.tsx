import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { randomSliderImages } from "./../constants/data";

/**
 * Images Component
 * Creates an animated image slider with GSAP animations
 * Includes random image selection and transition effects
 */
function Images() {
  // Animation timeline setup
  const repeatDelay = 1;
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: repeatDelay,
    yoyo: true,
    onReverseComplete: () => {
      tl.repeatDelay(repeatDelay);
      tl.play();
    },
  });

  useGSAP(() => {
    tl.fromTo(
      ".slide-image",
      {
        y: "100vh",
      },
      {
        y: 0,
        duration: 1,
        stagger: {
          each: 0.1,
          from: "center",
          grid: "auto",
          ease: "power2.inOut",
          onStart: updateImage,
        },
      },
    );

    tl.play();
  }, []);

  // Image update function
  function updateImage() {
    const imageElements = document.querySelectorAll(".slide-image");

    imageElements.forEach((element) => {
      // Ensure images array is not empty and access the src properly
      const randomImage =
        randomSliderImages[
          Math.floor(Math.random() * randomSliderImages.length)
        ];
      if (randomImage && randomImage.src) {
        element.setAttribute("src", randomImage.src);
      }
    });
  }

  return (
    <section className="relative flex h-fit flex-col items-center space-y-8 overflow-hidden text-center">
      {/*bg-neutral-950*/}
      <br />
      <h3 className="mb-12 text-center font-Teknaf text-3xl md:text-4xl lg:text-5xl">
        "Let’s cherish memories by sharing them with all."
      </h3>
      <div className="flex w-full items-center justify-center gap-2 overflow-hidden md:gap-6">
        <img
          src="https://placehold.co/400x600"
          alt=""
          className="slide-image h-[27vh] w-[50%] rounded-lg object-cover md:h-full"
        />
        <img
          src="https://placehold.co/400x600"
          alt=""
          className="slide-image h-[27vh] w-[50%] rounded-lg md:h-full"
        />
        <img
          src="https://placehold.co/400x600"
          alt=""
          className="slide-image h-[27vh] w-[50%] rounded-lg md:h-full"
        />
      </div>

      <button
        className="absolute right-3 top-24 z-10 grid aspect-square h-12 cursor-pointer place-content-center rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition hover:rotate-[24deg] md:right-1/3 md:top-20 md:h-24 md:p-6"
        onClick={() => {
          if (!tl.reversed()) {
            tl.repeatDelay(0);
            tl.reverse();
          }
        }}
      >
        <RefreshCcw size={36} className="w-full" strokeWidth={2} />
      </button>

      <div className="absolute bottom-0 h-[300px] w-full bg-gradient-to-t from-neutral-950 from-10% via-neutral-950 via-20% to-transparent to-90%"></div>
    </section>
  );
}

export default Images;
