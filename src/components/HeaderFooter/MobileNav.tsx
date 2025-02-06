import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidDashboard } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { MdCamera, MdLogout } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import SplitText from "./SplitText";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <BiSolidDashboard /> },
  { href: "/", label: "MainPage", icon: <GoHomeFill /> },
];

const userLinks = [
  { href: "/", label: "Home", icon: <GoHomeFill /> },
  { href: "/captures", label: "Captures", icon: <MdCamera /> },
  { href: "/about", label: "About", icon: <HiInformationCircle /> },
  { href: "/our-team", label: "Our Team", icon: <RiTeamFill /> },
];

type MobileNavProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const MobileNav = ({ isOpen, setIsOpen }: MobileNavProps) => {
  const { data: session } = useSession();
  const pathname = usePathname() || "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#0d1115,#000000),linear-gradient(135deg,#0d1115,#000000)] text-white bg-blend-overlay"
      >
        <SheetHeader>
          <SheetTitle className="mb-6 flex flex-col items-center space-y-4">
            <a href="/">
              <Image
                src="/images/Logo/capture-main.webp"
                alt="Logo"
                width={150}
                height={80}
                className="h-auto w-auto max-w-24"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </a>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center gap-6 text-2xl font-semibold text-white">
          {(session && isAdminRoute && session.user?.role === "admin"
            ? adminLinks
            : userLinks
          ).map((link, index) => (
            <SheetClose asChild key={link.href}>
              <NavLink
                href={link.href}
                label={
                  <SplitText
                    text={link.label}
                    className="text-center text-2xl font-semibold"
                    delay={150 * index}
                    animationFrom={{
                      opacity: 0,
                      transform: "translateY(20px)",
                    }}
                    animationTo={{ opacity: 1, transform: "translateY(0)" }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />
                }
                active={
                  link.href === "/"
                    ? pathname === link.href
                    : pathname.startsWith(link.href)
                }
                className="flex items-center gap-3 text-center"
              >
                <span>{link.icon}</span>
              </NavLink>
            </SheetClose>
          ))}

          {session && !isAdminRoute && (
            <button
              onClick={() => signIn()}
              className="flex items-center justify-center text-xl text-white"
            >
              <div>
                <MdLogout size={24} />
              </div>
            </button>
          )}
          {session && isAdminRoute && session.user?.role === "admin" && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 text-center"
            >
              <HiOutlineLogout /> Logout
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
