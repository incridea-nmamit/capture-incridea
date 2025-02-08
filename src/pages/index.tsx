import About from "~/components/Landing/About";
import Hero from "~/components/Landing/Hero";
import Images from "~/components/Landing/Images";
import TimeLine from "~/components/Landing/TimeLine";
import SEO from "~/components/SEO";

export default function Home() {
  return (
    <>
      <SEO />
      <Hero />
      <About />
      <Images />
      <TimeLine />
    </>
  );
}