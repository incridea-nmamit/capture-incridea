import React, { useEffect, useRef } from 'react';

const images = [
  'https://utfs.io/f/0yks13NtToBi4Qu8UcGv1SaXrdI2cpUh9EC5iNOTmMuDkPnw',
  'https://utfs.io/f/0yks13NtToBimGn6KrW4rLdYOgjBIhS01PQMHmAZoRaCfVDK',
  'https://utfs.io/f/0yks13NtToBinjnQQYF56OIDvu2PeYJ4icMh7aBfCbHQRAoq',
  'https://utfs.io/f/0yks13NtToBiky0ZJV1mUBlZChwebpEAV1rv23iI9YK7HWSfa',
  'https://utfs.io/f/0yks13NtToBijsrrujtZKfcud6snUA8tzaTQ9hI0kVgWplby',
  'https://utfs.io/f/0yks13NtToBiNSi7MLHjzD2wWm5AylYHcVfipk40e8O9RubF',
  'https://utfs.io/f/0yks13NtToBiraCXvbIUcBmoP98lMs3ZrOe2aL4VD1dpYAwj',
  'https://utfs.io/f/0yks13NtToBiPJ6BZfsu8SvNgVL69KsUPy21WpGfn4lrhZCA',
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

    const interval = setInterval(createFallingImage, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10"
      ref={containerRef}
    ></div>
  );
};

export default FallingClipart;
