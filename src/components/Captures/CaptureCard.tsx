import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./carousel.module.css";
import { carouselItems } from "../constants/data";
import { ArrowLeftCircle, ArrowRightCircle, Lock } from "lucide-react"; // Import the Lock icon
import { Button } from "../ui/button";
import { api } from "~/utils/api";

const CaptureCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [emblaRef, embla] = useEmblaCarousel({});
  const { data: cardStates, isLoading, refetch } = api.capturecard.getCards.useQuery();

  const [thumbnailEmblaRef, thumbnailEmbla] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: "center",
  });

  const sortedCards = carouselItems.map((carouselItems) => {
    const cardState = cardStates?.find((state) => state.cardName === carouselItems.title);
    return {
      ...carouselItems,
      cardState: cardState?.cardState,
    };
  });

  const handleNext = () => {
    setActiveIndex((prev) => {
      const nextIndex = (prev + 1) % carouselItems.length;
      if (thumbnailEmbla) thumbnailEmbla.scrollTo(nextIndex);
      return nextIndex;
    });
    resetTimeout();
    if (embla) embla.scrollNext();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => {
      const prevIndex = (prev - 1 + carouselItems.length) % carouselItems.length;
      if (thumbnailEmbla) thumbnailEmbla.scrollTo(prevIndex);
      return prevIndex;
    });
    resetTimeout();
    if (embla) embla.scrollPrev();
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      timeoutRef.current = setTimeout(handleNext, 7000);
    }
    return () => resetTimeout();
  }, [activeIndex, autoPlay]);

  useEffect(() => {
    if (embla) {
      embla.on("select", () => setActiveIndex(embla.selectedScrollSnap()));
    }
  }, [embla]);

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    if (embla) embla.scrollTo(index);
    if (thumbnailEmbla) thumbnailEmbla.scrollTo(index);
  };

  return (
    <div className={styles.carousel}>
      {/* Main Page Carousel */}
      <div className={styles.list}>
        {sortedCards.map((item, index) => (
          <div
            key={index}
            className={`${styles.item} ${index === activeIndex ? styles.active : ""}`}
            style={{ transform: `translateX(${-100 * activeIndex}%)` }}
          >
            <div className={styles.imageWrapper}>
              <Image src={item.imgSrc} alt={`Slide ${index + 1}`} fill className={`${styles.image} ${!item.cardState ? styles.grayscale : ""}`} priority={index === activeIndex} />
            </div>
            <div className={styles.content}>
              <div className={styles.textContent}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.description}>{item.description}</div>
              </div>
              <Button onClick={() => (window.location.href = `/captures/${item.route}`)} className={`${styles.ctaButton} ${!item.cardState ? styles.hide : ""}`}>
                Enter
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Thumbnail Component */}
      <div className={styles.thumbnailContainer} ref={thumbnailEmblaRef}>
        <div className={styles.thumbnailTrack}>
          {sortedCards.map((thumb, index) => (
            <div
              key={index}
              className={`${styles.thumbnailSlide} ${index === activeIndex ? styles.activeThumbnail : ""}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className={`${styles.thumbnailImageWrapper} ${!thumb.cardState ? styles.grayscale : ""}`}>
                <Image src={thumb.imgSrc} alt={`Thumbnail ${index + 1}`} fill className={styles.thumbnailImage} />
                {/* Render the padlock icon if the item is greyscaled */}
                {!thumb.cardState && (
                  <div className={styles.lockIcon}>
                    <Lock size={24} color="white" />
                  </div>
                )}
              </div>
              <div className={styles.thumbnailOverlay}>
                <div className={styles.thumbnailTitle}>{thumb.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Left and Right buttons */}
      <div className={styles.controls_l}>
        <button className={styles.controlButton} onClick={handlePrev} aria-label="Previous slide">
          <ArrowLeftCircle size={40} />
        </button>
      </div>

      <div className={styles.controls_r}>
        <button className={styles.controlButton} onClick={handleNext} aria-label="Next slide">
          <ArrowRightCircle size={40} />
        </button>
      </div>
    </div>
  );
};

export default CaptureCard;