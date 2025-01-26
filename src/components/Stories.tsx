import React from "react";
import Image from 'next/image';

interface StoryProps {
  url: string;
  header: {
    heading: string;
    subheading: string;
    profileImage: string;
  };
  duration: number;
  type?: 'video';
}

const Story: React.FC<StoryProps> = ({ url, header, duration, type }) => (
  <div>
    <Image src={url} alt={header.heading} layout="fill" />
    <div className="story-info">
      <Image src={header.profileImage} alt={header.heading} width={30} height={30} className="rounded-circle" />
      <div className="story-text">
        <h6>{header.heading}</h6>
        <p>{header.subheading}</p>
      </div>
    </div>
  </div>
);

export default Story;