import About from "~/components/Landing/About";
import Hero from "~/components/Landing/Hero";
import Images from "~/components/Landing/Images";
import TimeLine from "~/components/Landing/TimeLine";
import SEO from "~/components/SEO";
import CircularGallery from "~/components/Landing/CircularGallery";

const items = [
  { image: `/images/general/p1.webp`, text: 'Bridge' },
  { image: `/images/general/p11.webp`, text: 'Bridge' },
  { image: `/images/general/p3.webp`, text: 'Bridge' },
  { image: `/images/general/p4.webp`, text: 'Bridge' },
  { image: `/images/general/p13.webp`, text: 'Bridge' },
  { image: `/images/general/p2.webp`, text: 'Bridge' },
  { image: `/images/general/p12.webp`, text: 'Bridge' },
  { image: `/images/general/p14.webp`, text: 'Bridge' },
  { image: `/images/general/p10.webp`, text: 'Bridge' },
  { image: `/images/general/p5.webp`, text: 'Bridge' },
  { image: `/images/general/p8.webp`, text: 'Bridge' },
  { image: `/images/general/p6.webp`, text: 'Bridge' },
  { image: `/images/general/p9.webp`, text: 'Bridge' },
  { image: `/images/general/p7.webp`, text: 'Bridge' },
]

export default function Home() {
  return (
    <>
      <SEO />
      <Hero />
      <About />
      <section className="relative flex h-fit flex-col items-center space-y-8 overflow-hidden text-center">
        <br />
        <h3 className="mb-10 text-center font-Teknaf text-3xl md:text-4xl lg:text-5xl">
          "Let’s cherish memories by sharing them with all."
        </h3>
        <div className="w-full h-96 ">
          <CircularGallery items={items} />
        </div>
      </section>

      <TimeLine />
    </>
  );
}