"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import NavLink from "./NavLink";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidDashboard } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { MdCamera } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";

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
        <div className="flex items-center w-full md:w-auto px-10">
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
              className="w-auto h-auto max-w-24"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-10 gap-5 z-40">
          {isAdminRoute ? (
            session ? (
              <>
                <div className="flex items-center gap-2">
                  <BiSolidDashboard/> 
                  <NavLink
                    href="/admin/dashboard"
                    label="Dashboard"
                    active={pathname === "/admin/dashboard"}
                    className="text-xl font-BebasNeue relative top-1"
                  />                  
                </div>
                <button onClick={() => signOut()} className="text-white text-xl flex items-center gap-3">
                  <HiOutlineLogout /> <span className="font-BebasNeue relative top-0.5">Logout</span>
                </button>
              </>
            ) : (
              <button onClick={() => signIn()} className="text-white text-xl">
                Sign In
              </button>
            )
          ) : (
            <>
            <div className="flex items-center gap-1">
              <div className="flex items-center"><GoHomeFill /></div>
              <NavLink href="/" label="Home" className="text-xl font-BebasNeue relative top-1" active={pathname === "/"} />
            </div>
            <div className="flex items-center gap-1">
              <MdCamera />
              <NavLink
                href="/captures"
                label="Captures"
                active={pathname.startsWith("/captures")}
                className="text-xl font-BebasNeue relative top-1"
              />
            </div>
            <div className="flex items-center gap-1">
              <RiTeamFill />
              <NavLink
                href="/our-team"
                label="Our Team "
                active={pathname.startsWith("/our-team")}
                className="text-xl font-BebasNeue  relative top-1" 
              />              
            </div>
            <div className="flex items-center gap-1">
              <HiInformationCircle />
              <NavLink
                href="/about"
                label="About"
                active={pathname.startsWith("/about")}
                className="text-xl font-BebasNeue relative top-1"
              />              
            </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          aria-label="Open Menu"
          className="md:hidden text-white text-2xl focus:outline-none absolute right-4"
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

        <div className="flex flex-col space-y-4 text-white gap-2">
          {isAdminRoute ? (
            session ? (
              <>
              <div className="flex items-center gap-3">
                <BiSolidDashboard/> 
                <NavLink
                  href="/admin/dashboard"
                  label="Dashboard"
                  active={pathname === "/admin/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="text-xl w-fit"
                />
              </div>
                <button onClick={() => signOut()} className="text-white text-xl py-5 flex items-center gap-3">
                  <HiOutlineLogout />Logout
                </button>
              </>
            ) : (
              <button onClick={() => signIn()} className="text-white">
                Sign In
              </button>
            )
          ) : (
            <>
            <div className="flex items-center gap-1">
              <GoHomeFill />
              <NavLink
                href="/"
                label="Home"
                active={pathname === "/"}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />
            </div>
            <div className="flex items-center gap-1">
              <MdCamera />
              <NavLink
                href="/captures"
                label="Captures"
                active={pathname.startsWith("/captures")}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />              
            </div>
            <div className="flex items-center gap-1">
              <RiTeamFill />
              <NavLink
                href="/our-team"
                label="Our Team"
                active={pathname.startsWith("/our-team")}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />              
            </div>
            <div className="flex items-center gap-1">
              <HiInformationCircle />
              <NavLink
                href="/about"
                label="About"
                active={pathname.startsWith("/about")}
                onClick={() => setIsOpen(false)}
                className="text-xl w-fit"
              />              
            </div>
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
