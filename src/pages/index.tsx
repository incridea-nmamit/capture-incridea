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
      <section className="relative flex h-fit flex-col items-center space-y-8 overflow-hidden text-center">
        <br />
        <h3 className="mb-12 text-center font-Teknaf text-3xl md:text-4xl lg:text-5xl">
          "Let’s cherish memories by sharing them with all."
        </h3>
        <div className="w-full h-96">
          <CircularGallery items={items} />
        </div>
      </section>

      <TimeLine />
    </>
  );
}