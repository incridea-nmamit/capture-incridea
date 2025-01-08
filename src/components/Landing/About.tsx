import React from "react";
import RedirectButton from "./RedirectButton";

function About() {
  return (
    <section className="container-size mx-auto flex h-screen flex-col items-center justify-center gap-8 text-center">
      <h3 className="mb-8 w-full text-center font-Teknaf text-5xl md:text-6xl lg:text-6xl">
        We capture what u see....
      </h3>

      <p className="max-w-3xl text-center font-Trap-Regular">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has b een the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley o f type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but a lso the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more re cently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum About capture incredia
      </p>
      <br />

      <RedirectButton />
    </section>
  );
}

export default About;
