'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  onComplete?: () => void;
  onNextCategory?: () => void;
  onPrevCategory?: () => void;
  autoplay?: boolean;
  onPauseChange?: (paused: boolean) => void;
  isActive?: boolean;
  onActivate?: () => void;
  shouldPlay?: boolean;
  resetOnActivate?: boolean;
}

export const stories: Story[] = [
  {
    id: 1,
    category: 'Pronite',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    media: 'https://media.istockphoto.com/id/1297447329/video/vertical-format-footage-of-a-beautiful-female-scientist-looking-into-the-microscope-woman.mp4?s=mp4-640x640-is&k=20&c=xeSIG7ShX801J17z8GRyUy_fQ0-44LN9y64Pq1KfbHY=',
    mediaType: 'video',
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
    id: 6,
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    media: 'https://media.istockphoto.com/id/1297447329/video/vertical-format-footage-of-a-beautiful-female-scientist-looking-into-the-microscope-woman.mp4?s=mp4-640x640-is&k=20&c=xeSIG7ShX801J17z8GRyUy_fQ0-44LN9y64Pq1KfbHY=',
    mediaType: 'video',
    timestamp: '6h',
    capturedBy: 'Varshith',
    duration: 5,
  },
];

export default function StoryViewer({ 
  userStories, 
  onComplete, 
  onNextCategory, 
  onPrevCategory,
  autoplay = true,
  onPauseChange,
  isActive = false,
  onActivate,
  shouldPlay = false,
  resetOnActivate = false,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<number[]>(userStories.map(() => 0));
  const [isPaused, setIsPaused] = useState(false); // Change initial state to false
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();
  const elapsedRef = useRef<number>(0);

  const currentStory = userStories[currentIndex]; // Now cycles only through the selected user's stories

  const handleTouchStart = () => {
    if (!isActive) {
      onActivate?.();
      return;
    }
    setIsPaused(true);
    onPauseChange?.(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    onPauseChange?.(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeStory = async () => {
      if (!currentStory) return;
      
      // Reset everything on story change
      elapsedRef.current = 0;
      
      if (currentStory.mediaType === 'video' && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play(); // Auto-play video
      }
      
      // Always start playing immediately for both images and videos
      setIsPaused(false);
      startProgress();
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
  }, [currentIndex, currentStory]);

  useEffect(() => {
    if (autoplay) {
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  }, [autoplay]);

  // Add effect to handle active state changes
  useEffect(() => {
    if (!isActive || !shouldPlay) {
      // Force pause and reset when not active
      setIsPaused(true);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.removeAttribute('autoplay');
      }
      elapsedRef.current = 0;
      setCurrentIndex(0);
      setProgress(userStories.map(() => 0));
    } else if (shouldPlay) {
      // Only play if explicitly allowed
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          setIsPaused(true);
        });
      }
      startProgress();
    }
  }, [isActive, shouldPlay, userStories.length]);

  // Add effect to handle video state when component becomes inactive
  useEffect(() => {
    if (!isActive) {
      // Reset all state when becoming inactive
      setIsPaused(true);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      elapsedRef.current = 0;
      setCurrentIndex(0);
      setProgress(userStories.map(() => 0));
    }
  }, [isActive, userStories.length]);

  useEffect(() => {
    if (isActive && resetOnActivate) {
      setCurrentIndex(0);
      elapsedRef.current = 0;
      setProgress(userStories.map(() => 0));
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      startProgress();
    }
  }, [isActive, resetOnActivate, userStories]);

  const startProgress = () => {
    if (!currentStory) return;

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    // Always use 5 seconds duration for both images and videos
    const duration = 5;
    const interval = 50; // Smaller interval for smoother animation

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
          } else {
            // Always call onComplete after 5 seconds
            onComplete?.();
          }
        }
      }
    }, interval);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < userStories.length - 1) {
      // Move to the next clip within the same category
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      elapsedRef.current = 0;
      setCurrentIndex(prev => prev + 1);
      startProgress(); // Restart progress for the new clip
    } else {
      // We're at the last clip of the category, move to the next category
      onComplete?.(); // Use onComplete instead of onNextCategory
    }
  }, [currentIndex, userStories.length, onComplete]);

  const handlePrevious = () => {
    if (!isActive) {
      onActivate?.();
      return;
    }
    if (currentIndex > 0) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      elapsedRef.current = 0;
      setCurrentIndex(prev => prev - 1);
    } else {
      // If we're at the first story, trigger category change
      onPrevCategory?.();
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
      <div 
        className="rounded-2xl overflow-hidden shadow-2xl relative"
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Touch zones for navigation */}
        <div className="absolute inset-0 z-20 flex">
          <div 
            className="w-1/2 h-full cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
          />
          <div 
            className="w-1/2 h-full cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />
        </div>

        {currentStory.mediaType === 'image' ? (
          <img
            src={currentStory.media}
            alt="Story"
          />
        ) : (
          <video
            ref={videoRef}
            src={currentStory.media}
            className={cn("object-cover", !isActive && "opacity-70")}
            playsInline
            muted
            preload="auto"
            autoPlay={shouldPlay}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
            data-active={isActive}
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

        {/* Move the navigation buttons below the touch zones in the DOM but keep them visually on top */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-opacity z-30",
            currentIndex === 0 ? "opacity-0" : "opacity-100"
          )}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-opacity z-30",
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
