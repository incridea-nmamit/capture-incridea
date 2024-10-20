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

  return (
    <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
      <header className="bg-black shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4  px-5">
          <Image  src="/images/inc.png" alt="Logo" width={120} height={70} />
          <Image src="/images/mxsmc.png" alt="Small Logo" width={180} height={40} />
        </div>

        {/* Admin or Normal Navigation */}
        <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-10">
          {isAdminRoute ? (
            session ? (
              <>
                <NavLink
                  href="/admin/dashboard"
                  label="Dashboard"
                  active={pathname === "/admin/dashboard"}
                />
                {session.user.role === "admin" && (
                  <NavLink
                    href="/admin/analytics"
                    label="Analytics"
                    active={pathname.startsWith("/admin/analytics")}
                  />
                )}

                {/* Hover Dropdown for Desktop */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsPreviewOpen(true)}
                  onMouseLeave={() => setIsPreviewOpen(false)}
                >
                  <button>Preview</button>
                  {isPreviewOpen && (
                    <div className="absolute top-full left-0 bg-white text-black p-4 space-y-2 shadow-md rounded-md">
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
              <NavLink href="/" label="Home" active={pathname === "/"} />
              <NavLink
                href="/captures"
                label="Captures"
                active={pathname.startsWith("/captures")}
              />
              <NavLink
                href="/our-team"
                label="Our Team"
                active={pathname.startsWith("/our-team")}
              />
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          aria-label="Open Menu"
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          &#9776;
        </button>
      </header>

      {/* Mobile Sidebar */}
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
          {isAdminRoute ? (
            session ? (
              <>
                <NavLink
                  href="/admin/dashboard"
                  label="Dashboard"
                  active={pathname === "/admin/dashboard"}
                  onClick={() => setIsOpen(false)}
                />
                {session.user.role === "admin" && (
                  <NavLink
                    href="/admin/analytics"
                    label="Analytics"
                    active={pathname.startsWith("/admin/analytics")}
                    onClick={() => setIsOpen(false)}
                  />
                )}
                <button
                  className="text-white w-full text-left"
                  onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
                >
                  Preview
                </button>
                {isMobilePreviewOpen && (
                  <div className="mt-2 space-y-2 pl-4">
                    {subLinks.map((link) => (
                      <NavLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={pathname === link.href}
                        onClick={() => setIsOpen(false)}
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
