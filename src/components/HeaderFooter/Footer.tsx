import React from 'react';
import { Youtube, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';


const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black via-neutral-950 to-black
 text-white py-8">
      <div className="container-size grid grid-cols-1 md:grid-cols-3 gap-8 w-11/12">
        {/* Left Section */}
        <a href='https://incridea.in'
           rel="noopener noreferrer">
        <div className="text-left">
          <Image
            src="/images/Logo/capture-footer.png"
            alt="Logo"
            width={150}
            height={80}
            className="h-auto w-auto max-w-36"
          />
        </div>
        </a>
        {/* Center Section */}
        <div className="text-center flex justify-center items-center font-Trap-Regular text-sm">
          <div className="space-y-2 md:space-y-0 md:space-x-4">
            <a href="#" className="text-gray-400 hover:text-white block md:inline">
              Privacy Policy
            </a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="text-gray-400 hover:text-white block md:inline">
              Terms & Conditions
            </a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="text-gray-400 hover:text-white block md:inline">
              Contact Us
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-right text-sm md:text-right font-Trap-Regular">
          {/* Links */}
          <div>
            <p className="text-gray-400"><a href='https://incridea.in'>incredia.in</a></p>
            <p className="text-gray-400"><a href='https://merch.incridea.in'>merch.incridea.in</a></p>
          </div>

          {/* Social Media Icons */}
          <div className="mt-4 flex justify-center md:justify-end space-x-4">
            <a href="https://www.youtube.com/@incrideanmamit"  target="_blank"  rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white">
              <Youtube size={28} />
            </a>
            <a href="https://www.instagram.com/incridea"  target="_blank"  rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white">
              <Instagram size={24} />
            </a>
            <a href="https://www.linkedin.com/company/incridea-nmamit/" target="_blank"  rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center font-Trap-Regular">
        <p className="text-xs text-gray-500 shining-text">
          © Capture Incridea 2025  &nbsp; | &nbsp;  <a href='/our-team/developers'>Made with ❤️ by Capture Incridea Developers</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
