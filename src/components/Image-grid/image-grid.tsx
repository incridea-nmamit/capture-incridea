// import { ImageList, ImageListItem } from "@mui/material";
// import useResponsiveColumns from "~/hooks/useResponsiveColumns";
// import { GridCard } from "./grid-card";
// import { useEffect, useRef } from "react";

// type CaptureImage = {
//     id: number;
//     onClick: () => void;
//     compressed_path: string;
//     image_path: string;
//     downloadCount?: number;

// };

// export default function ImagesGrid({
//     images,
//     nextCursor,
//     isFetchingNextPage,
//     fetchNextPage,
//     isLoading
// }: {
//     images: CaptureImage[];
//     nextCursor: Date | null | undefined;
//     isFetchingNextPage: boolean;
//     fetchNextPage: () => void;
//     isLoading: boolean
// }) {
//     const observerRef = useRef<HTMLDivElement | null>(null);
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting && !isFetchingNextPage) {
//                         fetchNextPage();
//                     }
//                 });
//             },
//             { threshold: 1.0 },
//         );

//         if (observerRef.current) {
//             observer.observe(observerRef.current);
//         }
//         return () => {
//             if (observerRef.current) {
//                 observer.unobserve(observerRef.current);
//             }
//         };
//     }, []);

//     const columnCount = useResponsiveColumns({ 350: 1, 750: 2, 900: 3, 1024: 4 });
//     return (
//         <div className="container-size pt-8 rounded-t-3xl">
//             <ImageList variant="masonry" cols={columnCount} gap={8} className="mb-20">
//                 {images.map((image) => (
//                     <GridCard
//                         key={image.id}
//                         imageId={image.id}
//                         imagePath={image.compressed_path}
//                         altText="Snaps image"
//                         onClick={image.onClick}
//                         prefech
//                     />
//                 ))}
//             </ImageList>

//             {nextCursor && (
//                 <div
//                     className="mx-auto my-8 grid place-content-center"
//                     ref={observerRef}
//                 >                    <svg
//                         className="h-12 w-12 animate-spin text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                     >
//                         <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                         ></circle>
//                         <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                     </svg>
//                 </div>
//             )}
//         </div>
//     );
// }
import { useEffect, useRef, useState } from "react";
import { ImageList, ImageListItem } from "@mui/material";
import useResponsiveColumns from "~/hooks/useResponsiveColumns";
import { GridCard } from "./grid-card";
import { SkeletonLoader } from "./skeleton-loader";

type CaptureImage = {
    id: number;
    onClick: () => void;
    compressed_path: string;
    image_path: string;
    downloadCount?: number;
};

export default function ImagesGrid({
    images,
    nextCursor,
    isFetchingNextPage,
    fetchNextPage,
    isLoading
}: {
    images: CaptureImage[];
    nextCursor: Date | null | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isLoading: boolean;
}) {
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(isLoading || isFetchingNextPage);

    useEffect(() => {
        setLoading(isLoading || isFetchingNextPage);
    }, [isLoading, isFetchingNextPage]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && nextCursor && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                });
            },
            { threshold: 1.0 },
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }
        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [nextCursor, isFetchingNextPage]);

    const columnCount = useResponsiveColumns({ 350: 1, 750: 2, 900: 3, 1024: 4 });

    return (
        <div className="container-size pt-8 rounded-t-3xl">
            <ImageList variant="masonry" cols={columnCount} gap={1} className="mb-20">
                {loading && images.length === 0
                    ? [...Array(10)].map((_, index) => (
                          <ImageListItem key={index} className="grid place-content-center place-items-center p-2">
                              <SkeletonLoader />
                          </ImageListItem>
                      ))
                    : images.map((image) => (
                          <ImageListItem
                              key={image.id}
                              className="grid place-content-center place-items-center rounded-lg p-1"
                          >
                              <div className="relative h-fit w-fit">
                                  <GridCard
                                      imageId={image.id}
                                      imagePath={image.compressed_path}
                                      altText="Snaps image"
                                      onClick={image.onClick}
                                      prefech
                                  />
                              </div>
                          </ImageListItem>
                      ))}
            </ImageList>

            {nextCursor && isFetchingNextPage && (
                <div className="mx-auto my-8 grid place-content-center" ref={observerRef}>
                    <svg
                        className="h-12 w-12 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}
        </div>
    );
}
