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

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <BiSolidDashboard /> },
  { href: "/", label: "MainWebPage", icon: <GoHomeFill /> },
];

const userLinks = [
  { href: "/", label: "Home", icon: <GoHomeFill /> },
  { href: "/captures", label: "Captures", icon: <MdCamera /> },
  { href: "/our-team", label: "Our Team", icon: <RiTeamFill /> },
  // { href: "/gallery", label: "Gallery", icon: <GrGallery /> },
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
      <header className="fixed top-0 left-0 z-50 flex w-full flex-wrap items-center justify-between bg-primary-950/50 p-4 shadow-md backdrop-blur-sm md:justify-start">
        <div className="flex w-full items-center justify-center px-10 md:w-auto">
          <a
            href="https://incridea.in"
            rel="noopener noreferrer"
            className="mx-auto md:mx-0"
          >
            <Image
              src="https://utfs.io/f/0yks13NtToBiMOM3L9fzWI7ScAKGqQtv4FT8wMPEHbihruCg"
              alt="Logo"
              width={120}
              height={70}
              className="h-auto w-auto max-w-24"
            />
          </a>
        </div>

        <nav className="z-40 ml-auto hidden gap-5 space-x-8 px-10 text-lg text-white md:flex">
          {
            ((session && isAdminRoute && session.user?.role === "admin")?adminLinks:userLinks).map((link) => (
              <div key={link.href} className="flex items-center gap-2 justify-center">
                <span>{link.icon}</span>
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={
                    link.href === "/"
                      ? pathname === link.href
                      : pathname.startsWith(link.href)
                  }
                  className="font-BebasNeue text-xl"
                />
              </div>
            ))
          }

          {!session && isAdminRoute && (
            <button
              onClick={() => signIn()}
              className="flex text-xl text-white"
            >
              <HiOutlineLogout />{" "}
              <span className="relative top-0.5 font-BebasNeue">SignIn</span>
            </button>
          )}
          {session && isAdminRoute && session.user?.role === "admin" && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 text-xl text-white"
            >
              <HiOutlineLogout />{" "}
              <span className="relative top-0.5 font-BebasNeue">Logout</span>
            </button>
          )}
        </nav>
        <button
          aria-label="Open Menu"
          className="absolute right-4 text-2xl text-white focus:outline-none md:hidden"
          onClick={() => setIsOpen(true)}
        >
          &#9776;
        </button>
      </header>

      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 max-w-full transform space-y-6 bg-black p-6 opacity-100 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Close Menu"
          className="mb-4 text-3xl text-white"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        {/* Mobile Menu */}
        <div className="flex flex-col gap-2 space-y-4 text-white">
          {session
            ? isAdminRoute && session.user?.role === "admin"
              ? adminLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-3">
                  {link.icon}
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                    onClick={() => setIsOpen(false)}
                    className="w-fit font-BebasNeue text-xl"
                  />
                </div>
              ))
              : userLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-1">
                  {link.icon}
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={
                      link.href === "/"
                        ? pathname === link.href
                        : pathname.startsWith(link.href)
                    }
                    onClick={() => setIsOpen(false)}
                    className="w-fit font-BebasNeue text-xl"
                  />
                </div>
              ))
            : userLinks.map((link) => (
              <div key={link.href} className="flex items-center gap-1">
                {link.icon}
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={
                    link.href === "/"
                      ? pathname === link.href
                      : pathname.startsWith(link.href)
                  }
                  onClick={() => setIsOpen(false)}
                  className="w-fit font-BebasNeue text-xl"
                />
              </div>
            ))}

          {!session && isAdminRoute && (
            <button
              onClick={() => signIn()}
              className="flex text-xl text-white"
            >
              <HiOutlineLogout />{" "}
              <span className="relative top-0.5 font-BebasNeue">SignIn</span>
            </button>
          )}
          {session && isAdminRoute && session.user?.role === "admin" && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 text-xl text-white"
            >
              <HiOutlineLogout />
              Logout
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Header;
