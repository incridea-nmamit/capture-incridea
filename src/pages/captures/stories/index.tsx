'use client';

import React, { useCallback, useRef, useState } from 'react';
import EmblaCarousel from "~/components/EmblaCarousel";
import TitleDescription from "~/components/TitleDescription";
import StoryViewer  from "~/components/StoryComponent";
import { stories } from "~/components/StoryComponent";

const Stories: React.FC = () => {
  const carouselRef = useRef<any>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [autoplaying, setAutoplaying] = useState(true);  // Add this state
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Step 1: Group stories by category
  const groupedStories = stories.reduce((acc, story) => {
    const category = story.category;

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(story);

    return acc;
  }, {} as Record<string, typeof stories[0][]>);

  const categoryKeys = Object.keys(groupedStories);

  // More robust reset function that strictly controls video playback
  const resetOtherCategories = useCallback((activeCategory: string) => {
    Object.entries(groupedStories).forEach(([category, _]) => {
      if (category !== activeCategory) {
        const storyElement = document.querySelector(`[data-category="${category}"]`);
        const videos = storyElement?.getElementsByTagName('video');
        if (videos) {
          Array.from(videos).forEach(video => {
            video.pause();
            video.currentTime = 0;
            // Ensure video doesn't autoplay when inactive
            video.removeAttribute('autoplay');
            // Add a flag to mark as inactive
            video.dataset.inactive = 'true';
          });
        }
      }
    });
  }, [groupedStories]);

  const activateCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setAutoplaying(true);
    resetOtherCategories(category);
  }, [resetOtherCategories]);

  const handleNextCategory = useCallback(() => {
    const nextIndex = (currentCategoryIndex + 1) % categoryKeys.length;
    carouselRef.current?.scrollTo(nextIndex);
    setCurrentCategoryIndex(nextIndex);
    setAutoplaying(true);
    const nextCategory = categoryKeys[nextIndex];
    if (nextCategory) {
      activateCategory(nextCategory);
    }
  }, [currentCategoryIndex, categoryKeys, carouselRef, activateCategory]);

  const handlePrevCategory = useCallback(() => {
    const prevIndex = (currentCategoryIndex - 1 + categoryKeys.length) % categoryKeys.length;
    carouselRef.current?.scrollTo(prevIndex);
    setCurrentCategoryIndex(prevIndex);
    setAutoplaying(true);
    const prevCategory = categoryKeys[prevIndex];
    if (prevCategory) {
      activateCategory(prevCategory);
    }
  }, [currentCategoryIndex, categoryKeys, activateCategory]);

  const handleSlideChange = useCallback((index: number) => {
    const newCategory = categoryKeys[index];
    setCurrentCategoryIndex(index);
    if (newCategory) {
      activateCategory(newCategory);
    }
  }, [categoryKeys, activateCategory]);

  // Replace existing handleCategoryChange
  const handleCategoryChange = useCallback((category: string) => {
    activateCategory(category);
  }, [activateCategory]);

  const slides = Object.entries(groupedStories).map(([category, userStories]) => (
    <div key={category} className="w-full h-full" data-category={category}>
      <StoryViewer 
        key={category} 
        userStories={userStories} 
        onComplete={handleNextCategory}  // This will trigger category change after 5 seconds
        onPrevCategory={handlePrevCategory}
        autoplay={autoplaying}  // Pass autoplay prop to StoryViewer
        onPauseChange={(paused) => setAutoplaying(!paused)}  // Track pause state
        isActive={category === activeCategory}
        onActivate={() => handleCategoryChange(category)}
        shouldPlay={category === activeCategory} // Add this new prop
        resetOnActivate={true}
      />
    </div>
  ));

  return (
    <div className="gradient-bg h-full w-full">
      <div className="md:mt-40 mt-10 ">
        <h1 className="text-3xl md:text-4xl font-Trap-Black text-white text-center my-5">
          Stories
        </h1>
        <div className="flex   justify-center mb-10 ">
          <p className=" text-justify md:text-center text-gray-400 mb-5 w-3/4">Small Description</p>
        </div>
      </div>
      <div className="mt-20">
        <EmblaCarousel 
          slides={slides} 
          ref={carouselRef} 
          onSlideChange={handleSlideChange}
        />
      </div>
    </div>
  );
};

export default Stories;