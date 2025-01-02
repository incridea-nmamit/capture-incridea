import React, { useEffect } from 'react';
import FallingClipart from "../BackgroundFallAnimation/FallingClipart";
import CapturePageCard from "./CapturePageCard";
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';

const CapturesComponent = () => {
  const { data: cardStates, isLoading, refetch } = api.capturecard.getCards.useQuery();

  const cards = [
    {
      title: "Events",
      description: "Dive into a thrilling world of exciting events and competitions, tailored for every interest, at Incridea!",
      imagePath: "https://utfs.io/f/0yks13NtToBisuc2TRDHAqmhaYxQMr6etE8LJcNUg1TR9Bpj",
      link: "/captures/events",
      priority: 1,
    },
    {
      title: "Pronite",
      description: "Brace yourselves for an electrifying night of live performances by some of the biggest stars in entertainment!",
      imagePath: "https://utfs.io/f/0yks13NtToBitJchJ4NSCB2X9TSlbJxWYgG6rpN3n8swf4Fz",
      link: "/captures/pronite",
      priority: 2,
    },
    {
      title: "Abode of Memories",
      description: "The memories all so sweet, with moments cherished for life. Here lies the moments cherished with ones we love to cross paths by",
      imagePath: "https://utfs.io/f/0yks13NtToBiJ2v3kqw4BLygFdW15xChAKiDEleRHcja6tkI",
      link: "/captures/your-snaps",
      priority: 3,
    },
    {
      title: "Behind Incridea",
      description: "Explore the behind-the-scenes moments.",
      imagePath: "https://utfs.io/f/0yks13NtToBiR2RImlGmqjGOIgx47y3cAJSCbQ1V82Nitrsf",
      link: "/captures/behindincridea",
      priority: 4,
    },
    {
      title: "Cultural",
      description: "Feast your eyes to the glorious display of traditional brilliance paired alongside the glitzy, modern era",
      imagePath: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4",
      link: "/captures/cultural",
      priority: 5,
    },
    {
      title: "Stories",
      description: "Stories captured for you",
      imagePath: "https://utfs.io/f/0yks13NtToBiNNw4AKjzD2wWm5AylYHcVfipk40e8O9RubFS",
      link: "/captures/stories",
      priority: 5,
    },
    {
      title: "Flashmobs",
      description: "Hop in to watch the teasers for the events that fly by during the buildup to Incridea '25",
      imagePath: "https://utfs.io/f/0yks13NtToBiNNw4AKjzD2wWm5AylYHcVfipk40e8O9RubFS",
      link: "/captures/flashmobs",
      priority: 5,
    },
    {
      title: "Cultural Playbacks",
      description: "Stories captured for you",
      imagePath: "https://utfs.io/f/0yks13NtToBiNNw4AKjzD2wWm5AylYHcVfipk40e8O9RubFS",
      link: "/captures/cultural-playbacks",
      priority: 5,
    },
  ];

  // Set up a useEffect to refetch data when the component mounts
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) return <CameraLoading/>;

  // Map cardStates to match cards and add cardState and cardRtime to each card
  const sortedCards = cards
    .map((card) => {
      const cardState = cardStates?.find((state) => state.cardName === card.title);
      return {
        ...card,
        cardState: cardState?.cardState,
      };
    })
    // Sort: active cards first (by priority), then inactive cards (also by priority)
    .sort((a, b) => {
      if (a.cardState === "active" && b.cardState !== "active") return -1;
      if (a.cardState !== "active" && b.cardState === "active") return 1;
      return a.priority - b.priority;
    });

  return (
    <div>
      <FallingClipart />
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start p-8 z-30"
      >
        <h1 className="text-6xl md:text-6xl text-white font-GoldleafBold mb-5 z-30">Captures</h1>
        <p className="text-lg text-center max-w-3xl text-gray-400 mb-12 z-20 font-Trap-Regular">
        A picture is worth a thousand words, that’s why we let our captures do the talking. 
        Explore the moments showcasing the best of our techno-cultural fest.
        Relive the highlights and immerse yourself in the spirit of our college community as we celebrate the unforgettable moments that make Incridea truly special!
        </p>

        <div className="flex flex-col md:px-28 md:flex-row gap-12 flex-wrap justify-center z-30">
          {sortedCards.map((card, index) => (
            <CapturePageCard
              key={index}
              title={card.title}
              description={card.description}
              imagePath={card.imagePath}
              link={card.link}
              cardState={card.cardState}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CapturesComponent;
