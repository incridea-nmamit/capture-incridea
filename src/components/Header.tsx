"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
      <header className="bg-black shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/images/inc.png" alt="Logo" width={120} height={70} />
          <Image src="/images/mxsmc.png" alt="Small Logo" width={90} height={40} />
        </div>

        <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink href="/captures" label="Captures" active={pathname.startsWith("/captures")} />
          <NavLink href="/our-team" label="Our Team" active={pathname.startsWith("/our-team")} />
        </nav>

        <button
          aria-label="Open Menu"
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          &#9776;
        </button>
      </header>

      <div
        className={`fixed inset-y-0 right-0 w-64 bg-black p-6 space-y-6 transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Close Menu"
          className="text-white text-3xl mb-4"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>

        <div className="flex flex-col space-y-4">
          <NavLink
            href="/"
            label="Home"
            active={pathname === "/"}
            onClick={() => setIsOpen(false)}
          />
          <NavLink
            href="/captures"
            label="Captures"
            active={pathname.startsWith("/captures")}
            onClick={() => setIsOpen(false)}
          />
          <NavLink
            href="/our-team"
            label="Our Team"
            active={pathname.startsWith("/our-team")}
            onClick={() => setIsOpen(false)}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Header;
