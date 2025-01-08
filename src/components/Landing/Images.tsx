import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";

// please use the images which are 600x600 cuz its not optimised for mobile view due to gsap
const images = [
  { src: "/images/2022/DSC08909.png" },
  { src: "/images/2022/IMG_0373.png" },
  { src: "/images/2023/IMG_7455.png" },
  { src: "/images/2024/IMG_0162.png" },
  { src: "/images/2024/img5.jpeg" },
];

function Images() {
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

  function updateImage() {
    const imageElements = document.querySelectorAll(".slide-image");

    imageElements.forEach((element) => {
      // Ensure images array is not empty and access the src properly
      const randomImage = images[Math.floor(Math.random() * images.length)];
      if (randomImage && randomImage.src) {
        element.setAttribute("src", randomImage.src);
      }
    });
  }

  return (
    <section className="relative flex h-fit flex-col items-center space-y-8 overflow-hidden text-center">
      <br />
      <h3 className="mb-12 w-3/4 text-center font-Teknaf text-3xl md:text-4xl lg:text-5xl">
        "Let’s cherish memories by sharing them with all."
      </h3>
      <div className="flex w-full items-center justify-center gap-6 overflow-hidden">
        <img
          src="https://placehold.co/400x600"
          alt=""
          className="slide-image h-full w-[50%] rounded-lg object-cover"
        />
        <img
          src="https://placehold.co/400x600"
          alt=""
          className="slide-image w-[50%] rounded-lg"
        />
        <img
          src="https://placehold.co/400x600"
          alt=""
          className="slide-image w-[50%] rounded-lg"
        />
      </div>
      <button
        className="absolute right-1/3 top-20 z-10 grid aspect-square h-16 cursor-pointer place-content-center rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition hover:rotate-[24deg] md:h-24 md:p-6"
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
