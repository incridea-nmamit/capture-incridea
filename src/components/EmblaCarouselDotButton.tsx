/**
 * Carousel pagination dots component
 * Features:
 * - Dynamic dot generation
 * - Active state tracking
 * - Click navigation
 */

import React, {
    ComponentPropsWithRef,
    useCallback,
    useEffect,
    useState
  } from 'react'
  import { EmblaCarouselType } from 'embla-carousel'
  
  type UseDotButtonType = {
    selectedIndex: number
    scrollSnaps: number[]
    onDotButtonClick: (index: number) => void
  }
  
  /**
   * Hook for managing dot button state and interactions
   */
  export const useDotButton = (
    emblaApi: EmblaCarouselType | undefined,
    onButtonClick?: (emblaApi: EmblaCarouselType) => void
  ): UseDotButtonType => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  
    const onDotButtonClick = useCallback(
      (index: number) => {
        if (!emblaApi) return
        emblaApi.scrollTo(index)
        if (onButtonClick) onButtonClick(emblaApi)
      },
      [emblaApi, onButtonClick]
    )
  
    const onInit = useCallback((emblaApi: EmblaCarouselType) => {
      setScrollSnaps(emblaApi.scrollSnapList())
    }, [])
  
    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [])
  
    useEffect(() => {
      if (!emblaApi) return
  
      onInit(emblaApi)
      onSelect(emblaApi)
  
      emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onInit, onSelect])
  
    return {
      selectedIndex,
      scrollSnaps,
      onDotButtonClick
    }
  }
  
  type PropType = ComponentPropsWithRef<'button'>
  
  /**
   * Individual dot button component
   */
  export const DotButton: React.FC<PropType> = (props) => {
    const { children, ...restProps } = props
  
    return (
      <button type="button" {...restProps}>
        {children}
      </button>
    )
  }
