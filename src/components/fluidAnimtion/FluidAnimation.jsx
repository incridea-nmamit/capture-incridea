"use client";

import { useEffect, useRef } from "react";
import { initFluid } from "./FE";

function FluidAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref) {
      initFluid();
    }
  }, [ref]);

  return (
    <>
      <canvas
        id="fluid"
        className="fixed top-0 left-0 w-screen h-screen -z-10"
        ref={ref}
      ></canvas>
    </>
  );
}

export default FluidAnimation;