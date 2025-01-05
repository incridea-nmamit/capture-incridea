import { ImageList, ImageListItem } from "@mui/material";
import useResponsiveColumns from "~/hooks/useResponsiveColumns";
import { FaDownload } from "react-icons/fa";
import { CaptureCard } from "./CapturePage/CaptureCard";
import { useMemo } from "react";
import { api } from "~/utils/api";

type CaptureImage = {
    id: number,
    onClick: () => void
    compressed_path: string,
    image_path: string,
    downloadCount?: number
}

export default function ImagesMasonry({ images }: { images: CaptureImage[] }) {
    const { data: allDownloadLogs, isLoading: isDownloadLogLoading } =  api.download.getAllLogs.useQuery();
      const downloadCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        if (allDownloadLogs) {
          allDownloadLogs.forEach((log : any) => {
            counts[log.image_id] = (counts[log.image_id] || 0) + 1;
          });
        }
        return counts;
      }, [allDownloadLogs]);

      const getDownloadCount = (image_id: number): number => {
        if (isDownloadLogLoading) return 0;
        return downloadCounts[image_id] || 0; 
      };
      
    const columnCount = useResponsiveColumns({ 350: 1, 750: 2, 900: 3, 1024: 4 })
    return <div className="container-size pt-8">
        <ImageList variant="masonry" cols={columnCount} gap={8}>
            {images.map((image) => (
                <ImageListItem key={image.id} className="grid place-content-center place-items-center">
                    <div className="relative w-fit h-fit">
                        <CaptureCard
                            imagePath={image.compressed_path || image.image_path}
                            altText="Snaps image"
                            onClick={image.onClick}
                            prefech />

                            {image.downloadCount != null && (
                            <div className="absolute bottom-0 p-2 right-0 gap-1 flex items-center justify-end text-white font-bold text-sm pointer-events-none">
                                <FaDownload />
                                {(getDownloadCount(image.id)) > 0 ? getDownloadCount(image.id) : ""}
                            </div>
                            )}


                    </div>
                </ImageListItem>
            ))}
        </ImageList>

        {/* <Masonry
            breakpointCols={3}
            className="my-masonry-grid w-full"
            columnClassName="my-masonry-grid_column"
        >

            {images.map((image) => (
                <div key={image.id} className="grid place-content-center place-items-center">
                    <div className="relative w-fit h-fit">
                        <CaptureCard
                            imagePath={image.compressed_path || image.image_path}
                            altText="Snaps image"
                            onClick={image.onClick}
                            prefech />

                        {image.downloadCount != null && <div className="absolute bottom-0 p-2 right-0 gap-1 flex items-center justify-end  text-white font-bold text-sm pointer-events-none">
                            <FaDownload /> {image.downloadCount}
                        </div>}
                    </div>
                </div>
            ))}
        </Masonry> */}
    </div>;
}
