import React from 'react';
import { Youtube, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black via-neutral-950 to-black text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="flex justify-center md:justify-start">
          <a
            href="https://incridea.in"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Image
              src="/images/Logo/capture-footer.png"
              alt="Logo"
              width={150}
              height={80}
              className="h-auto w-auto max-w-36"
            />
          </a>
        </div>

        {/* Center Section */}
        <div className="text-center flex flex-col md:flex-row justify-center items-center font-Trap-Regular text-sm space-y-2 md:space-y-0 md:space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            Privacy Policy
          </a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="text-gray-400 hover:text-white">
            Terms & Conditions
          </a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="text-gray-400 hover:text-white">
            Contact Us
          </a>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-right text-sm font-Trap-Regular space-y-4">
          {/* Links */}
          <div className="space-y-1">
            <p className="text-gray-400">
              <a href="https://incridea.in">incredia.in</a>
            </p>
            <p className="text-gray-400">
              <a href="https://merch.incridea.in">merch.incridea.in</a>
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-end space-x-4">
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

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center font-Trap-Regular">
        <p className="text-xs text-gray-500 shining-text">
          © Capture Incridea 2025 &nbsp; | &nbsp;{' '}
          <a href="/our-team/developers" className="hover:underline">
            Made with ❤️ by Capture Incridea Developers
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
