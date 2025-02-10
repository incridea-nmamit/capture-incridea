/**
 * Advanced carousel component with smooth transitions
 * Features:
 * - Scale and blur animations
 * - Navigation controls
 * - Auto-loop functionality
 * - Responsive design
 */

import React, { useCallback, useEffect, useRef, forwardRef } from 'react';
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons';
import { Share,Download,Heart } from "lucide-react";

const TWEEN_FACTOR_BASE = 0.5;

/**
 * Constrains a number within specified range
 */
const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

interface PropType {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  onSlideChange?: (index: number) => void;  // Add this prop
}

const EmblaCarousel = forwardRef<EmblaCarouselType, PropType>((props, ref) => {
  const { slides, options = { loop: true }, onSlideChange } = props;
  
  // Carousel state and refs
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  // Forward the API methods through the ref
  React.useImperativeHandle(ref, () => emblaApi || ({} as EmblaCarouselType), [emblaApi]);

  // Navigation button handlers
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  /**
   * Sets up animation nodes for transitions
   */
  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__content') as HTMLElement; // Changed to target custom content
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  /**
   * Handles slide transition animations
   * - Applies scale and blur effects
   * - Handles loop transitions
   */
  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === 'scroll';
  
      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];
  
        // Check if slidesInSnap is defined before iterating
        if (slidesInSnap) {
          slidesInSnap.forEach((slideIndex) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return;
  
            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem) => {
                const target = loopItem.target();
  
                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);
  
                  if (sign === -1) {
                    diffToTarget = scrollSnap - (1 + scrollProgress);
                  }
                  if (sign === 1) {
                    diffToTarget = scrollSnap + (1 - scrollProgress);
                  }
                }
              });
            }
  
            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const scale = numberWithinRange(tweenValue, 0, 1).toString();
  
            // Calculate blur based on tweenValue
            const blurValue = 8 * (1 - tweenValue); // 8px blur when tweenValue is 0, 0px blur when tweenValue is 1
            const blur = `blur(${blurValue}px)`;
  
            const tweenNode = tweenNodes.current[slideIndex];
            if (tweenNode) {
              // Apply scaling and blur effects
              tweenNode.style.transform = `scale(${scale})`;
              tweenNode.style.filter = blur;
            }
          });
        }
      });
    },
    []
  );
  
  // Effect for carousel initialization
  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi.on('select', () => {
      const currentIndex = emblaApi.selectedScrollSnap();
      onSlideChange?.(currentIndex);
    });

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale);
  }, [emblaApi, tweenScale, onSlideChange]);

  return (
    <div className="embla h-full">
      <div className="embla__viewport " ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              
              <div className="embla__slide__content">{slide}</div> {/* Wrap custom content in a div for tweening */}
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
});

export default EmblaCarousel;
