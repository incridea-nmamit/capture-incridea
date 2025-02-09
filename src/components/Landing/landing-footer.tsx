import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * LandingFooter Component
 * Displays alternating footer content with links and copyright information
 * Features an animation that switches between two states every 5 seconds
 */
export const LandingFooter = () => {
    // State to toggle between footer views
    const [show, setShow] = useState(true);
  
    // Toggle footer content every 5 seconds
    useEffect(() => {
      const timeout = setTimeout(() => {
        setShow(!show);
      }, 5000);
  
      return () => clearTimeout(timeout);
    }, [show]);

    return ( 
      <footer className="absolute bottom-0 flex w-full flex-col gap-2 text-gray-200 md:gap-4">
        {/* Policy Links Section */}
        {show && (
          <ul className="mb-5 flex flex-1 flex-row flex-wrap items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-xs md:gap-5">
            <li className="text-white transition-colors duration-300 hover:text-gray-300">
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            |
            <li className="text-white transition-colors duration-300 hover:text-gray-300">
              <Link href="/rules">Terms & Conditions</Link>
            </li>
            |
            <li className="text-white transition-colors duration-300 hover:text-gray-300">
              <Link href="/guidelines">Guidelines</Link>
            </li>
            |
            <li className="text-white transition-colors duration-300 hover:text-gray-300">
              <Link href="/refund">Refund Policy</Link>
            </li>
            |
            <li className="text-white transition-colors duration-300 hover:text-gray-300">
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        )}

        {/* Copyright Section */}
        {!show && (
          <p className="pb-3 text-center text-xs">
            <Link
              className="flex items-center justify-center tracking-normal transition-all hover:tracking-widest hover:text-gray-300"
              href="/our-team/developers"
            >
              Made with ❤️ by Tech Team   ©  Capture Incridea 2024
            </Link>
          </p>
        )}
      </footer>
    );
};
