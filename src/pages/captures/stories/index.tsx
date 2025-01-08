
// // { src: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3" },
// // { src: "https://utfs.io/f/0yks13NtToBiRytYFqGmqjGOIgx47y3cAJSCbQ1V82Nitrsf" },
// // { src: "https://utfs.io/f/0yks13NtToBi6HmZQ4hUy9ofa2RpzAV7ldXGwM4xgSure8sE" },
// // { src: "https://utfs.io/f/0yks13NtToBiJ9b4q7w4BLygFdW15xChAKiDEleRHcja6tkI" },
// // { src: "https://utfs.io/f/0yks13NtToBipWkLivmnEQxj9Ckq6tA4uGeavWLzMV5woYHP" },
// // { src: "https://utfs.io/f/0yks13NtToBidkGYwLhfcvGemo1qIhyiPK56u3ZrnLzJUQRW" },
// // { src: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4" },
// // ];


import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const DATA = [
  {
    name: "Event 1",
    icon: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
    images: [
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
    ],
  }, {
    name: "Event 1",
    icon: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
    images: [
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
    ],
  }, {
    name: "Event 1",
    icon: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
    images: [
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
    ],
  }, {
    name: "Event 1",
    icon: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
    images: [
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
      {
        url: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3",
        time: "2021-09-01T00:00:00Z",
        likes: 10,
      },
    ],
  },
];

const Stories = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const storyImageIndex = useRef(Array(DATA.length).fill(0));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const categoriesRef = useRef<HTMLDivElement[]>([]);

  const slide = (
    images: HTMLDivElement,
    imgWidth: number,
    count: number,
    index: number,
    direction: 1 | -1
  ) => {
    storyImageIndex.current[index] =
      (storyImageIndex.current[index] + count + direction) % count;
    images.style.transform = `translate3d(-${imgWidth * storyImageIndex.current[index]
      }px, 0, 0)`;
  };

  useEffect(() => {
    const category = categoriesRef.current[activeCategory];
    if (!category) return;

    const images = category.querySelector<HTMLDivElement>(".story-images");
    if (!images) return;

    const count = images.childElementCount;
    const imgWidth = images.clientWidth / count;

    const updateProgressBar = () => {
      const activeIndex = storyImageIndex.current[activeCategory];
      const activeTip = document.getElementById(
        `tip-${activeCategory}-${activeIndex}`
      );
      if (activeTip) {
        activeTip.style.transition = "width 1.8s linear"; // Re-enable transition
        activeTip.style.width = "100%"; // Start the animation
      }
    };

    const resetProgressBar = () => {
      const activeIndex = storyImageIndex.current[activeCategory];
      const activeTip = document.getElementById(
        `tip-${activeCategory}-${activeIndex}`
      );

      if (activeTip) {
        activeTip.style.transition = "none"; // Temporarily disable transition
        activeTip.style.width = "0"; // Reset width to 0
      }
    };

    const slideRight = () => {
      resetProgressBar();
      slide(images, imgWidth, count, activeCategory, 1);
      updateProgressBar();
    };

    // Initial update
    updateProgressBar();

    intervalRef.current = setInterval(slideRight, 1800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      resetProgressBar();
    };
  }, [activeCategory]);

  return (
    <div className="stories-container flex">
      {DATA.map((category, index) => (
        <div
          key={category.name}
          className={`story-wrapper overflow-hidden relative flex rounded-lg ${activeCategory === index ? "bg-red-700" : "bg-gray-700"
            }`}
          ref={(el) => {
            if (el) categoriesRef.current[index] = el;
          }}
          onClick={() => setActiveCategory(index)}
        >
          {/* Images Carousel */}
          <div className="w-max flex story-images transition-all">
            {category.images.map((image, i) => (
              <div key={i} className="story">
                <img
                  className="w-full h-full object-contain object-center"
                  src={image.url}
                  alt={`Story ${i}`}
                />
              </div>
            ))}
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between" >
            {/* Header */}
            <div className="w-full">
              <div className="flex items-center gap-2">
                <img
                  className="w-10 aspect-square rounded-full object-cover border-white border-2"
                  src={category.icon}
                  alt={category.name}
                />
                <span>{category.name}</span>
              </div>
              <ul
                className="tips-container mt-4 w-full grid gap-2 items-center justify-center"
                style={{
                  gridTemplateColumns: `repeat(${category.images.length}, 1fr)`,
                }}
              >
                {category.images.map((_, i) => (
                  <li
                    key={i}
                    className="w-full h-1 bg-gray-300 rounded-md"
                  >

                    <div

                      id={`tip-${index}-${i}`}
                      className="story-tip w-0 h-full bg-purple-600 rounded-md"
                    >

                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2">
              <div>Total Stories: {category.images.length}</div>
              <div>
                Likes: {category.images.reduce((sum, img) => sum + img.likes, 0)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stories;

