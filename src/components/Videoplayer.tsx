/**
 * Custom video player component with enhanced controls
 * Features:
 * - Custom controls
 * - Download prevention
 * - Picture-in-Picture blocking
 * - Responsive design
 */

import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  // Reference to control player functions
  const playerRef = useRef<ReactPlayer>(null);

  /**
   * Handles seeking to specific timestamp
   */
  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  };

  return (
    <div className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
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