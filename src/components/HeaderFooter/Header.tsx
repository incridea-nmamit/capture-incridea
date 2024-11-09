"use client";

import { type FC, useState, useEffect } from "react";
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
import { GrGallery } from "react-icons/gr";

// Constants for links and their icons
const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <BiSolidDashboard /> },
  { href: "/", label: "MainWebPage", icon: <GoHomeFill /> },
];

const userLinks = [
  { href: "/", label: "Home", icon: <GoHomeFill /> },
  { href: "/captures", label: "Captures", icon: <MdCamera /> },
  { href: "/our-team", label: "Our Team", icon: <RiTeamFill /> },
  { href: "/gallery", label: "Gallery", icon: <GrGallery /> },
  { href: "/about", label: "About", icon: <HiInformationCircle /> },
];

const Header: FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname() || "";
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
      <header className="sticky-header bg-black shadow-md p-4 flex items-center justify-between flex-wrap md:justify-start z-50 w-full">
        <div className="flex justify-center items-center w-full md:w-auto px-10">
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

        <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-10 gap-5 z-40">
          {session ? (
            isAdminRoute && session.user?.role === "admin" ? (
              adminLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-2">
                  {link.icon}
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                    className="text-xl font-BebasNeue relative top-1"
                  />
                </div>
              ))
            ) : (
              userLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-1">
                  {link.icon}
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                    className="text-xl font-BebasNeue relative top-1"
                  />
                </div>
              ))
            )
          ) : (
            userLinks.map((link) => (
              <div key={link.href} className="flex items-center gap-1">
                {link.icon}
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                  className="text-xl font-BebasNeue relative top-1"
                />
              </div>
            ))
          )}
          {!session && isAdminRoute && (
            <button
              onClick={() => signIn()}
              className="text-white text-xl flex"
            >
              <HiOutlineLogout /> <span className="font-BebasNeue relative top-0.5">SignIn</span>
            </button>
          )}
          {session && isAdminRoute && session.user?.role === "admin" && (
            <button
              onClick={() => signOut()}
              className="text-white text-xl flex items-center gap-3"
            >
              <HiOutlineLogout /> <span className="font-BebasNeue relative top-0.5">Logout</span>
            </button>
          )}
        </nav>
        <button
          aria-label="Open Menu"
          className="md:hidden text-white text-2xl focus:outline-none absolute right-4"
          onClick={() => setIsOpen(true)}
        >
          &#9776;
        </button>
      </header>

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
        {/* Mobile Menu */}
        <div className="flex flex-col space-y-4 text-white gap-2">
          {session ? (
            isAdminRoute && session.user?.role === "admin" ? (
              adminLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-3">
                  {link.icon}
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl w-fit"
                  />
                </div>
              ))
            ) : (
              userLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-1">
                  {link.icon}
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                    onClick={() => setIsOpen(false)}
                    className="text-xl w-fit"
                  />
                </div>
              ))
            )
          ) : (
            userLinks.map((link) => (
              <div key={link.href} className="flex items-center gap-1">
                {link.icon}
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                  onClick={() => setIsOpen(false)}
                  className="text-xl w-fit"
                />
              </div>
            ))
          )}

          {!session && isAdminRoute && (
            <button
              onClick={() => signIn()}
              className="text-white text-xl flex"
            >
              <HiOutlineLogout /> <span className="font-BebasNeue relative top-0.5">SignIn</span>
            </button>
          )}
          {session && isAdminRoute && session.user?.role === "admin" && (
            <button
              onClick={() => signOut()}
              className="text-white text-xl flex items-center gap-3"
            >
              <HiOutlineLogout />Logout
            </button>
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
