import Images from "~/components/Landing/Images";
import { ParallaxHero } from "~/components/Landing/Parallax";
import TimeLine from "~/components/Landing/TimeLine";

export default function Home() {
  return (
    <>
      <ParallaxHero />
      <Images />
      <TimeLine />
    </>
  );
}
