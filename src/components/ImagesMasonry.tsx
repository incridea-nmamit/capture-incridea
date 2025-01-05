import { ImageList, ImageListItem } from "@mui/material";
import useResponsiveColumns from "~/hooks/useResponsiveColumns";
import { FaDownload } from "react-icons/fa";
import { CaptureCard } from "./CapturePage/CaptureCard";

type CaptureImage = {
    id: number,
    onClick: () => void
    compressed_path: string,
    image_path: string,
    downloadCount?: number
}

export default function ImagesMasonry({ images }: { images: CaptureImage[] }) {
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

                        {image.downloadCount != null && <div className="absolute bottom-0 p-2 right-0 gap-1 flex items-center justify-end  text-white font-bold text-sm pointer-events-none">
                            <FaDownload /> {image.downloadCount}
                        </div>}
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
