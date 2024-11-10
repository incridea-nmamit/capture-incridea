import React, { useEffect, useRef } from 'react';

const images = [
  '/images/cam2png.png',
  '/images/campng.png',
  '/images/dronepng.png',
  '/images/micpng.png',
  '/images/mobpng.png',
  '/images/gim.png',
  '/images/mobgim.png',
];

const FallingClipart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    const createFallingImage = () => {
      if (container) {
        const image = document.createElement('img');
        const randomImage = images[Math.floor(Math.random() * images.length)] || '';
        image.src = randomImage;
        image.style.position = 'absolute';
        image.style.width = `${Math.random() * 20 + 30}px`; // Random size between 30px and 50px
        image.style.left = `${Math.random() * window.innerWidth}px`;
        image.style.top = `-${Math.random() * 200 + 100}px`; // Start slightly above the viewport
        image.style.opacity = '0.7';
        image.style.transition = 'transform 4s ease-in, top 4s ease-in';

        // Add rotation
        image.style.transform = `rotate(${Math.random() * 360}deg)`;

        container.appendChild(image);

        // Animate falling
        setTimeout(() => {
          image.style.top = `${window.innerHeight}px`;
          image.style.transform = `rotate(${Math.random() * 720 - 360}deg)`; // Rotate between -360deg and 360deg
        }, 100);

        // Remove image after animation
        setTimeout(() => {
          container.removeChild(image);
        }, 4000);
      }
    };

    const interval = setInterval(createFallingImage, 700); // Create a new image every 700ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10"
      ref={containerRef}
      style={{
        backgroundImage: "url('/images/stars.png')", // Replace with your background image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );
};

export default FallingClipart;
