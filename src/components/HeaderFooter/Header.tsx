"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import NavLink from "./NavLink";

const Header: FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const subLinks = [
    { href: "/admin/events", label: "Events" },
    { href: "/admin/team", label: "Team" },
  ];

  const isPreviewActive =
    pathname === "/admin/events" || pathname === "/admin/team";

  return (
    <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
      <header className="bg-black shadow-md p-4 flex items-center justify-between flex-wrap md:justify-start">
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
              className="w-auto h-auto max-w-full"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-10">
          {isAdminRoute ? (
            session ? (
              <>
                <NavLink
                  href="/admin/dashboard"
                  label="Dashboard"
                  active={pathname === "/admin/dashboard"}
                  className="text-xl"
                />
                <div
                  className="relative group"
                  onMouseEnter={() => setIsPreviewOpen(true)}
                  onMouseLeave={() => setIsPreviewOpen(false)}
                >
                  <button
                    className={isPreviewActive ? "border-b-2 border-white text-xl" : ""}
                  >
                    Preview
                  </button>
                  {isPreviewOpen && (
                    <div className="absolute top-full left-0 bg-black text-white p-4 space-y-2 shadow-md rounded-md">
                      {subLinks.map((link) => (
                        <NavLink
                          key={link.href}
                          href={link.href}
                          label={link.label}
                          active={pathname === link.href}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => signOut()} className="text-white text-xl">
                  Logout
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
                label="Our Team"
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
        className={`fixed inset-y-0 right-0 w-64 max-w-full bg-black p-6 space-y-6 transform transition-transform duration-300 z-50 ${
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
                {session.user.role === "admin" && (
                  <NavLink
                    href="/admin/analytics"
                    label="Analytics"
                    active={pathname.startsWith("/admin/analytics")}
                    onClick={() => setIsOpen(false)}
                    className="text-xl w-fit"
                  />
                )}
                <button
                  className={`text-white w-full text-left text-xl w-fit${
                    isPreviewActive ? "border-b-2 border-white" : ""
                  }`}
                  onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
                  
                >
                  Preview
                </button>
                {isMobilePreviewOpen && (
                  <div className="mt-2 flex flex-col space-y-2 pl-4">
                    {subLinks.map((link) => (
                      <NavLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={pathname === link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-xl w-fit"
                      />
                    ))}
                  </div>
                )}
                <button onClick={() => signOut()} className="text-white">
                  Sign Out
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
