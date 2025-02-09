// Import necessary dependencies
import Image from "next/image";
import BlurFade from "./blurFade";

// Array of image paths for the grid
// Contains a mix of local and remote images from different years
const images = [
    // Landing page images
    "images/landing-images/img1.webp",
    "images/landing-images/img2.webp",
    "images/landing-images/img3.webp",
    "images/landing-images/img4.webp",
    "images/landing-images/img5.webp",
    "images/landing-images/img6.webp",
    "images/2022/DSC08909.webp",
    "https://utfs.io/f/0yks13NtToBitJchJ4NSCB2X9TSlbJxWYgG6rpN3n8swf4Fz",
    "images/2022/IMG_0373.webp",
    "images/2022/IMG_2204.webp",
    "images/2022/IMG_9452.webp",
    "images/2023/IMG_7455.webp",
    "images/2023/DSC_0300.webp",
    "images/2023/DSC_1080.webp",
    "images/2023/IMG_6193.webp",
    "images/2024/MVB03544.webp",
    "images/2024/IMG_0162.webp",
    "images/2024/DSC05653.webp",
    "images/2024/MVB04911.webp",
] as const;

/**
 * ImageGrid Component
 * Displays a responsive grid of images with fade-in animation effects
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render at the bottom of the grid
 */
const ImageGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen max-w-9xl relative">
            {/* Image grid container with overflow control */}
            <div className="relative h-screen overflow-hidden z-10">
                <section id="photos" className="h-screen overflow-hidden">
                    {/* Responsive column layout for images */}
                    <div className="columns-3 gap-1 p-1 md:columns-5">
                        {images.map((src, idx) => (
                            <BlurFade key={src} delay={0.25 + idx * 0.05} inView>
                                <Image
                                    src={src.startsWith('http') ? src : `/${src}`}
                                    alt={`Image ${idx + 1}`}
                                    width={idx % 2 === 0 ? 500 : 300}
                                    height={idx % 2 === 0 ? 300 : 500}
                                    className="mb-2 size-full rounded-lg object-contain"
                                />
                            </BlurFade>
                        ))}
                    </div>
                </section>
            </div>

            {/* Gradient overlay for better text visibility */}
            <div className="z-40 absolute inset-0 bg-gradient-to-t from-black to-transparent" />

            {/* Bottom container for child elements */}
            <div className="z-50 absolute inset-x-0 bottom-0 flex justify-center items-center">
                {children}
            </div>
        </div>
    );
};

export default ImageGrid;
