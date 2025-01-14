import Image from "next/image";
import BlurFade from "./blurFade";

const images = [
    "images/landing-images/img1.png",
    "images/landing-images/img2.png",
    "images/landing-images/img3.png",
    "images/landing-images/img4.png",
    "images/landing-images/img5.png",
    "images/landing-images/img6.png",
    "images/2022/DSC08909.png",
    "https://utfs.io/f/0yks13NtToBitJchJ4NSCB2X9TSlbJxWYgG6rpN3n8swf4Fz",
    "images/2022/IMG_0373.png",
    "images/2022/IMG_2204.png",
    "images/2022/IMG_9452.png",
    "images/2023/IMG_7455.png",
    "images/2023/DSC_0300.png",
    "images/2023/DSC_1080.png",
    "images/2023/IMG_6193.png",
    "images/2024/MVB03544.png",
    "images/2024/IMG_0162.png",
    "images/2024/DSC05653.png",
    "images/2024/MVB04911.png",
] as const;

const ImageGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className=" h-screen max-w-9xl relative">

            <div className="relative h-screen overflow-hidden z-10 ">
                <section id="photos" className="h-screen overflow-hidden">
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


            <div className="z-40 absolute inset-0 bg-gradient-to-t from-black to-transparent" />


            <div className="z-50 absolute inset-x-0 bottom-0 flex justify-center items-center">
                {children}
            </div>

        </div>
    );
};

export default ImageGrid;
