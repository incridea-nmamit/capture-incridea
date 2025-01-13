import React from "react";
import RedirectButton from "./RedirectButton";

function About() {
  return (
    <section className="container-size mx-auto flex h-screen flex-col items-center justify-center gap-8 text-left md:text-center">
      <br />
      <h3 className="mb-8 w-full text-center font-Teknaf font-bold text-4xl md:text-6xl lg:text-6xl">
        We capture 📷 what you see ...
      </h3>

      <p className="max-w-3xl  text-justify md:text-center font-Trap-Regular leading-relaxed">
        We transform what you see into extraordinary visuals with
        unmatched creativity and attention to detail. From our early
        beginnings to today, we’ve been committed to excellence in
        capturing and elevating every moment. Our journey started
        with the traditional tools of the trade and has evolved alongside
        cutting-edge technology, ensuring that every image tells a compelling story.
        Whether it’s through innovative techniques or timeless approaches, we bring your
        vision to life. With decades of expertise, we continue to enhance, innovate, and
        inspire, making every captured moment a masterpiece.
      </p>
      <br />

      <RedirectButton />
    </section>
  );
}

export default About;
