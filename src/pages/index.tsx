import { LandingButtons } from "~/components/Landing/landing-button";
import { LandingFooter } from "~/components/Landing/landing-footer";
import { ParallaxHero } from "~/components/Landing/Parallax";

export default function Home() {
  return (
    <>
      <ParallaxHero />
      <LandingButtons/>
      <LandingFooter/>
    </>
  );
}
