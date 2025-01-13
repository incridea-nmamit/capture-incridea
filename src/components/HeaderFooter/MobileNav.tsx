// components/MobileNav.tsx
import React from 'react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidDashboard } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { MdCamera } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import NavLink from "./NavLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import { Button } from '../ui/button';

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

const MobileNav = ({ isOpen, setIsOpen }: MobileNavProps) => {
    const { data: session } = useSession();
    const pathname = usePathname() || "";
    const isAdminRoute = pathname.startsWith("/admin");

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen} > 
            <SheetTrigger asChild>
                <Button variant="outline">Open</Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>
                        <div className="flex flex-col items-start space-y-4 justify-start mb-6 ml-0">
                            <a href="/">
                                <Image
                                    src="/images/Logo/capture-main.png"
                                    alt="Logo"
                                    width={150}
                                    height={80}
                                    className="h-auto w-auto max-w-32"
                                    onContextMenu={(e) => e.preventDefault()}
                                    onDragStart={(e) => e.preventDefault()}
                                />
                            </a>
                        </div>

                    </SheetTitle>
                </SheetHeader>

                {/* Links */}
                <div className="flex flex-col gap-2 space-y-4 text-white">
                    {(session && isAdminRoute && session.user?.role === "admin"
                        ? adminLinks
                        : userLinks
                    ).map((link) => (
                        <div
                            key={link.href}
                            className="flex items-center justify-start gap-2"  // changed items-start to items-center
                        >
                            <span>{link.icon}</span>
                            <SheetClose asChild>
                                <NavLink
                                    href={link.href}
                                    label={link.label}
                                    active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                                    className="w-fit font-BebasNeue text-xl"
                                />
                            </SheetClose>
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
                            className="flex items-center gap-3 font-Trap-Regular text-xl text-white"
                        >
                            <HiOutlineLogout />
                            Logout
                        </button>
                    )}
                </div>

            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;
