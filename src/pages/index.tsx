import About from "~/components/Landing/About";
import Hero from "~/components/Landing/Hero";
import Images from "~/components/Landing/Images";
import TimeLine from "~/components/Landing/TimeLine";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Images />
      <TimeLine />
    </>
  );
}