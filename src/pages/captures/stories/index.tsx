import React from 'react';
import EmblaCarousel from "~/components/EmblaCarousel";
import TitleDescription from "~/components/TitleDescription";
import StoryViewer  from "~/components/StoryComponent";
import { stories } from "~/components/StoryComponent";

const Stories = () => {
  // Step 1: Group stories by category
  const groupedStories = stories.reduce((acc, story) => {
    const category = story.category;

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(story);

    return acc;
  }, {} as Record<string, typeof stories[0][]>);

  // Step 2: Convert grouped stories into slides for the carousel
  const slides = Object.entries(groupedStories).map(([category, userStories]) => (
    <div key={category} className="w-full h-full">
      <StoryViewer key={category} userStories={userStories} />
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
        <EmblaCarousel slides={slides} />
      </div>
    </div>
  );
};

export default Stories;