import React from 'react';
import { Youtube, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 px-4 gap-8">
        {/* Left Section */}
        <div className="text-left">
          <p className="text-lg font-bold">LOGO</p>
          <p className="text-gray-400 mt-2">quote random ass</p>
        </div>

        {/* Center Section */}
        <div className="text-center">
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
        <div className="text-right md:text-right">
          {/* Links */}
          <div>
            <p className="text-gray-400">Incredia.in</p>
            <p className="text-gray-400">Incrediamerchandise.in</p>
          </div>

          {/* Social Media Icons */}
          <div className="mt-4 flex justify-center md:justify-end space-x-4">
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white">
              <Youtube size={24} />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white">
              <Instagram size={24} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm text-gray-500">
          © Capture Incridea 2025  Made with ❤️ by Capture Incridea Developers
        </p>
      </div>
    </footer>
  );
};

export default Footer;
