import React from "react";
import RedirectButton from "./RedirectButton";

/**
 * About Component
 * Displays information about the photography service with a call-to-action button
 */
function About() {
  return (
    <section className="container-size mx-auto flex flex-col items-center justify-center gap-8 text-left md:text-center">
      <br />
      <h3 className="mb-8 w-full mt-32 text-center font-Teknaf font-bold text-4xl md:text-5xl lg:text-6xl">
      Framing Moments <br/> Creating Stories
      </h3>

      <p className="max-w-3xl  text-justify md:text-center  leading-relaxed">
      We transform visuals with creativity and precision, capturing and elevating every moment. 
      Our team is dedicated to providing you with the best service possible. 
      We are committed to capturing the essence of your event, whether it be. 
      We are here to help you create memories that will last a lifetime.
      </p>
      <br />

      <RedirectButton />
    </section>
  );
}

export default About;
