import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import style from "./corousel.module.css";
import CenteredLoader from "../LoadingAnimation/CameraLoading";

interface CarouselItem {
  id: number;
  image: string;
  author: string;
  title: string;
  topic: string;
  description: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlayInterval = 7000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timeRunning = 3000;
  const autoNextRef = useRef<NodeJS.Timeout>();

  const showSlider = (type: "next" | "prev") => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    carousel.classList.add(type);

    setTimeout(() => {
      carousel.classList.remove(type);
      setCurrentIndex((prevIndex) => {
        if (type === "next") {
          return (prevIndex + 1) % items.length;
        } else {
          return prevIndex === 0 ? items.length - 1 : prevIndex - 1;
        }
      });
    }, timeRunning);

    if (autoNextRef.current) {
      clearTimeout(autoNextRef.current);
    }
    autoNextRef.current = setTimeout(() => {
      showSlider("next");
    }, autoPlayInterval);
  };

  useEffect(() => {
    autoNextRef.current = setTimeout(() => {
      showSlider("next");
    }, autoPlayInterval);

    return () => {
      if (autoNextRef.current) {
        clearTimeout(autoNextRef.current);
      }
    };
  }, [autoPlayInterval]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <CenteredLoader />;
  }

  const currentItem = items[currentIndex];
  const thumbnails = [
    ...items.slice(currentIndex),
    ...items.slice(0, currentIndex),
  ];

  return (
    <div className={style.carousel} ref={carouselRef}>
      <div className={style.list}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className={style.item}
            style={{ zIndex: index === currentIndex ? 1 : 0 }}
          >
            <div className={style.imageWrapper}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority={index === currentIndex}
                className={style.image}
                sizes="100vw"
                quality={90}
              />
            </div>
            <div className={style.content}>
              <div className={style.author}>{item.author}</div>

              <div className={style.topic}>{item.topic}</div>
              <div className={style.des}>{item.description}</div>
              <div className={style.buttons}>
                <button>SEE MORE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className={style.thumbnail}>
        {thumbnails.map((item) => (
          <div key={item.id} className={style.item}>
        <div className={style.imageWrapper}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className={style.image}
            sizes="150px"
          />
        </div>
        <div className={style.content}>
          <div className={style.title}>{item.title}</div>
        </div>
          </div>
        ))}
      </div> */}

      <div className={style.thumbnail}>
        {thumbnails.slice(0, 4).map((item) => (
          <div key={item.id} className={style.item}>
            <div className={style.imageWrapper}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={style.image}
                sizes="150px"
              />
            </div>
            <div className={style.content}>
              <div className={style.title}>{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={style.arrows}>
        <button id="prev" onClick={() => showSlider("prev")}>
          {"<"}
        </button>
        <button id="next" onClick={() => showSlider("next")}>
          {">"}
        </button>
      </div>

      <div className={style.time}></div>
    </div>
  );
};

export default Carousel;
