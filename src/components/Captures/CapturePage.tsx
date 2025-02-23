import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./carousel.module.css";
import { carouselItems } from "../constants/data";
import { ChevronLeftCircle, ChevronRightCircle, Lock } from "lucide-react"; // Import the Lock icon
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import ShinyText from "./ShinyText"; // Import the ShinyText component
import { useSession } from "next-auth/react";

/**
 * CaptureCard Component
 * Interactive carousel display for capture categories
 * Features:
 * - Auto-playing carousel
 * - Thumbnail navigation
 * - Lock/unlock states for categories
 * - Responsive controls
 */

const CaptureCard = () => {
  /**
   * State management for carousel
   */

  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    containScroll: "trimSnaps",
    direction: 'ltr'
  });
  const {
    data: cardStates,
    isLoading,
    refetch,
  } = api.capturecard.getCards.useQuery();
  const { data: session, status } = useSession();
  const [thumbnailEmblaRef, thumbnailEmbla] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: "center",
  });

  const sortedCards = carouselItems.map((carouselItem) => {
    const cardState = session?.user?.role === "admin" ? true : 
      cardStates?.find((state) => state.cardName === carouselItem.title)
        ?.cardState ?? true; // Default to true if cardState is undefined

    return {
      ...carouselItem,
      cardState,
    };
  });

  /**
   * Carousel control functions
   */
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
      const prevIndex =
        (prev - 1 + carouselItems.length) % carouselItems.length;
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

  /**
   * Auto-play management
   */
  useEffect(() => {
    if (autoPlay) {
      timeoutRef.current = setTimeout(handleNext, 9000);
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

  /**
   * Touch and scroll event handlers
   */
  const handleScroll = (event: Event) => {
    const wheelEvent = event as WheelEvent;
    if (wheelEvent.deltaX > 0) {
      handleNext();
    } else if (wheelEvent.deltaX < 0) {
      handlePrev();
    }
  };

  useEffect(() => {
    const carouselElement = document.querySelector(`.${styles.list}`);
    if (carouselElement) {
      carouselElement.addEventListener('wheel', handleScroll as EventListener);
      return () => {
        carouselElement.removeEventListener('wheel', handleScroll as EventListener);
      };
    }
  }, []);

  return (
    <div className="bg-secondary">
      <div className={styles.carousel}>
        {/* Main Page Carousel */}
        <div className={styles.list}>
          {/* Add touch zones */}
          <div 
            className={`${styles.touchZone} ${styles.touchZoneLeft}`}
            onClick={handlePrev}
            aria-label="Previous slide"
          />
          <div 
            className={`${styles.touchZone} ${styles.touchZoneRight}`}
            onClick={handleNext}
            aria-label="Next slide"
          />
          
          {sortedCards.map((item, index) => (
            <div
              key={index}
              className={`${styles.item} ${index === activeIndex ? styles.active : ""}`}
              style={{ transform: `translateX(${-100 * activeIndex}%)` }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={item.imgSrc}
                  alt={`Slide ${index + 1}`}
                  fill
                  className={`${styles.image} ${!item.cardState ? styles.grayscale : ""}`}
                  priority={index === activeIndex}
                />
              </div>
              <div className={styles.content}>
                <div className={styles.textContent}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.description}>{item.description}</div>
                </div>

                <Button
                  onClick={() =>
                    (window.location.href = `/captures/${item.route}`)
                  }
                  className={`relative m-3 rounded-3xl border border-white/20 bg-white/10 px-20 py-6 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-xl ${!item.cardState ? "hidden" : ""} before:animate-shine before:absolute before:inset-0 before:rounded-3xl before:border-[2px] before:border-transparent before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-10 hover:before:opacity-5`}
                >
                  <ShinyText
                    text="Enter"
                    disabled={false}
                    speed={5}
                    className="custom-class"
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Thumbnail Component */}
        <div className={styles.thumbnailContainer} ref={thumbnailEmblaRef}>
          <div className={styles.thumbnailTrack}>
            {sortedCards.map((item, index) => (
              <div
                key={index}
                className={`${styles.thumbnailSlide} ${index === activeIndex ? styles.activeThumbnail : ""}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <div
                  className={`${styles.thumbnailImageWrapper} ${!item.cardState ? styles.grayscale : ""}`}
                >
                  <Image
                    src={item.imgSrc}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className={styles.thumbnailImage}
                  />
                  {/* Render the padlock icon if the item is greyscaled */}
                  {!item.cardState && (
                    <div className={styles.lockIcon}>
                      <Lock size={24} color="white" />
                    </div>
                  )}
                </div>
                <div className={styles.thumbnailOverlay}>
                  <div className={styles.thumbnailTitle}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Add navigation instructions */}
        <div className={styles.navigationText}>
          Tap on the sides of the screen to navigate
        </div>
        
        {/* Left and Right buttons */}
        <div className={styles.controls_l}>
          <button
            className={styles.controlButton}
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <ChevronLeftCircle size={40} />
          </button>
        </div>

        <div className={styles.controls_r}>
          <button
            className={styles.controlButton}
            onClick={handleNext}
            aria-label="Next slide"
          >
            <ChevronRightCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptureCard;
