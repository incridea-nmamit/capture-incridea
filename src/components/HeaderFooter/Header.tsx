// import { type FC, useState, useEffect } from "react";

// import { usePathname } from "next/navigation";
// import { useSession, signOut, signIn } from "next-auth/react";
// import NavLink from "./NavLink";
// import { HiOutlineLogout } from "react-icons/hi";
// import { BiSolidDashboard } from "react-icons/bi";
// import { GoHomeFill } from "react-icons/go";
// import { MdCamera } from "react-icons/md";
// import { RiTeamFill } from "react-icons/ri";
// import { HiInformationCircle } from "react-icons/hi";
// import Image from "next/image";

// const adminLinks = [
//   { href: "/admin/dashboard", label: "Dashboard", icon: <BiSolidDashboard /> },
//   { href: "/", label: "MainPage", icon: <GoHomeFill /> },
// ];

// const userLinks = [
//   { href: "/", label: "Home", icon: <GoHomeFill /> },
//   { href: "/captures", label: "Captures", icon: <MdCamera /> },
//   { href: "/about", label: "About", icon: <HiInformationCircle /> },
//   { href: "/our-team", label: "Our Team", icon: <RiTeamFill /> },
//   // { href: "/gallery", label: "Gallery", icon: <GrGallery /> },
// ];

// const Header: FC = () => {
//   const { data: session } = useSession();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const pathname = usePathname() || "";
//   const isAdminRoute = pathname.startsWith("/admin");

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null;

//   return (
//     <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
//       <header className="fixed left-0 top-0 z-50 w-full bg-black/30 py-4 shadow-md backdrop-blur-md md:justify-start">
//         <div className="container-size flex w-full flex-wrap items-center justify-between px-0">
//           <div className="flex w-full items-center justify-center md:w-auto">
//             <a href="/" className="mx-auto md:mx-0">
//               <Image
//                 src="/images/Logo/capture-main.png"
//                 alt="Logo"
//                 width={150}
//                 height={80}
//                 className="h-auto w-auto max-w-32"
//                 onContextMenu={(e) => e.preventDefault()}
//                 onDragStart={(e) => e.preventDefault()}
//               />
//             </a>
//           </div>

//           <nav className="z-40 ml-auto hidden gap-5 space-x-8 text-lg text-white md:flex">
//             {(session && isAdminRoute && session.user?.role === "admin"
//               ? adminLinks
//               : userLinks
//             ).map((link) => (
//               <div
//                 key={link.href}
//                 className="flex items-center justify-center gap-2"
//               >
//                 <span className="mb-1">{link.icon}</span>
//                 <NavLink
//                   href={link.href}
//                   label={link.label}
//                   active={
//                     link.href === "/"
//                       ? pathname === link.href
//                       : pathname.startsWith(link.href)
//                   }
//                   className="font-Trap-Regular text-lg"
//                 />
//               </div>
//             ))}

//             {!session && isAdminRoute && (
//               <button
//                 onClick={() => signIn()}
//                 className="flex text-xl text-white"
//               >
//                 <HiOutlineLogout />{" "}
//                 <span className="relative top-0.5 font-Trap-Regular">
//                   SignIn
//                 </span>
//               </button>
//             )}
//             {session && isAdminRoute && session.user?.role === "admin" && (
//               <button
//                 onClick={() => signOut()}
//                 className="flex items-center gap-3 font-Trap-Regular text-lg text-white"
//               >
//                 <HiOutlineLogout />{" "}
//                 <span className="relative top-0.5">Logout</span>
//               </button>
//             )}
//           </nav>
//           <button
//             aria-label="Open Menu"
//             className="absolute right-4 text-2xl text-white focus:outline-none md:hidden"
//             onClick={() => setIsOpen(true)}
//           >
//             &#9776;
//           </button>
//         </div>
//       </header>

//       {/* Mobile Menu */}

//       <div
//         className={`fixed inset-y-0 right-0 z-50 w-64 max-w-full transform space-y-6 bg-black p-6 opacity-100 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         role="dialog"
//         aria-modal="true"
//       >
//         <button
//           aria-label="Close Menu"
//           className="mb-4 text-3xl text-white"
//           onClick={() => setIsOpen(false)}
//         >
//           &times;
//         </button>
//         {/* Mobile Menu */}
//         <div className="flex w-full items-center justify-center md:w-auto">
//           <a href="/" className="mx-auto md:mx-0">
//             <Image
//               src="/images/Logo/capture-main.png"
//               alt="Logo"
//               width={150}
//               height={80}
//               className="h-auto w-auto max-w-32"
//               onContextMenu={(e) => e.preventDefault()}
//               onDragStart={(e) => e.preventDefault()}
//             />
//           </a>
//         </div>
//         <div className="flex flex-col gap-2 space-y-4 text-white">
//           {(session && isAdminRoute && session.user?.role === "admin"
//             ? adminLinks
//             : userLinks
//           ).map((link) => (
//             <div
//               key={link.href}
//               className="flex items-center justify-center gap-2"
//             >
//               <span>{link.icon}</span>
//               <NavLink
//                 href={link.href}
//                 label={link.label}
//                 active={
//                   link.href === "/"
//                     ? pathname === link.href
//                     : pathname.startsWith(link.href)
//                 }
//                 onClick={() => setIsOpen(false)}
//                 className="w-fit font-BebasNeue text-xl"
//               />
//             </div>
//           ))}

//           {!session && isAdminRoute && (
//             <button
//               onClick={() => signIn()}
//               className="flex text-xl text-white"
//             >
//               <HiOutlineLogout />{" "}
//               <span className="relative top-0.5 font-BebasNeue">SignIn</span>
//             </button>
//           )}
//           {session && isAdminRoute && session.user?.role === "admin" && (
//             <button
//               onClick={() => signOut()}
//               className="flex items-center gap-3 font-Trap-Regular text-xl text-white"
//             >
//               <HiOutlineLogout />
//               Logout
//             </button>
//           )}
//         </div>
//       </div>

//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
//           onClick={() => setIsOpen(false)}
//           aria-hidden="true"
//         />
//       )}
//     </div>
//   );
// };

// export default Header;
import { FC, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import NavLink from "./NavLink";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidDashboard } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { MdCamera } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import Image from "next/image";
import MobileNav from './MobileNav'; // Import the MobileNav component

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

const Header: FC = () => {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "";
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative">
      <header className="fixed left-0 top-0 z-50 w-full bg-black/30 py-4 shadow-md backdrop-blur-md md:justify-start">
        <div className="container-size flex w-full flex-wrap items-center justify-between px-0">
          <div className="flex w-full items-center justify-center md:w-auto">
            <a href="/" className="mx-auto md:mx-0">
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

            {!session && isAdminRoute && (
              <button
                onClick={() => signIn()}
                className="flex text-xl text-white"
              >
                <HiOutlineLogout />{" "}
                <span className="relative top-0.5 font-Trap-Regular">
                  SignIn
                </span>
              </button>
            )}
            {session && isAdminRoute && session.user?.role === "admin" && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 font-Trap-Regular text-lg text-white"
              >
                <HiOutlineLogout />{" "}
                <span className="relative top-0.5">Logout</span>
              </button>
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

      {isOpen && (
        <MobileNav
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
        />
      )}

    </div>
  );
};

export default Header;

