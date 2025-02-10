'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Share, Download, Heart } from "lucide-react";
import { cn } from '../lib/utils';

type MediaType = 'image' | 'video';

interface Story {
  id: number;
  category: string;
  avatar: string;
  media: string;
  mediaType: MediaType;
  timestamp: string;
  capturedBy: string;
  duration?: number;
}

interface StoryViewerProps {
  userStories: Story[];
}

export const stories: Story[] = [
  {
    id: 1,
    category: 'Pronite',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    media: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=2000&fit=crop',
    mediaType: 'image',
    timestamp: '2h',
    capturedBy: 'Shishir',
    duration: 5,
  },
  {
    id: 2,
    category: 'Cultural',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    media: 'https://media.istockphoto.com/id/1297447329/video/vertical-format-footage-of-a-beautiful-female-scientist-looking-into-the-microscope-woman.mp4?s=mp4-640x640-is&k=20&c=xeSIG7ShX801J17z8GRyUy_fQ0-44LN9y64Pq1KfbHY=',
    mediaType: 'video',
    timestamp: '4h',
    capturedBy: 'Umar',
  },
  {
    id: 3,
    category: 'Behind The Scenes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    media: 'https://images.unsplash.com/photo-1682687220067-dced9a881b56?w=1200&h=2000&fit=crop',
    mediaType: 'image',
    timestamp: '6h',
    capturedBy: 'Varshith',
    duration: 5,
  },
];

export default function StoryViewer({ userStories }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<number[]>(userStories.map(() => 0));
  const [isPaused, setIsPaused] = useState(true); // Start paused
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();
  const elapsedRef = useRef<number>(0);

  const currentStory = userStories[currentIndex]; // Now cycles only through the selected user's stories


  useEffect(() => {
    let mounted = true;

    const initializeStory = async () => {
      if (!currentStory) return; // Guard clause to handle undefined currentStory
      if (currentStory.mediaType === 'video' && videoRef.current) {
        videoRef.current.currentTime = 0;
        setIsPaused(true); // Start paused for videos
      }
      if (mounted) {
        elapsedRef.current = 0;
        startProgress();
      }
    };

    initializeStory();

    return () => {
      mounted = false;
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [currentIndex, currentStory]); // Add currentStory to dependency array

  const startProgress = () => {
    if (!currentStory) return; // Guard clause to handle undefined currentStory

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const duration = currentStory.mediaType === 'video' 
      ? videoRef.current?.duration || 0 
      : currentStory.duration || 5;

    const interval = 100;

    progressInterval.current = setInterval(() => {
      if (!isPaused) {
        elapsedRef.current += interval;
        const percentage = Math.min((elapsedRef.current / (duration * 1000)) * 100, 100);
        
        setProgress(prev => {
          const newProgress = [...prev];
          newProgress[currentIndex] = percentage;
          return newProgress;
        });

        if (percentage >= 100) {
          clearInterval(progressInterval.current);
          if (currentIndex < userStories.length - 1) {
            handleNext();
          }
        }
      }
    }, interval);
  };

  const handleNext = () => {
    if (currentIndex < userStories.length - 1) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      elapsedRef.current = 0;
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      elapsedRef.current = 0;
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleVideoPlay = () => {
    setIsPaused(false);
  };

  const handleVideoPause = () => {
    setIsPaused(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && currentStory?.mediaType === 'video') {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      const percentage = (currentTime / duration) * 100;
      
      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[currentIndex] = percentage;
        return newProgress;
      });
    }
  };

  if (!currentStory) {
    return <div>No story available.</div>; // Fallback UI if no story is found
  }

  return (
    <div>
    <div className="rounded-2xl overflow-hidden shadow-2xl">
      {currentStory.mediaType === 'image' ? (
        <img
          src={currentStory.media}
          alt="Story"
        />
      ) : (
        <video
          ref={videoRef}
          src={currentStory.media}
          className="object-cover"
          playsInline
          muted
          controls
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNext}
        />
      )}

      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {userStories.map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 bg-gray-500/50 rounded-full overflow-hidden"
          >
            <div
              className={cn(
                "h-full bg-white transition-all duration-100",
                index < currentIndex ? "w-full" : "w-0"
              )}
              style={{
                width: index === currentIndex ? `${progress[index]}%` : index < currentIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-0 right-0 flex flex-col px-4 z-10">
        <div className="flex items-center">
          <img
            src={currentStory.avatar}
            alt={currentStory.category}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <span className="ml-2 text-white font-semibold">{currentStory.category}</span>
          <span className="ml-2 text-white/70 text-sm">{currentStory.timestamp}</span>
        </div>
        <div className="mt-1 text-white/90 text-sm">
          Captured by: {currentStory.capturedBy}
        </div>
      </div>

      <button
        onClick={handlePrevious}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-opacity",
          currentIndex === 0 ? "opacity-0" : "opacity-100"
        )}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={handleNext}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-opacity",
          currentIndex === userStories.length - 1 ? "opacity-0" : "opacity-100"
        )}
        disabled={currentIndex === stories.length - 1}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
    <div className="justify-end flex gap-3 mt-2 pb-4">
        <button>
          <Heart className="text-white" />
        </button>
        <button>
          <Share className="text-white" />
        </button>
        <button>
          <Download className="text-white" />
        </button>
      </div>
      </div>
  );
}
