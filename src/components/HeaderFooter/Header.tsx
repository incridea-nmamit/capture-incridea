"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import NavLink from "./NavLink";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidDashboard } from "react-icons/bi";

const Header: FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || ""; 
  const isAdminRoute = pathname.startsWith("/admin");

  const subLinks = [
    { href: "/admin/events", label: "Events" },
    { href: "/admin/team", label: "Team" },
  ];

  return (
    <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
      <header className="sticky-header bg-black shadow-md p-4 flex items-center justify-between flex-wrap md:justify-start z-50 ">
        {/* Logo Section */}
        <div className="flex items-center w-full md:w-auto">
          <a
            href="https://incridea.in"
            rel="noopener noreferrer"
            className="mx-auto md:mx-0"
          >
            <Image
              src="/images/inc.png"
              alt="Logo"
              width={120}
              height={70}
              className="w-auto h-auto max-w-36"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-10">
          {isAdminRoute ? (
            session ? (
              <>
                <div className="flex items-center">
                  <NavLink
                    href="/admin/dashboard"
                    label="Dashboard"
                    active={pathname === "/admin/dashboard"}
                    className="text-xl"
                  />
                  <BiSolidDashboard className="inline-block ml-2" /> 
                </div>
                <button onClick={() => signOut()} className="text-white text-xl flex items-center gap-3">
                  Logout <HiOutlineLogout />
                </button>
              </>
            ) : (
              <button onClick={() => signIn()} className="text-white text-xl">
                Sign In
              </button>
            )
          ) : (
            <>
              <NavLink href="/" label="Home" className="text-xl" active={pathname === "/"} />
              <NavLink
                href="/captures"
                label="Captures"
                active={pathname.startsWith("/captures")}
                className="text-xl"
              />
              <NavLink
                href="/our-team"
                label="Our Team "
                active={pathname.startsWith("/our-team")}
                className="text-xl" 
              />
              <NavLink
                href="/about"
                label="About"
                active={pathname.startsWith("/about")}
                className="text-xl"
              />
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          aria-label="Open Menu"
          className="md:hidden text-white text-3xl focus:outline-none absolute right-4"
          onClick={() => setIsOpen(true)}
        >
          &#9776;
        </button>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 max-w-full bg-black opacity-100 p-6 space-y-6 
          transform transition-transform duration-300 z-50 
          ${isOpen ? "translate-x-0" : "translate-x-full"
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

        <div className="flex flex-col space-y-4 text-white">
          {isAdminRoute ? (
            session ? (
              <>
                <NavLink
                  href="/admin/dashboard"
                  label="Dashboard"
                  active={pathname === "/admin/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="text-xl w-fit"
                />
                <button onClick={() => signOut()} className="text-white text-xl py-5 flex items-center gap-3">
                  Logout<HiOutlineLogout />
                </button>
              </>
            ) : (
              <button onClick={() => signIn()} className="text-white">
                Sign In
              </button>
            )
          ) : (
            <>
              <NavLink
                href="/"
                label="Home"
                active={pathname === "/"}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />
              <NavLink
                href="/captures"
                label="Captures"
                active={pathname.startsWith("/captures")}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />
              <NavLink
                href="/our-team"
                label="Our Team"
                active={pathname.startsWith("/our-team")}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />

              <NavLink
                href="/about"
                label="About"
                active={pathname.startsWith("/about")}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />
            </>
          )}
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
