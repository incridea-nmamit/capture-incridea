import Image from 'next/image';
import React from 'react';

const CameraLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-60 bg-opacity-80 backdrop-blur-sm">
            <div className="relative w-40 h-40">
                <div className="absolute inset-0 bg-gray-800 border-8 border-gray-700 rounded-lg animate-ring flex flex-col items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                        <Image
                            src="https://utfs.io/f/0yks13NtToBiMOM3L9fzWI7ScAKGqQtv4FT8wMPEHbihruCg"
                            alt="Loading"
                            className="w-3/4 h-auto object-cover rounded-full blur-lg"
                            style={{
                                animation: 'focus 4s ease infinite',
                            }}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes focus {
                    0% {
                        filter: blur(0px);
                    }
                    50% {
                        filter: blur(3px);
                    }
                    100% {
                        filter: blur(0px);
                    }
                }

                @keyframes ring {
                    0% {
                        transform: rotate(-20deg);
                    }
                    50% {
                        transform: rotate(20deg);
                    }
                    100% {
                        transform: rotate(-20deg);
                    }
                }

                .animate-ring {
                    animation: ring 4s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default CameraLoading;
