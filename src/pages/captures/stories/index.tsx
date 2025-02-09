import React from 'react';
import EmblaCarousel from "~/components/EmblaCarousel";
import TitleDescription from "~/components/TitleDescription";
import StoryViewer  from "./Story";
import { stories } from "./Story";

const Stories = () => {
  // Step 1: Group stories by username
  const groupedStories = stories.reduce((acc, story) => {
    const username = story.username;

    if (!acc[username]) {
      acc[username] = [];
    }

    acc[username].push(story);

    return acc;
  }, {} as Record<string, typeof stories[0][]>);

  // Step 2: Convert grouped stories into slides for the carousel
  const slides = Object.entries(groupedStories).map(([username, userStories]) => (
    <div key={username} className="w-full h-full">
      <StoryViewer key={username} userStories={userStories} />
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