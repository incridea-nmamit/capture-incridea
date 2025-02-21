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
      <TitleDescription
        title="Stories"
        description="Capturing community's essence through strategic social media interactions"
        imagePath="https://utfs.io/f/0yks13NtToBitJchJ4NSCB2X9TSlbJxWYgG6rpN3n8swf4Fz"
      />
      <div className="mt-20">
        <EmblaCarousel slides={slides} />
      </div>
    </div>
  );
};

export default Stories;