import React from 'react';

const LoadingAnimation = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-40 h-40">
                {/* Rotating camera container */}
                <div className="absolute inset-0 bg-gray-800 border-8 border-gray-700 rounded-lg animate-ring flex flex-col items-center justify-center">
                    {/* Static image in the center, representing the lens view */}
                    <div className="w-full h-full flex items-center justify-center">
                        <img
                            src="/images/inc.png" // Use the specified image source
                            alt="Loading"
                            className="w-3/4 h-auto object-cover rounded-full blur-lg" // Scale down to 75% of the container size
                            style={{
                                animation: 'focus 3s ease infinite', // Swift animation for blur
                            }}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes focus {
                    0% {
                        filter: blur(3px);
                    }
                    50% {
                        filter: blur(0px);
                    }
                    100% {
                        filter: blur(3px);
                    }
                }

                @keyframes ring {
                    0% {
                        transform: rotate(20deg);
                    }
                    50% {
                        transform: rotate(-20deg);
                    }
                    100% {
                        transform: rotate(20deg);
                    }
                }

                .animate-ring {
                    animation: ring 3s ease infinite; // Swift rotation
                }
            `}</style>
        </div>
    );
};

export default LoadingAnimation;
