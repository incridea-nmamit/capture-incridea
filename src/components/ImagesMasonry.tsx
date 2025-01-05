import { ImageList, ImageListItem } from "@mui/material";
import useResponsiveColumns from "~/hooks/useResponsiveColumns";
import CaptureCard from "./CapturePage/CaptureCard";

type CaptureImage = {
    id: number,
    onClick: () => void
    compressed_path: string,
    image_path: string
}

export default function ImagesMasonry({ images }: { images: CaptureImage[] }) {

    const columnCount = useResponsiveColumns({ 350: 1, 750: 2, 900: 3, 1024: 4 })
    return <div className="container-size pt-8">
        <ImageList variant="masonry" cols={columnCount} gap={8}>
            {images.map((image) => (
                <ImageListItem key={image.id} className="grid place-content-center place-items-center">
                    <CaptureCard
                        imagePath={image.compressed_path || image.image_path}
                        altText="Snaps image"
                        onClick={image.onClick}
                        prefech />
                </ImageListItem>
            ))}
        </ImageList>
    </div>;
}
