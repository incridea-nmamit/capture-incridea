/**
 * Instagram-style stories component
 * Features:
 * - Auto-advancing stories
 * - Progress bar
 * - Social interaction buttons
 * - Keyboard navigation
 */

import React from 'react';
import Stories from 'react-insta-stories';
import { Share, Download, Heart } from "lucide-react";

interface Story {
  url: string;
  duration?: number;
  header?: {
    heading: string;
    subheading: string;
    profileImage: string;
  };
}

interface StoriesComponentProps {
  storyData: Story[];
}

const StoriesComponent: React.FC<StoriesComponentProps> = ({ storyData }) => {
  return (
    <div>
      <Stories
        // Story display configuration
        width={'100%'}
        height={'100%'}
        stories={storyData}
        defaultInterval={1500}
        progressStyles={{
          backgroundColor: 'rgb(255, 255, 255)',
          height: '2px',
        }}
        loop={true}
        keyboardNavigation={true}
        // Story event handlers
        onStoryStart={(index: number) => console.log(`Story ${index + 1} started`)}
        onStoryEnd={(index: number) => console.log(`Story ${index + 1} ended`)}
        onAllStoriesEnd={() => console.log('All stories ended')}
      />
      {/* Social interaction buttons */}
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
};

export default StoriesComponent;
