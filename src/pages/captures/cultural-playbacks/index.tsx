import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'

const videoList = [{
  id: "1",
  name: "video 1",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "2",
  name: "video 2",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "3",
  name: "video 3",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "4",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "5",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "6",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "7",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "8",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "9",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "10",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "11",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "12",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "13",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "14",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}, {
  id: "15",
  name: "video 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum eaque, eligendi nulla maiores impedit magnam modi, in alias nemo excepturi atque corrupti quae? Suscipit sint nobis unde eius praesentium ipsa.",
  videoUrl: "/videos/VidCom.mp4",
  thumbnail: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4"
}
]

const CulturalPlaybacks = () => {

  const [selectedVideo, setSelectedVideo] = useState(videoList[0])

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.load();
  }, [selectedVideo]);

  return (
    <>
      <div className='!mt-20 container-size'>
        <h1 className="text-6xl font-Teknaf md:text-7xl text-white text-center mb-8" >Playbacks</h1>
        <FallingClipart />

        <div className=' items-start justify-start gap-4 grid lg:grid-cols-8 grid-cols-1 my-6'>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full aspect-video h-auto object-cover col-span-6 rounded-lg" 
            
          >
            <source src={selectedVideo?.videoUrl} type="video/mp4" />
          </video>
          <div className='p flex flex-col justify-start w-full h-full max-w-[106vh] gap-2 col-span-2'>
            <h3 className="text-4xl font-Teknaf">Playbacks</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A officia animi reprehenderit cupiditate dolore, commodi tenetur quas aut nemo facilis error officiis. Impedit consectetur quod sequi rerum aut sed ab!
            </p>
          </div>
        </div>

        <ScrollArea className="whitespace-nowrap rounded-md border lg:overflow-x-auto h-full">

          <div className="flex lg:w-max h-max p-4 flex-wrap gap-4 items-center justify-center">
            {videoList.map((video) => (
              <figure key={video.id}
                className={`shrink-0 cursor-pointer rounded-md max-h-48 h-full overflow-hidden max-w-full aspect-video ${selectedVideo?.id == video.id ? "border-4 border-purple-800" : ""}`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={`Photo by ${video.name}`}
                    className=" h-fit w-fit object-cover"
                    width={300}
                    height={400}
                  />
                </div>
              </figure>

            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </div>


    </>
  )
}

export default CulturalPlaybacks;