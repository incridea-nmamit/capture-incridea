import ScrollVelocityCarousel from "~/components/Animations/scrollVelocityCarousel";
import Image from "next/image";

type ReelImg = {
  src: string;
};

const Reel = ({
  reelImg,
  angle,
  direction,
  baseVelocity,
  classes,
}: {
  reelImg: ReelImg[];
  angle: number;
  direction: number; // Pass direction as prop
  baseVelocity: number;
  classes: string;
}) => {
  return (
    <div className={classes}>
      {/* Pass the direction prop dynamically */}
      <ScrollVelocityCarousel baseVelocity={baseVelocity} angle={angle} direction={direction}>
        <div className="flex gap-2 bg-white p-1">
          {reelImg.map((img, idx) => {
            return (
              <div
                className="h-[8.5rem] w-48 sm:h-44 sm:w-60 md:h-52 md:w-72 lg:h-64 lg:w-96 relative"
                key={idx}
              >
                <Image
                  src={img.src}
                  fill
                  className="object-cover object-center rounded-md"
                  alt={`reel-image-${idx}`}
                />
              </div>
            );
          })}
        </div>
      </ScrollVelocityCarousel>
    </div>
  );
};

export default Reel;
