"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession
import NavLink from "./NavLink";
import { signOut } from 'next-auth/react';
import { signIn } from 'next-auth/react';

const Header: FC = () => {
  const { data: session } = useSession(); // Get session data
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // Check if the current pathname starts with /admin
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
      <header className="bg-black shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/images/inc.png" alt="Logo" width={120} height={70} />
          <Image src="/images/mxsmc.png" alt="Small Logo" width={90} height={40} />
        </div>

        {/* Render admin navigation if on /admin route */}
        {isAdminRoute ? (
          <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-10">
            {session ? (
              <>
                <NavLink href="/admin/dashboard" label="Dashboard" active={pathname === "/admin/dashboard"} />
                {/* Check if the user role is admin before showing the Analytics link */}
                {session.user.role === 'admin' && (
                  <NavLink href="/admin/analytics" label="Analytics" active={pathname.startsWith("/admin/analytics")} />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div>
                <button
                  onClick={async () => await signIn()}
                  className="text-white"
                >
                  Sign In
                </button>
              </div>
            )}
          </nav>
        ) : (
          // Render normal navigation if not on /admin route
          <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-10">
            <NavLink href="/" label="Home" active={pathname === "/"} />
            <NavLink href="/captures" label="Captures" active={pathname.startsWith("/captures")} />
            <NavLink href="/our-team" label="Our Team" active={pathname.startsWith("/our-team")} />
          </nav>
        )}

        <button
          aria-label="Open Menu"
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          &#9776;
        </button>
      </header>

      <div
        className={`fixed inset-y-0 right-0 w-64 bg-black p-6 space-y-6 transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
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

        {/* Render mobile menu items based on admin route */}
        {isAdminRoute ? (
          <div className="flex flex-col space-y-4">
            {session ? (
              <>
                <NavLink href="/admin/dashboard" label="Dashboard" active={pathname === "/admin/dashboard"} onClick={() => setIsOpen(false)} />
                {/* Check if the user role is admin before showing the Analytics link */}
                {session.user.role === 'admin' && (
                  <NavLink href="/admin/analytics" label="Analytics" active={pathname.startsWith("/admin/analytics")} onClick={() => setIsOpen(false)} />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="text-white"
                onClick={async () => await signIn()}
              >
                Sign In
              </button>
            )}
          </div>
        ) : (
          // Render normal mobile navigation if not on /admin route
          <div className="flex flex-col space-y-4">
            <NavLink href="/" label="Home" active={pathname === "/"} onClick={() => setIsOpen(false)} />
            <NavLink href="/captures" label="Captures" active={pathname.startsWith("/captures")} onClick={() => setIsOpen(false)} />
            <NavLink href="/our-team" label="Our Team" active={pathname.startsWith("/our-team")} onClick={() => setIsOpen(false)} />
          </div>
        )}
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
