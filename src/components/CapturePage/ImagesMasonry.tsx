import { ImageList, ImageListItem } from "@mui/material";
import useResponsiveColumns from "~/hooks/useResponsiveColumns";
import { FaDownload } from "react-icons/fa";
import { CaptureCard } from "./CaptureCard";
import { useEffect, useRef } from "react";

type CaptureImage = {
    id: number,
    onClick: () => void
    compressed_path: string,
    image_path: string,
    downloadCount?: number,
}

export default function ImagesMasonry({ images, nextCursor, isFetchingNextPage, fetchNextPage }: {
    images: CaptureImage[], nextCursor: Date | null | undefined,
    isFetchingNextPage: boolean,
    fetchNextPage: () => void
}) {

    const observerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isFetchingNextPage) {
                        fetchNextPage()
                    }
                })
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }
        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, []);

    const columnCount = useResponsiveColumns({ 350: 1, 750: 2, 900: 3, 1024: 4 })
    return <div className="container-size pt-8 ">
        <ImageList variant="masonry" cols={columnCount} gap={8} className="mb-20">
            {images.map((image) => (
                <ImageListItem key={image.id} className="grid place-content-center place-items-center ">
                    <div className="relative w-fit h-fit">
                        <CaptureCard
                            imagePath={image.compressed_path}
                            altText="Snaps image"
                            onClick={image.onClick}
                            prefech />

                        {image.downloadCount != null && (
                            <div className="absolute bottom-0 p-2 right-0 gap-1 flex items-center justify-end text-white font-bold text-sm pointer-events-none">
                                <FaDownload />
                                {image.downloadCount}
                            </div>
                        )}


                    </div>
                </ImageListItem>
            ))}
        </ImageList>

        {nextCursor && <div className="mx-auto my-8 grid place-content-center" ref={observerRef}>
            <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        }
    </div>;
}
