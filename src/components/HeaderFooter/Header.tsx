import { FC, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import NavLink from "./NavLink";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidDashboard } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { MdCamera, MdLogout, MdOutlineDashboardCustomize } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import Image from "next/image";
import MobileNav from "./MobileNav";
import { MdAccountCircle } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
/**
 * Navigation link configurations
 */
const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <BiSolidDashboard /> },
  { href: "/", label: "MainPage", icon: <GoHomeFill /> },
];

const userLinks = [
  { href: "/", label: "Home", icon: <GoHomeFill /> },
  { href: "/captures", label: "Captures", icon: <MdCamera /> },
  { href: "/about", label: "About", icon: <HiInformationCircle /> },
  { href: "/our-team", label: "Team", icon: <RiTeamFill /> },
];

/**
 * Header Component
 * Main navigation component with responsive design and role-based access
 */
const Header: FC = () => {
  // Session and state management
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const pathname = usePathname() || "";
  const notUser = session?.user?.role !== "user";
  const isAdminRoute = pathname.startsWith("/admin");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Client-side mounting check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative">
      <header className="fixed left-0 top-0 z-50 w-full bg-black/30 py-4 shadow-md backdrop-blur-md md:justify-start">
        <div className="container-size flex w-full flex-wrap items-center justify-between px-0">
          <div className="flex w-full items-center justify-center md:w-auto">
            <a href="/" className="mx-auto md:mx-0">
              <Image
                src="/images/Logo/capture.webp"
                alt="Logo"
                width={150}
                height={80}
                className="h-auto w-auto max-w-28"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </a>
          </div>

          <nav className="z-40 ml-auto hidden gap-5 space-x-8 text-lg text-white md:flex">
            {(session && isAdminRoute && session.user?.role === "admin"
              ? adminLinks
              : userLinks
            ).map((link) => (
              <div
                key={link.href}
                className="flex items-center justify-center gap-2"
              >
                <span className="mb-1">{link.icon}</span>
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={
                    link.href === "/"
                      ? pathname === link.href
                      : pathname.startsWith(link.href)
                  }
                  className="font-Trap-Regular text-lg"
                />
              </div>
            ))}
            {session && !isAdminRoute && notUser && (
                <button
                onClick={() => {
                  window.location.href = "/admin";
                }}
                className="flex items-center justify-center text-xl text-white"
                >
                <div>
                  <MdOutlineDashboardCustomize />
                </div>
                </button>
            )}
             {session && isAdminRoute && session.user?.role === "admin" && (
                <button
                onClick={() => {
                  window.location.href = "/admin/analytics";
                }}
                className="flex items-center justify-center text-xl text-white"
                >
                <div>
                <TbDeviceAnalytics />
                </div>
                </button>
            )}
            {session && !isAdminRoute && session.user?.role === "admin" && (
                <button
                onClick={() => {
                  window.location.href = "/admin/analytics";
                }}
                className="flex items-center justify-center text-xl text-white"
                >
                <div>
                <TbDeviceAnalytics />
                </div>
                </button>
            )}

            {session && !isAdminRoute && (
              <div className="relative flex items-center" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropOpen(!isDropOpen)}
                  className="flex items-center justify-center p-1 text-white hover:opacity-80"
                >
                  <MdAccountCircle size={24} className="text-white" />
                </button>
                {isDropOpen && (
                  <div className="absolute right-1/2 translate-x-1/2 top-full mt-2 w-32 rounded-md bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:bg-zinc-700"
                    >
                      <HiOutlineLogout className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            {session && isAdminRoute && session.user?.role === "admin" && (
              <div className="relative flex items-center" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropOpen(!isDropOpen)}
                  className="flex items-center justify-center p-1 text-white hover:opacity-80"
                >
                  <MdAccountCircle size={24} className="text-white" />
                </button>
                {isDropOpen && (
                  <div className="absolute right-1/2 translate-x-1/2 top-full mt-2 w-32 rounded-md bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:bg-zinc-700"
                    >
                      <HiOutlineLogout className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
          <button
            className="absolute right-4 text-2xl text-white focus:outline-none md:hidden"
            onClick={() => setIsOpen(true)}
          >
            &#9776;
          </button>
        </div>
      </header>

      {isOpen && <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default Header;
