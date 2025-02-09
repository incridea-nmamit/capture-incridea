import React from "react";
import { Youtube, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

/**
 * Footer Component
 * Main footer with social links, copyright, and navigation
 */
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black via-neutral-950 to-black py-8 text-white">
      {/* Layout sections */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
        {/* Logo Section */}
        <div className="flex justify-center md:justify-start">
          <a
            href="https://incridea.in"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Image
              src="/images/Logo/capture-footer.webp"
              alt="Logo"
              width={150}
              height={80}
              className="h-auto w-auto max-w-28"
            />
          </a>
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-2 text-center font-Trap-Regular text-sm md:flex-row md:space-x-4 md:space-y-0">
          <a
            href="/terms-and-conditions"
            className="text-gray-400 hover:text-white"
          >
            Terms & Conditions
          </a>
          <span className="hidden md:inline">|</span>
          <a href="/privacy-policy" className="text-gray-400 hover:text-white">
            Privacy Policy
          </a>
          <span className="hidden md:inline">|</span>

          <a href="/contact" className="text-gray-400 hover:text-white">
            Contact Us
          </a>
        </div>

        {/* Social Media Links */}
        <div className="hidden md:block space-y-4 text-center font-Trap-Regular text-sm md:text-right">
          {/* Links */}
          <div className="space-y-1">
            <p className="text-gray-400 hover:text-white">
              <a href="https://incridea.in">incredia.in</a>
            </p>
            <p className="text-gray-400 hover:text-white">
              <a href="https://merch.incridea.in">merch.incridea.in</a>
            </p>
          </div>

          {/* Social Media Icons - Desktop */}
          <div className="flex justify-center md:justify-end space-x-4 items-center">
            <a
              href="https://www.youtube.com/@incrideanmamit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-gray-400 hover:text-white"
            >
              <Youtube size={28} />
            </a>
            <a
              href="https://www.instagram.com/incridea"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/company/incridea-nmamit/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* For mobile view only - appears above copyright */}
      <div className="flex md:hidden justify-between px-4 mt-8">
        <div className="flex flex-col items-start space-y-2 font-Trap-Regular text-sm">
          <a href="/terms-and-conditions" className="text-gray-400 hover:text-white">
            Terms & Conditions
          </a>
          <a href="/privacy-policy" className="text-gray-400 hover:text-white">
            Privacy Policy
          </a>
          <a href="/contact" className="text-gray-400 hover:text-white">
            Contact Us
          </a>
        </div>

        <div className="text-right space-y-4 font-Trap-Regular text-sm">
          <div className="space-y-1">
            <p className="text-gray-400 hover:text-white">
              <a href="https://incridea.in">incredia.in</a>
            </p>
            <p className="text-gray-400 hover:text-white">
              <a href="https://merch.incridea.in">merch.incridea.in</a>
            </p>
          </div>
          
          {/* Social Media Icons - Mobile only */}
          <div className="flex justify-end space-x-4 m-0">
            <a
              href="https://www.youtube.com/@incrideanmamit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-gray-400 hover:text-white"
            >
              <Youtube size={28} />
            </a>
            <a
              href="https://www.instagram.com/incridea"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/company/incridea-nmamit/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center font-Trap-Regular">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-1 md:space-y-0">
          <p className="shining-text text-xs text-gray-500">
            © Capture Incridea 2025
          </p>
          <span className="hidden md:inline text-xs text-gray-500">&nbsp; | &nbsp;</span>
          <p className="shining-text text-xs text-gray-500">
            <a href="/our-team/developers" className="hover:underline">
              Made with ❤️ by Capture Incridea Developers
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
