import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const playerRef = useRef<ReactPlayer>(null);

  // Function to handle seeking
  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  };

  // Function to update playe
  return (
    <div className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
      {/* Video Player */}
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <ReactPlayer
          ref={playerRef}
          url={url}
          controls={true}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true, 
              },
            },
          }}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;