import React from 'react';
import Stories from 'react-insta-stories';
import { Share,Download,Heart } from "lucide-react";

const StoriesComponent = ({ storyData }) => {
  return (
    <div>
      <Stories
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
        onStoryStart={(index) => console.log(`Story ${index + 1} started`)}
        onStoryEnd={(index) => console.log(`Story ${index + 1} ended`)}
        onAllStoriesEnd={() => console.log('All stories ended')}
      />
         <div className="flex justify-end gap-4 mt-2">
          <button aria-label="Like Button">
            <Heart size={35} className="text-white"/>
          </button>
          <button>
           <Share size={30} className="text-white" />
          </button>
          <button>
            <Download size={30} className="text-white" />
          </button>
         </div>
    </div>
  );
};

export default StoriesComponent;
