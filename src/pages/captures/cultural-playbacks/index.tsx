import { useEffect, useRef, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import { Heart, Share2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { api } from '~/utils/api'
import Loading from '~/pages/Loading'
import ReactPlayer from 'react-player'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { FaHeart } from 'react-icons/fa'
import { MoreInfo } from '~/components/MoreInfoDrawer/more-infoPopup'

type VideosProps = {
  id: number;
  name: string;
  description: string;
  videoPath: string;
}
const CulturalPlaybacks = () => {
  const { data: session } = useSession();
  const [isSharing, setIsSharing] = useState(false);
  const { data: Videos = [], isLoading } = api.playbacks.getAllPlaybacks.useQuery()
  const toggleLikes = api.playbacks.toggleLikeForPlayback.useMutation()
  const [selectedVideo, setSelectedVideo] = useState<VideosProps>();
  const { data: totalLikes, refetch: refetchTotalLikes } = api.playbacks.getTotalPlaybackLikes.useQuery({
    id: selectedVideo?.id!
  })
  const [openMoreInfo, setOpenMoreInfor] = useState(false);
  const { data: isLiked, refetch: refetchIsliked } = api.playbacks.isLiked.useQuery(
    {
      userId: session?.user.id!,
      playback_Id: selectedVideo?.id!
    }
  );

  useEffect(() => {
    if (Videos.length > 0) {
      setSelectedVideo(Videos[0] as VideosProps)
    }
  }, [Videos]);

  const videoRef = useRef<HTMLVideoElement>(null);



  const handleToggleLike = async () => {
    if (!selectedVideo || !session?.user.id) return;
    await toggleLikes.mutateAsync({
      userId: session.user.id,
      playback_Id: selectedVideo.id
    });
    refetchIsliked();
    refetchTotalLikes();
  };


  useEffect(() => {
    videoRef.current?.load();
  }, [selectedVideo]);




  if (isLoading) {
    return <Loading />
  }
  return (
    <>
      <div className="gradient-bg h-full w-full  ">
        <div className='!mt-20 container-size '>
          <h1 className="text-5xl font-Teknaf md:text-6xl text-white text-left mb-8" >Playbacks</h1>

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
              <h3 className="text-4xl font-cursive">{selectedVideo?.name}</h3>
              <p className="">
                {selectedVideo?.description}
              </p>

              <div className="flex flex-row items-center w-full justify-start gap-4 mt-2">
                <button onClick={handleToggleLike} aria-label="Like Button">
                  <FaHeart size={30} color={isLiked ? "red" : "white"} />
                </button>
                <span className="flex items-center text-white">
                  {isLoading ? "..." : totalLikes !== null ? totalLikes?.length : "..."}
                </span>
                <button >
                  <Share2 className="text-white" />
                </button>
                <button
                  className="bg-white rounded-2xl text-black px-6 py-2 hover:scale-105 transition-all"
                >
                  Download
                </button>
              </div>
              <button
                className="bg-white rounded-2xl text-black px-6 py-2 hover:scale-105 transition-all"
                onClick={() => setOpenMoreInfor(!openMoreInfo)}
              >
                Analytics
              </button>

            </div>
          </div>
          <div className="mb-10 space-y-7">
            <h1 className="text-xl md:text-3xl font-Teknaf">
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
                      <Image
                        src={video.thumbnails!}
                        alt='thumbnail'
                        width={100}
                        height={100}
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

      {
        openMoreInfo && (
          <MoreInfo
            isOpen={openMoreInfo}
            setOpen={setOpenMoreInfor}
            id={selectedVideo?.id!}
            apiTobeCalled="playbacks"
          />
        )
      }
    </>
  )
}

export default CulturalPlaybacks;

