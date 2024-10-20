const VideoComponent = () => {
    return (
      <video
        src="/videos/phonevd.mp4"
        width={200}
        height={400}
        autoPlay
        loop
        muted
        playsInline
        className="rounded-lg shadow-lg"
      />
    );
  };
  
  export default VideoComponent;
  