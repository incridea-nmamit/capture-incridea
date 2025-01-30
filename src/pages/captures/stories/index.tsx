import React from 'react';
import { useEffect, useState } from "react";
import EmblaCarousel from "~/components/EmblaCarousel";
import TitleDescription from "~/components/TitleDescription";
import StoriesComponent from "~/components/StoryComponent";

const Stories = () => {
  const storyData = [
    {
      url: 'https://media.istockphoto.com/id/1572191360/video/night-sky-and-stars-above-the-treetop.mp4?s=mp4-640x640-is&k=20&c=pwHZB_suFC8hIFwIEIZrfqtHPUXLkRB-VqOazhnW83E=',
      type: 'video',
      header: {
        heading: 'Nature',
        subheading: 'Captured By: Incridia',
        profileImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      autoPlay: false
    },
    {
      url: 'https://media.istockphoto.com/id/1704369861/video/downy-woodpecker-close-up-video-short.mp4?s=mp4-640x640-is&k=20&c=4RouE6nqj-6mWliDxdVYuRrILA8JUteQmNGeW8M21k0=',
      type: 'video',
      header: {
        heading: 'Nature',
        subheading: 'Captured By: Incridia',
        profileImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      autoPlay: false
    },
    {
      url: 'https://media.istockphoto.com/id/1297447329/video/vertical-format-footage-of-a-beautiful-female-scientist-looking-into-the-microscope-woman.mp4?s=mp4-640x640-is&k=20&c=xeSIG7ShX801J17z8GRyUy_fQ0-44LN9y64Pq1KfbHY=',
      type: 'video',
      header: {
        heading: 'Science',
        subheading: 'Captured By: Incridia',
        profileImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      autoPlay: false
    },
    {
      url: 'https://media.istockphoto.com/id/2166468006/video/vertical-video-server-hub-teamworking-coworkers-doing-disaster-recovery-planning.mp4?s=mp4-640x640-is&k=20&c=n6IWUC2TU1IgmGPdXm9zPIiQPx8KWPkSlgw5U1SF6GA=',
      type: 'video',
      header: {
        heading: 'Business',
        subheading: 'Captured By: Incridia',
        profileImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      autoPlay: false
    },
    {
      url: 'https://media.istockphoto.com/id/1742796178/video/vertical-video-media-star-films-digital-tablet-review.mp4?s=mp4-640x640-is&k=20&c=igLDnDXvJ9Q1jPDIHY-SpvzL7uJrkWsAlkO7cEarigI=',
      type: 'video',
      header: {
        heading: 'Business',
        subheading: 'Captured By: Incridia',
        profileImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      autoPlay: false
    },
    // Add more story data here along with Cateogry Name(heading) to Merge them, and the slides will automatically update
  ];

  // Step 1: Group slides by heading
  const groupedStories = storyData.reduce((acc, story) => {
    const heading = story.header.heading;

    if (!acc[heading]) {
      acc[heading] = [];
    }

    acc[heading].push(story);

    return acc;
  }, {} as Record<string, typeof storyData>); // TypeScript: Record<string, StoryData[]>

  // Dynamically generate slides based on storyData
  const slides = Object.entries(groupedStories).map(([heading, stories]) => (
    <StoriesComponent key={heading} storyData={stories} />
  ));


  return (
    <div className="mt-20 gradient-bg h-full w-full  ">
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