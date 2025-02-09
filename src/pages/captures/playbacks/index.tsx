import Plyr from 'plyr-react';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Info, Share2 } from 'lucide-react';
import { api } from '~/utils/api';
import Loading from '~/pages/Loading';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FaHeart } from 'react-icons/fa';
import { MoreInfo } from '~/components/MoreInfoDrawer/more-infoPopup';
import { Button } from '~/components/ui/button';
import ReactPlayer from 'react-player';
import VideoPlayer from '~/components/Videoplayer';
type VideosProps = {
  id: number;
  name: string;
  description: string;
  videoPath: string;
  thumbnails: string;
};

const CulturalPlaybacks = () => {
  const { data: session } = useSession();
  const [isSharing, setIsSharing] = useState(false);
  const { data: Videos = [], isLoading } = api.playbacks.getAllPlaybacks.useQuery();
  const toggleLikes = api.playbacks.toggleLikeForPlayback.useMutation();
  const [selectedVideo, setSelectedVideo] = useState<VideosProps | null>(null);
  const { data: totalLikes, refetch: refetchTotalLikes } = api.playbacks.getTotalPlaybackLikes.useQuery(
    { id: selectedVideo?.id! }
  );
  const [openMoreInfo, setOpenMoreInfor] = useState(false);
  const { data: isLiked, refetch: refetchIsliked } = api.playbacks.isLiked.useQuery(
    { userId: session?.user.id!, playback_Id: selectedVideo?.id! }
  );

  useEffect(() => {
    if (Videos.length > 0 && !selectedVideo) {
      setSelectedVideo(Videos[0] as VideosProps);
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
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => { });
    }
  }, [selectedVideo]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="gradient-bg h-full w-full">
      <div className='!mt-24 container-size'>
        <h1 className="text-5xl font-Teknaf md:text-5xl text-center text-white my-20">Playbacks</h1>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 my-6">
          <div className="col-span-12 lg:col-span-9">
          <VideoPlayer url={selectedVideo?.videoPath ?? ''} />
          </div>

          <div className="col-span-12 lg:col-span-3 flex flex-col gap-">
            <div className="gradient-bg shadow-2xl flex flex-col justify-start w-full h-full gap-2 border border-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-4xl font-Teknaf">{selectedVideo?.name}</h3>
                <div className="flex flex-col items-center justify-center gap-2">
                  <button><Share2 className="text-white" /></button>
                  {session?.user?.role === "admin" && (
                  <button onClick={() => setOpenMoreInfor(!openMoreInfo)}><Info className="text-white" /></button>
                  )}
                  </div>
              </div>
              <p className="text-white">{selectedVideo?.description}</p>
              <div className="flex flex-row items-center w-full justify-start gap-4 mt-2">
                <button onClick={handleToggleLike} aria-label="Like Button">
                  <FaHeart size={30} color={isLiked ? "red" : "white"} />
                </button>
                <span className="flex items-center text-white">{isLoading ? "..." : totalLikes?.length ?? "..."}</span>
                <Button className="bg-white rounded-xl w-full text-black px-6 py-2 hover:scale-105 transition-all">Download</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 space-y-7">
          <h1 className="text-xl md:text-3xl font-Teknaf">Recently Uploaded Playbacks</h1>
          <ScrollArea className="whitespace-nowrap rounded-md border-2 lg:overflow-x-auto h-full gradient-bg">
            <div className="flex lg:w-max h-max p-4 flex-wrap gap-4 items-center justify-center">
              {Videos.map((video) => (
                <div key={video.id} className="flex flex-col items-center">
                  <div
                    className={`relative shrink-0 cursor-pointer rounded-md max-h-52 h-full overflow-hidden max-w-full aspect-video ${selectedVideo?.id === video.id ? "border-4 border-white p-1" : ""}`}
                    onClick={() => setSelectedVideo(video as VideosProps)}
                  >
                    <Image
                      src={video.thumbnails!}
                      alt="thumbnail"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-black/80 text-white text-sm md:text-base font-semibold px-2 py-1 text-start z-10">
                      {video.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {openMoreInfo && (
        <MoreInfo isOpen={openMoreInfo} setOpen={setOpenMoreInfor} id={selectedVideo?.id!} apiTobeCalled="playbacks" />
      )}
    </div>
  );
};

export default CulturalPlaybacks;

