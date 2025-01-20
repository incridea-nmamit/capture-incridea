import Carousel from "src/components/CapturePage/CaptureCard";
import style from "./corousel.module.css";

const carouselItems = [
  {
    id: 1,
    image: "/images/CapturePage/img1.jpg",
    author: "INCRIDEA",
    title: "PRONITE",
    topic: "PRONITE",
    description:
      "Brace yourselves for an electrifying night of live performances by some of the biggest stars in entertainment!",
  },
  {
    id: 2,
    image: "/images/CapturePage/img2.jpg",
    author: "INCREDIA",
    title: "EVENTS",
    topic: "EVENTS",
    description:
      "Dive into a thrilling world of exciting events and competitions, tailored for every interest, at Incridea!",
  },
  {
    id: 3,
    image: "/images/CapturePage/img3.jpg",
    author: "INCREDIA",
    title: "ABODE OF MEMORIES",
    topic: "MEMORIES",
    description:
      "The memories all so sweet, with moments cherished for life. Here lies the moments cherished with ones we love to cross paths by",
  },
  {
    id: 4,
    image: "/images/CapturePage/img4.jpg",
    author: "INCRIDEA",
    title: "EVENTS",
    topic: "CULTURAL",
    description:
      "Feast your eyes to the glorious display of traditional brilliance paired alongside the glitzy, modern era",
  },
  {
    id: 5,
    image: "/images/CapturePage/img5.jpg",
    author: "INCREDIA",
    title: "STORIES",
    topic: "STORIES",
    description: "Stories captured for you",
  },
  {
    id: 6,
    image: "/images/CapturePage/img6.jpg",
    author: "INCREDIA",
    title: "PLAYBACKS",
    topic: "PLAYBACKS",
    description: "When your life needs some playbacks!!",
  },
  {
    id: 7,
    image: "/images/CapturePage/img7.jpg",
    author: "INCREDIA",
    title: "BEHIND INCRIDEA",
    topic: "BEHIND INCRIDEA",
    description: "Explore the behind-the-scenes moments.",
  },

  // Add more items...
];

export default function Home() {
  return <Carousel items={carouselItems} />;
}
