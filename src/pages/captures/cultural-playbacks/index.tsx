import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import { Heart, Share2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { api } from '~/utils/api'
import Loading from '~/pages/Loading'
import ReactPlayer from 'react-player'
import { isDesktop } from 'react-device-detect';

type VideosProps = {
  id: number;
  name: string;
  description: string;
  videoPath: string;
}
const CulturalPlaybacks = () => {
  const { data: Videos = [], isLoading } = api.playbacks.getAllPlaybacks.useQuery()

  const [selectedVideo, setSelectedVideo] = useState<VideosProps>();

  useEffect(() => {
    if (Videos.length > 0) {
      setSelectedVideo(Videos[0] as VideosProps)
    }
  }, [Videos]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.load();
  }, [selectedVideo]);

  if (isLoading) {
    return <Loading />
  }
  return (
    <div className="gradient-bg h-full w-full  ">
      <div className='!mt-20 container-size '>
        <h1 className="text-6xl font-lobster md:text-7xl text-white text-left mb-8" >Playbacks</h1>
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
            <source src={selectedVideo?.videoPath} type="video/mp4" />
          </video>
          <div className=' gradient-bg shadow-2xl flex flex-col justify-start w-full h-full max-w-[106vh] gap-2 col-span-2 border border-gray-50 p-3 rounded-xl'>
            <h3 className="text-4xl font-lobster">{selectedVideo?.name}</h3>
            <p className="font-grotesk">
              {selectedVideo?.description}
            </p>

            <div className="flex flex-row items-center w-full justify-start gap-4 mt-2">
              <Heart className='h-5 w-5' />
              <Share2 className="h-5 w-5" />
              <Button className="font-grotesk">
                Downlode
              </Button>
            </div>
          </div>
        </div>
        <div className="mb-10 space-y-7">
          <h1 className="text-xl md:text-4xl font-lobster">
            Recently uploded Playbacks
          </h1>
          <ScrollArea className="whitespace-nowrap rounded-md border-2 lg:overflow-x-auto h-full gradient-bg">

            <div className="flex lg:w-max h-max p-4 flex-wrap gap-4 items-center justify-center">
              {Videos.map((video) => (
                <figure
                  key={video.id}
                  className={`shrink-0 cursor-pointer rounded-md max-h-48 h-full overflow-hidden max-w-full aspect-video ${selectedVideo?.id == video.id ? "border-4 border-white p-1" : ""
                    }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="overflow-hidden h-full w-full">
                    <ReactPlayer
                      url={video.videoPath}
                      playing={false}
                      muted={true}
                      controls={false}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                      className="w-full h-full"
                    />
                  </div>
                </figure>


              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

      </div>


    </div>
  )
}

export default CulturalPlaybacks;