import About from "~/components/Landing/About";
import Hero from "~/components/Landing/Hero";
import Images from "~/components/Landing/Images";
import TimeLine from "~/components/Landing/TimeLine";
import SEO from "~/components/SEO";
import CircularGallery from "~/components/Landing/CircularGallery";

const items = [
  { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
  { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' },
  { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall' },
  { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries' },
  { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving' },
  { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track' },
  { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: 'Santorini' },
  { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: 'Blurry Lights' },
  { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: 'New York' },
  { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: 'Good Boy' },
  { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: 'Coastline' },
  { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: "Palm Trees" }
]

export default function Home() {
  return (
    <>
      <SEO />
      <Hero />
      <About />
      <div className="w-full h-96">
      <CircularGallery items={items} />
      </div>
      <TimeLine />
    </>
  );
}