import Carousel from "src/components/CapturePage/CaptureCard";
import style from "./corousel.module.css";

const carouselItems = [
  {
    id: 1,
    image: "/images/CapturePage/img1.jpg",
    author: "INCRIDEA",
    title: "PRONITE",
    topic: "LET'S ROCK",
    description: "Lorem ipsum dolor...",
  },
  {
    id: 2,
    image: "/images/CapturePage/img2.jpg",
    author: "INCREDIA",
    title: "EVENTS",
    topic: "KOYI NA",
    description: "Lorem ipsum dolor...",
  },
  {
    id: 3,
    image: "/images/CapturePage/img3.jpg",
    author: "INCREDIA",
    title: "ABODE OF MEMORIES",
    topic: "KOYI NA",
    description: "Lorem ipsum dolor...",
  },
  {
    id: 4,
    image: "/images/CapturePage/img4.jpg",
    author: "CULTURAL",
    title: "EVENTS",
    topic: "KOYI NA",
    description: "Lorem ipsum dolor...",
  },
  {
    id: 5,
    image: "/images/CapturePage/img5.jpg",
    author: "INCREDIA",
    title: "STORIES",
    topic: "KOYI NA",
    description: "Lorem ipsum dolor...",
  },
  {
    id: 6,
    image: "/images/CapturePage/img6.jpg",
    author: "INCREDIA",
    title: "PLAYBACKS",
    topic: "KOYI NA",
    description: "Lorem ipsum dolor...",
  },
  {
    id: 7,
    image: "/images/CapturePage/img7.jpg",
    author: "INCREDIA",
    title: "BEHIND INCRIDEA",
    topic: "KOYI NA",
    description: "Lorem ipsum dolor...",
  },

  // Add more items...
];

export default function Home() {
  return <Carousel items={carouselItems} />;
}
